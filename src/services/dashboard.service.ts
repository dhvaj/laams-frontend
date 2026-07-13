import type { Assignment, Exam, ClassRoster, AccessibilityProfileStat, SystemStat, RegisteredUser, SubjectProgress, CalendarEvent, NewAssignment, User, ExamAttempt } from '../types';
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim();

const getCurrentUserId = () => {
  try {
    const data = localStorage.getItem('laams_user_data');
    if (data) return JSON.parse(data).id;
  } catch (e) {}
  return '';
};

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('laams_jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

const getJson = async <T,>(path: string): Promise<T> => {
  const res = await fetch(`${API_URL}/${path}`, {
    headers: { ...getAuthHeader() }
  });
  if (!res.ok) throw new Error(`Failed to load ${path}`);
  return await res.json();
};

const writeJson = async <T,>(path: string, method: 'POST' | 'PATCH' | 'DELETE', body?: unknown): Promise<T> => {
  const res = await fetch(`${API_URL}/${path}`, {
    method,
    headers: { 
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: method === 'DELETE' ? undefined : JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`Failed to write ${path}`);
  if (method === 'DELETE') return {} as T;
  return await res.json();
};

export const dashboardService = {
  // Student Data
  getStudentAssignments: async (): Promise<Assignment[]> => {
    const userId = getCurrentUserId() || '1';
    return getJson(`assignments?studentId=${userId}`);
  },
  getStudentExams: async (): Promise<Exam[]> => {
    return getJson(`exams?studentId=${getCurrentUserId() || '1'}`);
  },
  
  // Teacher Data
  getTeacherStats: async (): Promise<SystemStat[]> => {
    const teacherId = getCurrentUserId();
    return getJson(`teacherStats?teacherId=${teacherId}`);
  },
  getTeacherAssignments: async (classId?: string): Promise<Assignment[]> => {
    const teacherId = getCurrentUserId() || '2';
    const query = classId ? `classId=${classId}` : `teacherId=${teacherId}`;
    return getJson(`assignments?${query}`);
  },
  getAssignmentSubmissions: async (assignmentId: string): Promise<any[]> => {
    return getJson(`assignments/${assignmentId}/submissions`);
  },
  gradeSubmission: async (assignmentId: string, studentId: string, grade: string, feedback: string): Promise<void> => {
    await writeJson(`assignments/${assignmentId}`, 'PATCH', { studentId, grade, feedback, status: 'Graded' });
  },
  getAccessibilityBreakdown: async (): Promise<AccessibilityProfileStat[]> => {
    const teacherId = getCurrentUserId();
    return getJson(`accessibilityBreakdown?teacherId=${teacherId}`);
  },
  getTeacherClasses: async (): Promise<ClassRoster[]> => {
    return getJson(`classes?teacherId=${getCurrentUserId()}`);
  },
  getClassStudents: async (classId: string): Promise<any[]> => {
    return getJson(`users?role=student&classId=${classId}`);
  },
  createAssignment: async (assignment: NewAssignment & { classId?: string }): Promise<Assignment> => {
    const newAssignment = { ...assignment, studentId: "1" };
    return writeJson('assignments', 'POST', newAssignment);
  },
  uploadFile: async (file: File): Promise<{ fileUrl: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${API_URL}/files`, {
      method: 'POST',
      headers: { ...getAuthHeader() },
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    return await response.json();
  },
  createBook: async (book: { title: string; subject: string; classId?: string }, file: File): Promise<any> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', book.title);
    formData.append('subject', book.subject);
    formData.append('classId', book.classId || '1');
    formData.append('teacherId', getCurrentUserId() || '2');
    
    const response = await fetch(`${API_URL}/books`, {
              method: 'POST',
        headers: { ...getAuthHeader() },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to create book');
    return await response.json();
  },
  getBooks: async (): Promise<any[]> => {
    return getJson('books');
  },
  getBookChapters: async (bookId: string): Promise<any[]> => {
    return getJson(`books/${bookId}/chapters`);
  },
  createStudyMaterial: async (material: { title: string; subject: string; content: string; classId?: string }, file?: File | null): Promise<any> => {
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', material.title);
      formData.append('subject', material.subject);
      formData.append('content', material.content);
      formData.append('classId', material.classId || '1');
      formData.append('teacherId', getCurrentUserId() || '2');
      
      const response = await fetch(`${API_URL}/studyMaterials`, {
                method: 'POST',
        headers: { ...getAuthHeader() },
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to create study material with file');
      return await response.json();
    }
    return writeJson('studyMaterials', 'POST', { ...material, teacherId: getCurrentUserId() || '2' });
  },
  getStudyMaterials: async (): Promise<any[]> => {
    return getJson('studyMaterials');
  },
  getStudyMaterialById: async (id: string): Promise<any> => {
    const materials = await getJson<any[]>('studyMaterials');
    return materials.find((m: any) => m.id === id);
  },
  getLessons: async (): Promise<any[]> => {
    return getJson('lessons');
  },
  getLesson: async (idOrSlug: string): Promise<any> => {
    return getJson(`lessons/${idOrSlug}`);
  },
  getExamQuestions: async (examId: string, profile: string): Promise<any[]> => {
    return getJson(`exams/${examId}/questions?profile=${profile}`);
  },
  updateAssignment: async (id: string, updates: Partial<Assignment>): Promise<Assignment> => {
    return writeJson(`assignments/${id}`, 'PATCH', updates);
  },
  extendAssignment: async (id: string): Promise<Assignment> => {
    return writeJson(`assignments/${id}/extend`, 'POST');
  },

  submitAssignmentWithFile: async (id: string, file: File, studentId: string): Promise<Assignment> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', studentId);
    
    const response = await fetch(`${API_URL}/assignments/${id}/submit`, {
              method: 'POST',
        headers: { ...getAuthHeader() },
        body: formData,
    });
    if (!response.ok) throw new Error('Failed to submit assignment');
    return await response.json();
  },
  submitAssignmentNotes: async (id: string, notes: string, studentId: string): Promise<Assignment> => {
    const response = await fetch(`${API_URL}/assignments/${id}/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ notes, studentId })
    });
    if (!response.ok) throw new Error('Failed to submit assignment notes');
    return await response.json();
  },
  getTeacherExams: async (): Promise<Exam[]> => {
    return getJson(`exams?teacherId=${getCurrentUserId()}`);
  },
  createExam: async (exam: Partial<Exam> & { classId?: string; generateWithAI?: boolean; questions?: any[] }): Promise<Exam> => {
    const newExam = {
      title: exam.title || 'Untitled Exam',
      priority: exam.priority || 'Normal',
      date: exam.date || 'TBD',
      description: exam.description || '',
      classId: exam.classId,
      teacherId: getCurrentUserId() || '2',
      generateWithAI: exam.generateWithAI,
      questions: exam.questions
    };
    return writeJson('exams', 'POST', newExam);
  },
  generateQuestions: async (classId: string, description: string, fileUrl?: string, numMcqs?: number, numShort?: number, numDescriptive?: number): Promise<any> => {
    return writeJson('exams/generate-questions', 'POST', { classId, description, fileUrl, numMcqs, numShort, numDescriptive });
  },
  startExam: async (examId: string, studentId: string): Promise<ExamAttempt> => {
    return writeJson(`exams/${examId}/start`, 'POST', { studentId });
  },
  submitExam: async (examId: string, studentId: string, answers: Record<string, string>): Promise<ExamAttempt> => {
    return writeJson(`exams/${examId}/submit`, 'POST', { studentId, answers });
  },
  getExamAttempt: async (attemptId: string): Promise<any> => {
    return getJson(`exams/attempts/${attemptId}`);
  },
  getExamAttemptsForExam: async (examId: string): Promise<any[]> => {
    return getJson(`exams/${examId}/attempts`);
  },
  gradeExamAttempt: async (attemptId: string, grades: Record<string, { score: number; feedback: string }>, overallFeedback: string): Promise<any> => {
    return writeJson(`exams/attempts/${attemptId}/grade`, 'POST', { grades, overallFeedback });
  },
  submitAttendance: async (attendanceRecord: any): Promise<any> => {
    return writeJson('attendance', 'POST', attendanceRecord);
  },

  // Admin Data
  getAdminStats: async (): Promise<SystemStat[]> => {
    return getJson('adminStats');
  },
  getRecentUsers: async (): Promise<RegisteredUser[]> => {
    return getJson('recentUsers');
  },
  getAllUsers: async (): Promise<User[]> => {
    return getJson('users');
  },
  createUser: async (user: any): Promise<User> => {
    return writeJson('users', 'POST', user);
  },
  deleteUser: async (id: string): Promise<void> => {
    await writeJson(`users/${id}`, 'DELETE');
  },
  updateUser: async (id: string, updates: Partial<User>): Promise<User> => {
    return writeJson(`users/${id}`, 'PATCH', updates);
  },
  getParentStudents: async (parentId: string): Promise<any[]> => {
    return getJson(`parents/${parentId}/students`);
  },
  linkStudentToParent: async (parentId: string, studentId: string): Promise<void> => {
    await writeJson(`users/${parentId}/students`, 'POST', { studentId });
  },
  unlinkStudentFromParent: async (parentId: string, studentId: string): Promise<void> => {
    await writeJson(`users/${parentId}/students/${studentId}`, 'DELETE');
  },
  getStudentProgress: async (studentId: string): Promise<any> => {
    return getJson(`students/${studentId}/progress`);
  },
  deleteBook: async (id: string): Promise<void> => {
    await writeJson(`books/${id}`, 'DELETE');
  },
  updateBook: async (id: string, updates: any): Promise<any> => {
    return writeJson(`books/${id}`, 'PATCH', updates);
  },
  deleteStudyMaterial: async (id: string): Promise<void> => {
    await writeJson(`studyMaterials/${id}`, 'DELETE');
  },
  updateStudyMaterial: async (id: string, updates: any): Promise<any> => {
    return writeJson(`studyMaterials/${id}`, 'PATCH', updates);
  },
  getAllClasses: async (): Promise<any[]> => {
    return getJson('classes');
  },
  createClass: async (classData: any): Promise<any> => {
    return writeJson('classes', 'POST', classData);
  },
  updateClass: async (id: string, updates: any): Promise<any> => {
    return writeJson(`classes/${id}`, 'PATCH', updates);
  },

  // Parent Data
  getParentProgress: async (): Promise<SubjectProgress[]> => {
    return getJson('progress?studentId=1');
  },
  getParentCalendar: async (): Promise<CalendarEvent[]> => {
    return getJson('calendar?studentId=1');
  },
  getNotifications: async (userId?: string): Promise<any[]> => {
    const query = userId ? `?userId=${userId}` : '';
    return getJson(`notifications${query}`);
  },
  trackAnalyticsEvent: async (lessonId: string | null, eventType: string, eventValue?: number, metadata?: any): Promise<void> => {
    await fetch(`${API_URL}/api/analytics/track`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ lessonId, eventType, eventValue, metadata })
    }).catch(err => console.warn('Failed to send analytics track', err));
  }
};
