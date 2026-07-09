import type {
  AdaptedLesson,
  AdaptedLessonBlock,
  AdaptiveEngineTrace,
  LessonContent
} from '../types';
import type { AccessibilityProfile } from '../contexts/AccessibilityContext';

const rules: Record<AccessibilityProfile, {
  layout: AdaptedLesson['layout'];
  complexity: AdaptedLesson['complexity'];
  summary: string;
  operations: string[];
}> = {
  typical: {
    layout: 'standard',
    complexity: 'standard',
    summary: 'Structured textbook content with headings, paragraphs, and supporting media.',
    operations: ['Segmented textbook content by heading', 'Preserved academic vocabulary']
  },
  blind: {
    layout: 'screen-reader-structured',
    complexity: 'standard',
    summary: 'Screen-reader friendly structure with descriptive media alt text and clear navigation.',
    operations: ['Added image descriptions inline', 'Kept headings explicit', 'Optimized content order for screen readers']
  },
  'low-vision': {
    layout: 'free-flow-high-contrast',
    complexity: 'standard',
    summary: 'Free-flow layout for magnification with concise chunks and high contrast support.',
    operations: ['Shortened line chunks', 'Kept content in a single readable column', 'Enabled read-aloud affordance']
  },
  deaf: {
    layout: 'short-visual',
    complexity: 'simplified',
    summary: 'Short visual lesson with simplified text and vocabulary support.',
    operations: ['Reduced content to 5-7 short lines', 'Added vocabulary definitions', 'Prioritized visual media']
  },
  dyslexic: {
    layout: 'bulleted-high-spacing',
    complexity: 'simplified',
    summary: 'Bulleted, high-spacing content with key facts surfaced first.',
    operations: ['Converted paragraphs to bullets', 'Reduced sentence length', 'Grouped related facts']
  },
  id: {
    layout: 'simple-picture-first',
    complexity: 'foundational',
    summary: 'Picture-first lesson using literal, concrete statements.',
    operations: ['Reduced concepts to concrete facts', 'Paired text with images', 'Removed abstract terminology']
  },
  'adhd-autism': {
    layout: 'step-by-step-low-distraction',
    complexity: 'guided',
    summary: 'Low-distraction step flow with one concept visible at a time.',
    operations: ['Split lesson into sequential steps', 'Reduced visual density', 'Added progress indicator']
  }
};

const splitSentences = (text: string) => {
  return text
    .split(/(?<=[.!?])\s+/)
    .map(sentence => sentence.trim())
    .filter(Boolean);
};

const simplifySentence = (text: string) => {
  return text
    .replace('gravitationally bound system of the Sun and the objects that orbit it', 'Sun and all objects moving around it')
    .replace('gravitational collapse of a giant interstellar molecular cloud', 'collapse of a huge gas and dust cloud')
    .replace('terrestrial planets', 'rocky planets')
    .replace('primarily', 'mostly')
    .replace('volatiles such as water, ammonia, and methane', 'materials such as water, ammonia, and methane');
};

const createTrace = (
  profile: AccessibilityProfile,
  source: LessonContent,
  contentBlocks: AdaptedLessonBlock[]
): AdaptiveEngineTrace => ({
  profile,
  sourceLessonId: source.id,
  sourceSegments: source.segments.length,
  outputBlocks: contentBlocks.length,
  operations: rules[profile].operations,
  generatedAt: new Date().toISOString()
});

const createStandardBlocks = (lesson: LessonContent, profile: AccessibilityProfile): AdaptedLessonBlock[] => {
  const blocks: AdaptedLessonBlock[] = [];

  if (profile === 'blind' || profile === 'low-vision') {
    blocks.push({
      id: 'media-description',
      type: 'callout',
      heading: 'Media Description',
      text: lesson.media.map(item => item.alt).join(' ')
    });
  }

  lesson.segments.forEach(segment => {
    blocks.push({
      id: segment.id,
      type: 'markdown',
      heading: segment.heading,
      text: segment.sourceText
    });
  });

  return blocks;
};

const createDeafBlocks = (lesson: LessonContent): AdaptedLessonBlock[] => {
  const blocks: AdaptedLessonBlock[] = [
    {
      id: 'deaf-visual-intro',
      type: 'media',
      heading: 'Visual Lesson',
      text: 'Sign language video translation.',
      media: lesson.media && lesson.media[0] ? lesson.media[0] : undefined
    }
  ];
  
  lesson.segments.forEach((segment, index) => {
    blocks.push({
      id: `deaf-bullets-${segment.id || index}`,
      type: 'bullets',
      heading: segment.heading || 'Key Ideas',
      items: splitSentences(segment.sourceText || '')
    });
  });
  
  if (lesson.vocabulary && lesson.vocabulary.length > 0) {
    blocks.push({
      id: 'deaf-vocabulary',
      type: 'vocabulary',
      heading: 'New Words',
      vocabulary: lesson.vocabulary
    });
  }
  
  return blocks;
};

