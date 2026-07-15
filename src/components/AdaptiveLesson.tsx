import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight, Play, Volume2, Download, Sparkles, BookOpen, RefreshCw, Headphones, Award, VolumeX, Music } from 'lucide-react';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useAuth } from '../contexts/AuthContext';
import { adaptiveLearningService } from '../services/adaptiveLearning.service';
import { dashboardService } from '../services/dashboard.service';
import { Tooltip } from './ui/Tooltip';
import type { AdaptedLessonBlock } from '../types';
import { useTranslation } from 'react-i18next';

const profileLabels: Record<string, string> = {
  typical: 'Typical',
  blind: 'Blind / Screen Reader',
  'low-vision': 'Low Vision',
  deaf: 'Deaf / Hard of Hearing',
  dyslexic: 'Dyslexic',
  id: 'Intellectual Disability',
  'adhd-autism': 'ADHD / Autism'
};

const renderTextWithVocabulary = (text: string, vocabulary: { word: string; definition: string }[]) => {
  if (!text) return <React.Fragment>{text}</React.Fragment>;
  if (!vocabulary || vocabulary.length === 0) return <React.Fragment>{text}</React.Fragment>;

  const vocabMap: Record<string, string> = {};
  vocabulary.forEach(v => {
    if (v && v.word) {
      vocabMap[v.word.toLowerCase()] = v.definition || '';
    }
  });

  const words = Object.keys(vocabMap);
  if (words.length === 0) return <React.Fragment>{text}</React.Fragment>;

  // Sort by length descending to match longer phrases first and avoid substring collisions
  const sortedWords = words.sort((a, b) => b.length - a.length);
  const escapedWords = sortedWords.map(w => w.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'));
  const pattern = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const definition = vocabMap[part.toLowerCase()];
    if (!definition) return <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>;
    return <Tooltip key={`${part}-${index}`} text={part} definition={definition} />;
  });
};

const renderInlineItalic = (text: string, vocabulary: any[]): React.ReactNode => {
  const parts = text.split(/\*([^*]+)\*/g);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return <em key={index} className="italic">{renderTextWithVocabulary(part, vocabulary)}</em>;
          }
          return renderTextWithVocabulary(part, vocabulary);
        })}
      </>
    );
  }
  return renderTextWithVocabulary(text, vocabulary);
};

const renderBoldItalic = (text: string, vocabulary: any[]): React.ReactNode => {
  const parts = text.split(/\*\*([^*]+)\*\*/g);
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return <strong key={index} className="font-extrabold">{renderInlineItalic(part, vocabulary)}</strong>;
          }
          return renderInlineItalic(part, vocabulary);
        })}
      </>
    );
  }
  return renderInlineItalic(text, vocabulary);
};

const renderInlineMarkdown = (text: string, vocabulary: any[]): React.ReactNode => {
  if (!text) return null;
  
  // First split by image markdown pattern
  const imgRegex = /(!\[.*?\]\(.*?\))/g;
  const parts = text.split(imgRegex);
  
  if (parts.length > 1) {
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            // This is an image markdown string: ![alt](url)
            const match = part.match(/!\[(.*?)\]\((.*?)\)/);
            if (match) {
              const alt = match[1] || 'Image';
              const src = match[2];
              const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim();
              const fullSrc = src.startsWith('http') || src.startsWith('data:') ? src : `${API_URL}${src}`;
              return (
                <span key={index} className="block select-all my-3 max-w-sm mx-auto text-center">
                  <img 
                    src={fullSrc} 
                    alt={alt} 
                    className="max-h-40 object-contain rounded-lg border theme-border shadow-sm bg-gray-50 dark:bg-gray-900/50 p-1 block mx-auto hover:scale-105 transition-transform" 
                  />
                  {alt && alt.trim() && (
                    <span className="text-xs theme-text-muted mt-1 block italic">{alt}</span>
                  )}
                </span>
              );
            }
          }
          // Recursively parse bold/italic for non-image text parts
          return renderBoldItalic(part, vocabulary);
        })}
      </>
    );
  }
  
  return renderBoldItalic(text, vocabulary);
};

