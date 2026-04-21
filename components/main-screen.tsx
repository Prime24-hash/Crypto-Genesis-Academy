'use client'

import { useState } from 'react'
import { Shield, Book, Zap, Users, Award, Globe, Lock, ExternalLink, Mail, Bell, Menu } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { SideMenu } from '@/components/side-menu'
import { useAnalytics } from '@/contexts/analytics-context'

interface MainScreenProps {
  onNavigate: () => void
  onOpenInbox?: () => void
  onOpenCertificate?: () => void
  onOpenFaculties?: () => void
  onOpenProfile?: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
  onOpenStats?: () => void
  completedLessons?: number[]
  hasUnreadNotifications?: boolean
}

const PI_SYMBOL = 'π'

const content = {
  en: {
    testnet: 'Testnet',
    welcome: 'Welcome, pioneer!',
    greetingShort: 'Start your journey in the crypto industry',
    progressLabel: 'Your Progress',
    foundation: 'Genesis Foundation',
    foundationDesc: '52 lessons • 8 blocks',
    foundationLongDesc: 'Build a strong foundation in crypto',
    notifyMainnet: 'Get notified for Mainnet launch',
    faculties: 'Professional Faculties',
    comingSoon: 'Coming soon to Mainnet',
    learn: 'Study',
    upgrade: 'Update',
    community: 'Community',
    certificate: 'Certificate',
    dailyMotivation: 'Daily Inspiration',
    motivationText: '"Every expert was once a beginner. Your journey in crypto starts today."',
    disclaimer: 'Educational material only. Not financial advice. Always do your own research.',
  },
  ru: {
    testnet: 'Тестнет',
    welcome: 'Добро пожаловать, пионер!',
    greetingShort: 'Начни свой путь в крипто-индустрии',
    progressLabel: 'Ваш прогресс',
    foundation: 'Genesis Foundation',
    foundationDesc: '52 урока • 8 блоков',
    foundationLongDesc: 'Создайте прочную основу в крипто',
    notifyMainnet: 'Уведомление о запуске Mainnet',
    faculties: 'Профессиональные факультеты',
    comingSoon: 'Скоро на Mainnet',
    learn: 'Обучение',
    upgrade: 'Обновление',
    community: 'Сообщество',
    certificate: 'Сертификат',
    dailyMotivation: 'Ежедневное вдохновение',
    motivationText: '"Каждый эксперт когда-то был новичком. Ваш путь в крипто начинается сегодня."',
    disclaimer: 'Только образовательный материал. Не инвестиционный совет. Изучайте самостоятельно.',
  },
}

