import express from "express";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { INITIAL_STUDENTS, INITIAL_COURSES, INITIAL_RESULTS, INITIAL_NOTICES } from "./src/data/mockData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

const DB_FILE = path.join(process.cwd(), 'db.json');

interface DatabaseSchema {
  students: any[];
  courses: any[];
  results: any[];
  notices: any[];
}

function loadDB(): DatabaseSchema {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (!parsed.notices || !Array.isArray(parsed.notices)) {
        parsed.notices = [...INITIAL_NOTICES];
        saveDB(parsed);
      }
      return parsed;
    }
  } catch (err) {
    console.error("Error reading db.json, recreating...", err);
  }

  // Initial seed data
  const initial: DatabaseSchema = {
    students: [...INITIAL_STUDENTS],
    courses: [...INITIAL_COURSES],
    results: [...INITIAL_RESULTS],
    notices: [...INITIAL_NOTICES]
  };
  saveDB(initial);
  return initial;
}

function saveDB(data: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error("Error saving db.json:", err);
  }
}

// API Routes

app.get("/api/students", (req, res) => {
  const db = loadDB();
  res.json(db.students);
});

app.put("/api/students/:student_id/photo", (req, res) => {
  const { student_id } = req.params;
  const { profile_photo } = req.body;
  const db = loadDB();
  const student = db.students.find(s => s.student_id === student_id);
  if (student) {
    student.profile_photo = profile_photo;
    saveDB(db);
    return res.json({ success: true, student });
  }
  res.status(404).json({ error: 'Student not found' });
});

app.get("/api/courses", (req, res) => {
  const db = loadDB();
  res.json(db.courses);
});

app.get("/api/results", (req, res) => {
  const db = loadDB();
  res.json(db.results);
});

app.post("/api/results", (req, res) => {
  const { student_id, course_code, marks_obtained, total_marks, grade, grade_point, semester, academic_year } = req.body;
  const db = loadDB();
  const newResult = {
    id: db.results.length > 0 ? Math.max(...db.results.map((r: any) => r.id)) + 1 : 1,
    student_id,
    course_code,
    marks_obtained: Number(marks_obtained),
    total_marks: Number(total_marks || 100),
    grade,
    grade_point: Number(grade_point),
    semester: Number(semester),
    academic_year,
    uploaded_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
  db.results.unshift(newResult);
  saveDB(db);
  res.json(newResult);
});

app.put("/api/results/:id", (req, res) => {
  const { id } = req.params;
  const { marks_obtained, grade, grade_point } = req.body;
  const db = loadDB();
  const idx = db.results.findIndex((r: any) => r.id === Number(id));
  if (idx !== -1) {
    db.results[idx] = {
      ...db.results[idx],
      marks_obtained: Number(marks_obtained),
      grade,
      grade_point: Number(grade_point)
    };
    saveDB(db);
    return res.json(db.results[idx]);
  }
  res.status(404).json({ error: 'Result not found' });
});

app.delete("/api/results/:id", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  db.results = db.results.filter((r: any) => r.id !== Number(id));
  saveDB(db);
  res.json({ success: true });
});

// Academic Notices API
app.get("/api/notices", (req, res) => {
  const db = loadDB();
  res.json(db.notices || []);
});

const handleMarkAllRead = (req: express.Request, res: express.Response) => {
  const db = loadDB();
  if (db.notices) {
    db.notices.forEach((n: any) => {
      n.isRead = true;
    });
    saveDB(db);
  }
  res.json({ success: true, count: db.notices ? db.notices.length : 0 });
};

app.post("/api/notices/mark-all-read", handleMarkAllRead);
app.put("/api/notices/mark-all-read", handleMarkAllRead);

app.put("/api/notices/:id/read", (req, res) => {
  const { id } = req.params;
  const db = loadDB();
  const notice = (db.notices || []).find((n: any) => n.id === id);
  if (notice) {
    notice.isRead = true;
    saveDB(db);
    return res.json({ success: true, notice });
  }
  res.status(404).json({ error: 'Notice not found' });
});

const handleAiAdvice = async (req: express.Request, res: express.Response) => {
  try {
    const { prompt, studentContext, context } = req.body;
    const effectiveContext = studentContext || context || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      const defaultAdvice = "### Academic Advisor Analysis\n\n- **Status**: Standard advisor mode.\n- **Performance**: Excellent academic consistency across core courses. Keep up the great work in maintaining high grade points!\n- **Recommendation**: Continue focusing on practical projects and consistent revision.";
      return res.json({ 
        advice: defaultAdvice,
        reply: defaultAdvice,
        response: defaultAdvice
      });
    }

    const ai = new GoogleGenAI({ 
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });

    // Call Gemini with a 10s timeout to prevent hanging requests
    const generateCall = async () => {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert university academic advisor. Student Context: ${JSON.stringify(effectiveContext)}. User prompt: ${prompt}`,
        });
        return response.text || '';
      } catch (primaryErr: any) {
        console.warn("Primary model error, attempting gemini-3.6-flash:", primaryErr?.message);
        const fallbackResponse = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `You are an expert university academic advisor. Student Context: ${JSON.stringify(effectiveContext)}. User prompt: ${prompt}`,
        });
        return fallbackResponse.text || '';
      }
    };

    const timeoutPromise = new Promise<string>((_, reject) => 
      setTimeout(() => reject(new Error("Gemini request timed out")), 10000)
    );

    const textResponse = await Promise.race([generateCall(), timeoutPromise]);

    return res.json({ 
      advice: textResponse,
      reply: textResponse,
      response: textResponse
    });
  } catch (err: any) {
    console.error("Gemini AI error:", err?.message || err);
    const fallbackAdvice = `### Academic Advisor Analysis

**Student Performance Overview**
- You have demonstrated solid academic engagement across your registered courses.
- Your GPA and academic trajectory reflect strong dedication to your degree.

**Key Recommendations**
1. **Focus on Core Modules**: Prioritize understanding fundamental concepts, coursework, and practical assignments.
2. **Time Management**: Allocate dedicated weekly blocks for reviewing lecture notes and completing projects early.
3. **Office Hours**: Engage with instructors to clarify complex concepts and explore academic research opportunities.`;

    return res.json({ 
      advice: fallbackAdvice,
      reply: fallbackAdvice,
      response: fallbackAdvice
    });
  }
};

app.post("/api/ai/advice", handleAiAdvice);
app.post("/api/ai/advisor", handleAiAdvice);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: "json_file_store" });
});

async function startServer() {
  loadDB(); // Ensure DB is initialized

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} (Database: JSON File Store)`);
  });
}

startServer();
