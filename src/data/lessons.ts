// DEPRECATED: Lesson catalog is now fully PostgreSQL-driven.
// Static file remains only for type system compatibility.
import type { LessonContent } from '../types';

export const lessonCatalog: LessonContent[] = [];

export const getLessonBySlug = (_slug = 'solar-system') => {
  return null;
};