export function MainScreen({
  onNavigate,
  onOpenInbox,
  onOpenCertificate,
  onOpenFaculties,
  onOpenProfile,
  language,
  onLanguageChange,
  onOpenStats,
  completedLessons = [],
  hasUnreadNotifications = false,
}: MainScreenProps) {
  const t = content[language]
  const { recordFacultyClick, recordNotifyClick } = useAnalytics()
  const [pressStartTime, setPressStartTime] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Calculate total progress (all 52 lessons in Foundation)
  const totalCompletedCount = completedLessons.length
  const totalLessons = 52
  const progressPercent = (totalCompletedCount / totalLessons) * 100

  const handleLogoMouseDown = () => {
    setPressStartTime(Date.now())
  }

  const handleLogoMouseUp = () => {
    if (pressStartTime && Date.now() - pressStartTime >= 3000) {
      onOpenStats?.()
    }
    setPressStartTime(null)
  }

  const handleLogoMouseLeave = () => {
    setPressStartTime(null)
  }

  const handleLogoTouchStart = () => {
    setPressStartTime(Date.now())
  }

  const handleLogoTouchEnd = () => {
    if (pressStartTime && Date.now() - pressStartTime >= 4000) {
      onOpenStats?.()
    }
    setPressStartTime(null)
  }

  return (
    <div className="w-full h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <header className="bg-gradient-to-b from-secondary/30 to-background/0 px-4 py-4 flex-shrink-0 border-b border-primary/30 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none active:opacity-70 transition-opacity"
            onMouseDown={handleLogoMouseDown}
            onMouseUp={handleLogoMouseUp}
            onMouseLeave={handleLogoMouseLeave}
            onTouchStart={handleLogoTouchStart}
            onTouchEnd={handleLogoTouchEnd}
          >
            <div className="relative w-10 h-10 bg-gradient-to-br from-primary/40 to-primary/20 rounded-xl flex items-center justify-center border border-primary/60 shadow-lg">
              <Shield size={20} className="text-primary" />
              <div className="absolute -top-1 -right-1 text-lg">🎓</div>
            </div>
            <div>
              <h1 className="text-base font-bold text-primary">Crypto Genesis</h1>
              <p className="text-xs text-primary/70">Academy</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
            <button className="p-2 rounded-lg hover:bg-primary/10 transition-all text-primary hover:text-primary/80">
              <Bell size={20} />
            </button>
            <button 
              onClick={() => setIsMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-primary/10 transition-all text-primary hover:text-primary/80"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>

        {/* Greeting - Centered */}
        <div className="mb-5 text-center">
          <h2 className="text-2xl font-bold text-primary mb-1.5">{t.welcome}</h2>
          <p className="text-xs text-muted-foreground leading-snug">{t.greetingShort}</p>
        </div>

        {/* Progress Bar - Clean and Compact */}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {/* Foundation Card */}
        <button
          onClick={onNavigate}
          className="bg-gradient-to-br from-secondary/20 via-background to-background border border-primary/50 rounded-2xl p-4 hover:border-primary/70 transition-all group shadow-lg hover:shadow-xl hover:shadow-primary/20"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/50 to-primary/30 rounded-lg flex items-center justify-center group-hover:from-primary/60 group-hover:to-primary/40 transition-all shadow-md">
                <Book size={20} className="text-primary" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-foreground">{t.foundation}</h3>
                <p className="text-xs text-muted-foreground">
                  {t.foundationDesc}
                </p>
              </div>
            </div>
            <Badge className="bg-secondary/40 text-secondary border-secondary/60 font-bold">
              {language === 'en' ? 'Testnet' : 'Тестнет'}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground text-left font-medium">
            {t.foundationLongDesc}
          </p>
        </button>

        {/* Notify on Mainnet Button */}
        <button
          onClick={recordNotifyClick}
          className="w-full"
        >
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button className="w-full bg-gradient-to-r from-primary/50 to-primary/40 text-primary-foreground hover:from-primary/60 hover:to-primary/50 border border-primary/60 font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all">
              <Globe size={16} />
              <span>{t.notifyMainnet}</span>
            </Button>
          </a>
        </button>

        {/* Faculties Section */}
        <div>
          <h3 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider text-center">
            {t.faculties}
          </h3>
          <div className="bg-gradient-to-b from-secondary/10 to-background border border-primary/40 rounded-xl p-3 backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 py-5">
              <Lock size={16} className="text-primary/60" />
              <p className="text-xs font-semibold text-primary/70 text-center">
                {t.comingSoon}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'DeFi', key: 'defi' as const, recommended: false },
                { name: 'Trading', key: 'trading' as const, recommended: false },
                { name: 'NFT', key: 'nft' as const, recommended: false },
                { name: 'Presale', key: 'presale' as const, recommended: false },
              ].map(({ name, key, recommended }) => (
                <button
                  key={name}
                  onClick={() => {
                    recordFacultyClick(key)
                  }}
                  className="bg-gradient-to-br from-secondary/20 to-background/40 rounded-lg p-3 border border-primary/30 hover:border-primary/60 text-center hover:bg-secondary/30 transition-all relative shadow-md"
                >
                  {recommended && (
                    <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                      {language === 'en' ? 'Recommended' : 'Рекомендуемый'}
                    </div>
                  )}
                  <p className="text-xs font-semibold text-foreground">{name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Inspiration Card */}
        <div className="bg-gradient-to-r from-secondary/25 to-accent/15 rounded-xl p-3.5 border border-secondary/40">
          <p className="text-xs font-semibold text-foreground mb-2.5 uppercase tracking-wide">{t.dailyMotivation}</p>
          <p className="text-sm leading-relaxed text-foreground/80 italic font-medium">
            {t.motivationText}
          </p>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-card/80 border-t border-border/50 px-4 py-2 flex-shrink-0 backdrop-blur space-y-2">
        {/* Disclaimer */}
        <p className="text-xs text-muted-foreground/70 text-center leading-tight py-2 border-t border-border/30">
          {t.disclaimer}
        </p>

        {/* Navigation */}
        <div className="flex items-center justify-around">
          {[
            { icon: Book, label: t.learn, action: () => onNavigate() },
            { icon: Zap, label: t.upgrade, action: () => {} },
            { icon: Users, label: t.community, action: () => {} },
            { icon: Award, label: t.certificate, action: () => onOpenCertificate?.() },
          ].map(({ icon: Icon, label, action }, idx) => (
            <button
              key={idx}
              onClick={action}
              className="flex flex-col items-center gap-1 py-2 px-3 rounded-lg hover:bg-primary/10 transition-all text-primary/60 hover:text-primary relative"
            >
              <Icon size={20} />
              <span className="text-xs font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Side Menu Drawer */}
      <SideMenu 
        isOpen={isMenuOpen} 
        onClose={() => setIsMenuOpen(false)} 
        language={language}
        onNavigate={(page) => {
          if (page === 'profile') {
            onOpenProfile?.()
          } else if (page === 'certificate') {
            onOpenCertificate?.()
          } else if (page === 'faculties') {
            onOpenFaculties?.()
          } else if (page === 'myLessons') {
            onNavigate()
          }
        }}
      />
    </div>
  )
}
