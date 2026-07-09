import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { Users, FileText, BarChart, ShieldAlert, ArrowLeft, CheckCircle, Loader, GraduationCap, Calendar, BookOpen, UploadCloud, Trash, Edit3, X, Paperclip, Plus, Trash2, HelpCircle, Sparkles } from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import type { SystemStat, AccessibilityProfileStat, ClassRoster, ClassStudent } from '../../types';

// Helper to map string icon names back to Lucide components
const IconMap: Record<string, any> = {
  Users, FileText, BarChart, ShieldAlert
};

const ProfileTips: Record<string, string> = {
  'low-vision': '💡 Contrast: High contrast, dark canvas, big fonts.',
  'deaf': '💡 Media: Captions, descriptive transcripts.',
  'dyslexic': '💡 layout: Wide letter-spacing, OpenDyslexic font.',
  'adhd-autism': '💡 UI: Gamified paths, checkboxes, step guides.',
  'typical': '💡 Setup: Standard layouts, typical visual styling.'
};

const ProfileThemeClasses: Record<string, { bar: string; badge: string; bg: string }> = {
  'low-vision': {
    bar: 'bg-amber-500',
    badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    bg: 'hover:border-amber-500/30'
  },
  'deaf': {
    bar: 'bg-sky-500',
    badge: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
    bg: 'hover:border-sky-500/30'
  },
  'dyslexic': {
    bar: 'bg-emerald-500',
    badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    bg: 'hover:border-emerald-500/30'
  },
  'adhd-autism': {
    bar: 'bg-rose-500',
    badge: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    bg: 'hover:border-rose-500/30'
  },
  'typical': {
    bar: 'bg-indigo-500',
    badge: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20',
    bg: 'hover:border-indigo-500/30'
  }
};

