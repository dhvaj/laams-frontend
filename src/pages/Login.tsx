import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogIn, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    if (!email) {
      setError('Enter your email address first, then request a reset link.');
      return;
    }
    setResetSent(true);
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
          Sign in to your account
        </h1>
        <p className="mt-2 text-center text-sm theme-text-muted">
          Or{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">
            register a new student account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="glass-panel py-8 px-4 shadow-2xl border border-white/20 sm:rounded-2xl sm:px-10 transition-all duration-300">
          
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900/50 text-center font-medium">
              {error}
            </div>
          )}

          {resetSent && (
            <div className="mb-4 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-300 p-3 rounded-lg text-sm border border-green-200 dark:border-green-900/50 text-center font-medium">
              Password reset instructions were sent to {email}.
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                />
              </div>
            </div>

            <div className="focus-glow rounded-xl border theme-border transition-all">
              <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm theme-text-muted font-medium select-none cursor-pointer">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button type="button" onClick={handleForgotPassword} className="font-semibold text-primary hover:underline">
                  Forgot your password?
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" fullWidth className="gap-2 py-3" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                ) : (
                  <LogIn className="w-5 h-5" aria-hidden="true" />
                )}
                {isSubmitting ? 'Signing in...' : 'Sign in'}
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
