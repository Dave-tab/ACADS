import { Student, Course, Result, AcademicNotice } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    student_id: '2024235020409',
    name: 'Alex Morgan',
    email: 'alex.morgan@school.edu',
    password: 'password123',
    department: 'Computer Science',
    semester: 3,
    created_at: '2024-09-01 10:00:00'
  },
  {
    id: 2,
    student_id: '2024235020410',
    name: 'Sarah Connor',
    email: 'sarah.connor@school.edu',
    password: 'password123',
    department: 'Computer Science',
    semester: 3,
    created_at: '2024-09-02 11:30:00'
  },
  {
    id: 3,
    student_id: '2024235020411',
    name: 'David Turing',
    email: 'david.turing@school.edu',
    password: 'password123',
    department: 'Mathematics',
    semester: 2,
    created_at: '2024-09-03 09:15:00'
  }
];

export const INITIAL_COURSES: Course[] = [
  { id: 1, course_code: 'CS101', course_name: 'Introduction to Programming', credit_hours: 3, department: 'Computer Science' },
  { id: 2, course_code: 'CS102', course_name: 'Data Structures & Algorithms', credit_hours: 4, department: 'Computer Science' },
  { id: 3, course_code: 'CS103', course_name: 'Database Systems', credit_hours: 3, department: 'Computer Science' },
  { id: 4, course_code: 'CS104', course_name: 'Web Development', credit_hours: 3, department: 'Computer Science' },
  { id: 5, course_code: 'MATH101', course_name: 'Calculus I', credit_hours: 4, department: 'Mathematics' },
  { id: 6, course_code: 'MATH102', course_name: 'Linear Algebra', credit_hours: 3, department: 'Mathematics' },
  { id: 7, course_code: 'ENG101', course_name: 'English Composition', credit_hours: 3, department: 'English' },
  { id: 8, course_code: 'PHY101', course_name: 'Physics I', credit_hours: 4, department: 'Physics' }
];

export const INITIAL_RESULTS: Result[] = [
  {
    id: 1,
    student_id: '2024235020409',
    course_code: 'CS101',
    marks_obtained: 92,
    total_marks: 100,
    grade: 'A+',
    grade_point: 4.0,
    semester: 1,
    academic_year: '2023-2024',
    uploaded_at: '2024-01-15 14:20:00'
  },
  {
    id: 2,
    student_id: '2024235020409',
    course_code: 'MATH101',
    marks_obtained: 88,
    total_marks: 100,
    grade: 'A',
    grade_point: 3.7,
    semester: 1,
    academic_year: '2023-2024',
    uploaded_at: '2024-01-15 14:25:00'
  },
  {
    id: 3,
    student_id: '2024235020409',
    course_code: 'ENG101',
    marks_obtained: 78,
    total_marks: 100,
    grade: 'B+',
    grade_point: 3.0,
    semester: 1,
    academic_year: '2023-2024',
    uploaded_at: '2024-01-15 14:30:00'
  },
  {
    id: 4,
    student_id: '2024235020409',
    course_code: 'CS102',
    marks_obtained: 84,
    total_marks: 100,
    grade: 'A-',
    grade_point: 3.3,
    semester: 2,
    academic_year: '2023-2024',
    uploaded_at: '2024-06-10 10:00:00'
  },
  {
    id: 5,
    student_id: '2024235020409',
    course_code: 'CS103',
    marks_obtained: 91,
    total_marks: 100,
    grade: 'A+',
    grade_point: 4.0,
    semester: 2,
    academic_year: '2023-2024',
    uploaded_at: '2024-06-10 10:05:00'
  },
  {
    id: 6,
    student_id: '2024235020409',
    course_code: 'CS104',
    marks_obtained: 89,
    total_marks: 100,
    grade: 'A',
    grade_point: 3.7,
    semester: 3,
    academic_year: '2024-2025',
    uploaded_at: '2025-01-12 09:30:00'
  },
  {
    id: 7,
    student_id: '2024235020409',
    course_code: 'MATH102',
    marks_obtained: 82,
    total_marks: 100,
    grade: 'A-',
    grade_point: 3.3,
    semester: 3,
    academic_year: '2024-2025',
    uploaded_at: '2025-01-12 09:35:00'
  },
  {
    id: 8,
    student_id: '2024235020410',
    course_code: 'CS101',
    marks_obtained: 76,
    total_marks: 100,
    grade: 'B+',
    grade_point: 3.0,
    semester: 1,
    academic_year: '2023-2024',
    uploaded_at: '2024-01-15 15:00:00'
  },
  {
    id: 9,
    student_id: '2024235020410',
    course_code: 'PHY101',
    marks_obtained: 68,
    total_marks: 100,
    grade: 'B-',
    grade_point: 2.3,
    semester: 1,
    academic_year: '2023-2024',
    uploaded_at: '2024-01-15 15:10:00'
  }
];