const Overview = () => {
  const [stats, setStats] = useState<SystemStat[]>([]);
  const [profiles, setProfiles] = useState<AccessibilityProfileStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      dashboardService.getTeacherStats(),
      dashboardService.getAccessibilityBreakdown()
    ]).then(([statsData, profilesData]) => {
      setStats(statsData);
      setProfiles(profilesData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-60 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-4 w-96 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-28 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    );
  }

  // Styles for the four stats cards dynamically based on card index
  const statCardStyles = [
    { bg: 'from-violet-500/5 to-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-100 dark:border-violet-900/30', iconBg: 'bg-violet-500/10 dark:bg-violet-500/20' },
    { bg: 'from-emerald-500/5 to-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30', iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20' },
    { bg: 'from-amber-500/5 to-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900/30', iconBg: 'bg-amber-500/10 dark:bg-amber-500/20' },
    { bg: 'from-indigo-500/5 to-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-900/30', iconBg: 'bg-indigo-500/10 dark:bg-indigo-500/20' }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
          <span>Teacher Dashboard</span>
        </h1>
        <p className="theme-text-muted text-sm font-medium">Monitor class progress, upload materials, and manage student accessibility features.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = IconMap[stat.iconName] || Users;
          const style = statCardStyles[idx % statCardStyles.length];
          return (
            <div key={idx} className={`card-premium theme-surface bg-gradient-to-br ${style.bg} p-6 flex items-center gap-4 border`}>
              <div className={`w-14 h-14 rounded-2xl ${style.iconBg} flex items-center justify-center shadow-inner`}>
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs theme-text-muted font-bold tracking-wider uppercase">{stat.title}</p>
                <p className="text-3xl font-extrabold theme-text tracking-tighter mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="theme-surface border theme-border rounded-2xl overflow-hidden shadow-sm">
        <div className="p-6 border-b theme-border bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold theme-text tracking-tight">Class Accessibility Breakdown</h2>
            <p className="theme-text-muted text-sm mt-0.5">Understanding your students' learning profiles to better customize instructions.</p>
          </div>
          <span className="hidden sm:inline-block bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full">
            Adaptive Learning Enabled
          </span>
        </div>
        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {profiles.map((item, idx) => {
            const profileKey = item.profile.toLowerCase();
            const themes = ProfileThemeClasses[profileKey] || ProfileThemeClasses['typical'];
            const tip = ProfileTips[profileKey] || ProfileTips['typical'];

            return (
              <div key={idx} className={`bg-gradient-glow rounded-xl p-5 border theme-border relative overflow-hidden transition-all duration-300 ${themes.bg} flex flex-col justify-between`}>
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-bold theme-text text-sm capitalize">{item.profile.replace('-', ' ')}</h3>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${themes.badge}`}>
                      Profile
                    </span>
                  </div>
                  <div className="flex items-end gap-2 mt-3">
                    <span className="text-3.5xl font-extrabold theme-text tracking-tight leading-none">{item.count}</span>
                    <span className="text-xs theme-text-muted font-semibold">students ({item.percentage})</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700/80 h-2 mt-4 rounded-full overflow-hidden shadow-inner">
                    <div className={`${themes.bar} h-full rounded-full transition-all duration-500`} style={{ width: item.percentage }}></div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t theme-border text-[11px] font-medium theme-text-muted">
                  {tip}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getAvatarGradient = (first: string = '', last: string = '') => {
  const name = `${first}${last}`;
  const charCodeSum = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const gradients = [
    'from-violet-500 to-indigo-500 text-white',
    'from-emerald-500 to-teal-500 text-white',
    'from-amber-500 to-orange-500 text-white',
    'from-rose-500 to-pink-500 text-white',
    'from-sky-500 to-blue-500 text-white'
  ];
  return gradients[charCodeSum % gradients.length];
};

const RosterProfileThemes: Record<string, string> = {
  'low-vision': 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 border-amber-100 dark:border-amber-900/50',
  'deaf': 'bg-sky-50 dark:bg-sky-950/20 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-900/50',
  'dyslexic': 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300 border-emerald-100 dark:border-emerald-900/50',
  'adhd-autism': 'bg-rose-50 dark:bg-rose-950/20 text-rose-700 dark:text-rose-300 border-rose-100 dark:border-rose-900/50',
  'typical': 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900/50'
};

const Classes = () => {
  const [classes, setClasses] = useState<ClassRoster[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    dashboardService.getTeacherClasses().then(data => {
      setClasses(data);
    }).catch(err => {
      console.error('Failed to fetch classes', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">My Classes</h1>
        <p className="theme-text-muted text-sm font-medium">Select a class to review the student list, track attendance, and analyze performance metrics.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-pulse">
          {[1, 2].map(n => (
            <div key={n} className="h-56 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {classes.map(cls => (
            <div key={cls.id} className="card-premium theme-surface p-6 border theme-border rounded-2xl flex flex-col justify-between h-56 relative overflow-hidden group">
              {/* Decorative background visual */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors pointer-events-none"></div>
              
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold theme-text tracking-tight">{cls.name}</h2>
                  </div>
                  <span className="bg-primary/10 text-primary border border-primary/20 text-xs font-bold px-3 py-1 rounded-full">{cls.studentCount} Students</span>
                </div>
                <div className="space-y-2 mt-2">
                  <p className="theme-text-muted text-sm leading-relaxed">
                    Focus: <span className="font-bold theme-text">{cls.focus}</span>
                  </p>
                  <div className="flex gap-1.5 mt-2">
                    <span className="text-[10px] font-bold border theme-border px-2 py-0.5 rounded-full theme-text-muted">Interactive Labs</span>
                    <span className="text-[10px] font-bold border theme-border px-2 py-0.5 rounded-full theme-text-muted">Roster Track</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => navigate(`/dashboard/classes/${cls.id}`)}
                className="w-full py-2.5 bg-gradient-premium hover:shadow-lg hover:shadow-primary/20 text-white font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Manage Roster</span>
                <ArrowLeft className="w-4 h-4 rotate-180 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ClassRosterView = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [students, setStudents] = useState<ClassStudent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (classId) {
      dashboardService.getClassStudents(classId).then(data => {
        setStudents(data);
      }).catch(err => {
        console.error('Failed to fetch class students', err);
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [classId]);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b theme-border pb-5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/classes')}
            className="p-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition cursor-pointer text-gray-700 dark:text-gray-300 hover:scale-105 active:scale-95"
            aria-label="Back to classes"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold theme-text tracking-tight">Class Roster</h1>
            <p className="text-xs theme-text-muted mt-0.5 font-medium">View student profiles, accessibility profiles, and academic performance.</p>
          </div>
        </div>
      </div>

      <div className="theme-surface border theme-border rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-gray-900/50">
        {loading ? (
           <div className="p-12 text-center text-primary animate-pulse flex flex-col items-center"><Loader className="animate-spin mb-4" /> Loading roster...</div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center theme-text-muted font-medium">No students found for this class.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-900/40 border-b theme-border text-xs theme-text-muted uppercase tracking-wider font-extrabold">
                  <th className="p-4 pl-6">Student Name</th>
                  <th className="p-4">Grade Level</th>
                  <th className="p-4">Accessibility Profile</th>
                  <th className="p-4 pr-6 text-right">Performance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student: any) => {
                  const profileKey = (student.profileId || student.needs || 'typical').toLowerCase();
                  const badgeClass = RosterProfileThemes[profileKey] || RosterProfileThemes['typical'];
                  const avatarGradient = getAvatarGradient(student.firstName, student.lastName);

                  return (
                    <tr key={student.id} className="border-b theme-border hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-sm uppercase shadow-inner transform group-hover:scale-105 transition-transform duration-200`}>
                            {student.firstName?.[0]}{student.lastName?.[0]}
                          </div>
                          <div>
                            <p className="font-bold theme-text text-sm">{student.firstName} {student.lastName}</p>
                            <p className="text-xs theme-text-muted font-semibold">{student.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm font-bold theme-text-muted">{student.gradeLevel || 'N/A'} Grade</td>
                      <td className="p-4">
                        <span className={`border text-xs font-bold px-3 py-1 rounded-full shadow-sm capitalize ${badgeClass}`}>
                          {student.profileId || student.needs || 'Typical'}
                        </span>
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20 px-3 py-1 rounded-full border border-green-200/50 dark:border-green-900/30">
                          Excellent
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

const ContentHub = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [formData, setFormData] = useState({
      contentType: 'assignment' as 'assignment' | 'study' | 'book',
      title: '',
      subject: '',
      dueDate: '',
      content: '',
      classId: ''
    });
    const [files, setFiles] = useState<File[]>([]);
    const [classes, setClasses] = useState<ClassRoster[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Content Management State
    const [books, setBooks] = useState<any[]>([]);
    const [studyMaterials, setStudyMaterials] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [editForm, setEditForm] = useState({ title: '', subject: '', content: '' });
    
    const loadContent = async () => {
      try {
        const [b, s] = await Promise.all([dashboardService.getBooks(), dashboardService.getStudyMaterials()]);
        setBooks(b);
        setStudyMaterials(s);
      } catch (e) { console.error("Failed to load content", e); }
    };

    useEffect(() => {
      dashboardService.getTeacherClasses().then(setClasses).catch(console.error);
      loadContent();
    }, []);

    const handleDrag = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.type === "dragenter" || e.type === "dragover") {
        setDragActive(true);
      } else if (e.type === "dragleave") {
        setDragActive(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const newFiles = Array.from(e.dataTransfer.files);
        if (formData.contentType === 'book') {
          setFiles([newFiles[0]]);
        } else {
          setFiles(prev => [...prev, ...newFiles]);
        }
      }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const newFiles = Array.from(e.target.files);
        if (formData.contentType === 'book') {
          setFiles([newFiles[0]]);
        } else {
          setFiles(prev => [...prev, ...newFiles]);
        }
      }
    };

    const formatFileSize = (bytes: number) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (formData.contentType === 'study' && !formData.content.trim() && files.length === 0) {
        alert('Please enter study content or attach a file to publish study material.');
        return;
      }
      if (formData.contentType === 'assignment' && !formData.content.trim() && files.length === 0) {
        alert('Please enter assignment instructions or attach a file to publish an assignment.');
        return;
      }
      setIsSubmitting(true);
      try {
        if (formData.contentType === 'assignment') {
          let finalInstructions = formData.content;
          if (files.length > 0) {
            const uploadResults = await Promise.all(files.map(f => dashboardService.uploadFile(f)));
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const downloadLinks = uploadResults.map((uploadRes, idx) => {
              const fileUrl = uploadRes.fileUrl.startsWith('http') ? uploadRes.fileUrl : `${API_URL}${uploadRes.fileUrl}`;
              return `- [${files[idx].name}](${fileUrl})`;
            }).join('\n');
            finalInstructions += `\n\n**Attachments:**\n${downloadLinks}`;
          }
          await dashboardService.createAssignment({
            title: formData.title,
            subject: formData.subject,
            instructions: finalInstructions,
            dueDate: formData.dueDate.replace('T', ' '),
            status: 'Incomplete',
            classId: formData.classId || '1'
          });
        } else if (formData.contentType === 'book') {
          if (files.length === 0) throw new Error("A .docx, .epub, or .pdf file is required for Books.");
          await dashboardService.createBook({
            title: formData.title,
            subject: formData.subject,
            classId: formData.classId || '1'
          }, files[0]);
        } else {
          let finalContent = formData.content;
          const primaryFile = files.length > 0 ? files[0] : null;
          
          if (files.length > 1) {
            const secondaryFiles = files.slice(1);
            const uploadResults = await Promise.all(secondaryFiles.map(f => dashboardService.uploadFile(f)));
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const downloadLinks = uploadResults.map((uploadRes, idx) => {
              const fileUrl = uploadRes.fileUrl.startsWith('http') ? uploadRes.fileUrl : `${API_URL}${uploadRes.fileUrl}`;
              return `- [${secondaryFiles[idx].name}](${fileUrl})`;
            }).join('\n');
            finalContent += `\n\n**Additional Attachments:**\n${downloadLinks}`;
          }
          
          await dashboardService.createStudyMaterial({
            title: formData.title,
            subject: formData.subject,
            content: finalContent,
            classId: formData.classId || '1'
          }, primaryFile);
        }
        setSuccessMessage(formData.contentType === 'assignment' ? 'Assignment created and dispatched to students.' : formData.contentType === 'book' ? 'Book uploaded and split into chapters.' : 'Study material added for students.');
        setIsSuccess(true);
        setFormData({ contentType: 'assignment', title: '', subject: '', dueDate: '', content: '', classId: '' });
        setFiles([]);
        loadContent();
        setTimeout(() => setIsSuccess(false), 3000);
      } catch (err) {
        console.error('Failed to create content', err);
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-3xl font-extrabold theme-text tracking-tight">Content Hub</h1>
          <p className="theme-text-muted text-sm font-medium">Create interactive assignments, post study materials, or upload textbook media to feed the adaptive parser.</p>
        </div>

        <div className="theme-surface border theme-border p-8 rounded-2xl shadow-sm relative overflow-hidden bg-white dark:bg-gray-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-premium rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
              <FileText className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold theme-text tracking-tight">Publish Learning Content</h2>
              <p className="text-xs theme-text-muted mt-0.5 font-medium">Let the AI Adaptive Engine adapt files to meet student needs.</p>
            </div>
          </div>
          
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900/40 rounded-xl flex items-center gap-3 animate-scale-up">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-bold text-sm">Success! {successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <legend className="sr-only">Content type</legend>
              
              <label className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 transform active:scale-98 flex flex-col justify-between h-36 ${formData.contentType === 'study' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'theme-border bg-gray-50/50 dark:bg-gray-800/10 hover:border-primary/50'}`}>
                <div className="flex items-start gap-3 select-none">
                  <input
                    type="radio"
                    name="contentType"
                    value="study"
                    checked={formData.contentType === 'study'}
                    onChange={() => setFormData({ ...formData, contentType: 'study', dueDate: '' })}
                    className="mt-1 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold theme-text text-sm">
                      <BookOpen className="w-4 h-4 text-primary" />
                      <span>Study Material</span>
                    </div>
                    <span className="block text-xs theme-text-muted mt-1 leading-relaxed">Upload notes, textbooks, or revision materials.</span>
                  </div>
                </div>
              </label>
              
              <label className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 transform active:scale-98 flex flex-col justify-between h-36 ${formData.contentType === 'assignment' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'theme-border bg-gray-50/50 dark:bg-gray-800/10 hover:border-primary/50'}`}>
                <div className="flex items-start gap-3 select-none">
                  <input
                    type="radio"
                    name="contentType"
                    value="assignment"
                    checked={formData.contentType === 'assignment'}
                    onChange={() => setFormData({ ...formData, contentType: 'assignment' })}
                    className="mt-1 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold theme-text text-sm">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Assignment</span>
                    </div>
                    <span className="block text-xs theme-text-muted mt-1 leading-relaxed">Create homework tasks with deadlines and worksheets.</span>
                  </div>
                </div>
              </label>

              <label className={`p-4 rounded-xl border cursor-pointer transition-all duration-300 transform active:scale-98 flex flex-col justify-between h-36 ${formData.contentType === 'book' ? 'border-primary bg-primary/5 shadow-md shadow-primary/10' : 'theme-border bg-gray-50/50 dark:bg-gray-800/10 hover:border-primary/50'}`}>
                <div className="flex items-start gap-3 select-none">
                  <input
                    type="radio"
                    name="contentType"
                    value="book"
                    checked={formData.contentType === 'book'}
                    onChange={() => setFormData({ ...formData, contentType: 'book', dueDate: '', content: '' })}
                    className="mt-1 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5 font-bold theme-text text-sm">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      <span>Full Textbook</span>
                    </div>
                    <span className="block text-xs theme-text-muted mt-1 leading-relaxed">Upload a .docx, .epub, or .pdf book for auto-splitting.</span>
                  </div>
                </div>
              </label>
            </fieldset>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="assignment-title" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Title</label>
                  <input 
                    id="assignment-title"
                    required
                    type="text" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    placeholder={formData.contentType === 'study' ? 'e.g. Solar System Notes' : 'e.g. History Essay'}
                  />
                </div>
              </div>
              
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="assignment-subject" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Subject</label>
                  <input 
                    id="assignment-subject"
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    placeholder="e.g. Science"
                  />
                </div>
              </div>
            </div>
            
            <div className={`grid grid-cols-1 ${formData.contentType === 'assignment' ? 'sm:grid-cols-2' : ''} gap-5`}>
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="assignment-class" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Assign to Class</label>
                  <select 
                    id="assignment-class"
                    required
                    value={formData.classId}
                    onChange={e => setFormData({...formData, classId: e.target.value})}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                  >
                    <option value="" disabled>Select a class...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              {formData.contentType === 'assignment' && (
                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label htmlFor="assignment-due" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Due Date</label>
                    <input 
                      id="assignment-due"
                      required
                      type="datetime-local" 
                      value={formData.dueDate}
                      onChange={e => setFormData({...formData, dueDate: e.target.value})}
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                    />
                  </div>
                </div>
              )}
            </div>

            {formData.contentType !== 'book' && (
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="assignment-content" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    {formData.contentType === 'study' ? 'Study Content' : 'Assignment Instructions'} (Markdown supported)
                  </label>
                  <textarea 
                    id="assignment-content"
                    required={formData.contentType === 'assignment' && files.length === 0}
                    rows={6}
                    value={formData.content}
                    onChange={e => setFormData({...formData, content: e.target.value})}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm resize-none"
                    placeholder={formData.contentType === 'study' ? 'Enter study notes, textbook content, or revision material...' : 'Enter assignment instructions here...'}
                  ></textarea>
                </div>
              </div>
            )}

            {['study', 'book', 'assignment'].includes(formData.contentType) && (
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-4 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                    Attach File {formData.contentType === 'book' ? '(Required .docx, .epub, or .pdf)' : '(Optional)'}
                  </label>
                  
                  {/* Premium Drag and Drop Zone */}
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    required={formData.contentType === 'book' && files.length === 0}
                    accept={formData.contentType === 'book' ? '.docx,.epub,.pdf' : '.pdf,.doc,.docx,image/*,video/*'}
                    onChange={handleFileChange}
                    multiple={formData.contentType !== 'book'}
                    className="hidden"
                  />
                  
                  {(formData.contentType !== 'book' || files.length === 0) && (
                    <div 
                      onDragEnter={handleDrag}
                      onDragLeave={handleDrag}
                      onDragOver={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 mb-4 ${dragActive ? 'border-primary bg-primary/5 scale-[0.99]' : 'border-gray-300 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/10'}`}
                    >
                      <UploadCloud className="w-10 h-10 text-primary/70 animate-bounce" />
                      <p className="text-sm font-bold theme-text">
                        Drag & drop file{formData.contentType === 'book' ? '' : 's'} here, or <span className="text-primary hover:underline">browse</span>
                      </p>
                      <p className="text-[10px] theme-text-muted font-semibold">
                        {formData.contentType === 'book' ? 'Supports .pdf, .epub, .docx (Single file only)' : 'Supports .pdf, .docx, images, videos (Multiple files)'}
                      </p>
                    </div>
                  )}

                  {files.length > 0 && (
                    <div className="space-y-2 mt-3">
                      {files.map((fileItem, idx) => (
                        <div key={`${fileItem.name}-${idx}`} className="flex items-center justify-between p-3.5 bg-primary/5 border border-primary/20 rounded-xl animate-scale-up">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold shrink-0">
                              <Paperclip className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-bold theme-text truncate">{fileItem.name}</p>
                              <p className="text-xs theme-text-muted font-semibold">{formatFileSize(fileItem.size)}</p>
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer shrink-0"
                            aria-label="Remove file"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-premium shadow-lg shadow-primary/25 text-white font-bold rounded-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2 cursor-pointer animate-glow"
            >
              {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" /> Uploading & Parsing...</> : formData.contentType === 'study' ? 'Add Study Material' : formData.contentType === 'book' ? 'Publish Full Book' : 'Publish Assignment'}
            </button>
          </form>
        </div>

        {/* Manage Content Section */}
        <div className="theme-surface border theme-border p-8 rounded-2xl shadow-sm bg-white dark:bg-gray-900/50">
          <h2 className="text-xl font-bold theme-text tracking-tight mb-6">Manage Existing Content</h2>
          <div className="grid grid-cols-1 gap-4">
            {[...books.map(b => ({...b, type: 'book'})), ...studyMaterials.map(s => ({...s, type: 'study'}))].map(item => (
              <div key={item.id} className="p-4 border theme-border rounded-xl flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/10 hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold shadow-inner ${item.type === 'book' ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400' : 'bg-violet-500/10 text-violet-600 dark:text-violet-400'}`}>
                    {item.type === 'book' ? <BookOpen className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="font-bold theme-text text-sm">{item.title}</h3>
                    <p className="text-xs theme-text-muted mt-0.5 font-semibold">
                      {item.subject} • <span className={`capitalize font-bold ${item.type === 'book' ? 'text-sky-600' : 'text-primary'}`}>{item.type === 'book' ? 'Full Book' : 'Study Material'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => { setEditingItem(item); setEditForm({ title: item.title, subject: item.subject, content: item.body || item.content || '' }); }} 
                    className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-all cursor-pointer"
                    aria-label="Edit content"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button 
                    type="button" 
                    onClick={async () => {
                      if (!confirm('Are you sure you want to delete this content?')) return;
                      try {
                        if (item.type === 'book') await dashboardService.deleteBook(item.id);
                        else await dashboardService.deleteStudyMaterial(item.id);
                        loadContent();
                      } catch (e) { alert('Failed to delete'); }
                    }} 
                    className="p-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/40 transition-all cursor-pointer"
                    aria-label="Delete content"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            {books.length === 0 && studyMaterials.length === 0 && (
              <p className="text-sm theme-text-muted text-center py-8 border border-dashed theme-border rounded-xl font-medium">No content uploaded yet.</p>
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="glass-panel border border-white/20 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-up">
              <h2 className="text-xl font-bold theme-text mb-4 tracking-tight flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-primary" />
                <span>Edit {editingItem.type === 'book' ? 'Book' : 'Study Material'}</span>
              </h2>
              <div className="space-y-4">
                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Title</label>
                    <input value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm" />
                  </div>
                </div>
                
                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Subject</label>
                    <input value={editForm.subject} onChange={e => setEditForm({...editForm, subject: e.target.value})} className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm" />
                  </div>
                </div>

                {editingItem.type === 'study' && (
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Content (Markdown)</label>
                      <textarea rows={6} value={editForm.content} onChange={e => setEditForm({...editForm, content: e.target.value})} className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm resize-none" />
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-3 pt-4 border-t theme-border mt-6">
                  <button type="button" onClick={() => setEditingItem(null)} className="px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors theme-text cursor-pointer">Cancel</button>
                  <button type="button" onClick={async () => {
                    try {
                      if (editingItem.type === 'book') {
                        await dashboardService.updateBook(editingItem.id, { title: editForm.title, subject: editForm.subject });
                      } else {
                        await dashboardService.updateStudyMaterial(editingItem.id, { title: editForm.title, subject: editForm.subject, body: editForm.content });
                      }
                      setEditingItem(null);
                      loadContent();
                    } catch (e) { alert('Failed to update'); }
                  }} className="px-5 py-2.5 bg-gradient-premium text-white rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer">Save Changes</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
};

const getExamDateParts = (dateStr: string) => {
  try {
    const cleanStr = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T');
    const d = new Date(cleanStr);
    if (isNaN(d.getTime())) {
      return { month: 'EXAM', day: 'D', year: '', time: dateStr };
    }
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      month: months[d.getMonth()],
      day: d.getDate().toString(),
      year: d.getFullYear().toString(),
      time: timeStr
    };
  } catch {
    return { month: 'EXAM', day: 'D', year: '', time: dateStr };
  }
};

interface QuestionInput {
  prompt: string;
  type: 'mcq' | 'short' | 'descriptive';
  options: string[];
  correctAnswer: string;
}

const ExamsHub = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    priority: 'Normal' as 'High Priority' | 'Normal',
    date: '',
    description: '',
    classId: ''
  });
  const [classes, setClasses] = useState<ClassRoster[]>([]);
  const [exams, setExams] = useState<any[]>([]);
  const [questionsList, setQuestionsList] = useState<QuestionInput[]>([]);
  const [examFile, setExamFile] = useState<File | null>(null);
  const [numMcqs, setNumMcqs] = useState(2);
  const [numShort, setNumShort] = useState(2);
  const [numDescriptive, setNumDescriptive] = useState(2);
  const examFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dashboardService.getTeacherClasses().then(setClasses).catch(console.error);
    dashboardService.getTeacherExams().then(setExams).catch(console.error);
  }, []);

  const handleAutoFill = async () => {
    if (!formData.classId) {
      alert('Please select a class first to determine the subject.');
      return;
    }
    setIsGenerating(true);
    try {
      let fileUrl = '';
      if (examFile) {
        const uploadRes = await dashboardService.uploadFile(examFile);
        fileUrl = uploadRes.fileUrl;
      }
      const data = await dashboardService.generateQuestions(
        formData.classId, 
        formData.description || 'Standard Exam',
        fileUrl || undefined,
        numMcqs,
        numShort,
        numDescriptive
      );
      if (data && Array.isArray(data.questions)) {
        const mapped = data.questions.map((q: any) => {
          const rawType = q.question_type || q.type;
          const mappedType = rawType === 'short' ? 'short' : (rawType === 'descriptive' ? 'descriptive' : 'mcq');
          return {
            prompt: q.prompt || '',
            type: mappedType,
            options: Array.isArray(q.options) ? q.options : ['', '', '', ''],
            correctAnswer: q.correct_answer || q.correctAnswer || ''
          };
        });
        setQuestionsList(mapped);
        setExamFile(null); // Clear selected file after successful generation
      } else {
        alert('Could not generate questions. AI engine returned an empty result.');
      }
    } catch (err: any) {
      console.error(err);
      alert('Error generating questions: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (questionsList.length === 0) {
      alert('Please add at least one question to the exam.');
      return;
    }
    // Check if MCQ questions have a correct answer selected
    for (let i = 0; i < questionsList.length; i++) {
      const q = questionsList[i];
      if (!q.prompt.trim()) {
        alert(`Question ${i + 1} cannot be empty.`);
        return;
      }
      if (q.type === 'mcq') {
        if (!q.correctAnswer) {
          alert(`Please select a correct answer for MCQ Question ${i + 1}.`);
          return;
        }
        if (q.options.some(opt => !opt.trim())) {
          alert(`All options must be filled for MCQ Question ${i + 1}.`);
          return;
        }
      } else {
        if (!q.correctAnswer.trim()) {
          alert(`Please provide a reference answer for Short Answer Question ${i + 1}.`);
          return;
        }
      }
    }

    setIsSubmitting(true);
    try {
      const newExam = await dashboardService.createExam({
        title: formData.title,
        priority: formData.priority,
        date: formData.date.replace('T', ' '),
        description: formData.description,
        classId: formData.classId || '1',
        generateWithAI: false,
        questions: questionsList.map(q => ({
          prompt: q.prompt,
          question_type: q.type,
          options: q.type === 'mcq' ? q.options : null,
          correct_answer: q.correctAnswer
        }))
      });
      setExams([newExam, ...exams]);
      setIsSuccess(true);
      setFormData({ title: '', priority: 'Normal', date: '', description: '', classId: '' });
      setQuestionsList([]);
      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to create exam', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Exams Hub</h1>
        <p className="theme-text-muted text-sm font-medium">Create course examinations, design custom question lists, and deploy AI descriptive evaluation engines.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 theme-surface border theme-border p-8 rounded-2xl shadow-sm h-fit bg-white dark:bg-gray-900/50">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-gradient-premium rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20">
              <GraduationCap className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-bold theme-text tracking-tight">Schedule & Build Exam</h2>
              <p className="text-xs theme-text-muted mt-0.5 font-medium">Design questions and assign a date, time, and class for the examination.</p>
            </div>
          </div>
          
          {isSuccess && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-900/40 rounded-xl flex items-center gap-3 animate-scale-up">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span className="font-bold text-sm">Exam successfully scheduled and registered.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="focus-glow rounded-xl border theme-border transition-all">
              <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                <label htmlFor="exam-title" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Exam Title</label>
                <input 
                  id="exam-title"
                  required
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                  placeholder="e.g. Midterm Mathematics"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="exam-class" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Assign to Class</label>
                  <select 
                    id="exam-class"
                    required
                    value={formData.classId}
                    onChange={e => setFormData({...formData, classId: e.target.value})}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                  >
                    <option value="" disabled>Select a class...</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="exam-priority" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Priority</label>
                  <select 
                    id="exam-priority"
                    required
                    value={formData.priority}
                    onChange={e => setFormData({...formData, priority: e.target.value as any})}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                  >
                    <option value="Normal">Normal</option>
                    <option value="High Priority">High Priority</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="focus-glow rounded-xl border theme-border transition-all">
              <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                <label htmlFor="exam-date" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Exam Date & Time</label>
                <input 
                  id="exam-date"
                  required
                  type="datetime-local" 
                  value={formData.date}
                  onChange={e => setFormData({...formData, date: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                />
              </div>
            </div>

            <div className="focus-glow rounded-xl border theme-border transition-all">
              <div className="px-4 py-2.5 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                <label htmlFor="exam-description" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Description</label>
                <textarea 
                  id="exam-description"
                  required
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm resize-none"
                  placeholder="Details about the exam format and covered topics..."
                ></textarea>
              </div>
            </div>

            {/* AI Generator Settings Panel */}
            <div className="p-5 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/20 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold theme-text tracking-tight flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                  <span>AI Question Generator Settings</span>
                </h4>
                <span className="text-[10px] font-semibold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Power-up
                </span>
              </div>
              <p className="text-xs theme-text-muted mt-0.5">
                Customize AI behavior. Upload course materials to base questions on specific texts, and choose your desired question counts.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="focus-glow rounded-xl border theme-border transition-all bg-white/50 dark:bg-gray-950/20 px-3 py-2">
                  <label htmlFor="num-mcqs" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Number of MCQs</label>
                  <select
                    id="num-mcqs"
                    value={numMcqs}
                    onChange={e => setNumMcqs(parseInt(e.target.value, 10))}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} MCQ{n !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="focus-glow rounded-xl border theme-border transition-all bg-white/50 dark:bg-gray-950/20 px-3 py-2">
                  <label htmlFor="num-short" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Number of Short Questions</label>
                  <select
                    id="num-short"
                    value={numShort}
                    onChange={e => setNumShort(parseInt(e.target.value, 10))}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Short Question{n !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>

                <div className="focus-glow rounded-xl border theme-border transition-all bg-white/50 dark:bg-gray-950/20 px-3 py-2">
                  <label htmlFor="num-descriptive" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">Number of Descriptive/Long</label>
                  <select
                    id="num-descriptive"
                    value={numDescriptive}
                    onChange={e => setNumDescriptive(parseInt(e.target.value, 10))}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                  >
                    {[0, 1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} Descriptive Question{n !== 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reference Material File Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-primary">
                  Reference Material for AI (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    ref={examFileInputRef}
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        setExamFile(e.target.files[0]);
                      }
                    }}
                    accept=".pdf,.docx,.txt,.epub"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => examFileInputRef.current?.click()}
                    className="px-4 py-2 bg-white/80 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 theme-text border theme-border rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer"
                  >
                    <UploadCloud className="w-4 h-4 text-primary" />
                    <span>Choose Reference File...</span>
                  </button>
                  <span className="text-[10px] theme-text-muted">
                    Supports PDF, DOCX, TXT, or EPUB
                  </span>
                </div>

                {examFile && (
                  <div className="flex items-center justify-between p-2.5 bg-primary/5 border border-primary/10 rounded-xl animate-scale-up">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <Paperclip className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-xs font-semibold theme-text truncate">{examFile.name}</span>
                      <span className="text-[10px] theme-text-muted">({(examFile.size / 1024).toFixed(1)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setExamFile(null);
                        if (examFileInputRef.current) examFileInputRef.current.value = '';
                      }}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Google Forms-like Questions Builder */}
            <div className="pt-4 border-t theme-border space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold theme-text tracking-tight flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" /> Questions Editor
                </h3>
                <button
                  type="button"
                  disabled={isGenerating}
                  onClick={handleAutoFill}
                  className="px-3.5 py-1.5 bg-primary/10 text-primary hover:bg-primary/20 disabled:opacity-75 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-primary/20"
                >
                  {isGenerating ? (
                    <><Loader className="w-3.5 h-3.5 animate-spin" /> Generating...</>
                  ) : (
                    <><Sparkles className="w-3.5 h-3.5" /> Auto-fill with AI</>
                  )}
                </button>
              </div>

              {questionsList.length === 0 ? (
                <div className="p-8 border border-dashed theme-border rounded-xl text-center">
                  <HelpCircle className="w-8 h-8 text-primary/40 mx-auto mb-2" />
                  <p className="text-sm theme-text-muted font-medium">No questions defined. Use AI to auto-fill or add questions manually below.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {questionsList.map((q, idx) => (
                    <div key={idx} className="p-5 border theme-border rounded-xl bg-gray-50/30 dark:bg-gray-950/10 space-y-4 animate-scale-up relative">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary">Question {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...questionsList];
                            updated.splice(idx, 1);
                            setQuestionsList(updated);
                          }}
                          className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                          title="Remove Question"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2 focus-glow rounded-xl border theme-border transition-all bg-white dark:bg-gray-950/20 px-3 py-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Question Text / Prompt</label>
                          <input
                            type="text"
                            required
                            value={q.prompt}
                            onChange={(e) => {
                              const updated = [...questionsList];
                              updated[idx].prompt = e.target.value;
                              setQuestionsList(updated);
                            }}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                            placeholder="e.g. What is the value of Pi?"
                          />
                        </div>

                        <div className="focus-glow rounded-xl border theme-border transition-all bg-white dark:bg-gray-950/20 px-3 py-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Question Type</label>
                          <select
                            value={q.type}
                            onChange={(e) => {
                              const updated = [...questionsList];
                              const newType = e.target.value as 'mcq' | 'short' | 'descriptive';
                              updated[idx].type = newType;
                              if (newType === 'mcq') {
                                updated[idx].options = ['', '', '', ''];
                                updated[idx].correctAnswer = '';
                              } else {
                                updated[idx].options = [];
                                updated[idx].correctAnswer = '';
                              }
                              setQuestionsList(updated);
                            }}
                            className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm cursor-pointer"
                          >
                            <option value="mcq">Multiple Choice</option>
                            <option value="short">Short Answer</option>
                            <option value="descriptive">Descriptive / Long Answer</option>
                          </select>
                        </div>
                      </div>

                      {q.type === 'mcq' && (
                        <div className="space-y-3">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary">Options (Select correct option's radio button)</label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {[0, 1, 2, 3].map((optIdx) => (
                              <div key={optIdx} className="flex items-center gap-2 px-3 py-2 border theme-border rounded-xl bg-white dark:bg-gray-950/20 focus-within:ring-2 focus-within:ring-primary/20">
                                <input
                                  type="radio"
                                  name={`correct-${idx}`}
                                  checked={q.correctAnswer === q.options[optIdx] && q.options[optIdx] !== ''}
                                  onChange={() => {
                                    const updated = [...questionsList];
                                    updated[idx].correctAnswer = q.options[optIdx];
                                    setQuestionsList(updated);
                                  }}
                                  disabled={!q.options[optIdx]}
                                  className="w-4 h-4 text-primary focus:ring-primary border-gray-300 dark:border-gray-700 cursor-pointer"
                                />
                                <input
                                  type="text"
                                  required
                                  value={q.options[optIdx] || ''}
                                  onChange={(e) => {
                                    const updated = [...questionsList];
                                    const oldVal = updated[idx].options[optIdx];
                                    const newVal = e.target.value;
                                    updated[idx].options[optIdx] = newVal;
                                    if (updated[idx].correctAnswer === oldVal) {
                                      updated[idx].correctAnswer = newVal;
                                    }
                                    setQuestionsList(updated);
                                  }}
                                  placeholder={`Option ${String.fromCharCode(65 + optIdx)}`}
                                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {(q.type === 'short' || q.type === 'descriptive') && (
                        <div className="focus-glow rounded-xl border theme-border transition-all bg-white dark:bg-gray-950/20 px-3 py-2">
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Reference / Expected Answer (For AI Evaluation)</label>
                          <textarea
                            required
                            rows={2}
                            value={q.correctAnswer}
                            onChange={(e) => {
                              const updated = [...questionsList];
                              updated[idx].correctAnswer = e.target.value;
                              setQuestionsList(updated);
                            }}
                            placeholder="Write the expected correct points or a reference answer. The AI will compare student submissions to this reference answer."
                            className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm resize-none"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setQuestionsList([...questionsList, { prompt: '', type: 'mcq', options: ['', '', '', ''], correctAnswer: '' }]);
                }}
                className="w-full py-2.5 border border-dashed theme-border text-primary hover:bg-primary/5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Question Manually
              </button>
            </div>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full py-3.5 bg-gradient-premium shadow-lg shadow-primary/25 text-white font-bold rounded-xl hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-70 disabled:scale-100 flex justify-center items-center gap-2 cursor-pointer animate-glow"
            >
              {isSubmitting ? <><Loader className="w-5 h-5 animate-spin" /> Scheduling...</> : 'Schedule Exam'}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2 theme-surface border theme-border p-6 rounded-2xl shadow-sm h-fit bg-white dark:bg-gray-900/50">
          <h2 className="text-lg font-bold theme-text tracking-tight mb-6 flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" /> Scheduled Exams</h2>
          {exams.length === 0 ? (
            <p className="text-sm theme-text-muted text-center py-6 border border-dashed theme-border rounded-xl">No exams scheduled yet.</p>
          ) : (
            <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
              {exams.map(exam => {
                const dateParts = getExamDateParts(exam.date);
                const isHighPriority = exam.priority === 'High Priority';
                return (
                  <div key={exam.id} className={`p-4 border theme-border rounded-xl hover:border-primary/25 bg-gray-50/50 dark:bg-gray-800/10 transition-colors flex gap-4 ${isHighPriority ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-primary'}`}>
                    {/* Calendar visual badge */}
                    <div className="w-12 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border theme-border shadow-sm shrink-0">
                      <span className={`text-[10px] font-extrabold ${isHighPriority ? 'text-red-500' : 'text-primary'}`}>{dateParts.month}</span>
                      <span className="text-lg font-extrabold theme-text leading-none mt-0.5">{dateParts.day}</span>
                    </div>
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <h3 className="font-bold theme-text text-sm leading-tight truncate">{exam.title}</h3>
                        {isHighPriority && (
                          <span className="text-[9px] bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-900/30 font-bold whitespace-nowrap">High</span>
                        )}
                      </div>
                      <p className="text-xs theme-text-muted leading-relaxed line-clamp-2 mb-2">{exam.description}</p>
                      <p className="text-[10px] font-bold text-primary flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                        {dateParts.time} {dateParts.year && `• ${dateParts.year}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AssignmentsReview = () => {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getTeacherAssignments().then(data => {
      setAssignments(data);
      setLoading(false);
    });
  }, []);

  const handleSelectAssignment = async (id: string) => {
    setSelectedAssignmentId(id);
    const data = await dashboardService.getAssignmentSubmissions(id);
    setSubmissions(data);
  };

  const handleGrade = async (studentId: string, grade: string, feedback: string) => {
    if (!selectedAssignmentId) return;
    await dashboardService.gradeSubmission(selectedAssignmentId, studentId, grade, feedback);
    // Refresh submissions
    handleSelectAssignment(selectedAssignmentId);
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col gap-1.5 border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Assignments Review</h1>
        <p className="theme-text-muted text-sm font-medium">Review homework submissions, grade work, and leave constructive student feedback.</p>
      </div>

      {loading ? (
        <div className="p-12 text-center text-primary animate-pulse flex flex-col items-center"><Loader className="animate-spin mb-4" /> Loading assignments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 pr-4 space-y-4 border-r theme-border">
            <h2 className="text-lg font-bold theme-text tracking-tight mb-2">Assignment Catalog</h2>
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-2">
              {assignments.map(a => {
                const isSelected = selectedAssignmentId === a.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => handleSelectAssignment(a.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all transform active:scale-98 cursor-pointer ${
                      isSelected 
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm border-l-4 border-l-primary' 
                        : 'theme-border hover:bg-gray-50/80 dark:hover:bg-gray-800/20 theme-text hover:-translate-y-0.5'
                    }`}
                  >
                    <div className="font-bold text-sm truncate">{a.title}</div>
                    <div className={`text-xs mt-1 font-semibold ${isSelected ? 'text-primary/80' : 'theme-text-muted'}`}>{a.subject}</div>
                  </button>
                );
              })}
              {assignments.length === 0 && (
                <p className="text-xs theme-text-muted text-center py-8 border border-dashed theme-border rounded-xl">No assignments posted yet.</p>
              )}
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-4">
            {!selectedAssignmentId ? (
              <div className="text-center p-12 theme-text-muted border border-dashed theme-border rounded-2xl bg-gray-50/50 dark:bg-gray-800/10 flex flex-col justify-center h-56">
                <FileText className="w-10 h-10 text-primary/40 mx-auto mb-3 animate-float" />
                <p className="font-bold text-sm theme-text">Select an assignment to grade</p>
                <p className="text-xs theme-text-muted mt-1">Select an assignment from the catalog on the left to start evaluating student submissions.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-lg font-bold theme-text tracking-tight mb-2">Student Submissions</h2>
                {submissions.length === 0 ? (
                  <p className="text-xs theme-text-muted text-center py-12 border border-dashed theme-border rounded-xl font-medium">No student submissions received yet.</p>
                ) : (
                  <div className="space-y-4 max-h-[580px] overflow-y-auto pr-2">
                    {submissions.map(sub => {
                      const avatarGradient = getAvatarGradient(sub.first_name, sub.last_name);
                      return (
                        <div key={sub.student_id} className="p-5 border theme-border rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20">
                          <div className="flex flex-wrap gap-4 justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center font-bold text-sm uppercase shadow-inner`}>
                                {sub.first_name?.[0]}{sub.last_name?.[0]}
                              </div>
                              <div>
                                <div className="font-bold theme-text text-base leading-tight">{sub.first_name} {sub.last_name}</div>
                                <div className="flex items-center gap-1.5 mt-1">
                                  <span className={`inline-block w-2 h-2 rounded-full ${sub.status === 'Graded' ? 'bg-green-500' : 'bg-orange-400 animate-pulse'}`}></span>
                                  <span className={`text-xs font-bold ${sub.status === 'Graded' ? 'text-green-600 dark:text-green-400' : 'text-orange-500'}`}>{sub.status}</span>
                                </div>
                              </div>
                            </div>
                            {sub.file_url && (
                              <a 
                                href={`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}${sub.file_url}`} 
                                target="_blank" 
                                rel="noreferrer" 
                                className="flex items-center gap-1.5 px-4 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-xl transition-all text-xs font-bold cursor-pointer hover:shadow-sm"
                              >
                                <Paperclip className="w-3.5 h-3.5" />
                                <span>Download Submission</span>
                              </a>
                            )}
                          </div>

                          {sub.notes && (
                            <div className="mb-4 bg-gray-50 dark:bg-gray-800/40 p-3.5 rounded-xl border theme-border">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-primary mb-1">Student Notes</p>
                              <p className="text-sm theme-text leading-relaxed font-medium">{sub.notes}</p>
                            </div>
                          )}

                          {sub.status !== 'Graded' && (
                            <div className="mt-4 pt-4 border-t theme-border flex flex-wrap gap-3 items-end">
                              <div className="focus-glow rounded-xl border theme-border transition-all flex-1 min-w-[120px]">
                                <div className="px-3 py-1.5 bg-gray-50/50 dark:bg-gray-950/20 rounded-xl">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Grade</label>
                                  <input type="text" placeholder="e.g. A+" className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm font-bold" id={`grade-${sub.student_id}`} />
                                </div>
                              </div>
                              
                              <div className="focus-glow rounded-xl border theme-border transition-all flex-[3] min-w-[200px]">
                                <div className="px-3 py-1.5 bg-gray-50/50 dark:bg-gray-950/20 rounded-xl">
                                  <label className="block text-[10px] font-bold uppercase tracking-wider text-primary mb-0.5">Feedback</label>
                                  <input type="text" placeholder="Great explanation of the concepts..." className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm" id={`feedback-${sub.student_id}`} />
                                </div>
                              </div>
                              
                              <button 
                                onClick={() => {
                                  const grade = (document.getElementById(`grade-${sub.student_id}`) as HTMLInputElement)?.value;
                                  const feedback = (document.getElementById(`feedback-${sub.student_id}`) as HTMLInputElement)?.value;
                                  handleGrade(sub.student_id, grade, feedback);
                                }} 
                                className="bg-gradient-premium text-white px-5 py-2.5 rounded-xl font-bold text-xs hover:shadow-lg hover:shadow-primary/20 transition-all cursor-pointer h-[46px] flex items-center justify-center gap-1.5"
                              >
                                <CheckCircle className="w-4 h-4" />
                                <span>Save Grade</span>
                              </button>
                            </div>
                          )}

                          {sub.status === 'Graded' && (
                            <div className="mt-3 pt-3 border-t theme-border text-sm space-y-1.5">
                              <p className="theme-text flex items-center gap-1.5">
                                <span className="font-bold text-xs text-primary uppercase tracking-wider">Grade:</span> 
                                <span className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-300 font-extrabold text-xs px-2.5 py-0.5 rounded-full">{sub.grade}</span>
                              </p>
                              <p className="theme-text">
                                <span className="font-bold text-xs text-primary uppercase tracking-wider mr-1.5">Feedback:</span> 
                                <span className="theme-text-muted font-medium">{sub.feedback || 'None'}</span>
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const TeacherDashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="classes" element={<Classes />} />
      <Route path="classes/:classId" element={<ClassRosterView />} />
      <Route path="content" element={<ContentHub />} />
      <Route path="assignments" element={<AssignmentsReview />} />
      <Route path="exams" element={<ExamsHub />} />
    </Routes>
  );
};
