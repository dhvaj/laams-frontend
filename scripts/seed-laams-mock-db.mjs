import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '..', 'db.json');

const users = [
  {
    id: '1',
    username: 'aarav',
    firstName: 'Aarav',
    lastName: 'Patel',
    email: 'student@school.edu',
    role: 'student',
    profileId: 'dyslexic',
    gradeLevel: '8',
    classId: '1',
    preferredLanguage: 'en',
    supportNeeds: ['read-aloud', 'large-spacing', 'simplified-text']
  },
  {
    id: '2',
    username: 'arjun',
    firstName: 'Arjun',
    lastName: 'Sharma',
    email: 'teacher@school.edu',
    role: 'teacher'
  },
  {
    id: '3',
    username: 'admin',
    firstName: 'System',
    lastName: 'Admin',
    email: 'admin@laams.edu',
    role: 'admin'
  },
  {
    id: '4',
    username: 'rahul',
    firstName: 'Rahul',
    lastName: 'Patel',
    email: 'parent@home.com',
    role: 'parent',
    linkedStudentIds: ['1']
  },
  {
    id: '5',
    username: 'maya',
    firstName: 'Maya',
    lastName: 'Singh',
    email: 'maya@school.edu',
    role: 'student',
    profileId: 'typical',
    gradeLevel: '8',
    classId: '1',
    preferredLanguage: 'en',
    supportNeeds: []
  },
  {
    id: '6',
    username: 'rohan',
    firstName: 'Rohan',
    lastName: 'Das',
    email: 'rohan@school.edu',
    role: 'student',
    profileId: 'adhd-autism',
    gradeLevel: '8',
    classId: '2',
    preferredLanguage: 'en',
    supportNeeds: ['low-distraction', 'short-steps', 'break-reminders']
  },
  {
    id: '7',
    username: 'priya',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'priya@school.edu',
    role: 'student',
    profileId: 'low-vision',
    gradeLevel: '8',
    classId: '1',
    preferredLanguage: 'en',
    supportNeeds: ['large-text', 'high-contrast', 'screen-magnifier']
  }
];

const subjects = [
  { id: '1', name: 'Science', gradeBand: '6-10', description: 'Middle-school science curriculum' },
  { id: '2', name: 'Mathematics', gradeBand: '6-10', description: 'Middle-school mathematics curriculum' },
  { id: '3', name: 'History', gradeBand: '6-10', description: 'Middle-school history curriculum' }
];

const classes = [
  { id: '1', teacherId: '2', subjectId: '1', name: '8th Grade Science', studentCount: 3, focus: 'The Solar System, Basic Chemistry' },
  { id: '2', teacherId: '2', subjectId: '2', name: '8th Grade Math', studentCount: 2, focus: 'Pre-Algebra, Fractions' }
];

const classStudents = [
  { id: '1', classId: '1', studentId: '1', name: 'Aarav Patel', profileId: 'Dyslexic', grade: '8th Grade', performance: 'Excellent' },
  { id: '2', classId: '1', studentId: '5', name: 'Maya Singh', profileId: 'Typical', grade: '8th Grade', performance: 'Good' },
  { id: '3', classId: '2', studentId: '6', name: 'Rohan Das', profileId: 'ADHD / Autism', grade: '8th Grade', performance: 'Needs Improvement' },
  { id: '4', classId: '1', studentId: '7', name: 'Priya Sharma', profileId: 'Low Vision', grade: '8th Grade', performance: 'Excellent' }
];

const lessons = [
  {
    id: '1',
    slug: 'solar-system',
    title: 'The Solar System',
    subject: 'Science',
    subjectId: '1',
    gradeLevel: '8',
    contentId: 'lesson_solar_system_v1',
    teacherId: '2'
  },
  {
    id: '2',
    slug: 'fractions-basics',
    title: 'Fractions Basics',
    subject: 'Mathematics',
    subjectId: '2',
    gradeLevel: '8',
    contentId: 'lesson_fractions_basics_v1',
    teacherId: '2'
  }
];

const studyMaterials = [
  {
    id: '1',
    lessonId: '1',
    classId: '1',
    teacherId: '2',
    title: 'Solar System Revision Notes',
    subject: 'Science',
    type: 'study-material',
    content: 'Short revision notes with adapted reading support for different accessibility profiles.',
    createdAt: '2026-05-20T09:00:00.000Z'
  }
];