const renderMarkdown = (text: string, vocabulary: any[]): React.ReactNode => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const renderedElements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  
  const flushList = (key: string | number) => {
    if (currentList.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="space-y-2 theme-text text-lg ml-6 my-4" style={{ listStyleType: 'disc' }}>
          {currentList}
        </ul>
      );
      currentList = [];
    }
  };
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();
    
    if (!trimmed) {
      flushList(i);
      continue;
    }
    
    // Check if it's a heading
    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      flushList(i);
      const level = headingMatch[1].length;
      const content = headingMatch[2];
      
      const headingClasses = 
        level === 1 ? "text-3xl font-extrabold theme-text mt-8 mb-4 border-b theme-border pb-2 block" :
        level === 2 ? "text-2xl font-bold theme-text mt-6 mb-3 block" :
        level === 3 ? "text-xl font-bold theme-text mt-5 mb-2 block" :
        "text-lg font-bold theme-text mt-4 mb-2 block";
        
      const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
      renderedElements.push(
        <HeadingTag key={`h-${i}`} className={headingClasses}>
          {renderInlineMarkdown(content, vocabulary)}
        </HeadingTag>
      );
      continue;
    }
    
    // Check if it's a list item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
      const content = trimmed.replace(/^[-*•]\s+/, '');
      currentList.push(
        <li key={`li-${i}`} className="pl-2 leading-relaxed">
          {renderInlineMarkdown(content, vocabulary)}
        </li>
      );
      continue;
    }
    
    // Check if the line contains any image markdown
    if (trimmed.includes('![') && trimmed.includes('](')) {
      flushList(i);
      const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
      const elements: React.ReactNode[] = [];
      let lastIndex = 0;
      let match;
      let keyOffset = 0;
      
      while ((match = imgRegex.exec(trimmed)) !== null) {
        const matchIndex = match.index;
        // Text before the image
        if (matchIndex > lastIndex) {
          const textBefore = trimmed.substring(lastIndex, matchIndex);
          if (textBefore.trim()) {
            elements.push(
              <span key={`text-pre-${i}-${keyOffset}`} className="theme-text text-lg leading-relaxed">
                {renderInlineMarkdown(textBefore, vocabulary)}
              </span>
            );
            keyOffset++;
          }
        }
        
        const alt = match[1];
        const src = match[2];
        const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim();
        const fullSrc = src.startsWith('http') || src.startsWith('data:') ? src : `${API_URL}${src}`;
        
        elements.push(
          <div key={`img-wrap-${i}-${keyOffset}`} className="space-y-2 select-all my-6 max-w-xl mx-auto">
            <img 
              src={fullSrc} 
              alt={alt} 
              className="w-full max-h-[450px] object-contain rounded-xl border theme-border shadow-sm bg-gray-50 dark:bg-gray-900/50 p-2 animate-fade-in block mx-auto" 
            />
            {alt && alt.trim() && (
              <figcaption className="text-xs text-center theme-text-muted italic bg-gray-100/50 dark:bg-gray-800/30 p-2 rounded-lg border border-dashed theme-border">
                <strong>Image Description (Alt Text):</strong> {alt}
              </figcaption>
            )}
          </div>
        );
        keyOffset++;
        lastIndex = imgRegex.lastIndex;
      }
      
      // Text after the last image
      if (lastIndex < trimmed.length) {
        const textAfter = trimmed.substring(lastIndex);
        if (textAfter.trim()) {
          elements.push(
            <span key={`text-post-${i}-${keyOffset}`} className="theme-text text-lg leading-relaxed">
              {renderInlineMarkdown(textAfter, vocabulary)}
            </span>
          );
        }
      }
      
      renderedElements.push(
        <div key={`img-wrap-${i}`} className="my-4 space-y-2">
          {elements}
        </div>
      );
      continue;
    }
    
    // Default: regular paragraph
    flushList(i);
    renderedElements.push(
      <p key={`p-${i}`} className="theme-text text-lg leading-relaxed my-4">
        {renderInlineMarkdown(trimmed, vocabulary)}
      </p>
    );
  }
  
  flushList(lines.length);
  return <div className="space-y-1">{renderedElements}</div>;
};

const parseStepText = (text: string) => {
  if (!text) return { front: '', sentences: [] };
  
  // Clean up bracketed annotations or code-like noise
  let clean = text.replace(/\[\/?.*?\]/g, '').trim();
  
  // Look for colon divider
  const colonIdx = clean.indexOf(':');
  let frontText = '';
  let detailText = clean;
  
  if (colonIdx > 0 && colonIdx < 40) {
    frontText = clean.substring(0, colonIdx).trim();
    detailText = clean.substring(colonIdx + 1).trim();
  } else {
    // Extract the first 3-5 words as a concept phrase
    const words = clean.split(/\s+/);
    if (words.length > 4) {
      let splitIndex = 3;
      const connectors = ['is', 'are', 'has', 'have', 'to', 'for', 'in', 'on', 'with', 'at', 'by', 'from', 'contains', 'about'];
      for (let i = 0; i < Math.min(words.length, 5); i++) {
        if (connectors.includes(words[i].toLowerCase())) {
          splitIndex = i > 0 ? i : 3;
          break;
        }
      }
      frontText = words.slice(0, splitIndex).join(' ');
    } else {
      frontText = clean;
    }
  }

  // Ensure front text ends clean
  frontText = frontText.replace(/[.,;:!?]+$/, '').trim();
  
  // Split detailText into sentences
  const sentences = detailText
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
    
  if (sentences.length === 0) {
    sentences.push(clean);
  }
    
  return { front: frontText, sentences };
};

