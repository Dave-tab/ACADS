export type Role = 'home' | 'admin_login' | 'admin_dashboard' | 'student_login' | 'student_portal';

export type AdminTab = 'dashboard' | 'manage_students' | 'manage_courses' | 'upload_result' | 'view_results';

export interface Student {
  id: number;
  student_id: string;
  name: string;
  email: string;
  password?: string;
  department: string;
  semester: number;
  profile_photo?: string;
  created_at?: string;
}

export interface Course {
  id: number;
  course_code: string;
  course_name: string;
  credit_hours: number;
  department: string;
}

export interface Result {
  id: number;
  student_id: string;
  course_code: string;
  marks_obtained: number;
  total_marks: number;
  grade: string;
  grade_point: number;
  semester: number;
  academic_year: string;
  uploaded_at: string;
  student_name?: string;
  course_name?: string;
  credit_hours?: number;
}

export interface AcademicNotice {
  id: string;
  title: string;
  category: 'Examination' | 'Academic Senate' | 'Registry' | 'Deadlines' | 'Financial' | 'General';
  content: string;
  date: string;
  timeAgo: string;
  priority: 'normal' | 'high' | 'urgent';
  isRead: boolean;
  author?: string;
}

