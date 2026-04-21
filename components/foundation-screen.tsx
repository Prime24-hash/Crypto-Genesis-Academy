'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, CheckCircle2, Lock, LockOpen, ChevronDown, ChevronUp, X } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useAnalytics } from '@/contexts/analytics-context'
import { LessonDetail } from '@/components/lesson-detail'
import {
  getCompletedLessonIds,
  saveCompletedLessonIds,
  getLessonId,
  convertNumbersToIds,
  convertIdsToNumbers,
  migrateProgress,
} from '@/lib/lesson-progress'
import { lessonNumberToId } from '@/lib/lessons-db'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface FoundationScreenProps {
  onBack: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
  onOpenStats?: () => void
  completedLessons?: number[]
  onCompletedLessonsChange?: (lessons: number[]) => void
}

const content = {
  en: {
    foundation: 'Genesis Foundation',
    progress: 'Your Progress',
    lesson: 'Lesson',
    completed: 'Completed',
    available: 'Available',
    locked: 'Locked',
    start: 'Start',
    mainnetComingSoon: 'Available online only',
    totalLessons: 'lessons',
    unlockPrice: 'Test Pi',
    confirmUnlock: 'Unlock Block 1 for 3.14 Test Pi?',
    unlockSuccess: 'Block 1 is unlocked',
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  ru: {
    foundation: 'Genesis Foundation',
    progress: 'Ваш прогресс',
    lesson: 'Урок',
    completed: 'Завершено',
    available: 'Доступно',
    locked: 'Заблокировано',
    start: 'Начать',
    mainnetComingSoon: 'Доступно только онлайн',
    totalLessons: 'уроков',
    unlockPrice: 'Test Pi',
    confirmUnlock: 'Разблокировать Блок 1 за 3.14 Test Pi?',
    unlockSuccess: 'Блок 1 разблокирован',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
  },
}

// Course blocks structure: 1 introductory block with 2 lessons + 8 main blocks
const courseBlocks = {
  en: [
    {
      id: 'intro',
      title: 'Introductory Block (2 lessons)',
      lessons: 2,
      description: 'The first steps for absolute beginners. Understand what you will gain from the entire course and learn the most important basic concepts before moving on.',
      startLesson: 101,
      isIntro: true,
      lessonTitles: [
        'What will you get after completing the Genesis Foundation course',
        'Basic concepts in the Crypto industry',
      ],
      lessonDescriptions: [
        'The real advantages of the course, the certificate, asset protection skills and a clear training scheme.',
        'What is cryptocurrency in simple terms, why do ordinary people need it and how not to get confused in terminology.',
      ],
    },
    {
      id: 1,
      title: 'Block 1. Why Cryptocurrency Matters Today (8 lessons)',
      lessons: 8,
      description: 'Discover why cryptocurrencies are reshaping the global economy and what opportunities they create for you.',
      startLesson: 1,
      lessonTitles: [
        'Why Money Is Changing and What Comes Next',
        'How Cryptocurrency Is Already Changing the World',
        'What Opportunities Crypto Opens for Ordinary People',
        'Why Now Is the Best Time to Learn Crypto',
        'Main Risks of the Crypto Market and How to Prepare for Them',
        'Real Stories of People Who Came to Crypto',
        'Cryptocurrency and Familiar Finance — What\'s the Main Difference',
        'Your First Checklist: Are You Ready to Move Forward?',
      ],
      lessonDescriptions: [
        'A simple explanation of how money evolved and why cryptocurrency appeared.',
        'Real examples of how crypto is used today and how it impacts everyday life.',
        'What becomes possible without banks and intermediaries.',
        'Understanding the current stage of the market without hype or promises.',
        'What risks exist and how to understand them at a basic level.',
        'Common examples of different scenarios without income promises.',
        'Comparison of the banking system and cryptocurrency in simple terms.',
        'A brief checklist of what you should understand before the next block.',
      ],
    },
    {
      id: 2,
      title: 'Block 2. Security and Protection of Your Assets (7 lessons)',
      lessons: 7,
      description: 'Master the essential security practices to keep your crypto safe from threats and theft.',
      startLesson: 9,
    },
    {
      id: 3,
      title: 'Block 3. Wallets and Their Proper Use (8 lessons)',
      lessons: 8,
      description: 'Learn to choose, set up, and manage crypto wallets that keep your assets secure and accessible.',
      startLesson: 18,
    },
    {
      id: 4,
      title: 'Block 4. How Transactions Work in Crypto (6 lessons)',
      lessons: 6,
      description: 'Understand the mechanics of blockchain transactions and how money moves in the crypto world.',
      startLesson: 26,
    },
    {
      id: 5,
      title: 'Block 5. How Cryptocurrencies Are Created and Grow (6 lessons)',
      lessons: 6,
      description: 'Explore tokenomics and understand what drives cryptocurrency value and adoption.',
      startLesson: 32,
    },
    {
      id: 6,
      title: 'Block 6. Major Blockchains of the World (5 lessons)',
      lessons: 5,
      description: 'Learn about the leading blockchain platforms and the unique features of each ecosystem.',
      startLesson: 37,
    },
    {
      id: 7,
      title: 'Block 7. Pi Network - A New Chapter in Cryptocurrency (5 lessons)',
      lessons: 5,
      description: 'Discover what makes Pi Network innovative and why it&apos;s changing the crypto landscape.',
      startLesson: 42,
    },
    {
      id: 8,
      title: 'Block 8. Where to Go Next (5 lessons)',
      lessons: 5,
      description: 'Chart your path forward with confidence after mastering the Foundation knowledge.',
      startLesson: 47,
    },
  ],
  ru: [
    {
      id: 'intro',
      title: 'Вводный блок (2 урока)',
      lessons: 2,
      description: 'Первые шаги для абсолютного новичка. Пойми, что ты получишь от курса и разберись в базовых понятиях.',
      startLesson: 101,
      isIntro: true,
      lessonTitles: [
        'Что ты получишь после прохождения Genesis Foundation',
        'Базовые понятия криптоиндустрии',
      ],
      lessonDescriptions: [
        'Реальная польза курса, сертификат, навыки защиты активов и план обучения.',
        'Что такое криптовалюта простыми словами, зачем она нужна и как не запутаться в терминах.',
      ],
    },
    {
      id: 1,
      title: 'Блок 1. Почему криптовалюта важна сегодня (8 уроков)',
      lessons: 8,
      description: 'Узнайте, почему криптовалюты переформатируют глобальную экономику и какие возможности они создают.',
      startLesson: 1,
      lessonTitles: [
        'Почему деньги меняются и что приходит им на смену',
        'Как криптовалюта уже меняет мир вокруг нас',
        'Какие новые возможности открывает криптовалюта обычному человеку',
        'Почему именно сейчас — лучшее время изучать криптовалюту',
        'Главные риски крипторынка и как к ним подготовиться',
        'Реальные истории людей, которые пришли в крипту',
        'Криптовалюта и привычные финансы — в чём главная разница',
        'Твой первый чек-лист: готов ли ты двигаться дальше?',
      ],
      lessonDescriptions: [
        'Простое объяснение, как менялись деньги со временем и почему появилась криптовалюта.',
        'Примеры того, как криптовалюта уже используется сегодня и влияет на разные сферы жизни.',
        'Какие действия становятся доступными без банков и посредников.',
        'Объяснение текущего этапа развития рынка без обещаний и хайпа.',
        'Какие риски существуют и как их понимать на базовом уровне.',
        'Общие примеры разных сценариев без обещаний дохода.',
        'Сравнение банковской системы и криптовалюты простым языком.',
        'Краткий список того, что пользователь должен понять перед следующим блоком.',
      ],
    },
    {
      id: 2,
      title: 'Блок 2. Безопасность и защита твоих активов (7 уроков)',
      lessons: 7,
      description: 'Овладейте основными практиками безопасности для защиты вашей крипты от угроз и кражи.',
      startLesson: 9,
    },
    {
      id: 3,
      title: 'Блок 3. Кошельки и их правильное использование (8 уроков)',
      lessons: 8,
      description: 'Научитесь выбирать, настраивать и управлять крипто-кошельками, которые хранят и защищают активы.',
      startLesson: 18,
    },
    {
      id: 4,
      title: 'Блок 4. Как работают транзакции в крипте (6 уроков)',
      lessons: 6,
      description: 'Поймите механику блокчейн-транзакций и как движутся деньги в крипто-мире.',
      startLesson: 26,
    },
    {
      id: 5,
      title: 'Блок 5. Как создаются и растут криптовалюты (6 уроков)',
      lessons: 6,
      description: 'Изучите токеномику и поймите, что движет стоимостью и принятием криптовалют.',
      startLesson: 32,
    },
    {
      id: 6,
      title: 'Блок 6. Главные блокчейны мира (5 уроков)',
      lessons: 5,
      description: 'Узнайте о ведущих блокчейн-платформах и уникальных особенностях каждой экосистемы.',
      startLesson: 37,
    },
    {
      id: 7,
      title: 'Блок 7. Pi Network — новая глава криптоиндустрии (5 уроков)',
      lessons: 5,
      description: 'Откройте для себя, что делает Pi Network инновационной и почему она меняет крипто-ландшафт.',
      startLesson: 42,
    },
    {
      id: 8,
      title: 'Блок 8. Куда двигаться дальше (5 уроков)',
      lessons: 5,
      description: 'Определите свой путь вперёд с уверенностью после овладения Foundation знаниями.',
      startLesson: 47,
    },
  ],
}

export function FoundationScreen({
  onBack,
  language,
  onLanguageChange,
  onOpenStats,
  completedLessons: propCompletedLessons = [],
  onCompletedLessonsChange,
}: FoundationScreenProps) {
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([])
  const [completedLessons, setCompletedLessons] = useState<number[]>(propCompletedLessons)
  const [expandedBlocks, setExpandedBlocks] = useState<(number | string)[]>([]) // No blocks expanded by default
  const [block1Unlocked, setBlock1Unlocked] = useState(false)
  const [showUnlockDialog, setShowUnlockDialog] = useState(false)
  const [unlockMessage, setUnlockMessage] = useState<string | null>(null)
  const [foundationOpenTracked, setFoundationOpenTracked] = useState(false)
  const [introOpenTracked, setIntroOpenTracked] = useState(false)
  const [block1OpenTracked, setBlock1OpenTracked] = useState(false)
  const [unlockViewTracked, setUnlockViewTracked] = useState(false)
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null) // Changed from number to string (lesson ID)
  const t = content[language]
  const blocks = courseBlocks[language]
  const { recordFoundationOpen, recordLessonOpen, recordUnlockBlock1, recordOpenIntro, recordOpenBlock1, recordViewUnlock, recordClickUnlock, recordConfirmUnlock, recordBlockUnlocked } = useAnalytics()

  // Restore block_1_unlocked and completed_lessons from localStorage on mount
  useEffect(() => {
    // Perform migration from old numeric storage to new ID-based storage
    migrateProgress()

    const savedUnlockedState = localStorage.getItem('block_1_unlocked')
    const completedIds = getCompletedLessonIds()
    
    if (savedUnlockedState === 'true') {
      setBlock1Unlocked(true)
    }
    
    // Set completed lesson IDs (primary storage)
    setCompletedLessonIds(completedIds)
    
    // Also update the numeric version for backward compatibility with prop callbacks
    const completedNumbers = convertIdsToNumbers(completedIds)
    setCompletedLessons(completedNumbers)
  }, [])

  // Save completed lessons to localStorage whenever they change (using lesson IDs as primary storage)
  useEffect(() => {
    saveCompletedLessonIds(completedLessonIds)
    onCompletedLessonsChange?.(completedLessons)
  }, [completedLessonIds, completedLessons, onCompletedLessonsChange])

  // Track foundation open (once per screen load)
  useEffect(() => {
    if (!foundationOpenTracked) {
      recordFoundationOpen()
      setFoundationOpenTracked(true)
    }
  }, [recordFoundationOpen, foundationOpenTracked])

  // In Testnet: Block 1 has 8 lessons (Intro is free with 2 lessons)
  const block1Lessons = 8
  const isTestnet = true
  const block1Cost = 3.14

  const getTotalCompletedLessons = () => {
    // Count ALL lessons: intro (101, 102) + Block 1 (1-8)
    const allIds = ['intro_lesson_1', 'intro_lesson_2', 'lesson_1', 'lesson_2', 'lesson_3', 'lesson_4', 'lesson_5', 'lesson_6', 'lesson_7', 'lesson_8']
    return completedLessonIds.filter(id => allIds.includes(id)).length
  }

  const getIntroCompletedLessons = () => {
    // Count intro lessons (intro_lesson_1, intro_lesson_2)
    const introIds = ['intro_lesson_1', 'intro_lesson_2']
    return completedLessonIds.filter(id => introIds.includes(id)).length
  }

  const isIntroComplete = () => {
    // Both intro lessons must be completed
    return getIntroCompletedLessons() === 2
  }

  const getBlockProgress = (block: any) => {
    const blockLessons = Array.from(
      { length: block.lessons },
      (_, i) => block.startLesson + i
    )
    const blockLessonIds = blockLessons.map(num => getLessonId(num)).filter(id => id)
    const completedInBlock = blockLessonIds.filter(id => completedLessonIds.includes(id)).length
    return { completed: completedInBlock, total: block.lessons }
  }

  const handleUnlockBlock1 = () => {
    recordClickUnlock()
    setShowUnlockDialog(true)
  }

  const confirmUnlock = () => {
    recordConfirmUnlock()
    
    // Unlock Block 1 and save to localStorage
    setBlock1Unlocked(true)
    localStorage.setItem('block_1_unlocked', 'true')
    recordUnlockBlock1() // Track unlock event
    recordBlockUnlocked() // Track block unlocked
    
    setUnlockMessage(t.unlockSuccess)
    setShowUnlockDialog(false)
    
    // Clear message after 3 seconds
    setTimeout(() => setUnlockMessage(null), 3000)
  }

  const getStatus = (lessonNumber: number, block: any): 'available' | 'completed' | 'locked' => {
    const lessonIdStr = getLessonId(lessonNumber)
    
    // Already completed lessons stay completed
    if (completedLessonIds.includes(lessonIdStr)) return 'completed'

    // Intro block - Always available (free for all users)
    if (block.id === 'intro') {
      if (lessonNumber === 101 || lessonNumber === 102) return 'available'
      return 'locked'
    }

    // Block 1 - Check if block is unlocked via payment
    if (block.id === 1) {
      if (block1Unlocked) {
        // STRICT SEQUENTIAL: Only the first lesson is available when block is unlocked
        if (lessonNumber === 1) return 'available'
        
        // All other lessons lock until the previous one is completed
        if (lessonNumber > 1 && lessonNumber <= 8) {
          const prevLessonNumber = lessonNumber - 1
          const prevLessonId = getLessonId(prevLessonNumber)
          if (prevLessonId && completedLessonIds.includes(prevLessonId)) {
            // Previous lesson is completed, so this lesson becomes available
            return 'available'
          }
        }
      }
    }

    // All other cases: locked (including Blocks 2-8)
    return 'locked'
  }

  const getBlockUnlockStatus = (block: any) => {
    // For intro block, always show as fully accessible
    if (block.id === 'intro') {
      return 'fully-unlocked'
    }

    // For Block 1
    if (block.id === 1) {
      if (block1Unlocked) {
        return 'fully-unlocked'
      }
      // Block 1 is locked until unlocked
      return 'fully-locked'
    }

    // Blocks 2-8: Always locked (Mainnet only)
    return 'fully-locked'
  }

  const shouldShowUnlockButton = (block: any) => {
    // Show unlock button only for Block 1 when:
    // 1. Intro is complete
    // 2. Block 1 is not yet unlocked
    if (block.id === 1) {
      return isIntroComplete() && !block1Unlocked
    }
    return false
  }

  const completeLesson = (lessonNumber: number, block: any) => {
    const lessonIdStr = getLessonId(lessonNumber)
    
    // For intro lessons with detail content, open the lesson detail by ID
    // Can open completed lessons to review them
    if (block.isIntro && (lessonNumber === 101 || lessonNumber === 102)) {
      const status = getStatus(lessonNumber, block)
      // Allow opening if available or already completed (for review)
      if (status === 'available' || status === 'completed') {
        setSelectedLessonId(lessonIdStr) // Set lesson ID, not number
        recordLessonOpen(lessonNumber)
      }
      return
    }

    if (getStatus(lessonNumber, block) === 'available' && !completedLessonIds.includes(lessonIdStr)) {
      // Update lesson ID storage
      const newCompletedIds = [...completedLessonIds, lessonIdStr]
      setCompletedLessonIds(newCompletedIds)
      
      // Also update numeric version for backward compatibility
      const newCompletedNumbers = [...completedLessons, lessonNumber]
      setCompletedLessons(newCompletedNumbers)
      
      onCompletedLessonsChange?.(newCompletedNumbers)
      recordLessonOpen(lessonNumber)
    }
  }

  const handleCompleteLessonDetail = (lessonIdStr: string) => {
    // lessonIdStr is already a lesson ID like 'lesson_1', 'intro_lesson_1', etc.
    if (!completedLessonIds.includes(lessonIdStr)) {
      // Update lesson ID storage (primary)
      const newCompletedIds = [...completedLessonIds, lessonIdStr]
      setCompletedLessonIds(newCompletedIds)
      
      // For backward compatibility, also update numeric version if it's a recognized lesson ID
      const completedNumbers = convertIdsToNumbers([...completedLessonIds, lessonIdStr])
      setCompletedLessons(completedNumbers)
      
      onCompletedLessonsChange?.(completedNumbers)
    }
  }

  const toggleBlockExpanded = (blockId: number | string) => {
    const willExpand = !expandedBlocks.includes(blockId)
    
    // Track block open events
    if (willExpand) {
      if (blockId === 'intro' && !introOpenTracked) {
        recordOpenIntro()
        setIntroOpenTracked(true)
      }
      if (blockId === 1 && !block1OpenTracked) {
        recordOpenBlock1()
        setBlock1OpenTracked(true)
      }
    }
    
    setExpandedBlocks(prev =>
      prev.includes(blockId) ? prev.filter(id => id !== blockId) : [...prev, blockId]
    )
  }

  const progressPercent = (getTotalCompletedLessons() / block1Lessons) * 100

  // Show lesson detail if selected
  if (selectedLessonId) {
    return (
      <LessonDetail
        lessonId={selectedLessonId}
        language={language}
        onBack={() => setSelectedLessonId(null)}
        onComplete={() => {
          if (selectedLessonId) {
            handleCompleteLessonDetail(selectedLessonId)
            setSelectedLessonId(null)
          }
        }}
        isCompleted={selectedLessonId ? completedLessonIds.includes(selectedLessonId) : false}
      />
    )
  }

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-b from-secondary/20 to-background/0 px-4 py-4 flex-shrink-0 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">{t.foundation}</span>
          </button>

          <div className="flex items-center gap-1">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-card/80 rounded-xl p-3 border border-border/50">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              {t.progress}
            </p>
            <span className="text-sm font-bold text-primary">
              {getTotalCompletedLessons()} out of 52
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
        {/* Success Message */}
        {unlockMessage && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-start gap-2">
            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm font-semibold text-emerald-500">{unlockMessage}</p>
          </div>
        )}

        {/* Course Blocks */}
        <div className="space-y-3">
          {blocks.map((block) => {
            const isExpanded = expandedBlocks.includes(block.id)
            const blockProgress = getBlockProgress(block)
            const blockLessons = Array.from(
              { length: block.lessons },
              (_, i) => block.startLesson + i
            )

            // Get the unlock status of this block
            const unlockStatus = getBlockUnlockStatus(block)
            const isBlockAvailable = unlockStatus !== 'fully-locked'

            return (
              <div
                key={block.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  unlockStatus === 'fully-locked'
                    ? 'border-border/30 bg-card/30 opacity-60'
                    : 'border-emerald-500/50 bg-card/50'
                }`}
              >
                {/* Block Header */}
                <button
                  onClick={() => toggleBlockExpanded(block.id)}
                  disabled={unlockStatus === 'fully-locked'}
                  className={`w-full p-4 flex items-center justify-between transition-all ${
                    isBlockAvailable ? 'hover:bg-card/80' : 'cursor-not-allowed'
                  }`}
                >
                  <div className="text-left flex-1">
                    <h3 className="text-sm font-bold text-foreground mb-1">
                      {block.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-snug mb-2">
                      {block.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {blockProgress.completed} of {blockProgress.total} {t.totalLessons}
                    </p>
                  </div>

                  {/* Display appropriate icon */}
                  {isBlockAvailable && (
                    <div className="flex-shrink-0 ml-3 flex items-center gap-2">
                      <LockOpen size={20} className="text-emerald-500" />
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-emerald-500" />
                      ) : (
                        <ChevronDown size={20} className="text-muted-foreground" />
                      )}
                    </div>
                  )}

                  {unlockStatus === 'fully-locked' && (
                    <Lock size={20} className="text-muted-foreground ml-3" />
                  )}
                </button>

                {/* Block Lessons (Expanded) */}
                {isExpanded && isBlockAvailable && (
                  <div className="border-t border-border/50 px-4 py-2 space-y-2 bg-background/30">
                    {blockLessons.map((lessonId) => {
                      const status = getStatus(lessonId, block)

                      return (
                        <button
                          key={lessonId}
                          onClick={() => completeLesson(lessonId, block)}
                          disabled={status === 'locked'}
                          className={`w-full p-3 rounded-lg border transition-all text-left disabled:cursor-not-allowed flex items-center gap-3 ${
                            status === 'completed'
                              ? 'bg-card border-border hover:border-primary/50'
                              : status === 'available'
                                ? 'bg-secondary/10 border-secondary/50 hover:border-secondary/80 active:bg-secondary/20'
                                : 'bg-card/50 border-border/50 opacity-50'
                          }`}
                        >
                          {/* Icon */}
                          <div className="flex-shrink-0">
                            {status === 'completed' && (
                              <CheckCircle2 size={18} className="text-emerald-500" />
                            )}
                            {status === 'available' && (
                              <div className="w-4 h-4 rounded-full border-2 border-primary bg-primary/20" />
                            )}
                            {status === 'locked' && (
                              <Lock size={18} className="text-muted-foreground" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {block.lessonTitles ? (
                              <>
                                <p className="text-xs font-semibold text-foreground">
                                  {block.isIntro 
                                    ? block.lessonTitles[lessonId === 101 ? 0 : 1]
                                    : block.lessonTitles[lessonId - block.startLesson]
                                  }
                                </p>
                                {block.lessonDescriptions && (
                                  <p className="text-xs text-muted-foreground/70 mt-1.5 leading-snug">
                                    {block.isIntro 
                                      ? block.lessonDescriptions[lessonId === 101 ? 0 : 1]
                                      : block.lessonDescriptions[lessonId - block.startLesson]
                                    }
                                  </p>
                                )}
                              </>
                            ) : (
                              <>
                                <p className="text-xs font-semibold text-foreground">
                                  {`${t.lesson} ${lessonId}`}
                                </p>
                              </>
                            )}
                          </div>

                          {/* Start Button */}
                          {status === 'available' && (
                            <Button
                              size="sm"
                              className="flex-shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 text-xs h-6 px-2"
                            >
                              {t.start}
                            </Button>
                          )}
                        </button>
                      )
                    })}
                  </div>
                )}

                {/* Unlock Block 1 Button - Show only after intro is complete and Block 1 is not unlocked */}
                {shouldShowUnlockButton(block) && (
                  <>
                    {!unlockViewTracked && recordViewUnlock() && setUnlockViewTracked(true)}
                    <div className="border-t border-border/50 px-4 py-3 bg-background/30">
                      <Button
                        onClick={handleUnlockBlock1}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold py-2 h-auto"
                      >
                        <Lock size={16} className="mr-2" />
                        Unlock Block 1 ({block1Lessons} {t.totalLessons} • {block1Cost} {t.unlockPrice})
                      </Button>
                    </div>
                  </>
                )}

                {/* Available online only - For blocks beyond block 1 */}
                {unlockStatus === 'fully-locked' && !block.isIntro && block.id > 1 && (
                  <div className="border-t border-border/50 px-4 py-3 bg-background/30">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Lock size={16} />
                      <p className="text-xs font-semibold">{t.mainnetComingSoon}</p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Completion Message */}
        {getTotalCompletedLessons() === block1Lessons && (
          <div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 mt-2">
              <p className="text-sm font-semibold text-emerald-500 mb-1">
                {language === 'en' ? 'Congratulations!' : 'Поздравляем!'}
              </p>
              <p className="text-xs text-emerald-500/80">
                {language === 'en'
                  ? 'You have completed the Basic level! Professional faculties are available online.'
                  : 'Вы завершили Basic уровень! Профессиональные факультеты доступны онлайн.'}
              </p>
            </div>

            {/* Recommendation for Digital Protection */}
            <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mt-3">
              <p className="text-sm font-semibold text-primary mb-2">
                {language === 'en' ? 'Next Step Recommendation' : 'Рекомендация для следующего шага'}
              </p>
              <p className="text-xs text-primary/80 leading-relaxed">
                {language === 'en'
                  ? 'We strongly recommend starting with Digital Protection — it teaches you how to protect your assets and accounts in Pi Network.'
                  : 'Мы настоятельно рекомендуем начать с курса «Цифровая защита» — он научит вас защищать ваши активы и аккаунты в Pi Network.'}
              </p>
            </div>
          </div>
        )}

        {/* Future Blocks Notice */}
        {isTestnet && (
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 mt-2">
            <div className="flex items-start gap-2">
              <Lock size={16} className="text-accent flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-accent mb-1">
                  {language === 'en' ? 'Blocks 2 and Beyond' : 'Блоки 2 и выше'}
                </p>
                <p className="text-xs text-accent/80">
                  {t.mainnetComingSoon}
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Unlock Confirmation Dialog */}
      <AlertDialog open={showUnlockDialog} onOpenChange={setShowUnlockDialog}>
        <AlertDialogContent className="bg-card border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">
              {t.confirmUnlock}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end mt-4">
            <AlertDialogCancel className="bg-card border border-border hover:bg-card/80 text-foreground">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmUnlock}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {t.confirm}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
