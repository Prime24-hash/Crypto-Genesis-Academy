'use client'

import { ArrowLeft, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'

interface CertificateScreenProps {
  onBack: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
}

const content = {
  en: {
    backButton: 'Back',
    title: 'Certificates',
    message: 'Available as the Pi network develops',
  },
  ru: {
    backButton: 'Назад',
    title: 'Сертификаты',
    message: 'Доступно по мере развития сети Pi',
  },
}

export function CertificateScreen({ onBack, language, onLanguageChange }: CertificateScreenProps) {
  const t = content[language]

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-b from-secondary/20 to-background/0 px-4 py-4 flex-shrink-0 border-b border-border/30">
        <div className="flex items-center justify-between mb-4">
          {/* Back Button */}
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">{t.backButton}</span>
          </Button>

          {/* Language Switcher */}
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground">{t.title}</h1>
        </div>
      </header>

      {/* Main Content - Centered Message */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center border border-primary/40">
            <Award size={40} className="text-primary" />
          </div>

          {/* Message */}
          <div>
            <p className="text-lg text-muted-foreground font-medium">
              {t.message}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
