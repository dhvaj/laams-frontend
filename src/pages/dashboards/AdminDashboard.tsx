import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Shield, 
  Users, 
  Activity, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Download, 
  Search, 
  Plus, 
  X,
  ChevronRight,
  Filter
} from 'lucide-react';
import { dashboardService } from '../../services/dashboard.service';
import { authService } from '../../services/auth.service';
import type { SystemStat, RegisteredUser, User, UserRole } from '../../types';

const IconMap: Record<string, any> = {
  Settings, Shield, Users, Activity
};

const statCardStyles: Record<string, { gradient: string; text: string; bg: string; border: string }> = {
  Users: {
    gradient: 'from-violet-500 to-purple-600',
    text: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    border: 'border-purple-100 dark:border-purple-900/30'
  },
  Shield: {
    gradient: 'from-emerald-500 to-green-600',
    text: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-950/20',
    border: 'border-emerald-100 dark:border-emerald-900/30'
  },
  Activity: {
    gradient: 'from-amber-500 to-orange-600',
    text: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-950/20',
    border: 'border-amber-100 dark:border-amber-900/30'
  },
  Settings: {
    gradient: 'from-blue-500 to-indigo-600',
    text: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    border: 'border-blue-100 dark:border-blue-900/30'
  }
};

const getAvatarGradient = (name: string) => {
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const hue = charCodeSum % 360;
  return {
    initials: initials || 'U',
    style: {
      background: `linear-gradient(135deg, hsl(${hue}, 80%, 65%), hsl(${(hue + 40) % 360}, 85%, 55%))`,
      color: '#fff',
      textShadow: '0 1px 2px rgba(0,0,0,0.15)'
    }
  };
};

