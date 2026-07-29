import React, { useEffect, useState, useRef } from 'react';
import { User, Type, Maximize, Globe, Sliders, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { useAccessibility } from '../../contexts/AccessibilityContext';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { dashboardService } from '../../services/dashboard.service';

const profileLabels: Record<string, string> = {
  typical: 'Original Content (Typical)',
  blind: 'Blind / Screen Reader',
  'low-vision': 'Low Vision',
  deaf: 'Deaf / Hard of Hearing',
  dyslexic: 'Dyslexic',
  id: 'Intellectual Disability',
  'adhd-autism': 'ADHD / Autism'
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

export const AccessibilityControls: React.FC = () => {
  const { profile, setProfile, fontSize, setFontSize, fontFamily, setFontFamily } = useAccessibility();
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isStudent = user?.role === 'student' && user?.email !== 'student@school.edu' && user?.email !== 'demo@demo.com';
  const defaultProfile = isStudent ? (user?.profileId || 'typical') : null;

  // Sync i18n with user's preferred language on load
  useEffect(() => {
    if (user?.preferredLanguage) {
      i18n.changeLanguage(user.preferredLanguage);
    }
  }, [user]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value;
    i18n.changeLanguage(newLang);
    if (user?.id) {
      try {
        await dashboardService.updateUser(user.id, { preferredLanguage: newLang } as any);
        // Update cached user data
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

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Sleek Toggle Button */}
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-800/80 theme-text text-xs font-extrabold rounded-xl border theme-border shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
      >
        <Sliders className="w-4 h-4 text-primary shrink-0" aria-hidden="true" />
        <span className="truncate max-w-[120px] md:max-w-none">
          {profileLabels[profile] || 'Accessibility Options'}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 theme-text-muted transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Modern Popover Menu */}
      {isOpen && (
        <div 
          className="absolute right-0 mt-2.5 w-72 origin-top-right rounded-2xl border theme-border bg-white/95 dark:bg-gray-950/95 backdrop-blur-md shadow-xl ring-1 ring-black/5 focus:outline-none z-50 p-4 space-y-4 animate-scale-up"
          role="menu"
          aria-orientation="vertical"
        >
          <div className="border-b theme-border pb-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-primary flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Adaptation Parameters
            </h3>
          </div>

          {/* Profile Row */}
          <div className="space-y-1">
            <label htmlFor="popover-profile" className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Adaptation Profile
            </label>
            <select 
              id="popover-profile"
              value={profile} 
              onChange={(e) => setProfile(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              {isStudent ? (
                defaultProfile && defaultProfile !== 'typical' ? (
                  <>
                    <option value={defaultProfile}>{profileLabels[defaultProfile] || defaultProfile} ({t('adapted_content')})</option>
                    <option value="typical">{t('original_content')} ({t('typical')})</option>
                  </>
                ) : (
                  <option value="typical">{t('original_content')} ({t('typical')})</option>
                )
              ) : (
                <>
                  <option value="typical">{t('original_content')} (Typical)</option>
                  <option value="blind">Blind / Screen Reader</option>
                  <option value="low-vision">Low Vision</option>
                  <option value="deaf">Deaf / Hard of Hearing</option>
                  <option value="dyslexic">Dyslexic</option>
                  <option value="id">Intellectual Disability</option>
                  <option value="adhd-autism">ADHD / Autism</option>
                </>
              )}
            </select>
          </div>

          {/* Font Type Row */}
          <div className="space-y-1">
            <label htmlFor="popover-font-family" className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5" />
              Font Style
            </label>
            <select 
              id="popover-font-family"
              value={fontFamily} 
              onChange={(e) => setFontFamily(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="standard">Standard Font</option>
              <option value="dyslexic">Dyslexia-Friendly</option>
              <option value="legible">High Legibility</option>
            </select>
          </div>

          {/* Text Scaling Row */}
          <div className="space-y-1">
            <label htmlFor="popover-font-size" className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Maximize className="w-3.5 h-3.5" />
              Text Scaling
            </label>
            <select 
              id="popover-font-size"
              value={fontSize} 
              onChange={(e) => setFontSize(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-semibold border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              <option value="normal">Normal Text</option>
              <option value="large">Large Text</option>
              <option value="x-large">Extra Large Text</option>
            </select>
          </div>

          {/* Language Row */}
          <div className="space-y-1">
            <label htmlFor="popover-language" className="text-[10px] font-bold theme-text-muted uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5" />
              System Language
            </label>
            <select 
              id="popover-language"
              value={i18n.language} 
              onChange={handleLanguageChange}
              className="w-full px-3 py-2 text-xs font-semibold border theme-border rounded-xl bg-gray-50 dark:bg-gray-900 theme-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all cursor-pointer"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>{l.name}</option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
};