const cleanTextbookMetadata = (text: string): string => {
  if (!text) return '';
  
  // 1. Remove QR Code image markdown links
  let cleaned = text.replace(/!\[Q\s*R\s*Code\]\(.*?\)/gi, '');
  
  // 2. Remove standard textbook codes
  cleaned = cleaned.replace(/\b\d{4}CH\d{2}\b/g, '');
  
  // 3. Remove standalone "Unknown"
  cleaned = cleaned.replace(/\bUnknown\b/gi, '');
  
  // 4. Split into lines to remove page numbers and empty lines
  const lines = cleaned.split('\n');
  const filteredLines: string[] = [];
  
  for (let line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      filteredLines.push('');
      continue;
    }
    
    // Check if it's a page number heading, e.g. ###### 64 or ###### **88**
    if (trimmed.startsWith('#')) {
      const headingContent = trimmed.replace(/[#*]/g, '').trim();
      if (!headingContent || /^\d+$/.test(headingContent) || headingContent.toLowerCase() === 'unknown') {
        continue; // skip page number heading
      }
    }
    
    // Check if the line itself is just a page number, e.g., "64" or "**88**"
    const content = trimmed.replace(/[*]/g, '').trim();
    if (/^\d+$/.test(content) || content.toLowerCase() === 'unknown') {
      continue; // skip standalone page number/unknown line
    }
    
    filteredLines.push(line);
  }
  
  // 5. Reconstruct paragraphs (merge wrapping line breaks inside sentences)
  const cleanedLines: string[] = [];
  let currentParagraph = '';

  for (let i = 0; i < filteredLines.length; i++) {
    const line = filteredLines[i].trim();
    if (!line) {
      if (currentParagraph) {
        cleanedLines.push(currentParagraph);
        currentParagraph = '';
      }
      continue;
    }

    // If it's a markdown heading
    if (line.startsWith('#')) {
      if (currentParagraph) {
        cleanedLines.push(currentParagraph);
        currentParagraph = '';
      }
      cleanedLines.push(line);
      continue;
    }

    // If it's a list item
    if (line.startsWith('- ') || line.startsWith('* ') || line.startsWith('• ') || /^\d+\.\s+/.test(line)) {
      if (currentParagraph) {
        cleanedLines.push(currentParagraph);
        currentParagraph = '';
      }
      cleanedLines.push(line);
      continue;
    }

    if (currentParagraph) {
      const lastChar = currentParagraph.trim().slice(-1);
      const isSentenceEnd = ['.', '!', '?', ':', ';'].includes(lastChar);
      
      // If previous paragraph is short and doesn't end with a period, it is likely a heading
      const isPrevHeading = currentParagraph.length < 45 && !['.', '!', '?'].includes(lastChar);

      if (isSentenceEnd || isPrevHeading) {
        cleanedLines.push(currentParagraph);
        currentParagraph = line;
      } else {
        // Merge lines with a space
        currentParagraph += ' ' + line;
      }
    } else {
      currentParagraph = line;
    }
  }

  if (currentParagraph) {
    cleanedLines.push(currentParagraph);
  }

  return cleanedLines.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
};


const BlockRenderer: React.FC<{ block: AdaptedLessonBlock; vocabulary: { word: string; definition: string }[]; compact?: boolean }> = ({ block, vocabulary, compact = false }) => {
  if (block.type === 'markdown') {
    return (
      <section className="space-y-4">
        {block.heading && <h2 className="text-2xl font-bold theme-text">{block.heading}</h2>}
        {block.text && <div>{renderMarkdown(block.text, vocabulary)}</div>}
      </section>
    );
  }

  if (block.type === 'media' && block.media) {
    return (
      <section className={compact ? 'text-center space-y-4' : 'space-y-4'}>
        {block.heading && <h2 className="text-2xl font-bold theme-text">{block.heading}</h2>}
        <div className="relative select-all max-w-2xl mx-auto">
          <img
            src={block.media.url}
            alt={block.media.alt}
            className={compact ? 'w-48 h-48 mx-auto rounded-full object-cover border-4 border-primary/30 shadow-xl' : 'w-full aspect-video rounded-lg object-cover border theme-border'}
          />
          {block.media.alt && block.media.alt.trim() && (
            <figcaption className="text-xs text-center theme-text-muted mt-2 italic bg-gray-100/50 dark:bg-gray-800/30 p-2 rounded-lg border border-dashed theme-border">
              <strong>Image Description (Alt Text):</strong> {block.media.alt}
            </figcaption>
          )}
        </div>
        {block.text && <p className={compact ? 'text-2xl font-bold theme-text' : 'theme-text text-lg'}>{renderTextWithVocabulary(block.text, vocabulary)}</p>}
      </section>
    );
  }

  if (block.type === 'bullets') {
    return (
      <section className="space-y-4">
        {block.heading && <h2 className="text-2xl font-bold theme-text">{block.heading}</h2>}
        <ul className="space-y-3 theme-text text-lg ml-6" style={{ listStyleType: 'square' }}>
          {block.items?.map((item, index) => (
            <li key={`${item}-${index}`} className="pl-2">{renderInlineMarkdown(item, vocabulary)}</li>
          ))}
        </ul>
      </section>
    );
  }

  if (block.type === 'vocabulary') {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {block.vocabulary?.map((item, index) => (
          <div key={`${item.word}-${index}`} className="theme-surface p-4 border theme-border">
            <h3 className="font-bold theme-text capitalize">{item.word}</h3>
            <p className="theme-text-muted text-sm mt-1">{item.definition}</p>
          </div>
        ))}
      </section>
    );
  }

  if (block.type === 'callout') {
    return (
      <aside className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
        {block.heading && <h2 className="font-bold text-primary mb-1">{block.heading}</h2>}
        <p className="theme-text text-sm">{renderInlineMarkdown(block.text || '', vocabulary)}</p>
      </aside>
    );
  }

  return (
    <section className="space-y-3">
      {block.heading && <h2 className="text-2xl font-bold theme-text">{block.heading}</h2>}
      {block.text && <p className="theme-text text-lg leading-relaxed">{renderInlineMarkdown(block.text, vocabulary)}</p>}
    </section>
  );
};

// Web Audio API ambient sound generator
let audioCtx: AudioContext | null = null;
let currentSource: AudioBufferSourceNode | null = null;
let currentOsc: OscillatorNode | null = null;

const playChime = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5
    osc.frequency.setValueAtTime(1046.50, now + 0.24); // C6
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc.start(now);
    osc.stop(now + 0.4);
  } catch (e) {}
};

