'use client'

import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getLesson, LessonSection } from '@/lib/lessons-db'

interface LessonDetailProps {
  lessonId: string // Lesson ID like 'lesson_1', 'intro_lesson_1', etc.
  language: 'en' | 'ru'
  onBack: () => void
  onComplete: () => void
  isCompleted: boolean
}

export function LessonDetail({
  lessonId,
  language,
  onBack,
  onComplete,
  isCompleted
}: LessonDetailProps) {
  const lessonData = getLesson(lessonId, language)
  
  if (!lessonData) {
    return (
      <div className="w-full h-screen bg-background flex flex-col">
        <header className="bg-gradient-to-b from-secondary/20 to-background/0 px-4 py-4 flex-shrink-0 border-b border-border/30">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">{language === 'en' ? 'Back' : 'Назад'}</span>
          </button>
        </header>
        <main className="flex-1 flex items-center justify-center px-4">
          <p className="text-muted-foreground">{language === 'en' ? 'Lesson not found' : 'Урок не найден'}</p>
        </main>
      </div>
    )
  }

  const renderSection = (section: LessonSection, idx: number) => {
    if (section.type === 'greeting') {
      return (
        <div key={idx} className="space-y-2">
          {(section.content as string[]).map((text, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground">
              {text}
            </p>
          ))}
        </div>
      )
    }

    if (section.type === 'heading') {
      return (
        <h2 key={idx} className="text-base font-bold text-foreground mt-4 mb-2">
          {section.title}
        </h2>
      )
    }

    if (section.type === 'paragraph') {
      return (
        <p key={idx} className="text-sm leading-relaxed text-foreground">
          {section.content}
        </p>
      )
    }

    if (section.type === 'paragraphs') {
      return (
        <div key={idx} className="space-y-2">
          {(section.content as string[]).map((text, i) => (
            <p key={i} className="text-sm leading-relaxed text-foreground">
              {text}
            </p>
          ))}
        </div>
      )
    }

    if (section.type === 'list') {
      return (
        <div key={idx} className="space-y-3">
          {section.items?.map((item, i) => (
            <div key={i} className="bg-secondary/30 rounded-lg p-3">
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs leading-relaxed text-foreground/70 mt-1">{item.description}</p>
            </div>
          ))}
        </div>
      )
    }

    return null
  }

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-b from-secondary/20 to-background/0 px-4 py-4 flex-shrink-0 border-b border-border/30">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-primary hover:text-primary/80 transition-all mb-3"
        >
          <ArrowLeft size={20} />
          <span className="text-sm font-semibold">{language === 'en' ? 'Back' : 'Назад'}</span>
        </button>
        <h1 className="text-lg font-bold text-foreground leading-tight">{lessonData.title}</h1>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-5">
        {lessonData.sections.map((section, idx) => renderSection(section, idx))}
      </main>

      {/* Footer with complete button */}
      <footer className="bg-gradient-to-t from-background to-background/0 px-4 py-5 flex-shrink-0 border-t border-border/30">
        <button
          onClick={onComplete}
          disabled={isCompleted}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all ${
            isCompleted
              ? 'bg-accent/20 text-accent cursor-default'
              : 'bg-primary text-white hover:bg-primary/90 active:scale-95'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            {isCompleted && <CheckCircle2 size={18} />}
            <span>
              {isCompleted
                ? language === 'en' ? 'Completed' : 'Завершено'
                : language === 'en' ? 'Mark as Complete' : 'Отметить как завершённо'}
            </span>
          </div>
        </button>
      </footer>
    </div>
  )
}
