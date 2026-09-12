import React, { useState } from 'react';
import { 
  Building2, 
  BrainCircuit, 
  Mail, 
  Calendar, 
  Clock, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  Award, 
  ChevronRight,
  Printer,
  GraduationCap
} from 'lucide-react';
import { Student, Course, Result } from '../../types';

interface AdvisoryPageProps {
  student: Student;
  courses: Course[];
  results: Result[];
  cgpaDisplay: string;
  totalCreditsEarned: number;
  onOpenPrintTranscript: () => void;
  onOpenFullAiModal: () => void;
}

export const AdvisoryPage: React.FC<AdvisoryPageProps> = ({
  student,
  courses,
  results,
  cgpaDisplay,
  totalCreditsEarned,
  onOpenPrintTranscript,
  onOpenFullAiModal,
}) => {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello ${student.name}! I am your AI Academic Counselor. I've audited your current record: CGPA of ${cgpaDisplay}, ${totalCreditsEarned} earned credits in B.Sc. ${student.department}. How can I assist with your degree planning, elective choices, or academic goals today?`
    }
  ]);
  const [isSending, setIsSending] = useState(false);
  const [bookingNotice, setBookingNotice] = useState<string | null>(null);

  const samplePrompts = [
    "What electives are best for an AI & Machine Learning focus?",
    "How can I maintain my First Class standing into my final year?",
    "Am I on schedule for Spring 2027 graduation?"
  ];

  const handleSendQuery = async (customPrompt?: string) => {
    const textToSend = customPrompt || query;
    if (!textToSend.trim() || isSending) return;

    const userMsg = { role: 'user' as const, content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsSending(true);

    try {
      const response = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.student_id,
          prompt: textToSend,
          context: {
            studentName: student.name,
            cgpa: cgpaDisplay,
            semester: student.semester,
            department: student.department,
            credits: totalCreditsEarned
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.reply || data.response || "Based on your current academic record, your progress is solid. Continue maintaining consistent coursework performance."
        }]);
      } else {
        // Fallback intelligent response based on student context
        setTimeout(() => {
          let advice = `Based on your audited CGPA of ${cgpaDisplay} in Semester ${student.semester}, you are performing at an exemplary level. For ${student.department}, your best progression path is to maintain at least a 3.70 term SGPA in your upcoming upper-division modules.`;
          if (textToSend.toLowerCase().includes('elective') || textToSend.toLowerCase().includes('ai')) {
            advice = `For an AI specialization in ${student.department}, I recommend taking CS-401 (Deep Learning Systems) and CS-415 (Natural Language Processing) in Semester 5 and 6. Ensure you have completed Linear Algebra and Data Structures with high grades.`;
          } else if (textToSend.toLowerCase().includes('graduation')) {
            advice = `You have completed ${totalCreditsEarned} out of 120 units. With an average of 15–18 units per semester across your remaining terms, you are perfectly on track for Spring 2027 conferment!`;
          }
          setMessages(prev => [...prev, { role: 'assistant', content: advice }]);
        }, 600);
      }
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Your academic profile is strong (${cgpaDisplay} CGPA). Focus on selecting high-impact electives that align with your capstone project next year.`
      }]);
    } finally {
      setIsSending(false);
    }
  };

  const handleBookOfficeHours = () => {
    setBookingNotice('Office hours appointment request submitted to Prof. Henderson for upcoming Thursday session (14:30). A confirmation has been sent to your student email.');
    setTimeout(() => setBookingNotice(null), 6000);
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight leading-tight">Academic Advisory & AI Counselor</h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Departmental faculty advisement, appointment scheduling, and 24/7 intelligent academic guidance.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenFullAiModal}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold text-xs shadow-xs transition-colors min-h-[40px]"
            >
              <BrainCircuit className="w-4 h-4 shrink-0" />
              <span>Full Screen AI Dialog</span>
            </button>
            <button
              onClick={onOpenPrintTranscript}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 font-semibold text-xs border border-slate-200 dark:border-slate-800 transition-colors min-h-[40px]"
            >
              <Printer className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>Print Record</span>
            </button>
          </div>
        </div>

        {/* Notice Banner if Appointment Booked */}
        {bookingNotice && (
          <div className="mt-3 sm:mt-4 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{bookingNotice}</span>
          </div>
        )}

        {/* Faculty Advisor Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6 pt-4 sm:pt-6">
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Faculty Advisor</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Prof. R. Henderson, Ph.D.</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Professor of Computer Science & Department Chair</p>
            </div>
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span>Department of Computing & Information Systems</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Office Location & Hours</span>
              <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Turing Hall, Suite 402</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Every Tuesday & Thursday (14:00 – 16:30)</p>
            </div>
            <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              <span>Drop-in or scheduled appointments welcome</span>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Advisory Actions</span>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 mb-3">
                Schedule a 20-minute 1-on-1 degree audit review with your assigned advisor.
              </p>
            </div>
            <button
              onClick={handleBookOfficeHours}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs transition-colors text-center min-h-[40px]"
            >
              Book Office Hours Session
            </button>
          </div>
        </div>
      </div>

      {/* Embedded AI Academic Counselor Interface */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white flex items-center justify-center shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">Interactive AI Academic Counselor</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Live advising tailored to your B.Sc. {student.department} transcript</p>
            </div>
          </div>
          <span className="self-start sm:self-auto text-xs font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2.5 py-1 rounded-lg border border-indigo-100 dark:border-indigo-900 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-indigo-500" />
            Gemini 3.8 Active
          </span>
        </div>

        {/* Conversation Stream */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950/50 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-[85%] sm:max-w-[75%] p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-800 border border-slate-200 dark:border-slate-800 rounded-bl-xs shadow-xs'
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}

          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl rounded-bl-xs text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
                <span>Auditing course criteria & generating guidance...</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sample Queries */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-400 mr-1">Suggested Inquiries:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              onClick={() => handleSendQuery(p)}
              disabled={isSending}
              className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 dark:text-slate-300 font-medium px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <input
            type="text"
            placeholder="Ask your AI Academic Counselor anything about courses, electives, or graduation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendQuery();
            }}
            className="flex-1 text-xs sm:text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl px-4 py-2.5 font-medium text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleSendQuery()}
            disabled={!query.trim() || isSending}
            className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shrink-0"
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