const playFanfare = () => {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'triangle';
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.1 * idx);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      osc.start(now);
      osc.stop(now + 0.8);
    });
  } catch (e) {}
};

const stopSynthFocusSound = () => {
  if (currentSource) {
    try { currentSource.stop(); } catch(e){}
    currentSource = null;
  }
  if (currentOsc) {
    try { currentOsc.stop(); } catch(e){}
    currentOsc = null;
  }
};

const startSynthFocusSound = (type: 'brown' | 'rain' | 'ocean') => {
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    stopSynthFocusSound();

    const sampleRate = audioCtx.sampleRate;
    const bufferSize = 2 * sampleRate;
    const noiseBuffer = audioCtx.createBuffer(1, bufferSize, sampleRate);
    const output = noiseBuffer.getChannelData(0);

    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5; 
    }

    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';

    if (type === 'rain') {
      filter.frequency.value = 1100;
    } else if (type === 'ocean') {
      filter.frequency.value = 350;
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.12; 
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 220;
      lfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);
      lfo.start();
      currentOsc = lfo;
    } else {
      filter.frequency.value = 550;
    }

    const gain = audioCtx.createGain();
    gain.gain.value = 0.08; 

    source.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);

    source.start();
    currentSource = source;
  } catch (e) {
    console.error(e);
  }
};

