'use client'

import { useState } from 'react'
import { Globe, Check } from 'lucide-react'

interface LanguageSwitcherProps {
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
}

export function LanguageSwitcher({ language, onLanguageChange }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (lang: 'en' | 'ru') => {
    onLanguageChange(lang)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Globe Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-secondary/30 transition-all text-foreground hover:text-primary"
        aria-label="Language selector"
      >
        <Globe size={20} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-card border border-border/50 rounded-lg shadow-lg overflow-hidden z-50 backdrop-blur-sm">
          <button
            onClick={() => handleSelect('en')}
            className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center justify-between group"
          >
            <span className={`text-sm font-medium ${language === 'en' ? 'text-primary font-bold' : 'text-foreground'}`}>
              English
            </span>
            {language === 'en' && (
              <Check size={16} className="text-primary" />
            )}
          </button>

          <div className="h-px bg-border/30" />

          <button
            onClick={() => handleSelect('ru')}
            className="w-full px-4 py-3 text-left hover:bg-primary/10 transition-colors flex items-center justify-between group"
          >
            <span className={`text-sm font-medium ${language === 'ru' ? 'text-primary font-bold' : 'text-foreground'}`}>
              Русский
            </span>
            {language === 'ru' && (
              <Check size={16} className="text-primary" />
            )}
          </button>
        </div>
      )}

      {/* Close on outside click */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
