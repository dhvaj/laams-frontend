import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, ArrowLeft, UserPlus, Loader2, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';


export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1);

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
          Create your account
        </h1>
        <p className="mt-2 text-center text-sm theme-text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl relative z-10">
        <div className="glass-panel py-8 px-4 shadow-2xl border border-white/20 sm:rounded-2xl sm:px-10 transition-colors duration-300">
          
          {/* Role selector at step 1 */}
          {step === 1 && (
            <div className="mb-6 pb-4 border-b theme-border flex flex-col items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary mb-3">
                Register as a
              </label>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="role" 
                    value="student" 
                    checked={role === 'student'} 
                    onChange={() => { setRole('student'); setStep(1); }}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span className="theme-text font-semibold text-sm">Student</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="radio" 
                    name="role" 
                    value="teacher" 
                    checked={role === 'teacher'} 
                    onChange={() => { setRole('teacher'); setStep(1); }}
                    className="text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                  />
                  <span className="theme-text font-semibold text-sm">Teacher</span>
                </label>
              </div>
            </div>
          )}

          {/* Stepper progress indicator */}
          <div className="flex justify-between items-center mb-8 px-4">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                  step === num 
                    ? 'bg-primary text-white ring-4 ring-primary/20' 
                    : step > num 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 dark:bg-gray-800 theme-text-muted'
                }`}>
                  {step > num ? <Check className="w-4 h-4" /> : num}
                </div>
                {num < 3 && (
                  <div className={`w-24 sm:w-36 h-1 mx-2 transition-all duration-300 ${
                    step > num ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-800'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {error && (
            <div className="mb-6 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm border border-red-200 dark:border-red-900/50 text-center font-medium">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleRegister}>
            
            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-bold theme-text border-b theme-border pb-2 mb-4">Basic Information</h3>
                
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="firstName" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        First Name (Required)
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="lastName" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Last Name (Required)
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Mobile Number (Required)
                      </label>
                      <input
                        id="mobile"
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="9876543210"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Email Address {role === 'student' ? '(Optional)' : '(Required)'}
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@school.edu"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Password (Required)
                      </label>
                      <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="confirmPassword" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Confirm Password (Required)
                      </label>
                      <input
                        id="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Education / Special Needs (STUDENT) */}
            {step === 2 && role === 'student' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-bold theme-text border-b theme-border pb-2 mb-4">Education & Special Needs</h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="gradeLevel" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Class / Grade (Required)
                      </label>
                      <select
                        id="gradeLevel"
                        value={gradeLevel}
                        onChange={(e) => setGradeLevel(e.target.value)}
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      >
                        <option value="" disabled className="dark:bg-gray-900">Select Grade...</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((grade) => (
                          <option key={grade} value={grade.toString()} className="dark:bg-gray-900">Grade {grade}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="schoolName" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        School / College Name
                      </label>
                      <input
                        id="schoolName"
                        type="text"
                        value={schoolName}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Central High School"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="udiseCode" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        School UDISE Code
                      </label>
                      <input
                        id="udiseCode"
                        type="text"
                        value={udiseCode}
                        onChange={(e) => setUdiseCode(e.target.value)}
                        placeholder="27220100101"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="apparNumber" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Student APAAR Number (Optional)
                      </label>
                      <input
                        id="apparNumber"
                        type="text"
                        value={apparNumber}
                        onChange={(e) => setApparNumber(e.target.value)}
                        placeholder="12-digit number"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20">
                  <label htmlFor="disability" className="block text-sm font-bold theme-text mb-1">
                    Accessibility Profile / Special Need (Required)
                  </label>
                  <p className="text-xs theme-text-muted mb-3">
                    LAAMS customizes learning modules based on your selection.
                  </p>
                  <select
                    id="disability"
                    value={specialNeed}
                    onChange={(e) => setSpecialNeed(e.target.value)}
                    className="block w-full px-3 py-2 text-sm theme-border rounded-lg bg-transparent theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option value="" disabled className="dark:bg-gray-900">Select special need profile...</option>
                    <option value="typical" className="dark:bg-gray-900">Typical Learning Profile</option>
                    {disabilitiesList.slice(0, -1).map(d => (
                      <option key={d.value} value={d.value} className="dark:bg-gray-900">{d.label}</option>
                    ))}
                    <option value="other" className="dark:bg-gray-900">Other (Specify Below)</option>
                  </select>

                  {specialNeed === 'other' && (
                    <div className="mt-4 animate-scale-up">
                      <label htmlFor="otherNeedText" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Describe Special Needs (Required)
                      </label>
                      <textarea
                        id="otherNeedText"
                        value={otherNeedText}
                        onChange={(e) => setOtherNeedText(e.target.value)}
                        rows={2}
                        className="block w-full px-3 py-2 text-sm theme-border rounded-lg bg-transparent theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50"
                        placeholder="Describe specific disability or accessibility accommodations needed..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Professional Details (TEACHER) */}
            {step === 2 && role === 'teacher' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-bold theme-text border-b theme-border pb-2 mb-4">Professional Information</h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="subjectsTaught" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Subjects Taught (Comma separated)
                      </label>
                      <input
                        id="subjectsTaught"
                        type="text"
                        value={subjectsTaught}
                        onChange={(e) => setSubjectsTaught(e.target.value)}
                        placeholder="Science, History"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="specialization" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Specialization
                      </label>
                      <input
                        id="specialization"
                        type="text"
                        value={specialization}
                        onChange={(e) => setSpecialization(e.target.value)}
                        placeholder="Inclusive Education, STEM"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label htmlFor="organization" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      Current School / Organization (Required)
                    </label>
                    <input
                      id="organization"
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="St. Mary's Public School"
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    />
                  </div>
                </div>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-4">
                  <div>
                    <label className="block text-sm font-bold theme-text mb-1">
                      Accessibility & Inclusion Experience
                    </label>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm theme-text-muted">Do you have experience with CWSN (Children with Special Needs)?</span>
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input 
                          type="radio" 
                          name="cwsnExperience" 
                          checked={cwsnExperience === true}
                          onChange={() => setCwsnExperience(true)}
                          className="text-primary w-4 h-4 cursor-pointer" 
                        />
                        <span className="theme-text text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input 
                          type="radio" 
                          name="cwsnExperience" 
                          checked={cwsnExperience === false}
                          onChange={() => setCwsnExperience(false)}
                          className="text-primary w-4 h-4 cursor-pointer" 
                        />
                        <span className="theme-text text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  {cwsnExperience && (
                    <div className="animate-scale-up pt-2">
                      <span className="block text-xs font-bold uppercase tracking-wider text-primary mb-2">
                        Disabilities Worked With (Multi-Select)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
                        {disabilitiesList.slice(0, -1).map(d => (
                          <label key={d.value} className="flex items-center gap-2 text-sm theme-text cursor-pointer select-none">
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
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-bold theme-text border-b theme-border pb-2 mb-2">Parent / Guardian Account</h3>
                <p className="text-xs theme-text-muted mb-4">
                  This details will create a linked Parent dashboard login so your parent can review notes, grades, and support needs.
                </p>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="parentName" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Parent / Guardian Name (Required)
                      </label>
                      <input
                        id="parentName"
                        type="text"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        placeholder="Sarah Doe"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="parentMobile" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Parent Mobile Number (Required)
                      </label>
                      <input
                        id="parentMobile"
                        type="tel"
                        value={parentMobile}
                        onChange={(e) => setParentMobile(e.target.value)}
                        placeholder="9876543211"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label htmlFor="parentEmail" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      Parent Email Address (Optional but recommended)
                    </label>
                    <input
                      id="parentEmail"
                      type="email"
                      value={parentEmail}
                      onChange={(e) => setParentEmail(e.target.value)}
                      placeholder="parent@home.com"
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="parentPassword" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Parent Account Password (Required)
                      </label>
                      <input
                        id="parentPassword"
                        type="password"
                        value={parentPassword}
                        onChange={(e) => setParentPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>

                  <div className="focus-glow rounded-xl border theme-border transition-all">
                    <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                      <label htmlFor="parentConfirmPassword" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Confirm Parent Password
                      </label>
                      <input
                        id="parentConfirmPassword"
                        type="password"
                        value={parentConfirmPassword}
                        onChange={(e) => setParentConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: Contact & Disability Info (TEACHER) */}
            {step === 3 && role === 'teacher' && (
              <div className="space-y-5 animate-fade-in">
                <h3 className="text-lg font-bold theme-text border-b theme-border pb-2 mb-4">Contact & Accommodation Information</h3>

                <div className="bg-primary/5 p-4 rounded-xl border border-primary/20 space-y-4">
                  <div>
                    <label className="block text-sm font-bold theme-text mb-1">
                      Personal Accommodations
                    </label>
                    <div className="flex gap-4 mt-2">
                      <span className="text-sm theme-text-muted">Do you have a personal disability/special need?</span>
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input 
                          type="radio" 
                          name="teacherHasDisability" 
                          checked={teacherHasDisability === true}
                          onChange={() => setTeacherHasDisability(true)}
                          className="text-primary w-4 h-4 cursor-pointer" 
                        />
                        <span className="theme-text text-sm">Yes</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer select-none">
                        <input 
                          type="radio" 
                          name="teacherHasDisability" 
                          checked={teacherHasDisability === false}
                          onChange={() => setTeacherHasDisability(false)}
                          className="text-primary w-4 h-4 cursor-pointer" 
                        />
                        <span className="theme-text text-sm">No</span>
                      </label>
                    </div>
                  </div>

                  {teacherHasDisability && (
                    <div className="animate-scale-up pt-2">
                      <label htmlFor="teacherDisabilityType" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                        Select Special Need Type
                      </label>
                      <select
                        id="teacherDisabilityType"
                        value={teacherDisabilityType}
                        onChange={(e) => setTeacherDisabilityType(e.target.value)}
                        className="block w-full px-3 py-2 text-sm theme-border rounded-lg bg-transparent theme-text border focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="" disabled className="dark:bg-gray-900">Select special need type...</option>
                        {disabilitiesList.slice(0, -1).map(d => (
                          <option key={d.value} value={d.value} className="dark:bg-gray-900">{d.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label htmlFor="address" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      Contact Address (Required)
                    </label>
                    <textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={2}
                      placeholder="123 Teacher's Lane, City Center"
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm resize-none"
                    />
                  </div>
                </div>

                <div className="focus-glow rounded-xl border theme-border transition-all">
                  <div className="px-4 py-2 bg-white/50 dark:bg-gray-950/20 rounded-xl">
                    <label htmlFor="emergencyContact" className="block text-xs font-bold uppercase tracking-wider text-primary mb-1">
                      Emergency Contact Number (Required)
                    </label>
                    <input
                      id="emergencyContact"
                      type="tel"
                      value={emergencyContact}
                      onChange={(e) => setEmergencyContact(e.target.value)}
                      placeholder="9876543219"
                      className="w-full bg-transparent border-none p-0 focus:ring-0 outline-none theme-text text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Form navigation buttons */}
            <div className="flex gap-4 pt-4 border-t theme-border">
              {step > 1 && (
                <Button type="button" variant="outline" className="flex-1 py-3" onClick={prevStep}>
                  Back
                </Button>
              )}
              
              {step < 3 ? (
                <Button type="button" fullWidth={step === 1} className="flex-1 gap-2 py-3" onClick={nextStep}>
                  Next Step
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button type="submit" className="flex-1 gap-2 py-3" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                  ) : (
                    <UserPlus className="w-5 h-5" aria-hidden="true" />
                  )}
                  {isSubmitting ? 'Registering...' : 'Register'}
                </Button>
              )}
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
