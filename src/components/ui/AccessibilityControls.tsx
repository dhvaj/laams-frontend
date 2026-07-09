import React, { useEffect } from 'react';
import { User, Type, Maximize, Globe } from 'lucide-react';
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

  const isStudent = user?.role === 'student' && user?.email !== 'student@school.edu';
  const defaultProfile = isStudent ? (user?.profileId || 'typical') : null;

  // Sync i18n with user's preferred language on load
  useEffect(() => {
    if (user?.preferredLanguage) {
      i18n.changeLanguage(user.preferredLanguage);
    }
  }, [user]);

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
    <div className="flex flex-wrap items-center gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-lg border theme-border">
      <div className="flex items-center gap-1 px-2">
        <User className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <select 
          value={profile} 
          onChange={(e) => setProfile(e.target.value as any)}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer theme-text font-semibold"
          aria-label="Accessibility Profile Selector"
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

      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

      <div className="flex items-center gap-1 px-2">
        <Type className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <select 
          value={fontFamily} 
          onChange={(e) => setFontFamily(e.target.value as any)}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer theme-text"
          aria-label="Font Type Selector"
        >
          <option value="standard">Standard Font</option>
          <option value="dyslexic">Dyslexia-Friendly</option>
          <option value="legible">High Legibility</option>
        </select>
      </div>

      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

      <div className="flex items-center gap-1 px-2">
        <Maximize className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <select 
          value={fontSize} 
          onChange={(e) => setFontSize(e.target.value as any)}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer theme-text"
          aria-label="Text Size Selector"
        >
          <option value="normal">Normal Text</option>
          <option value="large">Large Text</option>
          <option value="x-large">Extra Large Text</option>
        </select>
      </div>

      <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 hidden sm:block"></div>

      <div className="flex items-center gap-1 px-2">
        <Globe className="w-4 h-4 theme-text-muted" aria-hidden="true" />
        <select 
          value={i18n.language} 
          onChange={handleLanguageChange}
          className="bg-transparent border-none text-sm focus:ring-0 cursor-pointer theme-text font-semibold"
          aria-label="Language Selector"
        >
          {languages.map((l) => (
            <option key={l.code} value={l.code}>{l.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
};
