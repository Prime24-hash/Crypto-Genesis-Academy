'use client'

import { useState } from 'react'
import { ArrowLeft, ChevronDown, ChevronUp, Globe, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LanguageSwitcher } from '@/components/language-switcher'

interface DigitalProtectionScreenProps {
  onBack: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
}

const content = {
  en: {
    facultyName: 'Digital Protection',
    goal: 'Learn how to securely protect your digital assets, accounts, and data in the world of cryptocurrencies, with a particular focus on the Pi Network ecosystem.',
    courseStructure: 'Course Structure',
    totalBlocks: '3 blocks',
    totalLessons: '26 lessons',
    blockA: 'Fundamentals of digital personal data protection',
    blockALessons: '8 lessons',
    blockB: 'Threat recognition and fraud protection',
    blockBLessons: '10 lessons',
    blockC: 'Actions in case of hacking and advanced protection',
    blockCLessons: '8 lessons',
    soonMainnet: 'Soon on Mainnet',
    testnet: 'Testnet',
  },
  ru: {
    facultyName: 'Цифровая защита',
    goal: 'Узнайте, как безопасно защищать свои цифровые активы, аккаунты и данные в мире криптовалют, с особым акцентом на экосистему Pi Network.',
    courseStructure: 'Структура курса',
    totalBlocks: '3 блока',
    totalLessons: '26 уроков',
    blockA: 'Основы защиты цифровых персональных данных',
    blockALessons: '8 уроков',
    blockB: 'Распознавание угроз и защита от мошенничества',
    blockBLessons: '10 уроков',
    blockC: 'Действия в случае взлома и передовая защита',
    blockCLessons: '8 уроков',
    soonMainnet: 'Скоро на Mainnet',
    testnet: 'Тестнет',
  },
}

export function DigitalProtectionScreen({
  onBack,
  language,
  onLanguageChange,
}: DigitalProtectionScreenProps) {
  const t = content[language]
  const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set())

  const toggleBlock = (blockId: string) => {
    const newExpanded = new Set(expandedBlocks)
    if (newExpanded.has(blockId)) {
      newExpanded.delete(blockId)
    } else {
      newExpanded.add(blockId)
    }
    setExpandedBlocks(newExpanded)
  }

  const blocks = [
    {
      id: 'a',
      title: t.blockA,
      lessons: t.blockALessons,
    },
    {
      id: 'b',
      title: t.blockB,
      lessons: t.blockBLessons,
    },
    {
      id: 'c',
      title: t.blockC,
      lessons: t.blockCLessons,
    },
  ]

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-b from-secondary/20 to-background/0 px-4 py-4 flex-shrink-0 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="text-sm font-semibold">{language === 'en' ? 'Back' : 'Назад'}</span>
          </button>

          {/* Right Actions */}
          <div className="flex items-center gap-1">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
          </div>
        </div>

        {/* Faculty Title */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold text-foreground">{t.facultyName}</h1>
            <Badge variant="secondary" className="text-xs">
              {t.testnet}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t.goal}
          </p>
        </div>

        {/* Course Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-card/80 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
              {language === 'en' ? 'Blocks' : 'Блоков'}
            </p>
            <p className="text-lg font-bold text-primary">{t.totalBlocks}</p>
          </div>
          <div className="bg-card/80 rounded-lg p-3 border border-border/50">
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide font-semibold">
              {language === 'en' ? 'Lessons' : 'Уроков'}
            </p>
            <p className="text-lg font-bold text-primary">{t.totalLessons}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Course Structure */}
        <div>
          <h2 className="text-sm font-bold text-foreground mb-3 uppercase tracking-wider">
            {t.courseStructure}
          </h2>

          <div className="space-y-3">
            {blocks.map((block) => {
              const isExpanded = expandedBlocks.has(block.id)
              return (
                <button
                  key={block.id}
                  onClick={() => toggleBlock(block.id)}
                  className="w-full bg-card/80 border border-border/50 rounded-xl p-4 hover:border-primary/50 hover:bg-card transition-all text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {language === 'en' ? `Block ${block.id.toUpperCase()}` : `Блок ${block.id.toUpperCase()}`}
                      </h3>
                      <p className="text-sm text-muted-foreground">{block.title}</p>
                      {isExpanded && (
                        <p className="text-xs text-primary/70 mt-2 font-semibold">
                          {block.lessons}
                        </p>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-3">
                      {isExpanded ? (
                        <ChevronUp size={20} className="text-primary" />
                      ) : (
                        <ChevronDown size={20} className="text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Soon on Mainnet Button */}
        <div className="mt-4">
          <button
            disabled
            className="w-full bg-primary/20 text-primary border border-primary/40 rounded-2xl p-4 font-semibold flex items-center justify-center gap-2 opacity-60 cursor-not-allowed hover:opacity-60"
          >
            <Globe size={18} />
            <span>{t.soonMainnet}</span>
          </button>
        </div>

        {/* Additional Info */}
        <div className="bg-secondary/10 border border-border/50 rounded-xl p-4 mt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">
            {language === 'en'
              ? 'This faculty will be available on Mainnet with full course content and progression tracking.'
              : 'Этот факультет будет доступен на Mainnet с полным содержанием курса и отслеживанием прогресса.'}
          </p>
        </div>
      </main>
    </div>
  )
}
