import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { User, MessageSquare, TrendingUp, Calendar, RefreshCw, Mail, Award, Send, FileText, Loader, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService } from '../../services/dashboard.service';
import type { SubjectProgress, CalendarEvent } from '../../types';

const Overview = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [progressData, setProgressData] = useState<Record<string, any[]>>({});
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(() => {
    if (user?.id) {
      dashboardService.getNotifications(user.id)
        .then(setNotifications)
        .catch(err => console.error('Failed to load notifications', err));
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
    dashboardService.getParentStudents(user.id).then(async (children) => {
      setStudents(children);
      
      // Fetch progress for each child
      const progressMap: Record<string, any[]> = {};
      for (const child of children) {
        const prog = await dashboardService.getStudentProgress(child.id);
        progressMap[child.id] = prog;
      }
      setProgressData(progressMap);
      
      dashboardService.getParentCalendar().then(calendarData => {
        setEvents(calendarData);
      });
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch parent data', err);
      setLoading(false);
    });
  }, [user, fetchNotifications]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-5xl mx-auto">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
        <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
      </div>
    );
  }

  const child = students[0];
  const progress = child ? (progressData[child.id] || []) : [];

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Parent Portal</h1>
        <p className="theme-text-muted text-sm font-medium">Monitor child's academic journey, check school communications, and message teachers.</p>
      </div>
      
      {/* Student Overview Header Card */}
      <div className="card-premium theme-surface p-8 border theme-border rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden bg-white dark:bg-gray-900/50">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-premium/10 dark:bg-primary/20 text-primary flex items-center justify-center rounded-2xl border border-primary/20 shadow-inner">
            <User className="w-10 h-10" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold theme-text tracking-tight">{child ? `${child.firstName} ${child.lastName}` : 'Student Progress'}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-xs font-bold theme-text-muted bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full border theme-border">Grade 8</span>
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 px-3 py-1 rounded-full capitalize">
                Needs Profile: {child?.profileId || child?.needs || 'Dyslexic'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={() => navigate('/dashboard/messages')}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-premium hover:shadow-lg hover:shadow-primary/25 text-white font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer text-sm"
          >
            <MessageSquare className="w-4 h-4" aria-hidden="true" />
            Message Teacher
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Performance Card */}
        <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-emerald-600 dark:text-emerald-400">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold theme-text text-lg tracking-tight">Recent Performance</h3>
                <p className="text-[11px] theme-text-muted mt-0.5 font-medium">Current subject average progress</p>
              </div>
            </div>
            
            <div className="space-y-6">
              {progress.slice(0, 2).map((item: any, idx: number) => (
                <div key={idx} className="group">
                  <div className="flex justify-between text-sm mb-2 font-bold">
                    <span className="theme-text group-hover:text-primary transition-colors">{item.subject}</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-2.5 rounded-full overflow-hidden shadow-inner border theme-border">
                    <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={() => navigate('/dashboard/progress')}
            className="w-full py-2.5 border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-gradient-premium hover:text-white hover:border-transparent hover:-translate-y-0.5 active:scale-95 transition-all text-xs cursor-pointer mt-6"
          >
            View Detailed Progress Report
          </button>
        </div>

        {/* Upcoming Due Dates Card */}
        <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2.5 bg-sky-50 dark:bg-sky-950/20 border border-sky-100 dark:border-sky-900/40 rounded-xl text-sky-600 dark:text-sky-400">
                <Calendar className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold theme-text text-lg tracking-tight">Upcoming Due Dates</h3>
                <p className="text-[11px] theme-text-muted mt-0.5 font-medium">Pending child homework & assessments</p>
              </div>
            </div>
            
            <ul className="space-y-3.5">
              {events.slice(0, 2).map((event, idx) => (
                <li key={idx} className="flex justify-between items-center p-4 bg-gray-50/50 dark:bg-gray-800/10 rounded-xl border theme-border hover:border-primary/25 transition-all group">
                  <div className="min-w-0 pr-2">
                    <p className="font-bold theme-text text-sm group-hover:text-primary transition-colors truncate">{event.title}</p>
                    <p className="text-xs theme-text-muted mt-1 leading-relaxed truncate">{event.description}</p>
                  </div>
                  {/* Calendar badge style */}
                  <div className="w-12 h-14 rounded-lg bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border theme-border shadow-sm shrink-0">
                    <span className="text-[10px] font-extrabold text-primary">{event.month}</span>
                    <span className="text-lg font-extrabold theme-text leading-none mt-0.5">{event.day}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <button 
            onClick={() => navigate('/dashboard/calendar')}
            className="w-full py-2.5 border-2 border-primary/20 text-primary font-bold rounded-xl hover:bg-gradient-premium hover:text-white hover:border-transparent hover:-translate-y-0.5 active:scale-95 transition-all text-xs cursor-pointer mt-6"
          >
            View Calendar Schedule
          </button>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm transition-all duration-300">
        <div className="flex justify-between items-center mb-6 border-b theme-border pb-4">
          <div>
            <h3 className="font-bold theme-text text-lg tracking-tight flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary" />
              Simulated Parent Alerts Logs
            </h3>
            <p className="text-[11px] theme-text-muted mt-0.5 font-medium">Real-time alerts dispatched to parents (Twilio & SMTP simulation)</p>
          </div>
          <button 
            onClick={fetchNotifications}
            className="p-2 bg-gray-50 dark:bg-gray-800 border theme-border rounded-xl text-gray-500 hover:text-primary hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            title="Refresh simulated alerts"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[380px] overflow-y-auto pr-1">
          {notifications.length === 0 ? (
            <div className="md:col-span-2 text-center py-12 text-sm theme-text-muted border border-dashed theme-border rounded-xl">
              No simulated alerts logged for your child yet. Active student events will generate live alerts.
            </div>
          ) : (
            notifications.map((n) => {
              const dateStr = new Date(n.sentAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
              if (n.channel === 'whatsapp') {
                return (
                  <div key={n.id} className="flex flex-col items-start space-y-1">
                    <span className="text-[9px] font-bold text-green-600 dark:text-green-400 uppercase tracking-wider flex items-center gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                      WhatsApp Alert (Twilio Simulation)
                    </span>
                    <div className="bg-[#e7f9ee] dark:bg-green-950/20 border border-green-200 dark:border-green-900/40 rounded-2xl rounded-tl-none p-4 w-full relative text-sm text-green-900 dark:text-green-200 shadow-sm leading-relaxed">
                      <p className="font-bold text-xs border-b border-green-200/50 dark:border-green-900/30 pb-1 mb-2 text-green-800 dark:text-green-400 flex justify-between">
                        <span>Parent Phone Alert</span>
                        <span className="text-[10px] text-green-700/60 dark:text-green-400/60 font-semibold">{dateStr}</span>
                      </p>
                      <p className="text-sm font-medium">{n.body}</p>
                      <div className="flex justify-end items-center gap-1 mt-1.5 text-[10px] text-blue-500 font-bold">
                        <span>Read</span>
                        <span>✓✓</span>
                      </div>
                    </div>
                  </div>
                );
              } else {
                return (
                  <div key={n.id} className="flex flex-col items-start space-y-1">
                    <span className="text-[9px] font-bold text-blue-500 dark:text-blue-400 uppercase tracking-wider flex items-center gap-1 ml-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                      Email Alert (SMTP Simulation)
                    </span>
                    <div className="bg-white dark:bg-gray-800 border theme-border rounded-2xl rounded-tl-none p-4 w-full text-sm theme-text shadow-sm leading-relaxed">
                      <div className="border-b theme-border pb-2 mb-2 flex justify-between items-center">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="p-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-500 shrink-0">
                            <Mail className="w-3.5 h-3.5" />
                          </div>
                          <span className="font-bold text-xs theme-text block truncate">{n.title}</span>
                        </div>
                        <span className="text-[10px] theme-text-muted shrink-0 font-semibold">{dateStr}</span>
                      </div>
                      <p className="text-xs theme-text-muted leading-relaxed font-medium">{n.body}</p>
                    </div>
                  </div>
                );
              }
            })
          )}
        </div>
      </div>
    </div>
  );
};

const Progress = () => {
  const [progress, setProgress] = useState<SubjectProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getParentProgress().then(data => {
      setProgress(data);
    }).catch(err => {
      console.error('Failed to fetch progress', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      <div className="flex flex-col gap-1 pb-5 border-b theme-border">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Detailed Progress Report</h1>
        <p className="theme-text-muted text-sm font-medium">Review detailed child grading, teachers notes, homework submissions, and average exams data.</p>
      </div>
      
      <div className="theme-surface border theme-border p-8 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm">
        <h2 className="text-xl font-bold theme-text mb-6 tracking-tight flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Subject Breakdown</h2>
        
        {loading ? (
          <div className="p-12 text-center text-primary animate-pulse flex flex-col items-center"><Loader className="animate-spin mb-4" /> Loading progress report...</div>
        ) : (
          <div className="space-y-8">
            {progress.map((item: any, idx) => (
              <div key={idx} className={idx > 0 ? "pt-8 border-t theme-border" : ""}>
                <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                  <h3 className="font-bold theme-text text-lg">{item.subject}</h3>
                  <span className="bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900/30 text-xs font-bold px-3 py-1 rounded-full shadow-sm">{item.grade} ({item.percentage}%)</span>
                </div>
                <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 border theme-border rounded-xl mb-4 text-sm theme-text leading-relaxed">
                  <span className="font-bold text-primary mr-1 text-xs uppercase tracking-wider block mb-1">Teacher Note</span>
                  <span className="theme-text-muted font-medium">{item.teacherNote}</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800/80 h-2.5 rounded-full overflow-hidden mb-4 shadow-inner border theme-border">
                  <div className="bg-gradient-to-r from-emerald-400 to-green-500 h-full rounded-full transition-all duration-500" style={{ width: `${item.percentage}%` }}></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs theme-text-muted font-bold uppercase tracking-wider bg-gray-50/50 dark:bg-gray-850/10 p-3.5 rounded-xl border theme-border">
                  <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-primary" /> Completed: <strong className="theme-text">{item.assignmentsCompleted || 0} assignments</strong></span>
                  <span className="flex items-center gap-1.5"><FileText className="w-4 h-4 text-primary" /> Downloads: <strong className="theme-text">{item.downloadsCount || 0} files</strong></span>
                  <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4 text-primary" /> Exam Avg: <strong className="theme-text">{item.examPerformance || 0}%</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getParentCalendar().then(data => {
      setEvents(data);
    }).catch(err => {
      console.error('Failed to fetch calendar', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 pb-5 border-b theme-border">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Upcoming Deadlines</h1>
        <p className="theme-text-muted text-sm font-medium">Keep track of dates and events relating to child course workloads.</p>
      </div>

      <div className="theme-surface border theme-border overflow-hidden rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm">
        <div className="p-4.5 border-b theme-border bg-gray-50/50 dark:bg-gray-800/30 flex justify-between items-center">
          <span className="font-bold theme-text text-sm">Target Deadlines</span>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full font-bold">This Week</span>
        </div>
        {loading ? (
          <div className="p-12 text-center text-primary animate-pulse flex flex-col items-center"><Loader className="animate-spin mb-4" /> Loading deadlines...</div>
        ) : (
          <ul className="divide-y theme-border">
            {events.map((event) => (
              <li key={event.id} className="p-5 hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-all flex items-center gap-4 group">
                {/* Calendar date badge */}
                <div className="w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center border theme-border shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <span className="text-[10px] font-extrabold text-primary uppercase">{event.month}</span>
                  <span className="text-xl font-extrabold theme-text leading-none mt-0.5">{event.day}</span>
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold theme-text text-base group-hover:text-primary transition-colors truncate">{event.title}</h3>
                  <p className="text-xs theme-text-muted leading-relaxed font-semibold mt-1">{event.description}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Messages = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'teacher', text: 'Hello! Just a reminder that Aarav has a History essay due next week. Let me know if he needs an extension.', time: 'Yesterday, 4:00 PM' },
    { id: 2, sender: 'parent', text: 'Thank you! He is working on it and using the audio adaptation. It seems to be going well.', time: 'Today, 9:00 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    setMessages([...messages, { id: Date.now(), sender: 'parent', text: newMessage, time: 'Just now' }]);
    setNewMessage('');
  };

  return (
    <div className="space-y-6 animate-fade-in flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="flex flex-col gap-1 flex-shrink-0">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Communication Hub</h1>
        <p className="theme-text-muted text-sm font-medium">Direct live contact logs between parents and educators.</p>
      </div>

      <div className="theme-surface border theme-border flex-1 rounded-2xl flex flex-col overflow-hidden bg-white dark:bg-gray-900/50 shadow-sm">
        {/* Chat Header */}
        <div className="p-4.5 border-b theme-border bg-gray-50/50 dark:bg-gray-800/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-premium/10 text-primary flex items-center justify-center font-bold text-sm shadow-inner border border-primary/10">
              AS
            </div>
            <div>
              <h2 className="font-bold theme-text text-sm">Arjun Sharma (History Teacher)</h2>
              <p className="text-[10px] text-green-500 font-extrabold flex items-center gap-1 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
        </div>
        
        {/* Messages body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map(msg => {
            const isParent = msg.sender === 'parent';
            return (
              <div key={msg.id} className={`flex ${isParent ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                  isParent 
                    ? 'bg-gradient-premium text-white rounded-tr-none shadow-md shadow-primary/10' 
                    : 'bg-gray-100 dark:bg-gray-800 theme-text rounded-tl-none border theme-border'
                }`}>
                  <p className="font-medium">{msg.text}</p>
                  <p className={`text-[10px] mt-2 font-bold text-right ${isParent ? 'text-white/60' : 'theme-text-muted'}`}>{msg.time}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input box */}
        <div className="p-4 border-t theme-border bg-white dark:bg-gray-900/80">
          <form onSubmit={handleSend} className="flex gap-3 items-center">
            <div className="focus-glow rounded-xl border theme-border transition-all flex-1">
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type your message to Aarav's teacher..."
                className="w-full bg-transparent border-none px-4 py-3 outline-none theme-text text-sm"
              />
            </div>
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-premium hover:shadow-lg hover:shadow-primary/25 text-white rounded-xl font-bold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ParentDashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="progress" element={<Progress />} />
      <Route path="calendar" element={<CalendarPage />} />
      <Route path="messages" element={<Messages />} />
    </Routes>
  );
};

