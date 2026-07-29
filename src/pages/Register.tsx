import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, UserPlus, Loader2, ArrowRight, Check, GraduationCap, Users, Sparkles, Shield, Sliders, CheckSquare, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { t, i18n } = useTranslation();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

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

  // Common Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Student Fields
  const [gradeLevel, setGradeLevel] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [udiseCode, setUdiseCode] = useState('');
  const [apparNumber, setApparNumber] = useState('');
  const [specialNeed, setSpecialNeed] = useState('');
  const [otherNeedText, setOtherNeedText] = useState('');

  // Parent Fields (for Student registration)
  const [parentName, setParentName] = useState('');
  const [parentMobile, setParentMobile] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [parentPassword, setParentPassword] = useState('');
  const [parentConfirmPassword, setParentConfirmPassword] = useState('');

  // Teacher Fields
  const [subjectsTaught, setSubjectsTaught] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [organization, setOrganization] = useState('');
  const [cwsnExperience, setCwsnExperience] = useState<boolean>(false);
  const [workedDisabilities, setWorkedDisabilities] = useState<string[]>([]);
  const [teacherHasDisability, setTeacherHasDisability] = useState<boolean>(false);
  const [teacherDisabilityType, setTeacherDisabilityType] = useState('');
  const [address, setAddress] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');

  // Accessibility screen reader announcement state
  const [srAnnouncement, setSrAnnouncement] = useState('');

  // Accessibility screen reader focus and speech management
  useEffect(() => {
    let announcement = '';
    if (step === 1) {
      announcement = 'Step 1 of 3: Select account type. Student role card focused. Use left and right arrow keys to switch.';
    } else if (step === 2) {
      announcement = role === 'student' 
        ? 'Step 2 of 3: Education and Special Needs. Grade selection dropdown focused.' 
        : 'Step 2 of 3: Professional Information. Subjects taught field focused.';
    } else if (step === 3) {
      announcement = role === 'student' 
        ? 'Step 3 of 3: Parent or Guardian Account. Parent name field focused.' 
        : 'Step 3 of 3: Contact and Health details. Disability declaration section focused.';
    }
    
    setSrAnnouncement(announcement);

    const focusTimeout = setTimeout(() => {
      let element: HTMLElement | null = null;
      if (step === 1) {
        element = document.getElementById('role-student');
      } else if (step === 2) {
        element = role === 'student' ? document.getElementById('gradeLevel') : document.getElementById('subjectsTaught');
      } else if (step === 3) {
        element = role === 'student' ? document.getElementById('parentName') : document.getElementById('address');
      }
      
      if (element) {
        element.focus();
      }
    }, 450);

    return () => clearTimeout(focusTimeout);
  }, [step, role]);

  const disabilitiesList = [
    { value: 'blind', label: 'Visual Impairment / Blindness' },
    { value: 'low-vision', label: 'Low Vision' },
    { value: 'deaf', label: 'Hearing Impairment' },
    { value: 'speech', label: 'Speech & Language Disability' },
    { value: 'id', label: 'Intellectual Disability' },
    { value: 'asd', label: 'Autism Spectrum Disorder (ASD)' },
    { value: 'cerebral-palsy', label: 'Cerebral Palsy' },
    { value: 'learning', label: 'Learning Disability' },
    { value: 'dyslexic', label: 'Dyslexia' },
    { value: 'dysgraphia', label: 'Dysgraphia' },
    { value: 'dyscalculia', label: 'Dyscalculia' },
    { value: 'multiple', label: 'Multiple Disabilities' },
    { value: 'other', label: 'Other (Specify)' }
  ];

  const handleDisabilityCheckboxChange = (value: string) => {
    if (workedDisabilities.includes(value)) {
      setWorkedDisabilities(workedDisabilities.filter(d => d !== value));
    } else {
      setWorkedDisabilities([...workedDisabilities, value]);
    }
  };

  const validateStep = () => {
    setError('');
    if (step === 1) {
      if (!firstName || !lastName || !mobile || !password || !confirmPassword) {
        setError('Please fill in all required fields.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return false;
      }
      if (role === 'teacher' && !email) {
        setError('Email address is required for teachers.');
        return false;
      }
    } else if (step === 2) {
      if (role === 'student') {
        if (!gradeLevel || !specialNeed) {
          setError('Class/Grade and Special Needs selection are required.');
          return false;
        }
        if (specialNeed === 'other' && !otherNeedText.trim()) {
          setError('Please specify your special need details.');
          return false;
        }
      } else if (role === 'teacher') {
        if (!subjectsTaught || !organization) {
          setError('Subjects Taught and Current Organization are required.');
          return false;
        }
      }
    } else if (step === 3) {
      if (role === 'student') {
        if (!parentName || !parentMobile || !parentPassword || !parentConfirmPassword) {
          setError('Parent/Guardian details are required for student accounts.');
          return false;
        }
        if (parentPassword !== parentConfirmPassword) {
          setError('Parent passwords do not match.');
          return false;
        }
        if (parentPassword.length < 6) {
          setError('Parent password must be at least 6 characters.');
          return false;
        }
      } else if (role === 'teacher') {
        if (!address || !emergencyContact) {
          setError('Address and Emergency Contact Number are required.');
          return false;
        }
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setError('');
    setStep(prev => prev - 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError('');

    const userData: any = {
      firstName,
      lastName,
      email,
      mobile,
      password,
      role,
      username: email ? email.split('@')[0] : `user_${mobile}`,
      preferredLanguage: i18n.language
    };

    if (role === 'student') {
      userData.gradeLevel = gradeLevel;
      userData.schoolName = schoolName;
      userData.udiseCode = udiseCode;
      userData.apparNumber = apparNumber;
      userData.profileId = specialNeed;
      if (specialNeed === 'other') {
        userData.otherNeedDetails = otherNeedText;
      }
      userData.parentName = parentName;
      userData.parentMobile = parentMobile;
      userData.parentEmail = parentEmail;
      userData.parentPassword = parentPassword;
    } else {
      userData.subjectsTaught = subjectsTaught.split(',').map(s => s.trim());
      userData.specialization = specialization;
      userData.organization = organization;
      userData.cwsnExperience = cwsnExperience;
      userData.workedDisabilities = workedDisabilities;
      userData.hasDisability = teacherHasDisability;
      if (teacherHasDisability) {
        userData.disabilityType = teacherDisabilityType;
      }
      userData.address = address;
      userData.emergencyContact = emergencyContact;
    }

    try {
      await register(userData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex transition-colors duration-300 theme-bg relative overflow-hidden">
      {/* Offscreen assertive announcer for screen readers */}
      <div className="sr-only" aria-live="assertive" role="status">
        {srAnnouncement}
      </div>

      {/* LEFT PANEL: Branding & Onboarding Graphics */}
      <section className="hidden lg:flex w-5/12 bg-gradient-to-tr from-gray-950 via-slate-900 to-indigo-950 text-white p-12 flex-col justify-between relative overflow-hidden select-none border-r border-white/5 shadow-2xl">
        {/* Glow blobs in left panel */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full bg-primary/20 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full bg-indigo-500/20 blur-[100px]"></div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 hover:opacity-85 transition-opacity">
            <BookOpen className="w-10 h-10 text-primary" aria-hidden="true" />
            <span className="text-3xl font-extrabold tracking-tight">LAAMS</span>
          </Link>
        </div>

        <div className="my-auto space-y-8 relative z-10">
          <div className="space-y-4">
            <span className="px-3 py-1 bg-primary/10 border border-primary/25 rounded-full text-xs font-bold text-primary inline-flex items-center gap-1.5 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Inclusive Learning
            </span>
            <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight tracking-tight">
              Personalized Education, <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-400">Without Boundaries</span>
            </h2>
            <p className="text-slate-400 text-sm xl:text-base leading-relaxed max-w-md">
              LAAMS adapts content formats, spacing, and interaction parameters based on each student's unique accessibility profile.
            </p>
          </div>

          {/* Interactive Feature Pills */}
          <div className="space-y-3.5">
            <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
              <Shield className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Strict compliance</h4>
                <p className="text-xs text-slate-400 mt-0.5">Built according to WCAG 2.1 & CWSN guidelines</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
              <Sliders className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Dynamic personalization</h4>
                <p className="text-xs text-slate-400 mt-0.5">Adaptable fonts, layouts, audio cues, and spacing</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 bg-white/5 border border-white/10 p-3.5 rounded-2xl backdrop-blur-md">
              <CheckSquare className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h4 className="font-bold text-sm">Linked Parent Portal</h4>
                <p className="text-xs text-slate-400 mt-0.5">Easy review of child's learning metrics & reports</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs text-slate-500 font-medium">
          © {new Date().getFullYear()} LAAMS Adaptive LMS. All Rights Reserved.
        </div>
      </section>

      {/* RIGHT PANEL: Spacious Form Area */}
      <section className="w-full lg:w-7/12 flex flex-col justify-center py-12 px-6 sm:px-12 xl:px-20 overflow-y-auto max-h-screen relative z-10 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/40 dark:from-slate-950 dark:via-slate-900/90 dark:to-indigo-950/40">
        
        {/* Floating Language Switcher */}
        <div className="absolute top-6 right-6 sm:right-12 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border theme-border rounded-xl shadow-sm">
            <Globe className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
            <select
              value={i18n.language}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              className="bg-transparent text-xs font-bold theme-text focus:outline-none cursor-pointer border-none p-0 pr-6"
              aria-label="Select System Language"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code} className="theme-text bg-white dark:bg-slate-900">
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Glow blobs for background aesthetic (visible on mobile too) */}
        <div className="absolute top-[10%] right-[-5%] w-96 h-96 rounded-full bg-primary/5 dark:bg-primary/10 blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-[10%] left-[-5%] w-96 h-96 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

        <div className="max-w-xl w-full mx-auto space-y-8 relative z-10">
          
          {/* Header Mobile Logo & Titles */}
          <div className="space-y-2">
            <div className="lg:hidden flex items-center gap-2 mb-4 justify-center">
              <BookOpen className="w-8 h-8 text-primary" aria-hidden="true" />
              <span className="text-2xl font-bold theme-text">LAAMS</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-center lg:text-left bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600 dark:from-primary dark:to-indigo-400">
              Create Your Account
            </h2>
            <p className="text-sm theme-text-muted text-center lg:text-left">
              Already registered?{' '}
              <Link to="/login" className="font-semibold text-primary hover:underline">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Stepper Progress bar */}
          <div className="flex justify-between items-center bg-white/70 dark:bg-slate-900/60 border border-gray-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm backdrop-blur-md">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                    step === num 
                      ? 'bg-primary text-white ring-4 ring-primary/20 scale-105 shadow-sm' 
                      : step > num 
                        ? 'bg-green-500 text-white' 
                        : 'bg-slate-50 dark:bg-slate-800 theme-text-muted border border-gray-200 dark:border-slate-750'
                  }`}>
                    {step > num ? <Check className="w-4 h-4" /> : num}
                  </div>
                  <span className={`hidden sm:inline text-xs font-bold uppercase tracking-wider ${step === num ? 'theme-text' : 'theme-text-muted'}`}>
                    {num === 1 ? 'Details' : num === 2 ? 'Profile' : 'Verify'}
                  </span>
                </div>
                {num < 3 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-2 rounded-full transition-all duration-500 ${
                    step > num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400 p-4 rounded-2xl text-sm font-semibold shadow-sm animate-scale-up text-center">
              {error}
            </div>
          )}

          <div className="glass-panel p-8 sm:p-10 shadow-[0_20px_50px_rgba(170,59,255,0.05)] dark:shadow-[0_30px_70px_rgba(0,0,0,0.35)] border border-white/40 dark:border-white/5 rounded-3xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70">
            <form onSubmit={handleRegister} className="space-y-6">
              
              {/* STEP 1: Basic Information */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Premium Interactive Role Selection Cards */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-3.5">
                      Account Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button
                        id="role-student"
                        type="button"
                        role="radio"
                        aria-checked={role === 'student'}
                        onClick={() => setRole('student')}
                        className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                          role === 'student'
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/30 scale-[1.01] shadow-sm'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950'
                        }`}
                      >
                        <GraduationCap className={`w-8 h-8 flex-shrink-0 ${role === 'student' ? 'text-primary' : 'theme-text-muted'}`} />
                        <div>
                          <span className="theme-text font-extrabold text-sm block">Student</span>
                          <span className="text-[10px] theme-text-muted mt-0.5 block">Adaptive learning dashboard</span>
                        </div>
                      </button>
                      
                      <button
                        id="role-teacher"
                        type="button"
                        role="radio"
                        aria-checked={role === 'teacher'}
                        onClick={() => setRole('teacher')}
                        className={`flex items-center gap-3.5 p-4 rounded-xl border text-left transition-all duration-300 cursor-pointer ${
                          role === 'teacher'
                            ? 'border-primary bg-primary/5 dark:bg-primary/10 ring-2 ring-primary/30 scale-[1.01] shadow-sm'
                            : 'border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-950'
                        }`}
                      >
                        <Users className={`w-8 h-8 flex-shrink-0 ${role === 'teacher' ? 'text-primary' : 'theme-text-muted'}`} />
                        <div>
                          <span className="theme-text font-extrabold text-sm block">Teacher</span>
                          <span className="text-[10px] theme-text-muted mt-0.5 block">Reports & compliance logs</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t theme-border pt-5">
                    <div className="space-y-1.5">
                      <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Email Address {role === 'student' ? '(Optional)' : <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@school.edu"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Confirm Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Education / Special Needs (STUDENT) */}
              {step === 2 && role === 'student' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold theme-text border-b theme-border pb-2.5">Education & Accessibility</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="gradeLevel" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Class / Grade <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="gradeLevel"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-350"
                      >
                        <option value="" disabled className="dark:bg-gray-900">Select Grade...</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                          <option key={grade} value={grade.toString()} className="dark:bg-gray-900">Grade {grade}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="schoolName" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        School / College Name
                      </label>
                      <input
                        id="schoolName"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Central High School"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="udiseCode" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        School UDISE Code
                      </label>
                      <input
                        id="udiseCode"
                        type="text"
                        value={udiseCode}
                        onChange={(e) => setUdiseCode(e.target.value)}
                        placeholder="27220100101"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="apparNumber" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Student APAAR Number (Optional)
                      </label>
                      <input
                        id="apparNumber"
                        type="text"
                        value={apparNumber}
                        onChange={(e) => setApparNumber(e.target.value)}
                        placeholder="12-digit number"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
                    <div className="space-y-1">
                      <label htmlFor="disability" className="block text-sm font-extrabold theme-text">
                        Accessibility Adaptations <span className="text-red-500">*</span>
                      </label>
                      <p className="text-xs theme-text-muted">
                        Select your profile to automatically personalize layouts and interaction spacing.
                      </p>
                    </div>
                    <select
                      id="disability"
                      value={specialNeed}
                      onChange={(e) => setSpecialNeed(e.target.value)}
                      className="block w-full px-4 py-3 text-sm theme-border rounded-xl bg-white dark:bg-slate-900 theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="" disabled className="dark:bg-gray-900">Select profile...</option>
                      <option value="typical" className="dark:bg-gray-900">Typical Learning Profile</option>
                      {disabilitiesList.slice(0, -1).map(d => (
                        <option key={d.value} value={d.value} className="dark:bg-gray-900">{d.label}</option>
                      ))}
                      <option value="other" className="dark:bg-gray-900">Other (Detail below)</option>
                    </select>

                    {specialNeed === 'other' && (
                      <div className="mt-4 animate-scale-up space-y-2">
                        <label htmlFor="otherNeedText" className="block text-xs font-bold uppercase tracking-wider text-primary">
                          Accommodations description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="otherNeedText"
                          value={otherNeedText}
                          onChange={(e) => setOtherNeedText(e.target.value)}
                          rows={3}
                          className="block w-full px-4 py-3 text-sm theme-border rounded-xl bg-white dark:bg-slate-900 theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          placeholder="Detail specific accessibility tools or adaptations needed..."
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 2: Professional Details (TEACHER) */}
              {step === 2 && role === 'teacher' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold theme-text border-b theme-border pb-2.5">Professional Information</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="subjectsTaught" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Subjects Taught <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="subjectsTaught"
                        type="text"
                        value={subjectsTaught}
                        onChange={(e) => setSubjectsTaught(e.target.value)}
                        placeholder="Science, History"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="specialization" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Specialization
                      </label>
                      <input
                        id="specialization"
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Inclusive STEM, Special Ed"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-255 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Current School / Organization <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="organization"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="St. Mary's School"
                      className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-0.5">
                        <label className="block text-sm font-extrabold theme-text">
                          Accessibility & Inclusion Experience
                        </label>
                        <span className="text-xs theme-text-muted">Do you have experience with CWSN students?</span>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="cwsnExperience" 
                            checked={cwsnExperience === true}
                            onChange={() => setCwsnExperience(true)}
                            className="text-primary w-4 h-4 cursor-pointer" 
                          />
                          <span className="theme-text text-sm font-semibold">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="cwsnExperience" 
                            checked={cwsnExperience === false}
                            onChange={() => setCwsnExperience(false)}
                            className="text-primary w-4 h-4 cursor-pointer" 
                          />
                          <span className="theme-text text-sm font-semibold">No</span>
                        </label>
                      </div>
                    </div>

                    {cwsnExperience && (
                      <div className="animate-scale-up pt-4 border-t theme-border space-y-3">
                        <span className="block text-xs font-bold uppercase tracking-wider text-primary">
                          Disabilities Worked With (Select all that apply)
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                          {disabilitiesList.slice(0, -1).map(d => (
                            <label key={d.value} className="flex items-center gap-3 text-sm theme-text cursor-pointer select-none">
                              <input 
                                type="checkbox"
                                checked={workedDisabilities.includes(d.value)}
                                onChange={() => handleDisabilityCheckboxChange(d.value)}
                                className="rounded text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                              />
                              {d.label}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Parent / Guardian Account Info (STUDENT) */}
              {step === 3 && role === 'student' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold theme-text border-b theme-border pb-2.5">Parent / Guardian Portal Account</h3>
                  <p className="text-xs theme-text-muted mb-4">
                    Define credentials for your Parent/Guardian. They will get a linked log-in to view reports, adaptive progress, and course activities.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="parentName" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Parent / Guardian Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Sarah Doe"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="parentMobile" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Parent Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="parentMobile"
                        type="tel"
                        value={parentMobile}
                        onChange={(e) => setParentMobile(e.target.value)}
                        placeholder="9876543211"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="parentEmail" className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Parent Email Address (Optional but recommended)
                    </label>
                    <input
                      id="parentEmail"
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@home.com"
                      className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="parentPassword" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Parent Account Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="parentPassword"
                        type="password"
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="parentConfirmPassword" className="block text-xs font-bold uppercase tracking-wider text-primary">
                        Confirm Parent Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="parentConfirmPassword"
                        type="password"
                        value={parentConfirmPassword}
                        onChange={(e) => setParentConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-200"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Disability Info (TEACHER) */}
              {step === 3 && role === 'teacher' && (
                <div className="space-y-6 animate-fade-in">
                  <h3 className="text-lg font-bold theme-text border-b theme-border pb-2.5">Contact Details & Accommodations</h3>

                  <div className="bg-primary/5 p-5 rounded-2xl border border-primary/20 space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                      <div className="space-y-0.5">
                        <label className="block text-sm font-extrabold theme-text">
                          Personal Accommodations
                        </label>
                        <span className="text-xs theme-text-muted">Do you have a personal disability/special need?</span>
                      </div>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="teacherHasDisability" 
                            checked={teacherHasDisability === true}
                            onChange={() => setTeacherHasDisability(true)}
                            className="text-primary w-4 h-4 cursor-pointer" 
                          />
                          <span className="theme-text text-sm font-semibold">Yes</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input 
                            type="radio" 
                            name="teacherHasDisability" 
                            checked={teacherHasDisability === false}
                            onChange={() => setTeacherHasDisability(false)}
                            className="text-primary w-4 h-4 cursor-pointer" 
                          />
                          <span className="theme-text text-sm font-semibold">No</span>
                        </label>
                      </div>
                    </div>

                    {teacherHasDisability && (
                      <div className="animate-scale-up pt-4 border-t theme-border space-y-2">
                        <label htmlFor="teacherDisabilityType" className="block text-xs font-bold uppercase tracking-wider text-primary">
                          Select Special Need Type
                        </label>
                        <select
                          id="teacherDisabilityType"
                          value={teacherDisabilityType}
                          onChange={(e) => setTeacherDisabilityType(e.target.value)}
                          className="block w-full px-4 py-3 text-sm theme-border rounded-xl bg-white dark:bg-slate-900 theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        >
                          <option value="" disabled className="dark:bg-gray-900">Select special need...</option>
                          {disabilitiesList.slice(0, -1).map(d => (
                            <option key={d.value} value={d.value} className="dark:bg-gray-900">{d.label}</option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Contact Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      placeholder="123 Teacher's Lane, City Center"
                      className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="emergencyContact" className="block text-xs font-bold uppercase tracking-wider text-primary">
                      Emergency Contact Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="emergencyContact"
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="9876543219"
                      className="w-full bg-white dark:bg-slate-900 border border-gray-250 dark:border-slate-800 rounded-xl px-4 py-3 theme-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all duration-300"
                    />
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-4 pt-5 border-t theme-border">
                {step > 1 && (
                  <Button type="button" variant="outline" className="flex-1 py-3 font-bold rounded-xl text-sm" onClick={prevStep}>
                    Back
                  </Button>
                )}
                
                {step < 3 ? (
                  <Button type="button" fullWidth={step === 1} className="flex-1 gap-2 py-3 font-bold rounded-xl text-sm" onClick={nextStep}>
                    Next Step
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button type="submit" className="flex-1 gap-2 py-3 font-bold rounded-xl text-sm" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    ) : (
                      <UserPlus className="w-5 h-5" aria-hidden="true" />
                    )}
                    {isSubmitting ? 'Registering...' : 'Register Account'}
                  </Button>
                )}
              </div>
            </form>
          </div>

          <div className="pt-4 flex justify-center">
            <Link to="/" className="flex items-center gap-2 text-sm theme-text-muted hover:text-primary transition-colors font-medium">
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              Back to home page
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
