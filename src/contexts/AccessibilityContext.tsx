import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export type AccessibilityProfile = 
  | 'typical'
  | 'blind'
  | 'low-vision'
  | 'deaf'
  | 'dyslexic'
  | 'id'
  | 'adhd-autism'
  | 'learning';

export type FontSize = 'normal' | 'large' | 'x-large';
export type FontFamily = 'standard' | 'dyslexic' | 'legible';
export type ContrastOption = 'yellow-on-black' | 'white-on-black' | 'black-on-yellow' | 'blue-on-yellow' | 'green-on-black';

interface AccessibilityContextType {
  profile: AccessibilityProfile;
  setProfile: (profile: AccessibilityProfile) => void;
  fontSize: FontSize;
  setFontSize: (size: FontSize) => void;
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  contrast: ContrastOption;
  setContrast: (contrast: ContrastOption) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<AccessibilityProfile>('typical');
  const [fontSize, setFontSize] = useState<FontSize>('normal');
  const [fontFamily, setFontFamily] = useState<FontFamily>('standard');
  const [contrast, setContrast] = useState<ContrastOption>('yellow-on-black');

  const [announcement, setAnnouncement] = useState<string>('');

  // Sync profile with user's registered accessibility profile
  useEffect(() => {
    if (user) {
      setProfile((user.profileId || 'typical') as AccessibilityProfile);
    } else {
      const savedProfile = localStorage.getItem('laams-a11y-profile') as AccessibilityProfile;
      if (savedProfile) setProfile(savedProfile);
    }
  }, [user]);

  // Load settings from local storage if exists
  useEffect(() => {
    const savedFontSize = localStorage.getItem('laams-a11y-fontsize') as FontSize;
    const savedFontFamily = localStorage.getItem('laams-a11y-fontfamily') as FontFamily;
    const savedContrast = localStorage.getItem('laams-a11y-contrast') as ContrastOption;
    
    if (savedFontSize) setFontSize(savedFontSize);
    if (savedFontFamily) setFontFamily(savedFontFamily);
    if (savedContrast) setContrast(savedContrast);
  }, []);

  // Sync profile effects (e.g., setting default fonts for specific profiles if user hasn't overridden them)
  useEffect(() => {
    if (profile === 'dyslexic' && fontFamily === 'standard') {
      setFontFamily('dyslexic');
    } else if (profile === 'typical') {
      setFontFamily('standard');
      setFontSize('normal');
    }
    if (profile === 'low-vision' && fontSize === 'normal') {
      setFontSize('large');
    }
  }, [profile]);

  // Apply classes and CSS variables
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // 1. Apply Profile Class
    const profileClasses = ['a11y-typical', 'a11y-blind', 'a11y-low-vision', 'a11y-deaf', 'a11y-dyslexic', 'a11y-id', 'a11y-adhd-autism'];
    body.classList.remove(...profileClasses);
    body.classList.add(`a11y-${profile}`);
    localStorage.setItem('laams-a11y-profile', profile);

    // Apply Contrast Class for Low Vision
    const contrastClasses = ['lv-yellow-on-black', 'lv-white-on-black', 'lv-black-on-yellow', 'lv-blue-on-yellow', 'lv-green-on-black'];
    body.classList.remove(...contrastClasses);
    if (profile === 'low-vision') {
      body.classList.add(`lv-${contrast}`);
    }
    localStorage.setItem('laams-a11y-contrast', contrast);
    
    // 2. Apply Font Size
    let sizeValue = '100%';
    if (fontSize === 'large') sizeValue = '125%';
    if (fontSize === 'x-large') sizeValue = '150%';
    root.style.fontSize = sizeValue;
    localStorage.setItem('laams-a11y-fontsize', fontSize);
    
    // 3. Apply Font Family
    let fontValue = "Inter, system-ui, sans-serif";
    if (fontFamily === 'dyslexic') {
      fontValue = "'Comic Sans MS', 'OpenDyslexic', sans-serif";
    } else if (fontFamily === 'legible') {
      fontValue = "Verdana, Tahoma, sans-serif";
    }
    root.style.setProperty('--font-family-base', fontValue);
    localStorage.setItem('laams-a11y-fontfamily', fontFamily);

  }, [profile, fontSize, fontFamily, contrast]);

  const setProfileWithAnnouncement = (newProfile: AccessibilityProfile) => {
    setProfile(newProfile);
    setAnnouncement(`Accessibility profile changed to ${newProfile}`);
  };

  const setFontSizeWithAnnouncement = (newSize: FontSize) => {
    setFontSize(newSize);
    setAnnouncement(`Text size changed to ${newSize}`);
  };

  const setFontFamilyWithAnnouncement = (newFont: FontFamily) => {
    setFontFamily(newFont);
    setAnnouncement(`Font type changed to ${newFont}`);
  };

  const setContrastWithAnnouncement = (newContrast: ContrastOption) => {
    setContrast(newContrast);
    setAnnouncement(`Color contrast changed to ${newContrast.replace(/-/g, ' ')}`);
  };

  return (
    <AccessibilityContext.Provider value={{ 
      profile, setProfile: setProfileWithAnnouncement, 
      fontSize, setFontSize: setFontSizeWithAnnouncement, 
      fontFamily, setFontFamily: setFontFamilyWithAnnouncement,
      contrast, setContrast: setContrastWithAnnouncement
    }}>
      {children}
      <div 
        className="sr-only" 
        aria-live="polite" 
        aria-atomic="true"
      >
        {announcement}
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