const createDyslexicBlocks = (lesson: LessonContent): AdaptedLessonBlock[] => {
  return lesson.segments.map((segment, index) => ({
    id: `dyslexic-block-${segment.id || index}`,
    type: 'bullets',
    heading: segment.heading || (index === 0 ? 'Key Facts' : 'Important Concepts'),
    items: splitSentences(segment.sourceText || '').map(simplifySentence)
  }));
};

const createIdBlocks = (lesson: LessonContent): AdaptedLessonBlock[] => {
  const blocks: AdaptedLessonBlock[] = [];
  let mediaIdx = 0;
  
  lesson.segments.forEach((segment, segIdx) => {
    const sentences = splitSentences(segment.sourceText || '');
    sentences.forEach((sentence, sIdx) => {
      const hasMedia = lesson.media && lesson.media[mediaIdx];
      blocks.push({
        id: `id-block-${segIdx}-${sIdx}`,
        type: 'media',
        heading: segment.heading ? `${segment.heading} - Fact ${sIdx + 1}` : `Fact ${sIdx + 1}`,
        text: sentence,
        media: hasMedia ? lesson.media[mediaIdx] : undefined
      });
      if (hasMedia) mediaIdx = (mediaIdx + 1) % lesson.media.length;
    });
  });
  
  if (blocks.length === 0) {
    blocks.push({
      id: 'id-block-fallback',
      type: 'media',
      heading: lesson.title,
      text: 'Visual lesson overview.',
      media: lesson.media && lesson.media[0] ? lesson.media[0] : undefined
    });
  }
  return blocks;
};

const createAdhdBlocks = (lesson: LessonContent): AdaptedLessonBlock[] => {
  const blocks: AdaptedLessonBlock[] = [];
  if (lesson.segments && lesson.segments.length > 0) {
    lesson.segments.forEach((segment, index) => {
      blocks.push({
        id: `step-${segment.id || index}`,
        type: 'step',
        heading: segment.heading || `${lesson.title} - Step ${index + 1}`,
        text: segment.sourceText
      });
    });
  } else {
    const sentences = splitSentences(lesson.fullText || '');
    sentences.forEach((sentence, index) => {
      blocks.push({
        id: `step-${index}`,
        type: 'step',
        heading: `Step ${index + 1}`,
        text: sentence
      });
    });
  }
  if (blocks.length === 0) {
    blocks.push({
      id: 'step-fallback',
      type: 'step',
      heading: 'Introduction',
      text: 'Welcome to this lesson step-by-step overview.'
    });
  }
  return blocks;
};

const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('laams_jwt_token');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

import i18n from '../i18n';

export const adaptiveLearningService = {
  async adaptLesson(lesson: LessonContent, profile: AccessibilityProfile): Promise<AdaptedLesson> {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/lessons/adapt`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify({ lesson, profile, lang: i18n.language })
      });
      if (response.ok) {
        const data = await response.json();
        return {
          lessonId: lesson.id,
          title: lesson.title,
          subject: lesson.subject,
          profile,
          layout: rules[profile].layout,
          complexity: rules[profile].complexity,
          summary: rules[profile].summary,
          blocks: data.blocks,
          trace: data.trace,
          vocabulary: data.vocabulary || lesson.vocabulary || []
        };
      }
    } catch (e) {
      console.warn('Failed to contact adaptive engine, falling back to local heuristic rules', e);
    }

    let blocks: AdaptedLessonBlock[];

    switch (profile) {
      case 'deaf':
        blocks = createDeafBlocks(lesson);
        break;
      case 'dyslexic':
        blocks = createDyslexicBlocks(lesson);
        break;
      case 'id':
        blocks = createIdBlocks(lesson);
        break;
      case 'adhd-autism':
        blocks = createAdhdBlocks(lesson);
        break;
      case 'blind':
      case 'low-vision':
      case 'typical':
      default:
        blocks = createStandardBlocks(lesson, profile);
        break;
    }

    return {
      lessonId: lesson.id,
      title: lesson.title,
      subject: lesson.subject,
      profile,
      layout: rules[profile].layout,
      complexity: rules[profile].complexity,
      summary: rules[profile].summary,
      blocks,
      trace: createTrace(profile, lesson, blocks),
      vocabulary: lesson.vocabulary || []
    };
  }
};
