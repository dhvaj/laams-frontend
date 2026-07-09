import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, UserPlus, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const userData = {
      username: formData.get('username') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: role,
      profileId: role === 'student' ? (formData.get('disability') as string) : undefined
    };

    if (userData.password !== formData.get('confirmPassword')) {
      setError('Passwords do not match');
      setIsSubmitting(false);
      return;
    }

    try {
      await register(userData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main id="main-content" className="min-h-screen theme-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-300 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link to="/" className="flex items-center justify-center gap-2 mb-6 hover:opacity-80 transition-opacity">
          <BookOpen className="w-10 h-10 text-primary" aria-hidden="true" />
          <span className="text-3xl font-extrabold theme-text">LAAMS</span>
        </Link>
        <h1 className="text-center text-3xl font-extrabold theme-text tracking-tight">
          Create an account
        </h1>
        <p className="mt-2 text-center text-sm theme-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="glass-panel py-8 px-4 shadow-2xl border border-white/20 sm:rounded-2xl sm:px-10 transition-colors duration-300">
          
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900/50 text-center font-medium">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    placeholder="John"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                  />
                </div>
              </div>

              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    placeholder="Doe"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="focus-glow rounded-xl border theme-border transition-all">
              <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                <label htmlFor="username" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  placeholder="johndoe"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                />
              </div>
            </div>

            <div className="focus-glow rounded-xl border theme-border transition-all">
              <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="john@school.edu"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                  />
                </div>
              </div>

              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t theme-border">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Account Type
              </label>
              <div className="flex gap-6 px-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="role" 
                    value="student" 
                    checked={role === 'student'} 
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span className="theme-text font-semibold text-sm">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="role" 
                    value="parent" 
                    checked={role === 'parent'} 
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span className="theme-text font-semibold text-sm">Parent / Guardian</span>
                </label>
              </div>
            </div>

            {role === 'student' && (
              <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 animate-scale-up">
                <label htmlFor="disability" className="block text-sm font-bold theme-text mb-1">
                  Accessibility Profile (Mandatory for Students)
                </label>
                <p id="profile-help" className="text-xs theme-text-muted mb-3">
                  This helps LAAMS adapt learning content to best fit your needs.
                </p>
                <select
                  id="disability"
                  name="disability"
                  required
                  aria-describedby="profile-help"
                  className="block w-full px-3 py-2 text-sm theme-border rounded-lg bg-transparent theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="" disabled selected>Select a profile...</option>
                  <option value="typical">Typical</option>
                  <option value="blind">Blind / Screen Reader</option>
                  <option value="low-vision">Low Vision</option>
                  <option value="deaf">Deaf / Hard of Hearing</option>
                  <option value="dyslexic">Dyslexic</option>
                  <option value="id">Intellectual Disability (ID)</option>
                  <option value="adhd-autism">ADHD / Autism</option>
                </select>
              </div>
            )}

            <div className="pt-2">
              <Button type="submit" fullWidth className="gap-2 py-3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                ) : (
                  <UserPlus className="w-5 h-5" aria-hidden="true" />
                )}
                {isSubmitting ? 'Registering...' : 'Register'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Link to="/" className="flex items-center justify-center gap-2 text-sm theme-text-muted hover:text-primary transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};