export const AdaptiveLesson: React.FC = () => {
  const { id } = useParams();
  const { profile, setProfile } = useAccessibility();
  const { user } = useAuth();
  const { i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [focusSound, setFocusSound] = useState<'off' | 'brown' | 'rain' | 'ocean'>('off');
  const [particles, setParticles] = useState<{ id: number; dx: string; dy: string; color: string; size: number }[]>([]);

  const [lesson, setLesson] = useState<any>(null);
  const [adaptedLesson, setAdaptedLesson] = useState<any>(null);

  const triggerBurst = () => {
    playFanfare();
    const colors = ['#FF2A6D', '#05D9E8', '#f5a623', '#7ed321', '#b8e986', '#f8e71c', '#ff7849'];
    const newParticles = Array.from({ length: 30 }).map((_, idx) => {
      const angle = (idx / 30) * 360 * (Math.PI / 180);
      const distance = 80 + Math.random() * 120;
      return {
        id: Date.now() + idx,
        dx: `${Math.cos(angle) * distance}px`,
        dy: `${Math.sin(angle) * distance}px`,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12
      };
    });
    setParticles(newParticles);
    setTimeout(() => {
      setParticles([]);
    }, 1200);
  };

  const handleCheckItem = (itemKey: string, isCheckedNow: boolean, sentencesCount: number) => {
    setCheckedItems(prev => {
      const updated = { ...prev, [itemKey]: isCheckedNow };
      let checkedCount = 0;
      for (let i = 0; i < sentencesCount; i++) {
        if (updated[`${currentStep}-${i}`]) {
          checkedCount++;
        }
      }
      if (isCheckedNow) {
        playChime();
        if (checkedCount === sentencesCount) {
          triggerBurst();
        }
      }
      return updated;
    });
  };

  // Focus sound effect controller
  useEffect(() => {
    if (focusSound === 'off') {
      stopSynthFocusSound();
    } else {
      startSynthFocusSound(focusSound);
    }
    return () => {
      stopSynthFocusSound();
    };
  }, [focusSound]);

  // Automatically reset card flip state when currentStep changes
  useEffect(() => {
    setIsFlipped(false);
  }, [currentStep]);

  // Stop speaking when component unmounts or lesson changes
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [adaptedLesson]);

  // Reset step counter when accessibility profile changes
  useEffect(() => {
    setCurrentStep(0);
  }, [profile]);

  // Automatically reset the active accessibility profile to the student's signup profile when entering a new lesson page
  useEffect(() => {
    if (user && user.role === 'student' && user.profileId) {
      setProfile(user.profileId as any);
    }
  }, [id, user]);

  useEffect(() => {
    let isMounted = true;
    const loadContent = async () => {
      let source = null;
      try {
        source = await dashboardService.getLesson(id || 'solar-system');
      } catch (err) {
        console.warn('Lesson not found in main catalog, checking study materials...', err);
        // Fallback to custom study material
        try {
          const customMaterial = await dashboardService.getStudyMaterialById(id as string);
          if (customMaterial) {
            const rawBody = customMaterial.body || customMaterial.content || '';
            const materialBody = cleanTextbookMetadata(rawBody);
            
            // Extract all image links from materialBody to populate the media array
            const extractedMedia: { url: string; alt: string }[] = [];
            const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
            let match;
            while ((match = imgRegex.exec(materialBody)) !== null) {
              const alt = match[1] || 'Image';
              const src = match[2];
              const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3001').trim();
              const fullSrc = src.startsWith('http') || src.startsWith('data:') ? src : `${API_URL}${src}`;
              extractedMedia.push({
                alt: alt,
                url: fullSrc
              });
            }

            source = {
              id: customMaterial.id,
              slug: customMaterial.id,
              title: customMaterial.title,
              subject: customMaterial.subject,
              gradeLevel: 'Unknown',
              language: 'en',
              media: extractedMedia,
              vocabulary: [],
              fullText: materialBody,
              segments: [{ id: 'seg1', heading: '', level: 1, sourceText: materialBody }],
              fileUrl: customMaterial.fileUrl
            };
          }
        } catch (e) {
          console.error('Failed to load study material fallback:', e);
        }
      }
      
      if (isMounted && source) {
        // Clean source fullText and segments if needed
        source.fullText = cleanTextbookMetadata(source.fullText || '');
        if (source.segments) {
          source.segments = source.segments.map((seg: any) => ({
            ...seg,
            sourceText: cleanTextbookMetadata(seg.sourceText || '')
          }));
        }
        setLesson(source);
        const result = await adaptiveLearningService.adaptLesson(source, profile);
        if (isMounted) setAdaptedLesson(result);
      }
    };

    setLesson(null);
    setAdaptedLesson(null);
    loadContent();
    return () => { isMounted = false; };
  }, [id, profile]);

  // Analytics - Track time spent on lesson
  useEffect(() => {
    if (!lesson) return;
    
    let startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      if (elapsed > 0) {
        dashboardService.trackAnalyticsEvent(lesson.id, 'lesson_viewed', elapsed);
        startTime = Date.now();
      }
    }, 10000);

    return () => {
      clearInterval(interval);
      const elapsed = Math.round((Date.now() - startTime) / 1000);
      if (elapsed > 0) {
        dashboardService.trackAnalyticsEvent(lesson.id, 'lesson_viewed', elapsed);
      }
    };
  }, [lesson]);

  if (!adaptedLesson || !lesson) {
    return <div className="p-8 text-center text-primary animate-pulse flex flex-col items-center justify-center gap-4 h-64"><div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div><p className="font-bold">Adapting content for {profileLabels[profile]} profile...</p></div>;
  }

  const isStepLayout = 
    profile === 'adhd-autism' || 
    profile === 'dyslexic' || 
    profile === 'id';

  const stepBlocks = (adaptedLesson.blocks || []).filter((block: any) => {
    if (profile === 'adhd-autism') return block.type === 'step';
    if (profile === 'id') return block.type === 'media' || block.type === 'bullets';
    if (profile === 'dyslexic') return block.type === 'bullets' || block.type === 'markdown';
    return false;
  });
  const activeStep = stepBlocks[currentStep];
  const isSimpleLayout = adaptedLesson.layout === 'simple-picture-first' && !isStepLayout;
  const showReadAloud = true; // Survey feedback: make read-aloud options available to all learners

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert("Text-to-speech is not supported in this browser.");
      return;
    }

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const speechText = (adaptedLesson.blocks as AdaptedLessonBlock[])
      .flatMap((block: AdaptedLessonBlock) => [block.heading, block.text, ...(block.items || [])])
      .filter(Boolean)
      .join('. ');

    if (!speechText.trim()) return;

    window.speechSynthesis.cancel();
    
    // Split into sentences to prevent the browser/Chrome 15s timeout speaking bug
    const sentences = speechText.split(/[.!?]+\s+/).filter(Boolean);
    let currentIndex = 0;
    setIsPlaying(true);

    const speakNext = () => {
      if (currentIndex >= sentences.length) {
        setIsPlaying(false);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(sentences[currentIndex]);
      const voices = window.speechSynthesis.getVoices();
      const isHindi = i18n.language === 'hi';
      let selectedVoice = null;
      if (isHindi) {
        selectedVoice = voices.find(v => v.lang.startsWith('hi-IN') || v.lang.startsWith('hi')) || null;
      } else {
        selectedVoice = voices.find(v => v.lang.startsWith('en-IN') || v.name.toLowerCase().includes('india') || v.name.toLowerCase().includes('indian')) || null;
      }
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      utterance.onend = () => {
        currentIndex++;
        speakNext();
      };

      utterance.onerror = (e) => {
        console.error('SpeechSynthesis error:', e);
        setIsPlaying(false);
      };

      window.speechSynthesis.speak(utterance);
      
      // Periodic resume trick to prevent Chrome engine spin-downs during background play
      const keepAliveInterval = setInterval(() => {
        if (!window.speechSynthesis.speaking) {
          clearInterval(keepAliveInterval);
        } else {
          window.speechSynthesis.resume();
        }
      }, 10000);
    };

    speakNext();
  };

  return (
    <div className="max-w-4xl mx-auto p-2">
      <div className="mb-8 p-6 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <h2 className="font-bold text-primary text-lg tracking-tight">Adaptive Learning Engine</h2>
          <p className="text-sm theme-text">
            Profile: <strong>{profileLabels[profile]}</strong> · Layout: <span className="capitalize font-semibold text-primary">{adaptedLesson.layout.replace(/-/g, ' ')}</span>
          </p>
          <p className="text-xs theme-text-muted mt-1 leading-relaxed max-w-xl">{adaptedLesson.summary}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Premium Segmented Toggle for Student adapted profile vs original */}
          {user?.role === 'student' && user.profileId && user.profileId !== 'typical' && user.email !== 'student@school.edu' && (
            <div className="flex p-1 bg-gray-200/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-300/40 dark:border-gray-700/40" role="radiogroup" aria-label="Content Adapt Mode">
              <button
                role="radio"
                aria-checked={profile === user.profileId}
                onClick={() => setProfile(user.profileId as any)}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  profile === user.profileId
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'theme-text hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Adapted</span>
              </button>
              <button
                role="radio"
                aria-checked={profile === 'typical'}
                onClick={() => setProfile('typical')}
                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                  profile === 'typical'
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'theme-text hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                <span>Original</span>
              </button>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            {showReadAloud && (
              <button
                onClick={handleReadAloud}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-all duration-300 cursor-pointer ${
                  isPlaying 
                    ? 'bg-red-500 text-white shadow-md shadow-red-500/20 hover:bg-red-600' 
                    : 'bg-primary/10 text-primary hover:bg-primary/20'
                }`}
              >
                {isPlaying ? <VolumeX className="w-5 h-5" aria-hidden="true" /> : <Volume2 className="w-5 h-5" aria-hidden="true" />}
                {isPlaying ? 'Stop Reading' : 'Read Aloud'}
              </button>
            )}
          </div>
        </div>
      </div>

      <article className={`theme-surface p-8 border theme-border transition-all duration-500 ease-in-out ${isSimpleLayout ? 'text-center space-y-12' : 'space-y-8'}`}>
        <header className="flex flex-col sm:flex-row sm:items-center justify-between border-b theme-border pb-4 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">{adaptedLesson.subject}</span>
            <h1 className={isSimpleLayout ? 'text-4xl font-extrabold theme-text mt-1' : 'text-3xl font-bold theme-text mt-1'}>
              {adaptedLesson.title}
            </h1>
          </div>
          <div className="flex gap-3">
            {lesson.fileUrl && !lesson.fileUrl.match(/\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i) && (
              <a 
                href={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001').trim()}${lesson.fileUrl}`} 
                target="_blank" 
                rel="noreferrer" 
                onClick={() => dashboardService.trackAnalyticsEvent(lesson.id, 'content_downloaded', 1, { fileName: lesson.fileUrl })}
                className="flex items-center gap-2 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/40 dark:text-blue-300 px-4 py-2 rounded-lg font-bold shadow-sm transition-colors" 
                aria-label="Download Attachment"
              >
                <Download className="w-5 h-5" aria-hidden="true" />
                Attachment
              </a>
            )}
            {profile === 'deaf' && (
              <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-sm" aria-label="Play sign language translation">
                <Play className="w-5 h-5" aria-hidden="true" />
                Sign Video
              </button>
            )}
          </div>
        </header>

        {lesson.fileUrl && lesson.fileUrl.match(/\.(mp4|webm|ogg|mov|m4v|avi|mkv)$/i) && (
          <div className="my-6 max-w-3xl mx-auto space-y-2">
            <h3 className="text-sm font-bold theme-text-muted uppercase tracking-wider">Lesson Video Material</h3>
            <video controls className="w-full rounded-2xl border theme-border shadow-lg bg-black aspect-video">
              <source src={`${(import.meta.env.VITE_API_URL || 'http://localhost:3001').trim()}${lesson.fileUrl}`} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        )}

        {isStepLayout && activeStep ? (() => {
          const parsed = parseStepText(activeStep.text || '');
          const cardSentencesCount = parsed.sentences.length;
          const cardCheckedCount = parsed.sentences.filter((_, idx) => checkedItems[`${currentStep}-${idx}`]).length;
          const isAllChecked = cardCheckedCount === cardSentencesCount;

          return (
            <div className="max-w-2xl mx-auto space-y-8 animate-fade-in relative z-10">
              {/* Progress bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden shadow-inner" aria-hidden="true">
                <div
                  className="bg-gradient-to-r from-primary to-pink-500 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentStep + 1) / stepBlocks.length) * 100}%` }}
                />
              </div>

              {/* Profile-Specific layout cards */}
              {profile === 'adhd-autism' ? (
                /* 3D Flip Card Container */
                <div 
                  className="w-full h-[400px] perspective-1000 cursor-pointer focus:outline-none relative select-none"
                  onClick={() => setIsFlipped(!isFlipped)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
                  aria-label={`Flashcard: Step ${currentStep + 1} of ${stepBlocks.length}. ${isFlipped ? 'Back shown' : 'Front shown'}`}
                >
                  {/* CSS variable transition configuration */}
                  <style>{`
                    @keyframes particle-float {
                      0% {
                        transform: translate(-50%, -50%) translate(0, 0) scale(1);
                        opacity: 1;
                      }
                      100% {
                        transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0.2);
                        opacity: 0;
                      }
                    }
                    .animate-particle {
                      animation: particle-float 1.2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
                    }
                  `}</style>

                  <div className={`w-full h-full relative flip-card-inner ${isFlipped ? 'flip-card-flipped' : ''}`}>
                    
                    {/* Front Side - Vibrant, playful orange/rose gradient */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rounded-3xl p-8 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-white border-none transition-shadow hover:shadow-primary/30">
                      <div className="flex justify-between items-center">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white font-extrabold rounded-full text-xs uppercase tracking-wider border border-white/20 shadow-sm">
                          🚀 Card {currentStep + 1} of {stepBlocks.length}
                        </span>
                        <span className="text-xs font-extrabold flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 shadow-sm">
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" style={{ animationDuration: '4s' }} /> Active Quest
                        </span>
                      </div>

                      <div className="my-auto text-center space-y-6">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto shadow-md border border-white/30 animate-bounce">
                          <Sparkles className="w-10 h-10 text-yellow-200" />
                        </div>
                        <h3 className="text-3xl font-black tracking-tight capitalize leading-tight max-w-lg mx-auto" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
                          {parsed.front}
                        </h3>
                        <p className="text-sm text-white/90 font-bold bg-black/10 px-4 py-2 rounded-full inline-block mx-auto shadow-sm">
                          Tap card to flip & unlock details! 🔍
                        </p>
                      </div>

                      <div className="flex justify-center items-center gap-2 text-white/90 text-xs font-extrabold uppercase tracking-wider border-t border-white/15 pt-4">
                        <RefreshCw className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
                        Click to reveal details
                      </div>
                    </div>

                    {/* Back Side - Cool, magical indigo/purple/pink gradient */}
                    <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 rounded-3xl p-8 flex flex-col justify-between shadow-2xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white border-none">
                      
                      {/* Render Confetti Particles if active */}
                      {particles.map(p => (
                        <span
                          key={p.id}
                          className="absolute left-1/2 top-1/2 rounded-full pointer-events-none animate-particle z-50 shadow-md"
                          style={{
                            backgroundColor: p.color,
                            width: `${p.size}px`,
                            height: `${p.size}px`,
                            '--dx': p.dx,
                            '--dy': p.dy,
                          } as React.CSSProperties}
                        />
                      ))}

                      <div className="flex justify-between items-center">
                        <span className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md text-white font-extrabold rounded-full text-xs uppercase tracking-wider border border-white/20 shadow-sm">
                          📖 Details Checklist
                        </span>
                        {isAllChecked ? (
                          <span className="text-xs text-yellow-300 font-extrabold flex items-center gap-1 animate-bounce bg-white/25 px-3 py-1 rounded-full border border-white/20 shadow-md">
                            <Award className="w-4 h-4 text-yellow-300" /> +10 XP Card Mastered!
                          </span>
                        ) : (
                          <span className="text-xs text-white/85 font-extrabold bg-black/10 px-3 py-1 rounded-full border border-white/5">
                            Read & Check items to finish
                          </span>
                        )}
                      </div>

                      {/* Interactive Checklist sentences */}
                      <div className="my-auto space-y-3.5 overflow-y-auto max-h-[190px] pr-2 custom-scrollbar">
                        {parsed.sentences.map((sentence, idx) => {
                          const itemKey = `${currentStep}-${idx}`;
                          const isChecked = checkedItems[itemKey] || false;
                          return (
                            <div
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation(); // Avoid flipping when checking
                                handleCheckItem(itemKey, !isChecked, cardSentencesCount);
                              }}
                              className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-300 ${
                                isChecked
                                  ? 'bg-white/20 border-white/40 text-yellow-100 shadow-md scale-[1.01]'
                                  : 'bg-black/15 border-white/10 text-white/90 hover:bg-black/25'
                              }`}
                            >
                              <div className={`mt-0.5 h-6 w-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all ${
                                isChecked
                                  ? 'bg-yellow-400 border-yellow-400 text-indigo-900 shadow-sm scale-110'
                                  : 'border-white/40'
                              }`}>
                                {isChecked && <span className="font-extrabold text-xs">✓</span>}
                              </div>
                              <span className={`text-base leading-relaxed transition-all duration-300 ${isChecked ? 'line-through opacity-70' : 'font-bold'}`}>
                                {renderInlineMarkdown(sentence, adaptedLesson.vocabulary || lesson.vocabulary || [])}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex justify-between items-center border-t border-white/15 pt-4">
                        <span className="text-xs text-white/90 font-extrabold flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-yellow-300 animate-pulse" /> Progress: {cardCheckedCount} of {cardSentencesCount} read
                        </span>
                        <span className="text-xs text-white/90 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} /> Click to flip back
                        </span>
                      </div>
                    </div>

                  </div>
                </div>
              ) : profile === 'id' ? (
                /* Intellectual Disability Fact Card with visual integration */
                <div className="w-full min-h-[400px] theme-surface p-8 rounded-3xl border-2 border-indigo-400 shadow-xl flex flex-col justify-between bg-gradient-to-br from-indigo-50/50 to-purple-50/30 dark:from-indigo-950/20 dark:to-purple-950/10 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-extrabold rounded-full text-xs uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
                      💡 Fact {currentStep + 1} of {stepBlocks.length}
                    </span>
                  </div>

                  <div className="my-auto space-y-6">
                    {activeStep.type === 'media' && activeStep.media && (
                      <div className="max-w-md mx-auto">
                        <img 
                          src={activeStep.media.url} 
                          alt={activeStep.media.alt || 'Fact illustration'} 
                          className="w-full max-h-[220px] object-cover rounded-2xl border theme-border shadow-md"
                        />
                        {activeStep.media.alt && (
                          <p className="text-xs theme-text-muted mt-2 text-center italic bg-black/5 dark:bg-white/5 py-1.5 px-3 rounded-lg">
                            {activeStep.media.alt}
                          </p>
                        )}
                      </div>
                    )}
                    {activeStep.type === 'media' && activeStep.text && (
                      <h3 className="text-2xl md:text-3xl font-black text-center text-indigo-950 dark:text-indigo-200 leading-relaxed max-w-xl mx-auto">
                        {renderInlineMarkdown(activeStep.text, adaptedLesson.vocabulary || lesson.vocabulary || [])}
                      </h3>
                    )}
                    {activeStep.type === 'bullets' && (
                      <div className="space-y-4">
                        {activeStep.heading && (
                          <h3 className="text-xl font-bold text-indigo-700 dark:text-indigo-400 text-center mb-4">
                            {activeStep.heading}
                          </h3>
                        )}
                        <div className="grid gap-3 max-w-xl mx-auto">
                          {activeStep.items?.map((item: string, idx: number) => (
                            <div key={idx} className="bg-indigo-50/50 dark:bg-indigo-900/10 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 flex items-start gap-4 shadow-sm hover:scale-[1.01] transition-transform">
                              <span className="text-2xl mt-0.5" role="presentation">👉</span>
                              <span className="text-lg md:text-xl font-bold text-indigo-950 dark:text-indigo-200 leading-relaxed">
                                {renderInlineMarkdown(item, adaptedLesson.vocabulary || lesson.vocabulary || [])}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center items-center gap-2 text-indigo-500 text-xs font-extrabold uppercase tracking-wider border-t theme-border pt-4 mt-6">
                    Concrete Summary Card
                  </div>
                </div>
              ) : (
                /* Dyslexic High-Legibility Card with heavy letter/line spacing */
                <div className="w-full min-h-[400px] theme-surface p-8 rounded-3xl border-2 border-emerald-400 dark:border-emerald-600 shadow-xl flex flex-col justify-between tracking-wide font-sans leading-loose bg-gradient-to-br from-emerald-50/30 to-teal-50/10 dark:from-emerald-950/10 dark:to-teal-950/5 animate-fade-in">
                  <div className="flex justify-between items-center mb-6">
                    <span className="inline-block px-4 py-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-extrabold rounded-full text-xs uppercase tracking-wider border border-emerald-200 dark:border-emerald-800">
                      📖 Section {currentStep + 1} of {stepBlocks.length}
                    </span>
                  </div>

                  <div className="my-auto space-y-6">
                    {activeStep.type === 'bullets' && (
                      <div className="space-y-4">
                        {activeStep.heading && (
                          <h3 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-400 mb-4" style={{ letterSpacing: '0.04em' }}>
                            {activeStep.heading}
                          </h3>
                        )}
                        <ul className="space-y-4 list-disc pl-6 text-xl md:text-2xl theme-text font-medium" style={{ letterSpacing: '0.05em', lineHeight: '1.8' }}>
                          {activeStep.items?.map((item: string, idx: number) => (
                            <li key={idx} className="pl-2">
                              {renderInlineMarkdown(item, adaptedLesson.vocabulary || lesson.vocabulary || [])}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {activeStep.type === 'markdown' && (
                      <div className="space-y-4">
                        {activeStep.heading && (
                          <h3 className="text-2xl font-extrabold text-emerald-800 dark:text-emerald-400 mb-4" style={{ letterSpacing: '0.04em' }}>
                            {activeStep.heading}
                          </h3>
                        )}
                        <div className="text-xl md:text-2xl theme-text font-medium" style={{ letterSpacing: '0.05em', lineHeight: '1.9' }}>
                          {renderMarkdown(activeStep.text || '', adaptedLesson.vocabulary || lesson.vocabulary || [])}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center items-center gap-2 text-emerald-500 text-xs font-extrabold uppercase tracking-wider border-t theme-border pt-4 mt-6">
                    Dyslexia Friendly Layout
                  </div>
                </div>
              )}

              {/* Focus Ambient Noise Panel */}
              <div className="flex flex-col sm:flex-row items-center justify-between bg-gray-50/50 dark:bg-gray-800/10 backdrop-blur-md border border-gray-200/50 dark:border-gray-800/50 rounded-2xl p-4 gap-4 text-sm font-medium">
                <div className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary animate-pulse" />
                  <span className="font-bold theme-text">Focus Ambient Sounds:</span>
                </div>
                <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl gap-1">
                  {[
                    { id: 'off', label: 'Off', icon: VolumeX },
                    { id: 'brown', label: 'Space Noise', icon: Music },
                    { id: 'rain', label: 'Soft Rain', icon: Music },
                    { id: 'ocean', label: 'Ocean Waves', icon: Music }
                  ].map(s => {
                    const Icon = s.icon;
                    const isSelected = focusSound === s.id;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setFocusSound(s.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                          isSelected
                            ? 'bg-primary text-white shadow-md scale-105'
                            : 'theme-text-muted hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Navigation controls */}
              <div className="flex justify-between items-center border-t theme-border pt-6">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="font-bold py-2.5 px-6 rounded-xl theme-text hover:bg-primary/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all border border-transparent hover:border-theme-border"
                >
                  Previous Card
                </button>
                <button
                  onClick={() => setCurrentStep(Math.min(stepBlocks.length - 1, currentStep + 1))}
                  disabled={currentStep === stepBlocks.length - 1}
                  className="flex items-center gap-2 font-bold py-2.5 px-6 rounded-xl bg-primary text-white hover:bg-primary-dark disabled:opacity-30 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
                >
                  Next Card <ChevronRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })() : (
          adaptedLesson.blocks.map((block: AdaptedLessonBlock) => (
            <BlockRenderer key={block.id} block={block} vocabulary={adaptedLesson.vocabulary || lesson.vocabulary || []} compact={isSimpleLayout} />
          ))
        )}
      </article>

      {lesson.media && lesson.media.length > 0 && (
        <section className="mt-8 p-6 theme-surface border theme-border rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b theme-border pb-3">
            <Sparkles className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-bold theme-text">Visual Aids & Lesson Gallery</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {lesson.media.map((item: any, idx: number) => (
              <div key={idx} className="group relative overflow-hidden rounded-xl border theme-border bg-white dark:bg-gray-900 shadow-sm hover:shadow-md transition-all duration-300">
                <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img
                    src={item.url}
                    alt={item.alt}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 bg-gray-50/50 dark:bg-gray-950/20 border-t theme-border">
                  <p className="text-xs font-bold theme-text leading-normal line-clamp-2" title={item.alt}>
                    {item.alt || `Figure ${idx + 1}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}


    </div>
  );
};
