## Unified Lesson System - Implementation Summary

### Changes Made

#### 1. **New Lesson Database (`/lib/lessons-db.ts`)**
- Created a unified lesson structure where each lesson has ONE unique ID
- Lesson IDs: `lesson_1` through `lesson_8` for Block 1, `intro_lesson_1` and `intro_lesson_2` for intro
- Each lesson stores both Russian (`_ru`) and English (`_en`) content
- No separate IDs for different languages - same ID for all languages
- Functions:
  - `getLesson(lessonId, language)` - Returns lesson with localized content
  - `lessonNumberToId(number)` - Converts lesson number to ID

#### 2. **Updated Lesson Detail Component (`/components/lesson-detail.tsx`)**
- Changed `lessonId` prop from `number` to `string` (e.g., `'lesson_1'`)
- Uses `getLesson()` to fetch localized content
- Automatically renders correct language content based on passed language parameter
- Fixed "Lesson not found" error by using centralized lesson database

#### 3. **Updated Foundation Screen (`/components/foundation-screen.tsx`)**
- Updated `selectedLessonId` state to store string IDs instead of numbers
- Modified `completeLesson()` to work with lesson numbers but convert to IDs for storage
- Updated `handleCompleteLessonDetail()` to work with lesson ID strings
- Passes lesson ID string directly to `LessonDetail` component
- Progress storage still uses IDs in `completedLessonIds` array

### How Progress Tracking Works

**Storage:**
- Primary: `completed_lessons_v2` - stores array of lesson IDs like `['lesson_1', 'lesson_2']`
- Secondary (backup): Numeric array for backward compatibility

**Cross-Language Sync:**
- When lesson `lesson_1` is completed, it's marked in storage as `lesson_1`
- User switches language: `getLesson('lesson_1', 'ru')` returns same lesson in Russian
- UI checks if `'lesson_1'` is in `completedLessonIds` - it is, shows as completed
- Unlock logic: `lesson_2` unlocks only if `lesson_1` is in completed array

### Lesson Unlock Logic

**Block Logic:**
- If `block1_unlocked = false` → show locked state
- If `block1_unlocked = true` → show lessons

**Lesson Unlocking:**
1. Lesson 1 - Always available when block is unlocked
2. Lesson 2+ - Unlock only after previous lesson is completed
   - Example: `lesson_3` unlocks only if `lesson_2` is in `completedLessonIds`

### Migration

- Existing progress is automatically migrated from numeric format to ID format
- Migration runs once on app startup via `migrateProgress()`
- Old storage (`completed_lessons`) is converted to new format (`completed_lessons_v2`)

### No Duplication

- Each lesson exists once with one ID
- Language is a parameter, not part of the ID
- Same ID is used in all languages
