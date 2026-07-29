import React from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowRight, 
  ArrowLeft, 
  Mic, 
  Square, 
  Trash2, 
  Play, 
  FileUp, 
  Edit3, 
  RefreshCw, 
  Mail,
  Monitor, 
  User, 
  MessageSquare, 
  Laptop, 
  CheckCircle, 
  AlertCircle, 
  BookOpen, 
  ChevronRight, 
  BookText, 
  Globe, 
  Lightbulb, 
  Check, 
  X,
  Clock,
  Calendar,
  Volume2,
  Paperclip,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { AdaptiveLesson } from '../../components/AdaptiveLesson';
import { useAccessibility, type AccessibilityProfile } from '../../contexts/AccessibilityContext';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../../services/dashboard.service';
import type { Assignment, Exam } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

const Overview = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [progress, setProgress] = React.useState<any[]>([]);
  const [notifications, setNotifications] = React.useState<any[]>([]);

  const fetchNotifications = React.useCallback(() => {
    if (user?.id) {
      dashboardService.getNotifications(user.id)
        .then(setNotifications)
        .catch(err => console.error('Failed to load notifications', err));
    }
  }, [user]);

  React.useEffect(() => {
    dashboardService.getStudentAssignments().then(setAssignments);
    dashboardService.getStudentExams().then(setExams);
    dashboardService.getLessons().then(setLessons).catch(err => console.error('Failed to load lessons', err));
    fetchNotifications();
    
    if (user?.id) {
      dashboardService.getStudentProgress(user.id)
        .then(setProgress)
        .catch(err => console.error('Failed to load student progress', err));
    }
  }, [user, fetchNotifications]);

  const featuredLesson = lessons.length > 0 ? lessons[0] : null;

  // Compute total stats
  const totalTimeSpentSeconds = progress.reduce((sum, item) => sum + (item.timeSpent || 0), 0);
  const totalDownloads = progress.reduce((sum, item) => sum + (item.downloads || 0), 0);
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours} hr ${minutes} ${t('minutes')}`;
    }
    return `${minutes || 0} ${t('minutes')}`;
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">{t('welcome')}</h1>
        <p className="theme-text-muted text-sm font-medium">Access your personal learning roadmap, submit homework modules, and take adaptive tests.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-3.5 rounded-xl text-white bg-gradient-to-br from-violet-500 to-purple-600 shadow-md shadow-purple-500/10">
            <Clock className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[10px] font-extrabold theme-text-muted tracking-wider uppercase">{t('time_spent')}</h2>
            <p className="text-xl font-black theme-text tracking-tight mt-0.5">{formatTime(totalTimeSpentSeconds)}</p>
          </div>
        </div>

        <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-3.5 rounded-xl text-white bg-gradient-to-br from-emerald-500 to-green-600 shadow-md shadow-emerald-500/10">
            <FileUp className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[10px] font-extrabold theme-text-muted tracking-wider uppercase">{t('downloads')}</h2>
            <p className="text-xl font-black theme-text tracking-tight mt-0.5">{totalDownloads} {t('files')}</p>
          </div>
        </div>

        <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-3.5 rounded-xl text-white bg-gradient-to-br from-amber-500 to-orange-600 shadow-md shadow-amber-500/10">
            <Edit3 className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[10px] font-extrabold theme-text-muted tracking-wider uppercase">{t('pending_assignments')}</h2>
            <p className="text-xl font-black theme-text tracking-tight mt-0.5">{assignments.length}</p>
          </div>
        </div>

        <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="p-3.5 rounded-xl text-white bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md shadow-blue-500/10">
            <Calendar className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-[10px] font-extrabold theme-text-muted tracking-wider uppercase">{t('upcoming_exams')}</h2>
            <p className="text-xl font-black theme-text tracking-tight mt-0.5">{exams.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
        {/* Continue Learning Header */}
        <div className="lg:col-span-2">
          {featuredLesson && (
            <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex flex-col justify-between h-full min-h-[240px] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-36 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
              <div>
                <h2 className="text-lg font-bold theme-text tracking-tight mb-4 flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-primary" />
                  Continue Learning
                </h2>
                <div className="bg-gradient-glow border border-primary/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-6 shadow-inner relative z-10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 border border-primary/10 px-2.5 py-1 rounded-full mb-2 inline-block">{featuredLesson.subject}</span>
                    <h3 className="text-lg font-bold theme-text leading-snug mt-1">{featuredLesson.title}</h3>
                    <p className="theme-text-muted text-xs mt-2 leading-relaxed">Toggle your accessibility profile in settings or in the top navigation panel to experience our Adaptive Engine modifying layouts, text structures, and media assets in real time.</p>
                  </div>
                  <Link 
                    to={`/dashboard/lessons/${featuredLesson.slug || featuredLesson.id}`} 
                    className="flex items-center gap-2 bg-gradient-premium text-white px-6 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all hover:-translate-y-0.5 whitespace-nowrap active:scale-95 text-xs shrink-0 cursor-pointer"
                  >
                    View Lesson 
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Simulated Alerts */}
        <div className="lg:col-span-1">
          <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex flex-col h-full min-h-[240px]">
            <div className="flex justify-between items-center mb-4 border-b theme-border pb-3">
              <h2 className="text-md font-bold theme-text tracking-tight flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                Simulated Alerts Logs
              </h2>
              <button 
                onClick={fetchNotifications}
                className="p-2 bg-gray-50 dark:bg-gray-800 border theme-border rounded-xl text-gray-500 hover:text-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                title="Refresh simulated alerts"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[220px] pr-1 flex-1">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-xs theme-text-muted border border-dashed theme-border rounded-xl flex flex-col justify-center items-center h-full">
                  No simulated alerts yet. Submitting homework modules or taking adaptive quizzes will generate logs.
                </div>
              ) : (
                notifications.map((n) => {
                  const dateStr = new Date(n.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  if (n.channel === 'whatsapp') {
                    return (
                      <div key={n.id} className="flex flex-col items-start space-y-1">
                        <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1 ml-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                          WhatsApp Alert (Twilio Sim)
                        </span>
                        <div className="bg-[#e7f9ee] dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-2xl rounded-tl-none p-3.5 w-full relative text-xs text-green-900 dark:text-green-200 shadow-sm leading-relaxed">
                          <p className="font-extrabold text-[10px] border-b border-green-200/50 dark:border-green-900/30 pb-1 mb-1.5 text-green-800 dark:text-green-400">Parent Notify</p>
                          <p className="font-medium text-xs">{n.body}</p>
                          <div className="flex justify-end items-center gap-1 mt-1 text-[9px] text-green-700/60 dark:text-green-400/60 font-bold">
                            <span>{dateStr}</span>
                            <span className="text-blue-500">✓✓</span>
                          </div>
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div key={n.id} className="flex flex-col items-start space-y-1">
                        <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1 ml-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                          Email Alert (SMTP Sim)
                        </span>
                        <div className="bg-white dark:bg-gray-800 border theme-border rounded-2xl rounded-tl-none p-3.5 w-full text-xs theme-text shadow-sm leading-relaxed">
                          <div className="border-b theme-border pb-1.5 mb-1.5 flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <Mail className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              <span className="font-extrabold text-[10px] theme-text truncate">{n.title}</span>
                            </div>
                            <span className="text-[9px] theme-text-muted shrink-0">{dateStr}</span>
                          </div>
                          <p className="text-xs theme-text-muted font-medium leading-relaxed">{n.body}</p>
                        </div>
                      </div>
                    );
                  }
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LibraryList = () => {
  const [books, setBooks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    dashboardService.getBooks().then(data => {
      setBooks(data);
    }).catch(err => {
      console.error('Failed to fetch books', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-primary" /> 
          Course Library
        </h1>
        <p className="theme-text-muted text-sm font-medium mt-0.5">Browse textbooks, reading packets, and curriculum novels uploaded by school staff.</p>
      </div>
      
      {loading ? (
        <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Loading library catalogs...</div>
      ) : books.length === 0 ? (
        <div className="p-12 text-center theme-text-muted border border-dashed theme-border rounded-xl">
          No books available in the student library at the moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book: any) => (
            <div 
              key={book.id} 
              onClick={() => navigate(`/dashboard/library/${book.id}`)} 
              className="theme-surface p-5 rounded-2xl cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 flex flex-col border theme-border hover:border-primary/30 group bg-white dark:bg-gray-900/50"
            >
              {/* Styled book cover */}
              <div className="w-full aspect-[3/4] bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-4 flex flex-col items-center justify-center text-gray-400 group-hover:bg-primary/5 transition-all border theme-border relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <BookText className="w-14 h-14 text-gray-300 dark:text-gray-700 group-hover:text-primary group-hover:scale-105 transition-all duration-300" />
                <span className="absolute bottom-3 text-[10px] font-black uppercase text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-full">Read Book</span>
              </div>
              <h2 className="font-bold theme-text text-base leading-tight group-hover:text-primary transition-colors truncate">{book.title}</h2>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-505/80 mt-1.5 uppercase tracking-wide">{book.subject}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BookChaptersView = () => {
  const { id } = useParams();
  const [chapters, setChapters] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (id) {
      dashboardService.getBookChapters(id).then(data => {
        setChapters(data);
      }).catch(console.error).finally(() => setLoading(false));
    }
  }, [id]);

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      <button 
        onClick={() => navigate('/dashboard/library')} 
        className="flex items-center gap-2 text-xs font-bold theme-text-muted hover:text-primary transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Library
      </button>
      <h1 className="text-2xl font-extrabold theme-text tracking-tight flex items-center gap-2">
        <BookOpen className="w-6 h-6 text-primary" />
        Table of Contents
      </h1>
      
      {loading ? (
        <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Loading chapters index...</div>
      ) : chapters.length === 0 ? (
        <div className="p-12 text-center theme-text-muted border border-dashed theme-border rounded-xl">
          No chapters cataloged under this textbook entry.
        </div>
      ) : (
        <div className="space-y-3.5">
          {chapters.map((chapter: any, idx: number) => (
            <div 
              key={chapter.id} 
              onClick={() => navigate(`/dashboard/lessons/${chapter.id}`)} 
              className="p-4.5 theme-surface border theme-border rounded-2xl cursor-pointer hover:border-primary/20 bg-white dark:bg-gray-900/50 hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <span className="w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center text-sm shadow-inner group-hover:scale-105 transition-transform shrink-0">
                  {idx + 1}
                </span>
                <span className="font-bold text-sm theme-text group-hover:text-primary transition-colors">{chapter.title}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const renderInstructions = (text: string) => {
  if (!text) return null;
  const linkRegex = /\[(.*?)\]\((.*?)\)/g;
  const parts = [];
  let lastIndex = 0;
  let match;
  
  while ((match = linkRegex.exec(text)) !== null) {
    const matchIndex = match.index;
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }
    const linkText = match[1];
    const linkUrl = match[2];
    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
    const fullUrl = linkUrl.startsWith('http') || linkUrl.startsWith('data:') ? linkUrl : `${API_URL}${linkUrl}`;
    parts.push(
      <a 
        key={matchIndex} 
        href={fullUrl} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 border border-primary/20 hover:bg-primary/20 text-primary font-bold rounded-lg text-xs transition-all mx-1 my-0.5"
      >
        <Paperclip className="w-3.5 h-3.5" />
        {linkText}
      </a>
    );
    lastIndex = linkRegex.lastIndex;
  }
  
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }
  
  return (
    <div className="whitespace-pre-wrap break-words leading-relaxed text-sm theme-text">
      {parts.length > 0 ? parts.map((part, i) => typeof part === 'string' ? <React.Fragment key={i}>{part}</React.Fragment> : part) : text}
    </div>
  );
};

const Assignments = () => {
  const { user } = useAuth();
  const { profile } = useAccessibility();
  const { t, i18n } = useTranslation();
  const [assignments, setAssignments] = React.useState<Assignment[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  // Extension States
  const [extendingId, setExtendingId] = React.useState<string | null>(null);
  const [extensionSuccess, setExtensionSuccess] = React.useState<string | null>(null);

  const handleRequestExtension = async (assignmentId: string) => {
    setExtendingId(assignmentId);
    try {
      const updated = await (dashboardService as any).extendAssignment(assignmentId);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, dueDate: updated.dueDate } : a));
      setExtensionSuccess(assignmentId);
      setTimeout(() => setExtensionSuccess(null), 5000);
    } catch (e) {
      console.error("Failed to request extension", e);
      alert("Failed to request extension. Please try again.");
    } finally {
      setExtendingId(null);
    }
  };

  // Submission States
  const [notes, setNotes] = React.useState<Record<string, string>>({});
  const [isDictating, setIsDictating] = React.useState<string | null>(null);
  const [mediaRecorders, setMediaRecorders] = React.useState<Record<string, { recorder: MediaRecorder; chunks: Blob[]; audioUrl: string; blob: Blob | null }>>({});
  const [recordingStatus, setRecordingStatus] = React.useState<Record<string, 'idle' | 'recording' | 'preview'>>({});
  const [selectedFiles, setSelectedFiles] = React.useState<Record<string, File>>({});
  const [activeTabs, setActiveTabs] = React.useState<Record<string, 'write' | 'oral' | 'file'>>({});

  React.useEffect(() => {
    dashboardService.getStudentAssignments().then(data => {
      setAssignments(data);
    }).catch(err => {
      console.error('Failed to fetch assignments', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleFileChange = (assignmentId: string, file: File | null) => {
    if (file) {
      setSelectedFiles(prev => ({ ...prev, [assignmentId]: file }));
    } else {
      setSelectedFiles(prev => {
        const copy = { ...prev };
        delete copy[assignmentId];
        return copy;
      });
    }
  };

  const getLanguageLocale = (langCode: string) => {
    const mapping: Record<string, string> = {
      en: 'en-US', hi: 'hi-IN', mr: 'mr-IN', bn: 'bn-IN', te: 'te-IN',
      ta: 'ta-IN', gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN'
    };
    return mapping[langCode] || 'en-US';
  };

  // --- Speech to Text ---
  const startVoiceTyping = (assignmentId: string) => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice typing is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageLocale(i18n.language);

      recognition.onstart = () => {
        setIsDictating(assignmentId);
      };

      recognition.onerror = (e: any) => {
        console.error("Speech Recognition Error", e);
        setIsDictating(null);
      };

      recognition.onend = () => {
        setIsDictating(null);
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTrans += event.results[i][0].transcript;
          }
        }
        if (finalTrans) {
          setNotes(prev => ({
            ...prev,
            [assignmentId]: (prev[assignmentId] || '') + ' ' + finalTrans
          }));
        }
      };

      (window as any)._activeRecognition = recognition;
      recognition.start();
    } catch (e) {
      console.error("Failed to start Speech Recognition", e);
    }
  };

  const stopVoiceTyping = () => {
    const activeRec = (window as any)._activeRecognition;
    if (activeRec) {
      activeRec.stop();
      (window as any)._activeRecognition = null;
    }
    setIsDictating(null);
  };

  // --- Oral Audio Submission ---
  const startRecordingAudio = async (assignmentId: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMediaRecorders(prev => ({
          ...prev,
          [assignmentId]: { recorder, chunks, audioUrl, blob: audioBlob }
        }));
        setRecordingStatus(prev => ({ ...prev, [assignmentId]: 'preview' }));
      };

      recorder.start();
      setMediaRecorders(prev => ({
        ...prev,
        [assignmentId]: { recorder, chunks, audioUrl: '', blob: null }
      }));
      setRecordingStatus(prev => ({ ...prev, [assignmentId]: 'recording' }));
    } catch (err) {
      alert("Microphone access is required for oral submissions. Please check your browser permissions.");
      console.error("Failed to start recording", err);
    }
  };

  const stopRecordingAudio = (assignmentId: string) => {
    const activeRec = mediaRecorders[assignmentId];
    if (activeRec && activeRec.recorder && activeRec.recorder.state !== 'inactive') {
      activeRec.recorder.stop();
      activeRec.recorder.stream.getTracks().forEach(track => track.stop());
    }
  };

  const deleteRecording = (assignmentId: string) => {
    setMediaRecorders(prev => {
      const copy = { ...prev };
      delete copy[assignmentId];
      return copy;
    });
    setRecordingStatus(prev => ({ ...prev, [assignmentId]: 'idle' }));
  };

  // --- Submission Helpers ---
  const handleSubmitNotes = async (assignmentId: string) => {
    if (!user) return;
    const txt = notes[assignmentId] || '';
    if (!txt.trim()) {
      alert("Please type or speak your answer before submitting.");
      return;
    }
    try {
      await (dashboardService as any).submitAssignmentNotes(assignmentId, txt, user.id);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a));
      setExpandedId(null);
    } catch (e) {
      console.error("Failed to submit text notes", e);
    }
  };

  const handleSubmitAudio = async (assignmentId: string) => {
    if (!user) return;
    const record = mediaRecorders[assignmentId];
    if (!record || !record.blob) {
      alert("No audio recording found.");
      return;
    }
    const audioFile = new File([record.blob], `assignment_${assignmentId}_submission.webm`, { type: 'audio/webm' });
    try {
      await dashboardService.submitAssignmentWithFile(assignmentId, audioFile, user.id);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a));
      setExpandedId(null);
    } catch (e) {
      console.error("Failed to submit audio", e);
    }
  };

  const handleSubmitFile = async (assignmentId: string) => {
    if (!user) return;
    const file = selectedFiles[assignmentId];
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }
    try {
      await dashboardService.submitAssignmentWithFile(assignmentId, file, user.id);
      setAssignments(prev => prev.map(a => a.id === assignmentId ? { ...a, status: 'Submitted' } : a));
      setExpandedId(null);
    } catch (e) {
      console.error("Failed to submit file", e);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">{t('assignments')}</h1>
        <p className="theme-text-muted text-sm font-medium mt-0.5">Submit homework, view educator grading and review notes.</p>
      </div>

      <div className="theme-surface border theme-border rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden">
        <div className="p-4.5 border-b theme-border flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
          <span className="font-bold theme-text text-sm">{t('pending_assignments')} ({assignments.length})</span>
        </div>
        
        {loading ? (
          <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="p-12 text-center theme-text-muted border border-dashed theme-border rounded-xl m-6">
            No assignments available at the moment.
          </div>
        ) : (
          <div className="divide-y theme-border">
            {assignments.map((assignment) => {
              const isExpanded = expandedId === assignment.id;
              const activeTab = activeTabs[assignment.id] || 'write';
              const isSubmitted = assignment.status === 'Completed' || assignment.status === 'Submitted';

              return (
                <div key={assignment.id} className="transition-all hover:bg-gray-50/30 dark:hover:bg-gray-800/5">
                  <div className="p-5 sm:px-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="space-y-1">
                      <h3 className="font-bold theme-text text-base leading-tight">{assignment.title}</h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs theme-text-muted mt-1.5">
                        <span className="bg-primary/10 text-primary border border-primary/20 px-2.5 py-0.5 rounded-full font-bold">{assignment.subject}</span>
                        <span className="font-medium">{t('due')}: {assignment.dueDate}</span>
                        <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-black uppercase ${
                          isSubmitted 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30' 
                            : 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30'
                        }`}>
                          {isSubmitted ? t('completed') : t('uncompleted')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {!isSubmitted && profile !== 'typical' && (
                        <button
                          onClick={() => handleRequestExtension(assignment.id)}
                          disabled={extendingId === assignment.id}
                          className="px-4 py-2 border border-dashed border-primary/45 hover:border-primary text-primary hover:bg-primary/5 font-extrabold rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          {extendingId === assignment.id ? 'Extending...' : 'Request Accommodation Extension'}
                        </button>
                      )}

                      {isSubmitted ? (
                        <div className="flex items-center gap-2">
                          <button 
                            type="button"
                            onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                            className="px-4 py-2.5 bg-gray-150/80 hover:bg-gray-200/90 dark:bg-gray-850 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-800 rounded-xl text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            <span>{isExpanded ? 'Hide Details' : 'View Details'}</span>
                          </button>
                          <span 
                            className="px-5 py-2.5 border border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold rounded-xl opacity-80 text-xs flex items-center gap-1"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            {t('completed')}
                          </span>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setExpandedId(isExpanded ? null : assignment.id)}
                          className="px-5 py-2.5 bg-gradient-premium text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all text-xs cursor-pointer"
                        >
                          {isExpanded ? 'Hide Workspace' : t('submit')}
                        </button>
                      )}
                    </div>
                  </div>

                  {extensionSuccess === assignment.id && (
                    <div className="mx-6 my-2 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-xl text-xs text-green-800 dark:text-green-200 font-semibold flex items-center gap-2 animate-fade-in shadow-sm">
                      <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                      <span>Extension approved! 3 additional days have been granted under your Accommodation Plan. WhatsApp alert dispatched to parent logs.</span>
                    </div>
                  )}

                  {/* Submitted Details Panel */}
                  {isExpanded && isSubmitted && (
                    <div className="px-6 pb-6 pt-4 border-t theme-border bg-gray-50/10 dark:bg-gray-800/5 animate-fade-in space-y-4">
                      {assignment.instructions && (
                        <div className="p-4 bg-white/60 dark:bg-gray-900/60 rounded-xl border theme-border">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Instructions & Attachments</span>
                          </h4>
                          {renderInstructions(assignment.instructions)}
                        </div>
                      )}
                      
                      <div className="p-4 bg-emerald-50/30 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/20 rounded-xl text-xs text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>You have successfully submitted your response for this assignment.</span>
                      </div>
                      
                      {assignment.grade && (
                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                          <h4 className="text-xs font-black uppercase tracking-wider text-primary mb-1">Evaluation & Grade</h4>
                          <p className="text-sm font-bold theme-text">Grade: <span className="text-primary">{assignment.grade}</span></p>
                          {assignment.feedback && (
                            <p className="text-xs theme-text-muted mt-1 leading-relaxed whitespace-pre-wrap">{assignment.feedback}</p>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Submit Panel */}
                  {isExpanded && !isSubmitted && (
                    <div className="px-6 pb-6 pt-4 border-t theme-border bg-gray-50/30 dark:bg-gray-800/10 animate-fade-in space-y-4">
                      {assignment.instructions && (
                        <div className="p-4 bg-white/60 dark:bg-gray-900/60 rounded-xl border theme-border">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-2 flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Instructions & Attachments</span>
                          </h4>
                          {renderInstructions(assignment.instructions)}
                        </div>
                      )}
                      
                      {/* Sub-tab Controller */}
                      <div className="flex border-b theme-border mb-5 gap-2 bg-gray-100/50 dark:bg-gray-900/40 p-1.5 rounded-xl border">
                        <button
                          onClick={() => setActiveTabs(prev => ({ ...prev, [assignment.id]: 'write' }))}
                          className={`flex items-center gap-2 px-5 py-2.5 font-extrabold text-xs rounded-lg transition-all cursor-pointer ${
                            activeTab === 'write' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'theme-text-muted hover:text-primary hover:bg-white/50 dark:hover:bg-gray-900/50'
                          }`}
                        >
                          <Edit3 className="w-4 h-4" />
                          <span>{t('voice_typing')}</span>
                        </button>
                        <button
                          onClick={() => setActiveTabs(prev => ({ ...prev, [assignment.id]: 'oral' }))}
                          className={`flex items-center gap-2 px-5 py-2.5 font-extrabold text-xs rounded-lg transition-all cursor-pointer ${
                            activeTab === 'oral' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'theme-text-muted hover:text-primary hover:bg-white/50 dark:hover:bg-gray-900/50'
                          }`}
                        >
                          <Mic className="w-4 h-4" />
                          <span>{t('audio_record')}</span>
                        </button>
                        <button
                          onClick={() => setActiveTabs(prev => ({ ...prev, [assignment.id]: 'file' }))}
                          className={`flex items-center gap-2 px-5 py-2.5 font-extrabold text-xs rounded-lg transition-all cursor-pointer ${
                            activeTab === 'file' 
                              ? 'bg-primary text-white shadow-sm' 
                              : 'theme-text-muted hover:text-primary hover:bg-white/50 dark:hover:bg-gray-900/50'
                          }`}
                        >
                          <FileUp className="w-4 h-4" />
                          <span>{t('file_upload')}</span>
                        </button>
                      </div>

                      {/* Notes/Voice Typing */}
                      {activeTab === 'write' && (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] theme-text-muted font-black uppercase tracking-wider">Type or speak your answer:</span>
                            {isDictating === assignment.id ? (
                              <button 
                                onClick={stopVoiceTyping}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 text-white font-bold text-xs rounded-full animate-pulse shadow-sm cursor-pointer"
                              >
                                <Square className="w-3 h-3 fill-white" />
                                <span>{t('voice_stop')}</span>
                              </button>
                            ) : (
                              <button 
                                onClick={() => startVoiceTyping(assignment.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary font-bold text-xs rounded-full hover:bg-primary/20 transition-all border border-primary/20 cursor-pointer"
                              >
                                <Mic className="w-3 h-3" />
                                <span>Start Dictation</span>
                              </button>
                            )}
                          </div>
                          
                          <textarea
                            value={notes[assignment.id] || ''}
                            onChange={(e) => setNotes(prev => ({ ...prev, [assignment.id]: e.target.value }))}
                            rows={5}
                            placeholder="Draft your response here. Click 'Start Dictation' to dictate your answers aloud."
                            className="w-full p-4 border theme-border rounded-xl bg-white dark:bg-gray-900 theme-text focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm leading-relaxed"
                          />

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSubmitNotes(assignment.id)}
                              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs cursor-pointer shadow-sm hover:shadow"
                            >
                              {t('submit_notes')}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Oral Audio Recorder */}
                      {activeTab === 'oral' && (() => {
                        const status = recordingStatus[assignment.id] || 'idle';
                        const recInfo = mediaRecorders[assignment.id];

                        return (
                          <div className="space-y-4 text-center py-6 bg-gray-50 dark:bg-gray-900/20 rounded-2xl p-6 border theme-border">
                            {status === 'idle' && (
                              <div className="space-y-3">
                                <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-inner border border-primary/10">
                                  <Mic className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold theme-text text-sm">Oral Submission</h4>
                                <p className="text-xs theme-text-muted max-w-sm mx-auto">Record your answer orally using your system microphone rather than writing or uploading a document.</p>
                                <button
                                  onClick={() => startRecordingAudio(assignment.id)}
                                  className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark hover:scale-105 transition-all inline-flex items-center gap-1.5 shadow-sm text-xs cursor-pointer"
                                >
                                  <Play className="w-3.5 h-3.5 fill-white" />
                                  <span>Record Answer</span>
                                </button>
                              </div>
                            )}

                            {status === 'recording' && (
                              <div className="space-y-3">
                                <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto animate-pulse border border-red-500/20">
                                  <Square className="w-5 h-5 fill-red-500" />
                                </div>
                                <h4 className="font-bold text-red-500 text-sm">Recording Audio...</h4>
                                <p className="text-xs theme-text-muted">Speak clearly. LAAMS is capturing your response. Click stop when finished.</p>
                                <button
                                  onClick={() => stopRecordingAudio(assignment.id)}
                                  className="px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all inline-flex items-center gap-1.5 shadow-sm text-xs cursor-pointer"
                                >
                                  <Square className="w-3.5 h-3.5 fill-white" />
                                  <span>{t('audio_stop')}</span>
                                </button>
                              </div>
                            )}

                            {status === 'preview' && recInfo && (
                              <div className="space-y-4">
                                <div className="w-14 h-14 rounded-full bg-green-500/10 text-green-600 flex items-center justify-center mx-auto border border-green-500/20">
                                  <Play className="w-5 h-5 fill-green-600" />
                                </div>
                                <h4 className="font-bold theme-text text-sm">Review Recording</h4>
                                
                                <div className="max-w-md mx-auto py-2">
                                  <audio src={recInfo.audioUrl} controls className="w-full mx-auto" />
                                </div>

                                <div className="flex justify-center gap-3">
                                  <button
                                    onClick={() => deleteRecording(assignment.id)}
                                    className="px-4 py-2 border border-red-200 text-red-500 rounded-xl font-bold hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-1.5 transition-all text-xs cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete & Redo</span>
                                  </button>
                                  <button
                                    onClick={() => handleSubmitAudio(assignment.id)}
                                    className="px-5 py-2 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 flex items-center gap-1.5 shadow-sm text-xs cursor-pointer transition-all"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    <span>{t('submit_audio')}</span>
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })()}

                      {/* File Upload */}
                      {activeTab === 'file' && (
                        <div className="space-y-4">
                          <label className="block text-[10px] theme-text-muted font-black uppercase tracking-wider">Select a file (PDF, DOCX, JPG, MP3, MP4) from your device:</label>
                          <div className="p-8 border-2 border-dashed theme-border rounded-2xl bg-white dark:bg-gray-900/30 hover:border-primary/50 transition-all flex flex-col items-center justify-center">
                            <FileUp className="w-8 h-8 text-gray-400 mb-3" />
                            <input 
                              type="file" 
                              onChange={(e) => handleFileChange(assignment.id, e.target.files?.[0] || null)}
                              className="text-xs file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                            />
                            {selectedFiles[assignment.id] && (
                              <p className="text-xs theme-text font-bold mt-3 text-green-600">Selected: {selectedFiles[assignment.id].name}</p>
                            )}
                          </div>

                          <div className="flex justify-end">
                            <button
                              onClick={() => handleSubmitFile(assignment.id)}
                              disabled={!selectedFiles[assignment.id]}
                              className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl shadow hover:bg-primary-dark transition-all text-xs disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                              Submit File
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const questionHelps: Record<string, { hint: string; explanation: string }> = {
  'what is the largest planet in our solar system?': {
    hint: 'Think of the planet named after the king of the Roman gods, which is known for its Great Red Spot.',
    explanation: 'Jupiter is the largest planet in our solar system, with a mass more than two and a half times that of all the other planets in the solar system combined. It is a gas giant primarily composed of hydrogen and helium.'
  },
  'which planet is known as the red planet?': {
    hint: 'This planet gets its reddish color from iron oxide (rust) on its surface, and it is the fourth planet from the Sun.',
    explanation: 'Mars is known as the Red Planet due to the large amount of iron oxide (rust) on its surface, which gives it a reddish appearance. It has a thin atmosphere and features like polar ice caps and valleys.'
  },
  'briefly describe what a star is.': {
    hint: 'Think about a glowing ball of gas, like our Sun, that produces heat and light through nuclear fusion.',
    explanation: 'A star is a luminous sphere of plasma held together by its own gravity. The nearest star to Earth is the Sun, which powers life on Earth through nuclear fusion reactions in its core.'
  },
  'who was the first president of the united states?': {
    hint: 'He is often called the "Father of His Country" and served as commander-in-chief of the Continental Army during the American Revolutionary War.',
    explanation: 'George Washington was the first President of the United States (1789–1797). He led the American forces to victory in the Revolutionary War and presided over the writing of the U.S. Constitution.'
  },
  'in which year did world war ii end?': {
    hint: 'It happened in the mid-1940s, right after the liberation of Europe and the atomic bombings of Hiroshima and Nagasaki.',
    explanation: 'World War II officially ended on September 2, 1945, when formal surrender documents were signed aboard the USS Missouri, following the surrender of Germany in May 1945 and Japan in August 1945.'
  },
  'explain the primary cause of the american civil war.': {
    hint: 'Think about the disagreement between northern and southern states over the institution of slavery and states\' rights.',
    explanation: 'The primary cause of the American Civil War (1861–1865) was the moral, political, and economic conflict over the enslavement of black people in the southern states. Southern states seceded to form the Confederacy, leading to war.'
  },
  'describe the social and economic impact of the industrial revolution on workers in europe during the 19th century.': {
    hint: 'Consider how factories shifted people from rural farms to crowded cities, changed daily work schedules, and led to the rise of trade unions.',
    explanation: 'The Industrial Revolution shifted production from home workshops to large factories, causing rapid urbanization and overcrowding in cities. Workers faced long hours, dangerous conditions, and low pay, which eventually spurred the development of labor unions and labor laws.'
  }
};

const getQuestionHelp = (prompt: string): { hint: string; explanation: string } => {
  const cleanKey = (prompt || '').trim().toLowerCase().replace(/[?,.]/g, '');
  const matchedKey = Object.keys(questionHelps).find(k => cleanKey.includes(k) || k.includes(cleanKey));
  if (matchedKey) {
    return questionHelps[matchedKey];
  }
  return {
    hint: 'Review the lesson material and try breaking down the question into simpler terms.',
    explanation: 'Examine key terms in the question and consult your textbook or course library notes to understand the concepts.'
  };
};

const Exams = () => {
  const { profile } = useAccessibility();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [exams, setExams] = React.useState<Exam[]>([]);
  const [loading, setLoading] = React.useState(true);
  
  const [activeExam, setActiveExam] = React.useState<Exam | null>(null);
  const [examStep, setExamStep] = React.useState<'list' | 'taking' | 'results'>('list');
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<number, string>>({});

  const [questions, setQuestions] = React.useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = React.useState(false);
  const [attemptResult, setAttemptResult] = React.useState<any>(null);
  const [loadingResults, setLoadingResults] = React.useState(false);

  // Practice Quiz States
  const [examTab, setExamTab] = React.useState<'timed' | 'practice'>('timed');
  const [isPracticeMode, setIsPracticeMode] = React.useState(false);
  const [showHint, setShowHint] = React.useState(false);
  const [hasCheckedAnswer, setHasCheckedAnswer] = React.useState<Record<number, boolean>>({});

  // Reset showHint when question index changes
  React.useEffect(() => {
    setShowHint(false);
  }, [currentQuestionIdx]);

  React.useEffect(() => {
    dashboardService.getStudentExams().then(data => {
      setExams(data);
    }).catch(err => {
      console.error('Failed to fetch exams', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleStartExam = (exam: Exam, isPractice: boolean = false) => {
    setIsPracticeMode(isPractice);
    setActiveExam(exam);
    setExamStep('taking');
    setCurrentQuestionIdx(0);
    setAnswers({});
    setHasCheckedAnswer({});
    setQuestions([]);
    setAttemptResult(null);
    
    setLoadingQuestions(true);
    dashboardService.getExamQuestions(exam.id, profile)
      .then(data => {
        setQuestions(data);
      })
      .catch(err => {
        console.error('Failed to fetch exam questions', err);
      })
      .finally(() => {
        setLoadingQuestions(false);
      });
  };

  const handleViewResults = (exam: Exam) => {
    if (exam.attemptId) {
      setLoadingResults(true);
      setExamStep('results');
      setAttemptResult(null);
      dashboardService.getExamAttempt(exam.attemptId)
        .then(details => {
          setAttemptResult(details);
        })
        .catch(err => {
          console.error("Failed to load attempt details:", err);
        })
        .finally(() => {
          setLoadingResults(false);
        });
    } else {
      setExamStep('results');
    }
  };

  const playAudioFeedback = (isCorrect: boolean) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = isCorrect 
        ? "Fantastic job! That's correct." 
        : "Not quite. Let's read the explanation to learn why.";
      
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      
      const isHindi = i18n.language === 'hi';
      let selectedVoice = null;
      if (isHindi) {
        selectedVoice = voices.find(v => v.lang.startsWith('hi-IN') || v.lang.startsWith('hi')) || null;
      } else {
        selectedVoice = voices.find(v => v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('indian')) || null;
      }
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSelectOption = (opt: string) => {
    setAnswers({...answers, [currentQuestionIdx]: opt});
    
    if (isPracticeMode) {
      const question = questions[currentQuestionIdx];
      const isCorrect = opt === question.correctAnswer || opt === question.correct_answer;
      setHasCheckedAnswer({...hasCheckedAnswer, [currentQuestionIdx]: true});
      playAudioFeedback(isCorrect);
    }
  };

  const handleSubmitExam = () => {
    if (!isPracticeMode && activeExam && user) {
      setLoadingResults(true);
      setExamStep('results');
      
      const mappedAnswers: Record<string, string> = {};
      questions.forEach((q, idx) => {
        mappedAnswers[q.id] = answers[idx] || '';
      });

      dashboardService.submitExam(activeExam.id, user.id, mappedAnswers)
        .then((submitRes) => {
          dashboardService.getStudentExams().then(setExams).catch(e => console.warn('Failed to refresh exams list:', e));
          return dashboardService.getExamAttempt(submitRes.id);
        })
        .then((attemptDetails) => {
          setAttemptResult(attemptDetails);
        })
        .catch(err => {
          console.error("Failed to submit exam attempt or load AI evaluation:", err);
        })
        .finally(() => {
          setLoadingResults(false);
        });
    } else {
      setExamStep('results');
    }
  };

  const renderExamTaking = () => {
    const question = questions[currentQuestionIdx];
    const isDyslexic = profile === 'dyslexic';
    const isID = profile === 'id';
    const isADHD = profile === 'adhd-autism';
    
    const help = getQuestionHelp(question.prompt || question.question);
    const selectedAnswer = answers[currentQuestionIdx];
    const checked = hasCheckedAnswer[currentQuestionIdx] || false;
    
    return (
      <div className={`space-y-8 animate-fade-in max-w-4xl mx-auto ${isDyslexic ? 'max-w-xl' : ''}`}>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b theme-border pb-4">
          <div className="space-y-1.5 flex-1">
            <h2 className="text-xl font-bold theme-text tracking-tight">{activeExam?.title}</h2>
            {isPracticeMode && (
              <span className="inline-block text-[9px] font-black text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
                Practice Mode
              </span>
            )}
            
            {/* Smooth Progress Track */}
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mt-3 overflow-hidden max-w-md border theme-border shadow-inner">
              <div 
                className="bg-gradient-to-r from-primary to-pink-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <span className="bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full font-bold text-xs shrink-0 self-start sm:self-auto shadow-sm">
            Question {currentQuestionIdx + 1} of {questions.length}
          </span>
        </div>

        {/* Adaptive Layout Card */}
        <div className={`theme-surface p-8 rounded-2xl border transition-all duration-300 bg-white dark:bg-gray-900/50 ${
          isADHD 
            ? 'border-2 border-purple-500/55 shadow-[0_0_22px_rgba(168,85,247,0.25)]' 
            : isID 
            ? 'border-2 border-indigo-400 bg-indigo-50/5 dark:bg-indigo-950/5 shadow-md'
            : 'theme-border shadow-sm'
        }`}>
          
          {isADHD && question.accessibilityNotes?.adhd?.subStep && (
            <span className="inline-block bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-black px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800 uppercase tracking-wider mb-4 animate-bounce">
              🧩 Section Part {question.accessibilityNotes.adhd.subStep}
            </span>
          )}

          {isADHD && question.accessibilityNotes?.adhd?.focusTip && (
            <div className="mb-6 p-4.5 bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
              <span className="text-lg shrink-0">🎯</span>
              <div>
                <strong className="block font-bold">Focus Tip:</strong>
                {question.accessibilityNotes.adhd.focusTip}
              </div>
            </div>
          )}

          {isID && question.accessibilityNotes?.id?.helperText && (
            <div className="mb-6 p-4.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 rounded-xl flex items-start gap-3 text-xs leading-relaxed">
              <span className="text-lg shrink-0">💡</span>
              <div>
                <strong className="block font-bold">Helper Guide:</strong>
                {question.accessibilityNotes.id.helperText}
              </div>
            </div>
          )}

          <h3 className={`font-bold theme-text mb-6 leading-snug ${isDyslexic ? 'text-2xl leading-loose font-sans tracking-wide' : isID ? 'text-3xl font-extrabold' : 'text-xl'}`}>
            {question.prompt || question.question}
          </h3>

          {question.type === 'mcq' && (
            <div className={`grid gap-4 ${isID ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              {question.options?.map((opt: string, idx: number) => {
                const isSelected = selectedAnswer === opt;
                const isCorrect = opt === question.correctAnswer || opt === question.correct_answer;
                
                let buttonStyle = 'border-gray-200 hover:border-primary/40 dark:border-gray-800 theme-text bg-white dark:bg-gray-900/40';
                
                if (isSelected) {
                  if (isPracticeMode) {
                    buttonStyle = isCorrect
                      ? 'border-green-500 bg-green-500/10 font-bold text-green-700 dark:text-green-300'
                      : 'border-red-500 bg-red-500/10 font-bold text-red-700 dark:text-red-300';
                  } else {
                    buttonStyle = 'border-primary bg-primary/10 font-bold theme-text';
                  }
                } else if (isPracticeMode && checked && isCorrect) {
                  buttonStyle = 'border-green-500/50 bg-green-500/5 font-semibold text-green-600 dark:text-green-400';
                }

                return (
                  <button
                    key={idx}
                    disabled={isPracticeMode && checked}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      answers[currentQuestionIdx] === opt ? 'scale-[1.01] shadow-sm' : ''
                    } ${buttonStyle} ${isDyslexic ? 'text-xl py-5 tracking-wide' : isID ? 'text-2xl py-6 font-black' : 'text-sm'}`}
                  >
                    <span>{opt}</span>
                    {isPracticeMode && isSelected && (
                      isCorrect ? (
                        <Check className="w-4 h-4 text-green-600 shrink-0 ml-2" />
                      ) : (
                        <X className="w-4 h-4 text-red-600 shrink-0 ml-2" />
                      )
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {(question.type === 'short' || question.type === 'descriptive') && (
            <div className="space-y-4">
              <textarea
                value={answers[currentQuestionIdx] || ''}
                disabled={isPracticeMode && checked}
                onChange={(e) => setAnswers({...answers, [currentQuestionIdx]: e.target.value})}
                rows={isDyslexic ? 6 : 4}
                className={`w-full p-4 border theme-border rounded-xl bg-white dark:bg-gray-900 theme-text focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none text-sm leading-relaxed ${isDyslexic ? 'text-xl leading-loose' : ''}`}
                placeholder="Type your answer here..."
              />
              {isPracticeMode && !checked && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      setHasCheckedAnswer({...hasCheckedAnswer, [currentQuestionIdx]: true});
                      playAudioFeedback(true);
                    }}
                    className="px-5 py-2.5 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all text-xs cursor-pointer"
                  >
                    Check Answer Details
                  </button>
                </div>
              )}
            </div>
          )}

          {isPracticeMode && (
            <div className="mt-8 pt-6 border-t theme-border space-y-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowHint(!showHint)}
                  className="px-3.5 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 font-bold rounded-lg border border-yellow-500/20 transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? 'Hide Hint' : 'Reveal Hint'}
                </button>
              </div>

              {showHint && (
                <div className="p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl text-xs text-yellow-800 dark:text-yellow-200 animate-fade-in leading-relaxed">
                  <strong>Hint:</strong> {help.hint}
                </div>
              )}

              {checked && (
                <div className="p-4.5 bg-green-500/5 border border-green-500/25 rounded-xl text-xs theme-text animate-fade-in space-y-2 leading-relaxed">
                  <h4 className="font-bold text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Explanation & Context:
                  </h4>
                  <p className="theme-text-muted">{help.explanation}</p>
                  {question.type === 'mcq' && (
                    <p className="text-[10px] theme-text-muted mt-2 border-t theme-border pt-2 font-medium">
                      Correct Choice: <strong className="text-green-600 dark:text-green-400">{question.correctAnswer || question.correct_answer}</strong>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-4">
          <button 
            onClick={() => setCurrentQuestionIdx(Math.max(0, currentQuestionIdx - 1))}
            disabled={currentQuestionIdx === 0}
            className="px-5 py-2.5 rounded-xl font-bold theme-text hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 border theme-border text-xs transition-all cursor-pointer"
          >
            Previous
          </button>
          
          {currentQuestionIdx < questions.length - 1 ? (
            <button 
              onClick={() => setCurrentQuestionIdx(currentQuestionIdx + 1)}
              disabled={isPracticeMode && !checked}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isPracticeMode && !checked
                  ? 'bg-gray-100 text-gray-400 border theme-border cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-primary text-white hover:bg-primary-dark hover:-translate-y-0.5 active:scale-95 shadow-sm'
              }`}
            >
              Next Question
            </button>
          ) : (
            <button 
              onClick={handleSubmitExam}
              disabled={isPracticeMode && !checked}
              className={`px-6 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                isPracticeMode && !checked
                  ? 'bg-gray-100 text-gray-400 border theme-border cursor-not-allowed dark:bg-gray-800 dark:text-gray-600'
                  : 'bg-green-600 text-white hover:bg-green-700 hover:-translate-y-0.5 active:scale-95'
              }`}
            >
              {isPracticeMode ? 'Finish Quiz' : 'Submit Exam'}
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!isPracticeMode && loadingResults) {
      return (
        <div className="space-y-6 text-center py-16 theme-surface border theme-border rounded-2xl max-w-xl mx-auto my-12 bg-white dark:bg-gray-900/50 shadow-sm animate-pulse">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold theme-text tracking-tight">Compiling AI Feedback Roster...</h2>
          <p className="theme-text-muted text-sm font-medium">Evaluating submitted answers against primary textbook modules.</p>
        </div>
      );
    }

    const questionsCount = (attemptResult && attemptResult.answers && attemptResult.answers.length) 
      ? attemptResult.answers.length 
      : questions.length;
    const maxScore = questionsCount * 10.0;
    const scoreVal = attemptResult ? parseFloat(attemptResult.score || 0) : 0;
    const percentage = maxScore > 0 ? Math.round((scoreVal / maxScore) * 100) : 0;

    return (
      <div className="space-y-8 animate-fade-in max-w-3xl mx-auto">
        <div className="theme-surface p-8 rounded-3xl border theme-border shadow-md text-center space-y-6 bg-gradient-to-br from-primary/5 via-transparent to-pink-500/5 bg-white dark:bg-gray-900/30">
          <div className="w-20 h-20 rounded-full bg-gradient-premium text-white flex items-center justify-center mx-auto shadow-md border-4 border-white dark:border-gray-800 animate-scale-up">
            <span className="text-2xl font-black">{percentage}%</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black theme-text tracking-tight">
              {isPracticeMode ? 'Practice Quiz Completed!' : 'Exam Submitted Successfully!'}
            </h2>
            <p className="theme-text-muted text-xs font-semibold max-w-md mx-auto">
              {isPracticeMode
                ? `You have finished your practice attempt for ${activeExam?.title}. Review your results and details below.`
                : `Your responses for ${activeExam?.title} have been recorded and graded automatically by the LAAMS AI engine.`}
            </p>
          </div>

          {!isPracticeMode && attemptResult && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto pt-4">
              <div className="bg-gray-50/50 dark:bg-gray-800/10 p-4 rounded-xl border theme-border">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Overall Score</span>
                <strong className="text-xl font-black text-primary mt-1 block">{scoreVal} / {maxScore}</strong>
              </div>
              <div className="bg-gray-50/50 dark:bg-gray-800/10 p-4 rounded-xl border theme-border">
                <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wide">Evaluation Status</span>
                <strong className="text-xl font-black text-green-600 dark:text-green-400 capitalize mt-1 block">{attemptResult.status}</strong>
              </div>
            </div>
          )}
        </div>

        {/* Breakdown Card */}
        {!isPracticeMode && attemptResult && attemptResult.answers && (
          <div className="space-y-5">
            <h3 className="text-lg font-bold theme-text flex items-center gap-2 tracking-tight">
              <BookText className="w-5 h-5 text-primary" />
              AI Evaluation Scorecard Breakdown
            </h3>
            
            <div className="space-y-4">
              {attemptResult.answers.map((ans: any, idx: number) => {
                const isCorrect = ans.isCorrect === true;
                const score = parseFloat(ans.score || 0);
                
                let badgeColor = "bg-red-50 text-red-700 border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30";
                let badgeText = "Incorrect";
                if (isCorrect) {
                  badgeColor = "bg-green-50 text-green-700 border-green-100 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900/30";
                  badgeText = "Correct";
                } else if (score > 0) {
                  badgeColor = "bg-yellow-50 text-yellow-700 border-yellow-100 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900/30";
                  badgeText = "Partial Credit";
                }

                return (
                  <div key={ans.id} className="theme-surface p-5 rounded-2xl border theme-border bg-white dark:bg-gray-900/50 shadow-sm space-y-3.5 hover:border-primary/20 transition-all duration-300">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Question {idx + 1}</span>
                        <h4 className="font-bold theme-text text-sm mt-0.5">{ans.prompt}</h4>
                      </div>
                      <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border shrink-0 ${badgeColor}`}>
                        {badgeText} ({score} / 10)
                      </span>
                    </div>

                    <div className="p-3 bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border theme-border">
                      <span className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider">Your Response:</span>
                      <p className="theme-text text-xs font-semibold mt-1">{ans.answer || <span className="italic text-gray-400">No response logged</span>}</p>
                    </div>

                    {ans.feedback && (
                      <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/10 flex items-start gap-2.5">
                        <span className="text-md shrink-0">🤖</span>
                        <div>
                          <strong className="block text-[9px] font-bold text-primary uppercase tracking-wide">AI Feedback & worked steps</strong>
                          <p className="theme-text text-xs leading-relaxed mt-0.5 font-medium">{ans.feedback}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex justify-center pt-4">
          <button 
            onClick={() => { setExamStep('list'); setActiveExam(null); setAttemptResult(null); }}
            className="px-6 py-3 bg-gradient-premium text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all text-xs cursor-pointer"
          >
            Return to Exams List
          </button>
        </div>
      </div>
    );
  };

  if (examStep === 'taking') {
    if (loadingQuestions) {
      return (
        <div className="p-16 text-center text-primary animate-pulse theme-surface rounded-2xl flex flex-col items-center justify-center gap-4 h-64 border theme-border max-w-xl mx-auto my-12 bg-white dark:bg-gray-900/50">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-sm">Loading exam questions...</p>
        </div>
      );
    }
    if (questions.length === 0) {
      return (
        <div className="theme-surface p-8 rounded-2xl shadow-sm border theme-border text-center space-y-5 max-w-md mx-auto my-12 bg-white dark:bg-gray-900/50">
          <div className="w-14 h-14 bg-orange-50 dark:bg-orange-950/20 text-orange-500 rounded-full flex items-center justify-center mx-auto border border-orange-100 dark:border-orange-900/35">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold theme-text tracking-tight">No Questions Configured</h2>
          <p className="theme-text-muted text-xs leading-relaxed">This exam registry does not contain questions in the database catalog yet.</p>
          <button 
            onClick={() => { setExamStep('list'); setActiveExam(null); }}
            className="px-5 py-2.5 bg-primary text-white rounded-xl font-bold text-xs hover:bg-primary-dark transition-all cursor-pointer"
          >
            Go Back
          </button>
        </div>
      );
    }
    return renderExamTaking();
  }
  if (examStep === 'results') return renderResults();

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold theme-text tracking-tight">Exams & Practice Quizzes</h1>
          <p className="theme-text-muted text-sm font-medium mt-0.5">Test your comprehension with school exams or practice modes.</p>
        </div>
        <div className="self-start sm:self-auto text-xs theme-text-muted bg-primary/10 text-primary px-3.5 py-1.5 rounded-full border border-primary/20 font-bold shadow-sm">
          Active Profile: <span className="capitalize">{profile}</span>
        </div>
      </div>

      {/* Pill switcher tab bar */}
      <div className="flex border-b theme-border mb-6 gap-2 bg-gray-50/50 dark:bg-gray-800/10 p-1.5 rounded-2xl border">
        <button
          onClick={() => setExamTab('timed')}
          className={`flex items-center justify-center gap-2 px-6 py-3 font-extrabold text-xs rounded-xl transition-all cursor-pointer ${
            examTab === 'timed' 
              ? 'bg-primary text-white shadow-sm' 
              : 'theme-text hover:bg-white/50 dark:hover:bg-gray-900/50'
          }`}
        >
          <span>Timed Exams (Summative)</span>
        </button>
        <button
          onClick={() => setExamTab('practice')}
          className={`flex items-center justify-center gap-2 px-6 py-3 font-extrabold text-xs rounded-xl transition-all cursor-pointer ${
            examTab === 'practice' 
              ? 'bg-primary text-white shadow-sm' 
              : 'theme-text hover:bg-white/50 dark:hover:bg-gray-900/50'
          }`}
        >
          <span>Self-Paced Practice Quizzes</span>
        </button>
      </div>
      
      {loading ? (
        <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Loading exams list...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exams.map(exam => (
            <div key={exam.id} className="theme-surface p-6 hover:border-primary/30 bg-white dark:bg-gray-900/50 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border theme-border shadow-sm flex flex-col justify-between rounded-2xl min-h-[220px]">
              {exam.priority === 'High Priority' && examTab === 'timed' && (
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/10 rounded-bl-full -mr-4 -mt-4"></div>
              )}
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    {exam.priority === 'High Priority' && examTab === 'timed' && (
                      <span className="text-[9px] font-black text-red-600 bg-red-50 text-red-600 border border-red-100 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 px-2.5 py-0.5 rounded-full mb-2.5 inline-flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {exam.priority}
                      </span>
                    )}
                    <h3 className="text-lg font-bold theme-text leading-tight">{exam.title}</h3>
                  </div>
                  {/* Calendar Badge */}
                  <div className="w-12 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border theme-border shadow-sm shrink-0 ml-3">
                    <span className="text-[10px] font-extrabold text-primary uppercase">{exam.date.split(' ')[1] || 'JUN'}</span>
                    <span className="text-lg font-extrabold theme-text leading-none mt-0.5">{exam.date.split(' ')[0] || '15'}</span>
                  </div>
                </div>
                <p className="text-xs theme-text-muted mb-6 leading-relaxed line-clamp-2">
                  {examTab === 'practice' 
                    ? `Self-paced practice review for: ${exam.title}. Reinforce your understanding with hints, worked examples, and instant feedback.`
                    : exam.description}
                </p>
              </div>
              
              {examTab === 'practice' ? (
                <button 
                  onClick={() => handleStartExam(exam, true)}
                  className="w-full py-2.5 bg-gradient-premium hover:shadow-lg hover:shadow-primary/20 text-white font-bold rounded-xl transition-all transform hover:scale-[1.01] text-xs cursor-pointer"
                >
                  Start Practice Quiz
                </button>
              ) : (exam.status === 'Submitted' || exam.status === 'Reviewed' || exam.status === 'Graded') ? (
                <button 
                  onClick={() => handleViewResults(exam)}
                  className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all transform hover:scale-[1.01] text-xs cursor-pointer"
                >
                  View Results
                </button>
              ) : (
                <button 
                  onClick={() => handleStartExam(exam, false)}
                  className="w-full py-2.5 bg-gradient-premium hover:shadow-lg hover:shadow-primary/20 text-white font-bold rounded-xl transition-all transform hover:scale-[1.01] text-xs cursor-pointer"
                >
                  Start Exam Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Skills = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Skill Development Modules</h1>
        <p className="theme-text-muted text-sm font-medium mt-0.5">Extracurricular courses designed to build essential life and academic skills.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="theme-surface p-6 rounded-2xl border theme-border hover:-translate-y-1 hover:border-primary/20 transition-all shadow-sm bg-white dark:bg-gray-900/50 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/25 border border-blue-100 dark:border-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center mb-4 shadow-sm">
               <MessageSquare className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold theme-text mb-2">Communication Basics</h2>
            <p className="theme-text-muted text-xs leading-relaxed mb-4">Learn essential communication frameworks tailored to different styles and setups.</p>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-3 overflow-hidden border theme-border shadow-inner">
              <div className="bg-blue-500 h-full rounded-full" style={{ width: '40%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] theme-text-muted mb-6 font-bold">
              <span>40% Complete</span>
              <span>Module 2 of 5</span>
            </div>
          </div>
          <button className="w-full py-2.5 bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400 border border-blue-100 dark:border-blue-900/35 rounded-xl font-bold hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-all text-xs cursor-pointer">Continue Course</button>
        </div>
        
        <div className="theme-surface p-6 rounded-2xl border theme-border hover:-translate-y-1 hover:border-primary/20 transition-all shadow-sm bg-white dark:bg-gray-900/50 flex flex-col justify-between">
          <div>
            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center mb-4 shadow-sm">
               <Laptop className="w-5 h-5" />
            </div>
            <h2 className="text-lg font-bold theme-text mb-2">Digital Literacy</h2>
            <p className="theme-text-muted text-xs leading-relaxed mb-4">Master navigating digital portals, interfaces, and accessibility tool suites safely.</p>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2 rounded-full mb-3 overflow-hidden border theme-border shadow-inner">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '10%' }}></div>
            </div>
            <div className="flex justify-between text-[10px] theme-text-muted mb-6 font-bold">
              <span>10% Complete</span>
              <span>Module 1 of 6</span>
            </div>
          </div>
          <button className="w-full py-2.5 bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/35 rounded-xl font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all text-xs cursor-pointer">Continue Course</button>
        </div>
      </div>
    </div>
  );
};

const Settings = () => {
  const { profile, setProfile, fontSize, setFontSize, fontFamily, setFontFamily, contrast, setContrast } = useAccessibility();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();

  const defaultProfile = user?.profileId || 'typical';
  const isTypicalOnly = defaultProfile === 'typical';

  const profileLabels: Record<string, { label: string; desc: string; icon: any; color: string }> = {
    typical: {
      label: 'Original Layout (Typical)',
      desc: 'Standard visuals as authored by your teacher without modifications.',
      icon: Monitor,
      color: 'from-slate-500 to-gray-600'
    },
    blind: {
      label: 'Screen Reader Profile',
      desc: 'Enhanced ARIA compatibility, speech cues, and narrative layouts.',
      icon: Volume2,
      color: 'from-pink-500 to-rose-600'
    },
    'low-vision': {
      label: 'Low Vision Mode',
      desc: 'High contrast text ratios, bold details, and responsive scaling borders.',
      icon: Globe,
      color: 'from-amber-500 to-orange-600'
    },
    deaf: {
      label: 'Deaf / Hard of Hearing',
      desc: 'Visual captions, transcript downloads, and notification logs.',
      icon: MessageSquare,
      color: 'from-teal-500 to-emerald-600'
    },
    dyslexic: {
      label: 'Dyslexia Friendly',
      desc: 'OpenDyslexic fonts, wide line breaks, and contrasting row borders.',
      icon: BookText,
      color: 'from-blue-500 to-indigo-600'
    },
    id: {
      label: 'Intellectual Disability',
      desc: 'Simplified vocabulary, structured timelines, and guided AI cues.',
      icon: Lightbulb,
      color: 'from-purple-500 to-violet-600'
    },
    'adhd-autism': {
      label: 'ADHD / Autism Focus',
      desc: 'Sound suppression widgets, focus alerts, and checkbox steps.',
      icon: Laptop,
      color: 'from-indigo-500 to-purple-600'
    }
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी (Hindi)' },
    { code: 'mr', name: 'मराठी (Marathi)' },
    { code: 'bn', name: 'বাংলা (Bengali)' },
    { code: 'te', name: 'తెలుగు (Telugu)' },
    { code: 'ta', name: 'தமிழ் (Tamil)' },
    { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
    { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', name: 'മലയാളം (Malayalam)' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' }
  ];

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    if (user?.id) {
      try {
        await dashboardService.updateUser(user.id, { preferredLanguage: newLang } as any);
        const cached = localStorage.getItem('laams_user_data');
        if (cached) {
          const parsed = JSON.parse(cached);
          parsed.preferredLanguage = newLang;
          localStorage.setItem('laams_user_data', JSON.stringify(parsed));
        }
      } catch (err) {
        console.error('Failed to sync language preference with backend', err);
      }
    }
  };

  const showAllProfiles = user?.email === 'student@school.edu' || user?.email === 'demo@demo.com';

  const allowedProfiles = showAllProfiles
    ? Object.keys(profileLabels).map(id => ({ id, ...profileLabels[id] }))
    : isTypicalOnly 
      ? [{ id: 'typical', ...profileLabels['typical'] }]
      : [
          { id: defaultProfile, ...profileLabels[defaultProfile] },
          { id: 'typical', ...profileLabels['typical'] }
        ];

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">{t('settings') || 'Account Settings'}</h1>
        <p className="theme-text-muted text-sm font-medium mt-0.5">Customize accessibility adaptations, preferred languages, and profile parameters.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card Selector Grid */}
        <div className="lg:col-span-2 space-y-6">
          <div className="theme-surface p-6 rounded-2xl border theme-border bg-white dark:bg-gray-900/50 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b theme-border pb-4">
              <Monitor className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold theme-text tracking-tight">{t('profile') || 'Accessibility Adaptations'}</h2>
            </div>
            
            <div className="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl text-xs theme-text font-medium leading-relaxed">
              {showAllProfiles ? (
                <span>Your account <strong>{user?.email}</strong> is configured in test mode. You can toggle and preview <strong>all 7 accessibility modes</strong>.</span>
              ) : (
                <span>Your registered student needs map to <strong className="text-primary capitalize">{defaultProfile}</strong>.</span>
              )}
            </div>

            <p className="theme-text-muted mb-6 text-xs font-semibold uppercase tracking-wider">
              Choose adapted environment view:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {allowedProfiles.map((p) => {
                const Icon = p.icon;
                const active = profile === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setProfile(p.id as AccessibilityProfile)}
                    className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer group select-none min-h-[140px] bg-white dark:bg-gray-900/30 ${
                      active 
                        ? 'border-primary shadow-md shadow-primary/5' 
                        : 'theme-border hover:border-primary/25'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="space-y-1">
                        <span className={`font-extrabold text-sm transition-colors ${active ? 'text-primary' : 'theme-text'}`}>
                          {p.label}
                        </span>
                        <p className="text-[11px] theme-text-muted mt-1 leading-relaxed font-semibold">
                          {p.desc}
                        </p>
                      </div>
                      <div className={`p-2.5 rounded-xl text-white bg-gradient-to-br ${p.color} shrink-0 shadow-sm ${active ? 'scale-105' : 'opacity-65'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-4">
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${active ? 'border-primary bg-primary' : 'theme-border bg-gray-50 dark:bg-gray-800'}`}>
                        {active && <Check className="w-2.5 h-2.5 text-white stroke-[3px]" />}
                      </div>
                      <span className="text-[10px] font-black uppercase text-gray-400 group-hover:text-primary tracking-wider transition-colors">
                        {active ? 'Active Profile' : 'Select Adaptations'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Settings panels */}
        <div className="space-y-6">
          <div className="theme-surface p-6 rounded-2xl border theme-border bg-white dark:bg-gray-900/50 shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b theme-border pb-4">
              <User className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold theme-text tracking-tight">Personal Info</h2>
            </div>
            <div className="space-y-4 text-xs font-semibold">
              <div>
                <label htmlFor="settings-name" className="block theme-text-muted mb-1.5 uppercase tracking-wide">Full Name</label>
                <input id="settings-name" type="text" disabled value={user ? `${user.firstName} ${user.lastName}` : ''} className="w-full px-4 py-2.5 rounded-xl border theme-border bg-gray-100 dark:bg-gray-800 theme-text opacity-75 cursor-not-allowed text-xs font-bold" />
              </div>
              <div>
                <label htmlFor="settings-email" className="block theme-text-muted mb-1.5 uppercase tracking-wide">Email</label>
                <input id="settings-email" type="email" disabled value={user?.email || ''} className="w-full px-4 py-2.5 rounded-xl border theme-border bg-gray-100 dark:bg-gray-800 theme-text opacity-75 cursor-not-allowed text-xs font-bold" />
              </div>
              <div>
                <label htmlFor="settings-grade" className="block theme-text-muted mb-1.5 uppercase tracking-wide">Grade Level</label>
                <input id="settings-grade" type="text" disabled value={user?.gradeLevel || 'N/A'} className="w-full px-4 py-2.5 rounded-xl border theme-border bg-gray-100 dark:bg-gray-800 theme-text opacity-75 cursor-not-allowed text-xs font-bold" />
              </div>
            </div>
          </div>

          <div className="theme-surface p-6 rounded-2xl border theme-border shadow-sm">
            <div className="flex items-center gap-3 mb-6 border-b theme-border pb-4">
              <Globe className="w-5 h-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-bold theme-text tracking-tight">{t('preferred_lang') || 'Language Settings'}</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="settings-language" className="block text-[10px] font-bold theme-text-muted mb-1.5 uppercase tracking-wide">System Language</label>
                <select 
                  id="settings-language"
                  value={i18n.language} 
                  onChange={handleLanguageChange}
                  className="w-full px-4 py-2.5 rounded-xl border theme-border bg-white dark:bg-gray-900 theme-text font-bold shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer text-xs"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="settings-font-family" className="block text-[10px] font-bold theme-text-muted mb-1.5 uppercase tracking-wide">{t('font_family') || 'Font Type'}</label>
                <select 
                  id="settings-font-family"
                  value={fontFamily} 
                  onChange={(e) => setFontFamily(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border theme-border bg-white dark:bg-gray-900 theme-text font-bold shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer text-xs"
                >
                  <option value="standard">Standard Sans-Serif</option>
                  <option value="dyslexic">OpenDyslexic Adapted</option>
                  <option value="legible">Clean High Legibility</option>
                </select>
              </div>

              <div>
                <label htmlFor="settings-font-size" className="block text-[10px] font-bold theme-text-muted mb-1.5 uppercase tracking-wide">{t('font_size') || 'Text Size'}</label>
                <select 
                  id="settings-font-size"
                  value={fontSize} 
                  onChange={(e) => setFontSize(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl border theme-border bg-white dark:bg-gray-900 theme-text font-bold shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer text-xs"
                >
                  <option value="normal">Normal Text</option>
                  <option value="large">Large Text</option>
                  <option value="x-large">Extra Large Text</option>
                </select>
              </div>

              {profile === 'low-vision' && (
                <div>
                  <label htmlFor="settings-contrast" className="block text-[10px] font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Color Contrast</label>
                  <select 
                    id="settings-contrast"
                    value={contrast} 
                    onChange={(e) => setContrast(e.target.value as any)}
                    className="w-full px-4 py-2.5 rounded-xl border theme-border bg-white dark:bg-gray-900 theme-text font-bold shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary focus:outline-none cursor-pointer text-xs"
                  >
                    <option value="yellow-on-black">Yellow text on Black canvas</option>
                    <option value="white-on-black">White text on Black canvas</option>
                    <option value="black-on-yellow">Black text on Yellow canvas</option>
                    <option value="blue-on-yellow">Blue text on Yellow canvas</option>
                    <option value="green-on-black">Green text on Black canvas</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LessonsList = () => {
  const [lessons, setLessons] = React.useState<any[]>([]);
  const [materials, setMaterials] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    Promise.all([
      dashboardService.getLessons(),
      dashboardService.getStudyMaterials()
    ]).then(([lessonsData, materialsData]) => {
      setLessons(lessonsData);
      setMaterials(materialsData);
    }).catch(err => {
      console.error('Failed to fetch lessons or materials', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Lessons & Study Materials</h1>
        <p className="theme-text-muted text-sm font-medium mt-0.5">Explore syllabus chapters and additional uploads cataloged by teachers.</p>
      </div>

      {loading ? (
        <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center justify-center gap-4 h-64 border theme-border rounded-2xl theme-surface">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-bold text-sm">Loading course roadmap...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.map(lesson => (
            <Link 
              key={lesson.id} 
              to={`/dashboard/lessons/${lesson.slug}`} 
              className="theme-surface p-6 rounded-2xl border theme-border hover:border-primary/20 hover:-translate-y-1 transition-all shadow-sm block group"
            >
              <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/10 px-2.5 py-0.5 rounded-full mb-3.5 inline-block">
                {lesson.subject}
              </span>
              <h2 className="text-base font-bold theme-text mb-2 group-hover:text-primary transition-colors line-clamp-1">{lesson.title}</h2>
              <p className="text-xs theme-text-muted font-medium mt-1">Core curriculum unit · Grade {lesson.gradeLevel}</p>
            </Link>
          ))}
          {materials.map(m => {
            const isVideo = m.fileUrl && m.fileUrl.match(/\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i);
            return (
              <Link 
                key={m.id} 
                to={`/dashboard/lessons/${m.id}`} 
                className="theme-surface p-6 rounded-2xl border theme-border hover:border-primary/20 hover:-translate-y-1 transition-all shadow-sm block group"
              >
                <div className="flex justify-between items-start gap-2 mb-3.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 border border-primary/10 px-2.5 py-0.5 rounded-full inline-block">
                    {m.subject}
                  </span>
                  {isVideo && (
                    <span className="text-[9px] font-black text-rose-600 bg-rose-50 border border-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Play className="w-2.5 h-2.5 fill-current" /> Video
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold theme-text mb-2 group-hover:text-primary transition-colors line-clamp-1">{m.title}</h2>
                <p className="text-xs theme-text-muted font-medium mt-1">
                  {isVideo ? 'Video learning resource' : 'Supplementary module'} uploaded by teacher
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const StudentDashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="library" element={<LibraryList />} />
      <Route path="library/:id" element={<BookChaptersView />} />
      <Route path="lessons" element={<LessonsList />} />
      <Route path="lessons/:id" element={<AdaptiveLesson />} />
      <Route path="assignments" element={<Assignments />} />
      <Route path="exams" element={<Exams />} />
      <Route path="skills" element={<Skills />} />
      <Route path="settings" element={<Settings />} />
    </Routes>
  );
};