const assignments = [
  {
    id: '1',
    studentId: '1',
    classId: '1',
    lessonId: '1',
    title: 'The Water Cycle Quiz',
    subject: 'Science',
    dueDate: 'Tomorrow, 11:59 PM',
    status: 'Incomplete',
    allowedSubmissionTypes: ['typed', 'file-upload', 'audio']
  },
  {
    id: '2',
    studentId: '1',
    classId: '2',
    lessonId: '2',
    title: 'Fractions Worksheet',
    subject: 'Math',
    dueDate: 'Friday, 5:00 PM',
    status: 'Incomplete',
    allowedSubmissionTypes: ['typed', 'photo-upload']
  },
  {
    id: '3',
    studentId: '1',
    classId: '1',
    lessonId: '1',
    title: 'Solar System Reflection',
    subject: 'Science',
    dueDate: 'Overdue',
    status: 'Submitted',
    feedback: 'Submitted for teacher review',
    allowedSubmissionTypes: ['typed', 'audio']
  }
];

const assignmentSubmissions = [
  {
    id: '1',
    assignmentId: '3',
    studentId: '1',
    status: 'Submitted',
    notes: 'Audio-supported response uploaded.',
    uploadUrl: '/uploads/demo/solar-reflection-aarav.txt',
    submittedAt: '2026-05-18T13:00:00.000Z'
  }
];

const exams = [
  {
    id: '1',
    studentId: '1',
    classId: '1',
    teacherId: '2',
    title: 'Midterm: History',
    priority: 'High Priority',
    date: '15 OCT',
    scheduledAt: '2026-10-15T09:00:00.000Z',
    description: 'Covers Chapters 1-4. Includes multiple choice and short adaptive essay questions.'
  },
  {
    id: '2',
    studentId: '1',
    classId: '1',
    teacherId: '2',
    title: 'Science: Solar System',
    priority: 'Normal',
    date: '18 OCT',
    scheduledAt: '2026-10-18T09:00:00.000Z',
    description: 'MCQs, short answers, and accessible prompts.'
  }
];

const examQuestions = [
  {
    id: '1',
    examId: '2',
    position: 1,
    questionType: 'mcq',
    prompt: 'What is the largest planet in our solar system?',
    options: ['Earth', 'Mars', 'Jupiter', 'Saturn'],
    correctAnswer: 'Jupiter',
    accessibilityNotes: {
      blind: 'Answer options are screen-reader labeled.',
      dyslexic: 'Use larger spacing between options.'
    }
  },
  {
    id: '2',
    examId: '2',
    position: 2,
    questionType: 'short',
    prompt: 'Briefly describe what a star is.',
    accessibilityNotes: {
      id: 'Allow oral answer or very short written answer.'
    }
  }
];

const examAttempts = [
  { id: '1', examId: '2', studentId: '1', status: 'Not Started' }
];

const attendance = [
  {
    id: '1',
    classId: '1',
    date: '2026-05-20',
    students: [
      { studentId: '1', status: 'Present' },
      { studentId: '5', status: 'Present' },
      { studentId: '7', status: 'Excused' }
    ]
  }
];

const teacherStats = [
  { id: '1', teacherId: '2', title: 'Total Students', value: '4', iconName: 'Users', colorClass: 'text-blue-500' },
  { id: '2', teacherId: '2', title: 'Classes', value: '2', iconName: 'FileText', colorClass: 'text-green-500' },
  { id: '3', teacherId: '2', title: 'Assignments to Grade', value: '1', iconName: 'BarChart', colorClass: 'text-orange-500' },
  { id: '4', teacherId: '2', title: 'Accessibility Alerts', value: '3', iconName: 'ShieldAlert', colorClass: 'text-red-500' }
];

const accessibilityBreakdown = [
  { id: '1', teacherId: '2', profile: 'Typical', count: 1, percentage: '25%' },
  { id: '2', teacherId: '2', profile: 'Dyslexic', count: 1, percentage: '25%' },
  { id: '3', teacherId: '2', profile: 'ADHD / Autism', count: 1, percentage: '25%' },
  { id: '4', teacherId: '2', profile: 'Low Vision', count: 1, percentage: '25%' }
];

const adminStats = [
  { id: '1', title: 'Total Users', value: '7', iconName: 'Users', colorClass: 'text-indigo-500' },
  { id: '2', title: 'Active Sessions', value: '4', iconName: 'Activity', colorClass: 'text-green-500' },
  { id: '3', title: 'Compliance Score', value: '98%', iconName: 'Shield', colorClass: 'text-blue-500' },
  { id: '4', title: 'System Errors', value: '0', iconName: 'Settings', colorClass: 'text-gray-500' }
];

