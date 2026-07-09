export type UserRole = 'student' | 'teacher' | 'admin' | 'parent';

export interface User {
  id: string;
  username?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  profileId?: string; // e.g., 'dyslexic', 'typical'
  needs?: string;
  gradeLevel?: string;
  classId?: string;
  linkedStudentIds?: string[];
  preferredLanguage?: string;
}

export interface Assignment {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  status: 'Complete' | 'Completed' | 'Incomplete' | 'Submitted' | 'Graded';
  classId?: string;
  studentId?: string;
  feedback?: string;
  grade?: string;
  instructions?: string;
}

export interface Exam {
  id: string;
  title: string;
  priority: 'High Priority' | 'Normal';
  date: string;
  description: string;
  classId?: string;
  teacherId?: string;
  status?: 'Not Started' | 'In Progress' | 'Submitted' | 'Reviewed' | 'Graded';
  score?: number | string | null;
  feedback?: string | null;
  attemptId?: string | null;
}

export interface CourseStat {
  title: string;
  value: string | number;
}

export interface ClassRoster {
  id: string;
  name: string;
  studentCount: number;
  focus: string;
}

export interface AccessibilityProfileStat {
  profile: string;
  count: number;
  percentage: string;
}

export interface SystemStat {
  id?: string;
  title: string;
  value: string;
  iconName: string;
  colorClass: string;
}

export interface RegisteredUser {
  name: string;
  email: string;
  role: string;
  needs: string;
  date: string;
}

export interface SubjectProgress {
  subject: string;
  grade: string;
  percentage: number;
  teacherNote: string;
}

export interface CalendarEvent {
  id: string;
  month: string;
  day: string;
  title: string;
  description: string;
  colorClass: string;
}

export interface ClassStudent {
  id: string;
  classId: string;
  name: string;
  profileId: string;
  grade: string;
  performance: string;
}

export interface NewAssignment {
  title: string;
  subject: string;
  dueDate: string;
  status: 'Complete' | 'Completed' | 'Incomplete' | 'Submitted' | 'Graded';
  classId?: string;
  studentId?: string;
  instructions?: string;
}

export interface NewExam {
  title: string;
  priority: 'High Priority' | 'Normal';
  date: string;
  description: string;
  classId: string;
}

export interface AttendanceRecord {
  id: string;
  classId: string;
  date: string;
  students: {
    studentId: string;
    status: 'Present' | 'Absent' | 'Excused';
  }[];
}

export interface LessonMedia {
  type: 'image' | 'video' | 'audio';
  url: string;
  alt: string;
}

export interface LessonVocabularyItem {
  word: string;
  definition: string;
}

export interface LessonSegment {
  id: string;
  heading: string;
  level: number;
  sourceText: string;
}

export interface LessonContent {
  id: string;
  slug: string;
  title: string;
  subject: string;
  gradeLevel: string;
  language: string;
  media: LessonMedia[];
  vocabulary: LessonVocabularyItem[];
  segments: LessonSegment[];
  fullText: string;
  fileUrl?: string;
}

export interface AdaptedLessonBlock {
  id: string;
  type: 'paragraph' | 'bullets' | 'media' | 'vocabulary' | 'step' | 'callout' | 'markdown';
  heading?: string;
  text?: string;
  items?: string[];
  media?: LessonMedia;
  vocabulary?: LessonVocabularyItem[];
}

export interface AdaptiveEngineTrace {
  profile: string;
  sourceLessonId: string;
  sourceSegments: number;
  outputBlocks: number;
  operations: string[];
  generatedAt: string;
}

export interface AdaptedLesson {
  lessonId: string;
  title: string;
  subject: string;
  profile: string;
  layout:
    | 'standard'
    | 'screen-reader-structured'
    | 'free-flow-high-contrast'
    | 'short-visual'
    | 'bulleted-high-spacing'
    | 'simple-picture-first'
    | 'step-by-step-low-distraction';
  complexity: 'standard' | 'simplified' | 'foundational' | 'guided';
  summary: string;
  blocks: AdaptedLessonBlock[];
  trace: AdaptiveEngineTrace;
  vocabulary?: LessonVocabularyItem[];
}

export interface ExamQuestion {
  id: string;
  examId: string;
  position: number;
  type: 'mcq' | 'short' | 'descriptive';
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  accessibilityNotes?: any;
}

export interface ExamAttempt {
  id: string;
  examId: string;
  studentId: string;
  status: 'Not Started' | 'In Progress' | 'Submitted' | 'Reviewed' | 'Graded';
  startedAt?: string;
  submittedAt?: string;
  score?: number | null;
  feedback?: string | null;
}

export interface ExamAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string;
  isCorrect?: boolean | null;
  score?: number | null;
  feedback?: string | null;
}
