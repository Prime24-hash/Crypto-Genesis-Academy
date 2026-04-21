'use client'

import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface FacultiesScreenProps {
  onBack: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
}

const content = {
  en: {
    faculties: 'Faculties',
    defi: 'DeFi',
    defiDesc: 'Learn decentralized finance strategies and protocols',
    nft: 'NFT',
    nftDesc: 'Master NFT creation, trading, and blockchain art',
    trading: 'Trading',
    tradingDesc: 'Advanced cryptocurrency trading techniques',
    presale: 'Presale',
    presaleDesc: 'Participate in token presales and investment opportunities',
    comingSoon: 'Coming Soon in Mainnet',
  },
  ru: {
    faculties: 'Факультеты',
    defi: 'DeFi',
    defiDesc: 'Изучите стратегии децентрализованных финансов',
    nft: 'NFT',
    nftDesc: 'Овладейте созданием и торговлей NFT',
    trading: 'Трейдинг',
    tradingDesc: 'Передовые техники торговли криптовалютой',
    presale: 'Presale',
    presaleDesc: 'Участие в предпродажах и инвестиционных возможностях',
    comingSoon: 'Скоро в Mainnet',
  },
}

const faculties = [
  { id: 'defi', key: 'defi' },
  { id: 'nft', key: 'nft' },
  { id: 'trading', key: 'trading' },
  { id: 'presale', key: 'presale' },
]

export function FacultiesScreen({ onBack, language, onLanguageChange }: FacultiesScreenProps) {
  const t = content[language]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-background/95">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/30 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 rounded-lg hover:bg-background/50 transition-all text-muted-foreground hover:text-foreground"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="text-2xl font-bold text-foreground">{t.faculties}</h1>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-2 bg-background/50 rounded-lg p-1">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => onLanguageChange('ru')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                language === 'ru'
                  ? 'bg-primary text-background'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              РУ
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faculties.map((faculty) => {
            const title = t[faculty.key as keyof typeof t]
            const desc = t[`${faculty.key}Desc` as keyof typeof t]
            
            return (
              <div
                key={faculty.id}
                className="group relative rounded-2xl bg-gradient-to-br from-primary/10 via-background to-background border border-border/50 hover:border-primary/30 p-8 transition-all hover:shadow-lg hover:shadow-primary/10"
              >
                {/* Content */}
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold text-foreground mb-3">{title}</h2>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {desc}
                  </p>

                  {/* Coming Soon Badge */}
                  <div className="flex items-center justify-center bg-primary/20 border border-primary/40 rounded-xl py-4 px-6">
                    <span className="text-lg font-bold text-primary text-center">
                      {t.comingSoon}
                    </span>
                  </div>
                </div>

                {/* Background accent */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