const recentUsers = users.slice(0, 5).map((user, index) => ({
  id: `${index + 1}`,
  name: `${user.firstName} ${user.lastName}`,
  email: user.email,
  role: user.role,
  needs: user.profileId || 'typical',
  date: index === 0 ? 'Today, 09:41 AM' : 'Yesterday'
}));

const progress = [
  {
    id: '1',
    studentId: '1',
    subject: 'Science',
    grade: 'A',
    percentage: 92,
    teacherNote: 'Aarav is doing excellent with the adaptive visual modules. His understanding of the Solar System is very strong.',
    timeSpentMinutes: 145,
    downloadsCount: 3,
    assignmentsCompleted: 4,
    examPerformance: 91
  },
  {
    id: '2',
    studentId: '1',
    subject: 'Mathematics',
    grade: 'B',
    percentage: 85,
    teacherNote: 'We are currently focusing on fractions. The high-contrast color coding seems to be helping significantly.',
    timeSpentMinutes: 110,
    downloadsCount: 2,
    assignmentsCompleted: 3,
    examPerformance: 84
  },
  {
    id: '3',
    studentId: '1',
    subject: 'History',
    grade: 'B+',
    percentage: 88,
    teacherNote: 'Audio submission support is helping response quality.',
    timeSpentMinutes: 90,
    downloadsCount: 1,
    assignmentsCompleted: 2,
    examPerformance: 87
  }
];

const calendar = [
  { id: '1', studentId: '1', month: 'Oct', day: '12', title: 'History Essay Due', description: 'Requires Audio Submission based on Aarav profile.', colorClass: 'bg-orange-100 text-orange-600' },
  { id: '2', studentId: '1', month: 'Oct', day: '14', title: 'Math Quiz: Fractions', description: 'In-class assessment.', colorClass: 'bg-blue-100 text-blue-600' },
  { id: '3', studentId: '1', month: 'Oct', day: '18', title: 'Science Exam', description: 'Adaptive question format enabled.', colorClass: 'bg-green-100 text-green-600' }
];

const messages = [
  {
    id: '1',
    senderId: '2',
    recipientId: '4',
    studentId: '1',
    body: 'Aarav has a History essay due next week. Let me know if he needs an extension.',
    sentAt: '2026-05-18T10:30:00.000Z',
    readAt: null
  },
  {
    id: '2',
    senderId: '4',
    recipientId: '2',
    studentId: '1',
    body: 'Thank you. He is using the audio adaptation and it is going well.',
    sentAt: '2026-05-18T11:20:00.000Z',
    readAt: null
  }
];

const notifications = [
  {
    id: '1',
    userId: '1',
    channel: 'in_app',
    title: 'Assignment due tomorrow',
    body: 'The Water Cycle Quiz is due tomorrow at 11:59 PM.',
    relatedEntityType: 'assignment',
    relatedEntityId: '1',
    createdAt: '2026-05-20T09:30:00.000Z'
  },
  {
    id: '2',
    userId: '4',
    channel: 'whatsapp',
    title: 'Progress update',
    body: 'Aarav completed 4 Science assignments this month.',
    relatedEntityType: 'progress',
    relatedEntityId: '1',
    createdAt: '2026-05-20T09:45:00.000Z'
  }
];

const adaptiveEvents = [
  {
    id: '1',
    studentId: '1',
    lessonId: '1',
    profileId: 'dyslexic',
    sourceContentId: 'lesson_solar_system_v1',
    outputLayout: 'bulleted-high-spacing',
    operations: ['simplified-text', 'increased-spacing', 'chunked-content'],
    generatedAt: '2026-05-20T09:15:00.000Z'
  }
];

const auditLogs = [
  {
    id: '1',
    actorId: '3',
    action: 'seed.mock_database',
    entityType: 'database',
    entityId: 'db.json',
    metadata: { source: 'LAAMS SRD V1' },
    createdAt: '2026-05-20T09:00:00.000Z'
  }
];

const db = {
  users,
  subjects,
  classes,
  classStudents,
  lessons,
  studyMaterials,
  assignments,
  assignmentSubmissions,
  exams,
  examQuestions,
  examAttempts,
  attendance,
  teacherStats,
  accessibilityBreakdown,
  adminStats,
  recentUsers,
  progress,
  calendar,
  messages,
  notifications,
  adaptiveEvents,
  auditLogs
};

writeFileSync(dbPath, `${JSON.stringify(db, null, 2)}\n`);
console.log(`Seeded ${dbPath}`);
