/**
 * Lesson Progress Utility
 * Maps between lesson numbers and unique lesson IDs
 * Used to track progress across all languages uniformly
 * 
 * IMPORTANT: Lesson IDs are language-independent
 * - Block 1 lessons: lesson_1 through lesson_8
 * - Intro lessons: intro_lesson_1, intro_lesson_2
 * 
 * When a lesson is completed in any language, it's marked as completed globally.
 * This ensures that if a user completes Lesson 2 in English, and then switches to Russian,
 * Lesson 2 will already show as completed and Lesson 3 will be available (unlocked).
 */

// Mapping of lesson numbers (1-8) to unique lesson IDs
const LESSON_ID_MAP: Record<number, string> = {
  1: 'lesson_1',
  2: 'lesson_2',
  3: 'lesson_3',
  4: 'lesson_4',
  5: 'lesson_5',
  6: 'lesson_6',
  7: 'lesson_7',
  8: 'lesson_8',
  101: 'intro_lesson_1', // Intro lessons
  102: 'intro_lesson_2',
}

// Reverse mapping for converting lesson IDs back to numbers
const LESSON_NUMBER_MAP: Record<string, number> = Object.entries(LESSON_ID_MAP).reduce(
  (acc, [num, id]) => {
    acc[id] = parseInt(num, 10)
    return acc
  },
  {} as Record<string, number>
)

/**
 * Convert lesson number to unique lesson ID
 */
export function getLessonId(lessonNumber: number): string {
  return LESSON_ID_MAP[lessonNumber] || `lesson_${lessonNumber}`
}

/**
 * Convert lesson ID back to lesson number
 */
export function getLessonNumber(lessonId: string): number {
  return LESSON_NUMBER_MAP[lessonId] || 0
}

/**
 * Migrate old numeric progress storage to new ID-based storage
 * Called once on app initialization
 */
export function migrateProgress(): void {
  try {
    const oldProgress = localStorage.getItem('completed_lessons')
    const newProgress = localStorage.getItem('completed_lessons_v2')

    // If v2 already exists, migration is done
    if (newProgress) {
      return
    }

    // If v1 exists, migrate it
    if (oldProgress) {
      try {
        const completedNumbers: number[] = JSON.parse(oldProgress)
        const completedIds: string[] = completedNumbers
          .map((num) => getLessonId(num))
          .filter((id) => id) // Filter out undefined mappings

        localStorage.setItem('completed_lessons_v2', JSON.stringify(completedIds))
        console.log('[LessonProgress] Migrated progress to ID-based storage:', completedIds)
      } catch (e) {
        console.error('[LessonProgress] Failed to migrate progress:', e)
      }
    }
  } catch (e) {
    console.error('[LessonProgress] Migration error:', e)
  }
}

/**
 * Get completed lesson IDs from storage
 */
export function getCompletedLessonIds(): string[] {
  try {
    const stored = localStorage.getItem('completed_lessons_v2')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (e) {
    console.error('[LessonProgress] Failed to parse completed lesson IDs:', e)
  }
  return []
}

/**
 * Save completed lesson IDs to storage
 */
export function saveCompletedLessonIds(lessonIds: string[]): void {
  try {
    localStorage.setItem('completed_lessons_v2', JSON.stringify(lessonIds))
  } catch (e) {
    console.error('[LessonProgress] Failed to save completed lesson IDs:', e)
  }
}

/**
 * Add a completed lesson by number (for internal use)
 */
export function addCompletedLessonByNumber(lessonNumber: number): string[] {
  const lessonId = getLessonId(lessonNumber)
  if (!lessonId) return getCompletedLessonIds()

  const current = getCompletedLessonIds()
  if (!current.includes(lessonId)) {
    current.push(lessonId)
    saveCompletedLessonIds(current)
  }
  return current
}

/**
 * Check if a lesson is completed by number
 */
export function isLessonCompletedByNumber(lessonNumber: number): boolean {
  const lessonId = getLessonId(lessonNumber)
  return lessonId ? getCompletedLessonIds().includes(lessonId) : false
}

/**
 * Convert completed lesson numbers to IDs (for migration from old prop format)
 */
export function convertNumbersToIds(numbers: number[]): string[] {
  return numbers
    .map((num) => getLessonId(num))
    .filter((id) => id)
}

/**
 * Convert completed lesson IDs to numbers (for backward compatibility)
 */
export function convertIdsToNumbers(ids: string[]): number[] {
  return ids
    .map((id) => getLessonNumber(id))
    .filter((num) => num > 0)
}
