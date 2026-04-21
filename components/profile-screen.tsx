'use client'

import { useState, useMemo } from 'react'
import { ArrowLeft, CheckCircle2, Lock, Menu } from 'lucide-react'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SideMenu } from '@/components/side-menu'
import { usePiAuth } from '@/contexts/pi-auth-context'

interface ProfileScreenProps {
  onBack: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
  completedLessons?: number[]
  onOpenLessonDetail?: () => void
  onNavigateToFaculties?: () => void
  onNavigateToCertificate?: () => void
}

const TOTAL_LESSONS = 52
const BLOCKS_DATA = [
  { id: 1, lessons: 7 },
  { id: 2, lessons: 8 },
  { id: 3, lessons: 8 },
  { id: 4, lessons: 6 },
  { id: 5, lessons: 6 },
  { id: 6, lessons: 10 },
  { id: 7, lessons: 3 },
  { id: 8, lessons: 4 },
]

// Mock user data - in real app, this would come from Pi Network
const MOCK_USER = {
  piUsername: 'pioneer_crypto',
  avatar: '👤',
}

const content = {
  en: {
    profile: 'Profile',
    progress: 'Your Progress',
    lessonsCompleted: 'lessons completed',
    blocks: 'Blocks Progress',
    continueLearning: 'Continue Learning',
    certificate: 'Claim Certificate',
    certificateLocked: 'Complete all lessons to unlock',
    foundationCompleted: 'Foundation Completed',
    foundationInProgress: 'Foundation in Progress',
  },
  ru: {
    profile: 'Профиль',
    progress: 'Ваш прогресс',
    lessonsCompleted: 'уроков завершено',
    blocks: 'Прогресс блоков',
    continueLearning: 'Продолжить обучение',
    certificate: 'Получить сертификат',
    certificateLocked: 'Завершите все уроки',
    foundationCompleted: 'Foundation завершен',
    foundationInProgress: 'Foundation в процессе',
  },
}

export function ProfileScreen({
  onBack,
  language,
  onLanguageChange,
  completedLessons = [],
  onOpenLessonDetail,
  onNavigateToFaculties,
  onNavigateToCertificate,
}: ProfileScreenProps) {
  const t = content[language]
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { userData, isAuthenticated } = usePiAuth()

  const handleMenuNavigation = (page: string) => {
    console.log('[ProfileScreen] Menu navigation:', page)
    if (page === 'myLessons') {
      onOpenLessonDetail?.()
    } else if (page === 'faculties') {
      onNavigateToFaculties?.()
    } else if (page === 'certificate') {
      onNavigateToCertificate?.()
    } else if (page === 'profile') {
      // Already on profile, just close menu
      setIsMenuOpen(false)
      return
    }
    setIsMenuOpen(false)
  }

  // Use real user data from Pi SDK, fallback to placeholder if not available
  const piUsername = userData.username || 'Pioneer'
  const avatar = userData.avatar || '👤'

  // Calculate completion status and progress
  const completedCount = completedLessons.length
  const progressPercent = Math.round((completedCount / TOTAL_LESSONS) * 100)
  const xpTotal = completedCount * 10
  const allLessonsCompleted = completedCount === TOTAL_LESSONS

  // Determine status - use English status text always
  const status = allLessonsCompleted
    ? 'Foundation Completed'
    : 'Foundation in Progress'

  // Calculate block completion status
  const blockStatus = useMemo(() => {
    let lessonIndex = 1
    return BLOCKS_DATA.map((block) => {
      const blockLessons = Array.from(
        { length: block.lessons },
        (_, i) => lessonIndex + i
      )
      lessonIndex += block.lessons

      const completedInBlock = blockLessons.filter((lesson) =>
        completedLessons.includes(lesson)
      ).length

      if (completedInBlock === block.lessons) {
        return 'completed'
      } else if (completedInBlock > 0) {
        return 'in-progress'
      } else {
        return block.id === 1 ? 'in-progress' : 'locked'
      }
    })
  }, [completedLessons])

  // Find next incomplete lesson
  const nextIncompleteLesson = useMemo(() => {
    for (let i = 1; i <= TOTAL_LESSONS; i++) {
      if (!completedLessons.includes(i)) {
        return i
      }
    }
    return null
  }, [completedLessons])

  return (
    <div className="min-h-screen bg-background text-foreground pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b border-border/10">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-lg font-semibold">{t.profile}</h1>
          <div className="flex items-center gap-2">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-10">
        {/* User Section */}
        <div className="flex items-center gap-5 pb-8 border-b border-border/10">
          <div className="text-6xl">{avatar}</div>
          <div className="flex-1">
            <p className="text-2xl font-semibold">{piUsername}</p>
            <p className="text-sm text-muted-foreground mt-2">{status}</p>
          </div>
        </div>

        {/* Progress Card */}
        <div className="space-y-5">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t.progress}</h2>
            <span className="text-2xl font-bold text-primary">{progressPercent}%</span>
          </div>
          <div className="space-y-3">
            <div className="w-full bg-muted/50 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-accent via-primary to-accent h-full transition-all duration-700 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground font-medium">
              {completedCount} of {TOTAL_LESSONS} {t.lessonsCompleted}
            </p>
          </div>
        </div>

        {/* Blocks Progress */}
        <div className="space-y-5">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">{t.blocks}</h2>
          <div className="grid grid-cols-8 gap-3">
            {blockStatus.map((status, index) => {
              const blockNum = index + 1
              const isCompleted = status === 'completed'
              const isInProgress = status === 'in-progress'
              const isLocked = status === 'locked'
              
              return (
                <div
                  key={blockNum}
                  className={`flex items-center justify-center aspect-square rounded-lg transition-all duration-200 ${
                    isCompleted
                      ? 'bg-green-500/20 border border-green-500/50 shadow-sm'
                      : isInProgress
                      ? 'bg-primary/15 border border-primary/40 shadow-sm'
                      : 'bg-muted/40 border border-border/30'
                  }`}
                  title={`Block ${blockNum}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 size={20} className="text-green-500" strokeWidth={2.5} />
                  ) : isLocked ? (
                    <Lock size={16} className="text-muted-foreground/40" strokeWidth={2} />
                  ) : (
                    <span className="text-xs font-bold text-primary">{blockNum}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-6">
          {nextIncompleteLesson && (
            <button
              onClick={onOpenLessonDetail}
              className="w-full px-4 py-4 bg-gradient-to-r from-accent to-primary hover:from-accent/90 hover:to-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {t.continueLearning}
            </button>
          )}
          <button
            disabled={!allLessonsCompleted}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              allLessonsCompleted
                ? 'bg-green-500/20 border border-green-500/40 text-green-400 hover:bg-green-500/30'
                : 'bg-muted/30 border border-border/30 text-muted-foreground cursor-not-allowed'
            }`}
          >
            {allLessonsCompleted ? t.certificate : t.certificateLocked}
          </button>
        </div>
      </div>

      {/* Side Menu */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        language={language}
        onNavigate={handleMenuNavigation}
      />
    </div>
  )
}
