import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, User, ArrowRight, Loader2 } from 'lucide-react';
import { AccessibilityControls } from '../components/ui/AccessibilityControls';
import { useAuth } from '../contexts/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await login(email, password);
      if (res && res.requirePasswordSetup) {
        navigate('/login', { state: { email, requirePasswordSetup: true, userId: res.userId } });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col theme-bg theme-text transition-colors duration-300">
      {/* Header */}
      <header className="theme-header-bg border-b theme-border shadow-sm py-4 px-6 flex flex-wrap gap-4 justify-between items-center transition-colors duration-300">
        <div className="flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
          <span className="text-2xl font-bold">LAAMS</span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          
          <AccessibilityControls />
          
          <nav className="hidden lg:flex gap-6 mx-4">
            <a href="#about" className="theme-text-muted hover:text-primary transition-colors font-medium">About</a>
            <a href="#features" className="theme-text-muted hover:text-primary transition-colors font-medium">Features</a>
          </nav>
          
          <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 font-medium transition-colors">
            <User className="w-4 h-4" />
            <span>Login</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main id="main-content" className="flex-1 relative overflow-hidden flex items-center">
        {/* Animated Background blobs for premium aesthetic */}
        <div className="absolute top-1/4 left-1/10 w-72 h-72 rounded-full bg-primary/10 blur-3xl animate-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
          
          <div className="flex flex-col gap-6">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-tight">
              Learning Without <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">Barriers</span>
            </h1>
            <p className="text-lg md:text-xl theme-text-muted leading-relaxed">
              An inclusive, adaptive, and accessible digital learning platform, designed to support Children with Special Needs (CWSN) through intelligent content personalization.
            </p>
            
            <div className="flex gap-4 mt-4">
              <Link to="/register" className="flex items-center justify-center gap-3 px-7 py-3.5 rounded-xl bg-gradient-premium text-white font-bold hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                <span>Start Learning <span className="sr-only">on LAAMS platform</span></span>
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
          
          {/* Premium Glass Login Panel */}
          <div className="glass-panel rounded-2xl shadow-2xl p-8 border border-white/20 relative overflow-hidden transition-all duration-300 hover:shadow-primary/5">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Welcome Back</h2>
              <div className="w-12 h-12 bg-gradient-premium rounded-xl flex items-center justify-center text-white shadow-md shadow-primary/20" aria-hidden="true">
                <User className="w-6 h-6" />
              </div>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900/50 text-center font-medium">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-3 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1" htmlFor="username">Email or Username</label>
                  <input 
                    type="email" 
                    id="username" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>
              
              <div className="focus-glow rounded-xl border theme-border transition-all">
                <div className="px-4 py-3 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                  <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-1" htmlFor="password">Password</label>
                  <input 
                    type="password" 
                    id="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm px-1">
                <label htmlFor="remember-me-landing" className="flex items-center gap-2 cursor-pointer select-none">
                  <input id="remember-me-landing" type="checkbox" className="rounded text-primary focus:ring-primary bg-transparent border-gray-300 w-4 h-4 cursor-pointer" />
                  <span className="theme-text-muted font-medium">Remember me</span>
                </label>
                <a href="#" className="text-primary hover:underline font-semibold">Forgot password?</a>
              </div>
              
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="mt-4 w-full py-3.5 bg-gradient-premium text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    <span>Signing In...</span>
                  </>
                ) : (
                  <span>Sign In</span>
                )}
              </button>
            </form>
            
            <p className="mt-6 text-center text-sm theme-text-muted">
              Don't have an account? <Link to="/register" className="text-primary font-semibold hover:underline">Register here (Students)</Link>
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="theme-surface border-t theme-border py-8 px-6 mt-auto transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 theme-text-muted">
            <BookOpen className="w-5 h-5" aria-hidden="true" />
            <span className="font-semibold">LAAMS Platform</span>
          </div>
          <p className="text-sm theme-text-muted">© 2026 LAAMS. All rights reserved. WCAG Compliant.</p>
        </div>
      </footer>
    </div>
  );
};
