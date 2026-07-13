import React, { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  BookOpen, LayoutDashboard, FileText,
  CheckSquare, GraduationCap, Settings, LogOut, Shield, Users, Calendar, Target, MessageSquare, Menu, X
} from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';
import { AccessibilityControls } from '../components/ui/AccessibilityControls';
import { useTranslation } from 'react-i18next';

// Dashboards
import { StudentDashboard } from './dashboards/StudentDashboard';
import { TeacherDashboard } from './dashboards/TeacherDashboard';
import { AdminDashboard } from './dashboards/AdminDashboard';
import { ParentDashboard } from './dashboards/ParentDashboard';

export const Dashboard: React.FC = () => {
  const { profile } = useAccessibility();
  const { user, role, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const getTranslationKey = (name: string) => {
    if (role === 'teacher') {
      switch (name) {
        case 'Overview': return 'overview';
        case 'My Classes': return 'teacher_classes';
        case 'Content Hub': return 'content_hub';
        case 'Assignments': return 'teacher_assignments';
        case 'Exams': return 'teacher_exams';
      }
    }

    switch (name) {
      case 'Overview': return 'overview';
      case 'Library': return 'library';
      case 'My Lessons': return 'lessons';
      case 'Assignments': return 'assignments';
      case 'Exams': return 'exams';
      case 'Skills': return 'skills';
      case 'Settings': return 'settings';
      case 'My Classes': return 'lessons';
      case 'Content Hub': return 'library';
      case 'User Management': return 'user_management';
      case 'Classes': return 'classes';
      case 'Compliance': return 'compliance';
      case 'Progress': return 'assignments';
      case 'Calendar': return 'exams';
      case 'Messages': return 'skills';
      default: return name.toLowerCase().replace(' ', '_');
    }
  };

  let navItems: { name: string; path: string; icon: any }[] = [];
  let portalName = "Portal";
  let dashboardContent: React.ReactNode = (
    <div className="theme-surface p-8 text-center">
      <h1 className="text-2xl font-bold theme-text">Dashboard unavailable</h1>
      <p className="theme-text-muted mt-2">
        Your account is signed in, but no valid portal role is assigned.
      </p>
    </div>
  );
  const userName = user ? `${user.firstName} ${user.lastName}` : "User";

  if (role === 'student') {
    portalName = 'Student Portal';
    navItems = [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Library', path: '/dashboard/library', icon: BookOpen },
      { name: 'My Lessons', path: '/dashboard/lessons', icon: FileText },
      { name: 'Assignments', path: '/dashboard/assignments', icon: CheckSquare },
      { name: 'Exams', path: '/dashboard/exams', icon: GraduationCap },
      { name: 'Skills', path: '/dashboard/skills', icon: Target },
      { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ];
    dashboardContent = <StudentDashboard />;
  } else if (role === 'teacher') {
    portalName = 'Teacher Panel';
    navItems = [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'My Classes', path: '/dashboard/classes', icon: Users },
      { name: 'Content Hub', path: '/dashboard/content', icon: FileText },
      { name: 'Assignments', path: '/dashboard/assignments', icon: CheckSquare },
      { name: 'Exams', path: '/dashboard/exams', icon: GraduationCap },
    ];
    dashboardContent = <TeacherDashboard />;
  } else if (role === 'admin') {
    portalName = 'Admin Panel';
    navItems = [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'User Management', path: '/dashboard/users', icon: Users },
      { name: 'Classes', path: '/dashboard/classes', icon: BookOpen },
      { name: 'Compliance', path: '/dashboard/compliance', icon: Shield },
    ];
    dashboardContent = <AdminDashboard />;
  } else if (role === 'parent') {
    portalName = 'Parent Portal';
    navItems = [
      { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Progress', path: '/dashboard/progress', icon: CheckSquare },
      { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
      { name: 'Messages', path: '/dashboard/messages', icon: MessageSquare },
    ];
    dashboardContent = <ParentDashboard />;
  }

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
    navigate('/');
  };

  return (
    <div className="h-screen w-screen theme-bg flex overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-300 border-r border-white/5 flex flex-col h-full shrink-0 transition-transform duration-300 ease-out md:hidden ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
            <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">LAAMS</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 px-3">
            {portalName}
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-primary to-indigo-600 text-white font-extrabold shadow-[0_4px_20px_rgba(170,59,255,0.25)] scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 hover:translate-x-1'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{t(getTranslationKey(item.name))}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-xs text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize font-medium">Role: {role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 transition-colors cursor-pointer text-xs font-bold">
            <LogOut className="w-4 h-4" aria-hidden="true" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gradient-to-b from-slate-950 via-slate-900 to-indigo-950 text-slate-300 border-r border-white/5 hidden md:flex flex-col h-full shrink-0">
        <div className="p-6 flex items-center gap-2 border-b border-white/5">
          <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">LAAMS</span>
        </div>

        <div className="p-4 overflow-y-auto flex-1">
          <p className="text-xs font-extrabold text-slate-500 uppercase tracking-widest mb-4 px-3">
            {portalName}
          </p>
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/dashboard');
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive
                    ? 'bg-gradient-to-r from-primary to-indigo-600 text-white font-extrabold shadow-[0_4px_20px_rgba(170,59,255,0.25)] scale-[1.01]'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 hover:translate-x-1'
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
                  <span>{t(getTranslationKey(item.name))}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-white/5 space-y-3">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5">
            <div className="w-9 h-9 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-extrabold text-sm shadow-inner">
              {userName.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-extrabold text-xs text-white truncate">{userName}</p>
              <p className="text-[10px] text-slate-400 truncate capitalize font-medium">Role: {role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-500/10 transition-colors cursor-pointer text-xs font-bold">
            <LogOut className="w-4 h-4" aria-hidden="true" />
            {t('logout')}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-16 sticky top-0 z-40 bg-white/80 dark:bg-gray-900/85 backdrop-blur-md border-b theme-border flex items-center justify-between px-6 shadow-sm">
          <div className="md:hidden flex items-center gap-2">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-lg theme-text hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <BookOpen className="w-6 h-6 text-primary" aria-hidden="true" />
            <span className="text-xl font-bold theme-text">LAAMS</span>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="hidden lg:block">
              <AccessibilityControls />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-bold theme-text">{userName}</p>
              <p className="text-xs theme-text-muted capitalize">Profile: {profile}</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-gradient-premium flex items-center justify-center text-white font-bold shadow-md shadow-primary/25 hover:rotate-6 transition-transform cursor-pointer">
              {userName.charAt(0)}
            </div>
          </div>
        </header>

        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-5xl mx-auto">
            {dashboardContent}
          </div>
        </div>
      </main>
    </div>
  );
};