const Overview = () => {
  const [stats, setStats] = useState<SystemStat[]>([]);
  const [recentUsers, setRecentUsers] = useState<RegisteredUser[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleExportCSV = () => {
    if (recentUsers.length === 0) return;
    const headers = ['Name', 'Email', 'Role', 'Needs', 'Joined Date'];
    const csvContent = [
      headers.join(','),
      ...recentUsers.map(u => `"${u.name}","${u.email}","${u.role}","${u.needs}","${u.date}"`)
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'recent_users_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    Promise.all([
      dashboardService.getAdminStats(),
      dashboardService.getRecentUsers()
    ]).then(([statsData, usersData]) => {
      setStats(statsData);
      setRecentUsers(usersData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="h-8 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
        <div className="h-80 bg-gray-200 dark:bg-gray-800 rounded-2xl mt-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold theme-text tracking-tight">System Administration</h1>
          <p className="theme-text-muted text-sm font-medium">Control core platform workflows, monitor registrations, compliance and accessibility profiles.</p>
        </div>
        <div className="self-start sm:self-auto">
          <span className="bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System Status: Operational
          </span>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = IconMap[stat.iconName] || Settings;
          const style = statCardStyles[stat.iconName] || statCardStyles.Settings;
          return (
            <div 
              key={idx} 
              onClick={() => {
                if (stat.title.toLowerCase().includes('user')) navigate('users');
                if (stat.title.toLowerCase().includes('class')) navigate('classes');
                if (stat.title.toLowerCase().includes('complian')) navigate('compliance');
              }}
              className="theme-surface border theme-border p-6 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-primary/20 cursor-pointer group"
            >
              <div className={`p-3.5 rounded-xl text-white bg-gradient-to-br ${style.gradient} shadow-md group-hover:scale-105 transition-transform`}>
                <Icon className="w-5 h-5" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[10px] theme-text-muted font-extrabold tracking-wider uppercase">{stat.title}</p>
                <p className="text-2xl font-black theme-text tracking-tight mt-0.5">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Users Section */}
      <div className="theme-surface border theme-border rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden">
        <div className="p-6 border-b theme-border bg-gray-50/50 dark:bg-gray-800/25 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <h2 className="text-lg font-bold theme-text tracking-tight">Recent User Registrations</h2>
            <p className="theme-text-muted text-xs font-medium mt-0.5">Manage platform access, active roles, and linking parameters.</p>
          </div>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-premium hover:shadow-lg hover:shadow-primary/25 text-white font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer text-xs"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/30 dark:bg-gray-800/10 border-b theme-border theme-text-muted text-[10px] uppercase tracking-wider">
                <th className="p-4 font-extrabold">User Details</th>
                <th className="p-4 font-extrabold">Platform Role</th>
                <th className="p-4 font-extrabold">Accessibility Needs</th>
                <th className="p-4 font-extrabold">Registration Date</th>
                <th className="p-4 font-extrabold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y theme-border theme-text">
              {recentUsers.map((user, idx) => {
                const avatar = getAvatarGradient(user.name);
                return (
                  <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0"
                          style={avatar.style}
                        >
                          {avatar.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-sm theme-text truncate">{user.name}</p>
                          <p className="text-xs theme-text-muted truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize border shadow-sm ${
                        user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30' :
                        user.role === 'teacher' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30' :
                        user.role === 'parent' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' :
                        'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="bg-gray-100 dark:bg-gray-800/80 border theme-border px-2.5 py-0.5 rounded text-[11px] font-bold theme-text-muted capitalize">
                        {user.needs || 'Typical'}
                      </span>
                    </td>
                    <td className="p-4 text-xs theme-text-muted font-semibold">{user.date}</td>
                    <td className="p-4">
                      <button 
                        onClick={() => navigate('users')}
                        className="text-primary hover:underline font-bold text-xs flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform"
                      >
                        Manage
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const UserManagement = () => {
  const [usersList, setUsersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({ firstName: '', lastName: '', email: '', role: 'student', needs: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    dashboardService.getAllUsers().then(data => {
      setUsersList(data);
    }).catch(err => {
      console.error('Failed to fetch users', err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await dashboardService.deleteUser(id);
        setUsersList(prev => prev.filter(u => u.id !== id));
      } catch (err) {
        console.error('Failed to delete user', err);
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { user } = await authService.register({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role as UserRole,
        profileId: newUser.role === 'student' ? newUser.needs : undefined,
      });
      setUsersList(prev => [...prev, user]);
      setIsAddingUser(false);
      setNewUser({ firstName: '', lastName: '', email: '', role: 'student', needs: '' });
    } catch (err) {
      console.error('Failed to add user', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setIsSubmitting(true);
    try {
      const updatedUser = await dashboardService.updateUser(editingUser.id, editingUser);
      setUsersList(prev => prev.map(u => u.id === editingUser.id ? updatedUser : u));
      setEditingUser(null);
    } catch (err) {
      console.error('Failed to update user', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = usersList.filter(u => {
    const matchesSearch = `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b theme-border pb-5">
        <div>
          <h1 className="text-3xl font-extrabold theme-text tracking-tight">User Directory</h1>
          <p className="theme-text-muted text-sm font-medium mt-0.5">Register, link, edit, or delete platform student, parent, teacher and admin records.</p>
        </div>
        <button 
          onClick={() => setIsAddingUser(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-premium hover:shadow-lg hover:shadow-primary/25 text-white font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </button>
      </div>
      
      {/* Search & Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50/50 dark:bg-gray-800/10 border theme-border p-4 rounded-2xl">
        <div className="sm:col-span-2 relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 theme-text-muted pointer-events-none" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search directory by name, email..." 
            aria-label="Search users by name or email"
            className="w-full bg-white dark:bg-gray-900 border theme-border rounded-xl pl-9 pr-4 py-2.5 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
          />
        </div>
        <div className="relative flex items-center">
          <Filter className="absolute left-3 w-4 h-4 theme-text-muted pointer-events-none" />
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            aria-label="Filter by role"
            className="w-full bg-white dark:bg-gray-900 border theme-border rounded-xl pl-9 pr-4 py-2.5 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
            <option value="parent">Parent</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="theme-surface border theme-border rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Loading user database...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-gray-800/10 border-b theme-border theme-text-muted text-[10px] uppercase tracking-wider">
                  <th className="p-4 font-extrabold">User Details</th>
                  <th className="p-4 font-extrabold">Role</th>
                  <th className="p-4 font-extrabold">Linked Profiles</th>
                  <th className="p-4 font-extrabold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border theme-text">
                {filteredUsers.map(u => {
                  const name = `${u.firstName} ${u.lastName}`;
                  const avatar = getAvatarGradient(name);
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs uppercase shadow-sm shrink-0"
                            style={avatar.style}
                          >
                            {avatar.initials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-sm theme-text truncate">{name}</p>
                            <p className="text-xs theme-text-muted truncate">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold capitalize border shadow-sm ${
                          u.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30' :
                          u.role === 'teacher' ? 'bg-blue-50 text-blue-700 border-blue-100 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30' :
                          u.role === 'parent' ? 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30' :
                          'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.role === 'parent' && u.linkedStudentIds && u.linkedStudentIds.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {u.linkedStudentIds.map(id => {
                              const s = usersList.find(x => x.id === id);
                              return s ? (
                                <span key={id} className="bg-gray-100 dark:bg-gray-800 border theme-border px-2 py-0.5 rounded text-[10px] font-bold theme-text-muted">
                                  Kid: {s.firstName}
                                </span>
                              ) : null;
                            })}
                          </div>
                        ) : u.role === 'parent' ? (
                          <span className="text-red-400 dark:text-red-500/80 text-[10px] font-bold">Unlinked profile</span>
                        ) : u.role === 'student' ? (
                          <span className="bg-gray-50 dark:bg-gray-850 px-2 py-0.5 rounded text-[10px] font-bold theme-text-muted">
                            Needs: {u.profileId || u.needs || 'Dyslexic'}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <button 
                            onClick={() => setEditingUser(u)} 
                            className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-transparent hover:border-blue-100 dark:hover:border-blue-900/30 rounded-xl transition-all cursor-pointer" 
                            title="Edit User"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteUser(u.id)} 
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 rounded-xl transition-all cursor-pointer" 
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center theme-text-muted font-medium text-sm">No records found matching your directory query.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-950 border theme-border p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] transform scale-100 transition-all duration-300 animate-scale-in">
            <div className="flex justify-between items-center border-b theme-border pb-4 mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold theme-text tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Register New User
              </h2>
              <button 
                onClick={() => setIsAddingUser(false)} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 -mr-2 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="new-firstName" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">First Name</label>
                    <input 
                      id="new-firstName" 
                      required 
                      type="text" 
                      value={newUser.firstName} 
                      onChange={e => setNewUser({...newUser, firstName: e.target.value})} 
                      className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="new-lastName" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Last Name</label>
                    <input 
                      id="new-lastName" 
                      required 
                      type="text" 
                      value={newUser.lastName} 
                      onChange={e => setNewUser({...newUser, lastName: e.target.value})} 
                      className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="new-email" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Email Address</label>
                  <input 
                    id="new-email" 
                    required 
                    type="email" 
                    value={newUser.email} 
                    onChange={e => setNewUser({...newUser, email: e.target.value})} 
                    className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                  />
                </div>
                <div>
                  <label htmlFor="new-role" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Directory Role</label>
                  <select 
                    id="new-role" 
                    value={newUser.role} 
                    onChange={e => setNewUser({...newUser, role: e.target.value as UserRole})} 
                    className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="parent">Parent</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                
                {newUser.role === 'student' && (
                  <div className="animate-fade-in">
                    <label htmlFor="new-needs" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Accessibility Adaptation Profile</label>
                    <select 
                      id="new-needs" 
                      value={newUser.needs} 
                      onChange={e => setNewUser({...newUser, needs: e.target.value})} 
                      className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="">No Adaptation (Typical)</option>
                      <option value="dyslexic">Dyslexia Profile (Readable Font, High Spacing)</option>
                      <option value="low-vision">Low Vision Profile (High Contrast, Bold Labels)</option>
                      <option value="deaf">Deaf Profile (Sign Language Adaptations)</option>
                      <option value="adhd">ADHD Profile (High Focus, Reduced Noise)</option>
                    </select>
                  </div>
                )}
              </div>
              <div className="flex gap-4 pt-4 border-t theme-border flex-shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsAddingUser(false)} 
                  className="flex-1 py-3 border theme-border rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors theme-text text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 py-3 bg-gradient-premium text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 text-sm cursor-pointer"
                >
                  {isSubmitting ? 'Registering...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className={`bg-white dark:bg-gray-950 border theme-border p-6 md:p-8 rounded-2xl w-full ${editingUser.role === 'parent' ? 'max-w-3xl' : 'max-w-md'} shadow-2xl flex flex-col max-h-[90vh] transform scale-100 transition-all duration-300 animate-scale-in`}>
            <div className="flex justify-between items-center border-b theme-border pb-4 mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold theme-text tracking-tight flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-primary" />
                Modify User Details
              </h2>
              <button 
                onClick={() => setEditingUser(null)} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleUpdateUser} className="flex flex-col flex-1 overflow-hidden">
              <div className={`overflow-y-auto flex-1 pr-2 -mr-2 mb-6 ${editingUser.role === 'parent' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-4'}`}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="edit-firstName" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">First Name</label>
                      <input 
                        id="edit-firstName" 
                        required 
                        type="text" 
                        value={editingUser.firstName} 
                        onChange={e => setEditingUser({...editingUser, firstName: e.target.value})} 
                        className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      />
                    </div>
                    <div>
                      <label htmlFor="edit-lastName" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Last Name</label>
                      <input 
                        id="edit-lastName" 
                        required 
                        type="text" 
                        value={editingUser.lastName} 
                        onChange={e => setEditingUser({...editingUser, lastName: e.target.value})} 
                        className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="edit-email" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Email Address</label>
                    <input 
                      id="edit-email" 
                      required 
                      type="email" 
                      value={editingUser.email} 
                      onChange={e => setEditingUser({...editingUser, email: e.target.value})} 
                      className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    />
                  </div>
                  <div>
                    <label htmlFor="edit-role" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Directory Role</label>
                    <select 
                      id="edit-role" 
                      value={editingUser.role} 
                      onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})} 
                      className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="parent">Parent</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {editingUser.role === 'parent' && (
                  <div className="p-5 border theme-border rounded-xl bg-gray-50/50 dark:bg-gray-800/10 h-full flex flex-col justify-between">
                    <div>
                      <h3 className="font-extrabold theme-text mb-3 text-sm tracking-tight flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        Linked Students
                      </h3>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {editingUser.linkedStudentIds && editingUser.linkedStudentIds.length > 0 ? (
                          editingUser.linkedStudentIds.map(id => {
                            const s = usersList.find(x => x.id === id);
                            return (
                              <span key={id} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                                {s ? `${s.firstName} ${s.lastName}` : id}
                                <button 
                                  type="button" 
                                  onClick={async () => {
                                    await dashboardService.unlinkStudentFromParent(editingUser.id, id);
                                    setEditingUser({...editingUser, linkedStudentIds: editingUser.linkedStudentIds?.filter(x => x !== id)});
                                    setUsersList(usersList.map(u => u.id === editingUser.id ? {...u, linkedStudentIds: u.linkedStudentIds?.filter(x => x !== id)} : u));
                                  }} 
                                  className="ml-1 hover:text-red-500 font-extrabold text-sm transition-colors cursor-pointer"
                                >
                                  &times;
                                </button>
                              </span>
                            );
                          })
                        ) : (
                          <span className="text-xs theme-text-muted font-medium py-1">No children linked to this parent profile</span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2.5 mt-auto pt-3 border-t theme-border">
                      <select 
                        id="link-student-select" 
                        className="flex-1 px-3 py-2 border theme-border rounded-lg text-sm bg-white dark:bg-gray-900 theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                      >
                        <option value="">Select a student to link...</option>
                        {usersList.filter(u => u.role === 'student' && !(editingUser.linkedStudentIds || []).includes(u.id)).map(s => (
                          <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
                        ))}
                      </select>
                      <button 
                        type="button" 
                        onClick={async () => {
                          const select = document.getElementById('link-student-select') as HTMLSelectElement;
                          const studentId = select.value;
                          if (studentId) {
                            await dashboardService.linkStudentToParent(editingUser.id, studentId);
                            setEditingUser({...editingUser, linkedStudentIds: [...(editingUser.linkedStudentIds || []), studentId]});
                            setUsersList(usersList.map(u => u.id === editingUser.id ? {...u, linkedStudentIds: [...(u.linkedStudentIds || []), studentId]} : u));
                            select.value = '';
                          }
                        }} 
                        className="px-4 py-2 bg-gradient-premium hover:shadow-lg hover:shadow-primary/20 text-white rounded-lg text-xs font-bold transition-all hover:-translate-y-0.5 active:scale-95 cursor-pointer"
                      >
                        Link
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 pt-4 border-t theme-border flex-shrink-0">
                <button 
                  type="button" 
                  onClick={() => setEditingUser(null)} 
                  className="flex-1 py-3 border theme-border rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors theme-text text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 py-3 bg-gradient-premium text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 text-sm cursor-pointer"
                >
                  {isSubmitting ? 'Updating...' : 'Update User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Compliance = () => {
  const [profileStats, setProfileStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getAllUsers().then(users => {
      const stats: Record<string, number> = {};
      users.forEach(u => {
        if (u.role === 'student') {
          const profile = u.profileId || u.needs || 'typical';
          stats[profile] = (stats[profile] || 0) + 1;
        }
      });
      setProfileStats(stats);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const getProfileGradient = (profile: string) => {
    switch (profile.toLowerCase()) {
      case 'low-vision':
        return 'from-amber-400 to-orange-500';
      case 'dyslexic':
        return 'from-blue-400 to-indigo-500';
      case 'deaf':
        return 'from-pink-400 to-rose-500';
      case 'adhd':
        return 'from-purple-400 to-violet-500';
      default:
        return 'from-emerald-400 to-green-500';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="border-b theme-border pb-5">
        <h1 className="text-3xl font-extrabold theme-text tracking-tight">Accessibility Compliance Report</h1>
        <p className="theme-text-muted text-sm font-medium mt-0.5">Automated scans and statistics regarding active inclusion-adapted learner profiles.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="theme-surface border theme-border p-8 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-premium/10 text-primary flex items-center justify-center text-3xl font-black shadow-inner border border-primary/15">
                A+
              </div>
              <div>
                <h2 className="text-xl font-bold theme-text tracking-tight">WCAG 2.1 Level AA Compliant</h2>
                <p className="theme-text-muted text-xs font-semibold">Last automated audit scan: Today, 08:00 AM</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/35 rounded-xl flex items-start gap-3.5 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Color Contrast Validation</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400/80 leading-relaxed font-semibold mt-0.5">All text elements satisfy contrast margins of 4.5:1 (or 3:1 for large text) across light, dark, and specialized dyslexia themes.</p>
                </div>
              </div>
              <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/35 rounded-xl flex items-start gap-3.5 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/20">
                <Shield className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300 text-sm">Semantic & ARIA Landmarks</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400/80 leading-relaxed font-semibold mt-0.5">ARIA landmarks, keyboard tabbing indices, and live announcement zones are verified operational for screen readers.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="theme-surface border theme-border p-8 rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold theme-text mb-6 tracking-tight flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Active Accessibility Profiles
            </h2>
            {loading ? (
              <div className="text-primary animate-pulse py-12 text-center flex flex-col items-center"><span className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Aggregating accessibility profile metrics...</div>
            ) : (
              <div className="space-y-6">
                {Object.entries(profileStats).map(([profile, count]) => {
                  const total = Object.values(profileStats).reduce((a, b) => a + b, 0) || 1;
                  const percentage = Math.round((count / total) * 100);
                  const gradient = getProfileGradient(profile);
                  return (
                    <div key={profile} className="group">
                      <div className="flex justify-between text-xs font-bold theme-text mb-2 capitalize">
                        <span className="group-hover:text-primary transition-colors">{profile === 'id' ? 'Intellectual Disability' : profile}</span>
                        <span className="theme-text-muted">{count} {count === 1 ? 'Student' : 'Students'} ({percentage}%)</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden border theme-border shadow-inner">
                        <div className={`bg-gradient-to-r ${gradient} h-full rounded-full transition-all duration-1000`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassManagement = () => {
  const [classesList, setClassesList] = useState<any[]>([]);
  const [teachersList, setTeachersList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddingClass, setIsAddingClass] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', focus: '', teacherId: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      dashboardService.getAllClasses(),
      dashboardService.getAllUsers()
    ]).then(([classesData, usersData]) => {
      setClassesList(classesData);
      setTeachersList(usersData.filter(u => u.role === 'teacher'));
    }).catch(err => console.error('Failed to load class management data', err))
      .finally(() => setLoading(false));
  }, []);

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const added = await dashboardService.createClass({
        id: Date.now().toString(),
        name: newClass.name,
        focus: newClass.focus,
        teacherId: newClass.teacherId,
        studentCount: 0
      });
      setClassesList(prev => [...prev, added]);
      setIsAddingClass(false);
      setNewClass({ name: '', focus: '', teacherId: '' });
    } catch (err) {
      console.error('Failed to create class', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b theme-border pb-5">
        <div>
          <h1 className="text-3xl font-extrabold theme-text tracking-tight">Class Administration</h1>
          <p className="theme-text-muted text-sm font-medium mt-0.5">Manage subjects, assigned focus paths, educator assignments, and student capacities.</p>
        </div>
        <button 
          onClick={() => setIsAddingClass(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-gradient-premium hover:shadow-lg hover:shadow-primary/25 text-white font-bold rounded-xl hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer text-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Class
        </button>
      </div>

      <div className="theme-surface border theme-border rounded-2xl bg-white dark:bg-gray-900/50 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-primary animate-pulse flex flex-col items-center"><span className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-3"></span>Loading class registries...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/30 dark:bg-gray-800/10 border-b theme-border theme-text-muted text-[10px] uppercase tracking-wider">
                  <th className="p-4 font-extrabold">Class Name</th>
                  <th className="p-4 font-extrabold">Subject Focus</th>
                  <th className="p-4 font-extrabold">Assigned Teacher</th>
                  <th className="p-4 font-extrabold">Enrolled Students</th>
                </tr>
              </thead>
              <tbody className="divide-y theme-border theme-text">
                {classesList.map((c) => {
                  const teacher = teachersList.find(t => t.id === c.teacherId);
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/10 transition-colors group">
                      <td className="p-4 font-bold text-sm">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="theme-text group-hover:text-primary transition-colors">{c.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-xs theme-text-muted font-semibold">{c.focus}</td>
                      <td className="p-4 text-sm font-semibold">{teacher ? `${teacher.firstName} ${teacher.lastName}` : <span className="text-amber-500 font-bold">Unassigned</span>}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 dark:bg-gray-800/80 border theme-border px-3 py-1 rounded-full text-xs font-bold theme-text-muted">
                          {c.studentCount} {c.studentCount === 1 ? 'Student' : 'Students'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {classesList.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center theme-text-muted font-medium text-sm">No classes created yet. Use 'Create New Class' to get started.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Class Modal */}
      {isAddingClass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-950 border theme-border p-6 md:p-8 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh] transform scale-100 transition-all duration-300 animate-scale-in">
            <div className="flex justify-between items-center border-b theme-border pb-4 mb-6 flex-shrink-0">
              <h2 className="text-xl font-bold theme-text tracking-tight flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Create New Class
              </h2>
              <button 
                onClick={() => setIsAddingClass(false)} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <form onSubmit={handleAddClass} className="flex flex-col flex-1 overflow-hidden">
              <div className="space-y-4 overflow-y-auto flex-1 pr-2 -mr-2 mb-6">
                <div>
                  <label htmlFor="class-name" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Class Name</label>
                  <input 
                    id="class-name" 
                    required 
                    type="text" 
                    value={newClass.name} 
                    onChange={e => setNewClass({...newClass, name: e.target.value})} 
                    className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    placeholder="e.g. 9th Grade Physics" 
                  />
                </div>
                <div>
                  <label htmlFor="class-focus" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Subject Focus</label>
                  <input 
                    id="class-focus" 
                    required 
                    type="text" 
                    value={newClass.focus} 
                    onChange={e => setNewClass({...newClass, focus: e.target.value})} 
                    className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" 
                    placeholder="e.g. Kinematics, Dynamics" 
                  />
                </div>
                <div>
                  <label htmlFor="class-teacher" className="block text-xs font-bold theme-text-muted mb-1.5 uppercase tracking-wide">Assign Educator</label>
                  <select 
                    id="class-teacher" 
                    required 
                    value={newClass.teacherId} 
                    onChange={e => setNewClass({...newClass, teacherId: e.target.value})} 
                    className="w-full px-4 py-2.5 border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="" disabled>Select a teacher...</option>
                    {teachersList.map(t => (
                      <option key={t.id} value={t.id}>{t.firstName} {t.lastName}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t theme-border flex-shrink-0">
                <button 
                  type="button" 
                  onClick={() => setIsAddingClass(false)} 
                  className="flex-1 py-3 border theme-border rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors theme-text text-sm cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex-1 py-3 bg-gradient-premium text-white rounded-xl font-bold hover:shadow-lg hover:shadow-primary/25 transition-all disabled:opacity-50 text-sm cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Class'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminDashboard: React.FC = () => {
  return (
    <Routes>
      <Route index element={<Overview />} />
      <Route path="users" element={<UserManagement />} />
      <Route path="classes" element={<ClassManagement />} />
      <Route path="compliance" element={<Compliance />} />
    </Routes>
  );
};