export function calculateGPA(marks: number, totalMarks: number): { grade: string; grade_point: number } {
  const percentage = (marks / totalMarks) * 100;
  
  if (percentage >= 90) return { grade: 'A+', grade_point: 4.0 };
  if (percentage >= 85) return { grade: 'A', grade_point: 3.7 };
  if (percentage >= 80) return { grade: 'A-', grade_point: 3.3 };
  if (percentage >= 75) return { grade: 'B+', grade_point: 3.0 };
  if (percentage >= 70) return { grade: 'B', grade_point: 2.7 };
  if (percentage >= 65) return { grade: 'B-', grade_point: 2.3 };
  if (percentage >= 60) return { grade: 'C+', grade_point: 2.0 };
  if (percentage >= 55) return { grade: 'C', grade_point: 1.7 };
  if (percentage >= 50) return { grade: 'C-', grade_point: 1.3 };
  if (percentage >= 45) return { grade: 'D', grade_point: 1.0 };
  return { grade: 'F', grade_point: 0.0 };
}

export function calculateCGPA(studentId: string, results: Result[], courses: Course[]): number {
  const studentResults = results.filter(r => r.student_id === studentId);
  let totalGradePoints = 0;
  let totalCreditHours = 0;

  for (const res of studentResults) {
    const course = courses.find(c => c.course_code === res.course_code);
    const credits = course ? course.credit_hours : (res.credit_hours || 3);
    totalGradePoints += res.grade_point * credits;
    totalCreditHours += credits;
  }

  if (totalCreditHours > 0) {
    return parseFloat((totalGradePoints / totalCreditHours).toFixed(2));
  }
  return 0.0;
}

export const INITIAL_NOTICES: AcademicNotice[] = [
  {
    id: 'notice-1',
    title: 'Spring 2026 Final Examination Timetable & Seating Allocation Published',
    category: 'Examination',
    content: 'The official schedule for Spring 2026 End-of-Semester Examinations is now released. Students must present a valid Student ID Card and examination docket at all designated lecture halls. Morning sessions commence promptly at 09:00 AM.',
    date: '2026-04-12',
    timeAgo: 'Just now',
    priority: 'high',
    isRead: false,
    author: 'Office of the Controller of Examinations'
  },
  {
    id: 'notice-2',
    title: "Senate Commendation: Dean's Honors List for Spring 2026",
    category: 'Academic Senate',
    content: 'The Academic Senate has ratified the Dean\'s Honors Roll. Undergraduate scholars maintaining a cumulative CGPA of 3.75 and above with no course deficiencies have been awarded formal senate commendation.',
    date: '2026-04-09',
    timeAgo: '2 days ago',
    priority: 'normal',
    isRead: false,
    author: 'University Academic Senate'
  },
  {
    id: 'notice-3',
    title: 'Official Academic Transcript Attestation & Verification Window',
    category: 'Academic Senate',
    content: 'The Academic Records Division has opened digital transcript attestation for upcoming graduate school and scholarship submissions. Processing turnaround is 48 business hours.',
    date: '2026-03-30',
    timeAgo: '1 week ago',
    priority: 'normal',
    isRead: false,
    author: 'Academic Records & Certification'
  },
  {
    id: 'notice-4',
    title: 'Grade Verification & Examination Audit Appeal Deadline',
    category: 'Deadlines',
    content: 'Students wishing to request a formal re-computation or script review for published semester results must submit Form AR-12 to their respective department chair by April 24, 2026.',
    date: '2026-03-20',
    timeAgo: '2 weeks ago',
    priority: 'urgent',
    isRead: true,
    author: 'Academic Records Department'
  }
];

export function getHonorsClassification(cgpa: number): string {
  if (cgpa >= 3.70) return 'First Class Honours / Summa Cum Laude';
  if (cgpa >= 3.30) return 'Second Class (Upper Division) / Magna Cum Laude';
  if (cgpa >= 2.70) return 'Second Class (Lower Division) / Cum Laude';
  if (cgpa >= 2.00) return 'Third Class Standing';
  return 'Academic Probationary Standing';
}

export function getAcademicStanding(cgpa: number): { status: string; isGoodStanding: boolean; badgeClass: string } {
  if (cgpa >= 3.70) {
    return { status: 'Dean\'s Honors Standing', isGoodStanding: true, badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
  if (cgpa >= 2.00) {
    return { status: 'Good Academic Standing', isGoodStanding: true, badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
  }
  return { status: 'Academic Warning', isGoodStanding: false, badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
}
