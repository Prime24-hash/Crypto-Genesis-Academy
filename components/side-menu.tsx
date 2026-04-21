'use client'

import { X, Home, BookOpen, Award, FileText, HelpCircle, Info, User } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

interface SideMenuProps {
  isOpen: boolean
  onClose: () => void
  language: 'en' | 'ru'
  onNavigate?: (page: string) => void
}

const content = {
  en: {
    profile: 'Profile',
    myLessons: 'My Lessons',
    faculties: 'Faculties',
    certificate: 'Certificate',
    whitePaper: 'White Paper',
    support: 'Support / FAQ',
    about: 'About the App',
    terms: 'Terms of Service',
    privacy: 'Privacy Policy',
  },
  ru: {
    profile: 'Профиль',
    myLessons: 'Мои уроки',
    faculties: 'Факультеты',
    certificate: 'Сертификат',
    whitePaper: 'White Paper',
    support: 'Помощь / FAQ',
    about: 'О приложении',
    terms: 'Условия использования',
    privacy: 'Политика конфиденциальности',
  },
}

const menuItems = [
  { label: 'profile', icon: User },
  { label: 'myLessons', icon: BookOpen },
  { label: 'faculties', icon: Award },
  { label: 'certificate', icon: FileText },
  { label: 'whitePaper', icon: FileText },
  { label: 'support', icon: HelpCircle },
  { label: 'about', icon: Info },
]

const bottomItems = [
  { label: 'terms', icon: FileText },
  { label: 'privacy', icon: FileText },
]

export function SideMenu({ isOpen, onClose, language, onNavigate }: SideMenuProps) {
  const t = content[language]

  const handleItemClick = (label: string) => {
    if (label === 'profile') {
      onNavigate?.('profile')
    } else if (label === 'certificate') {
      onNavigate?.('certificate')
    } else if (label === 'faculties') {
      onNavigate?.('faculties')
    } else if (label === 'myLessons') {
      onNavigate?.('myLessons')
    } else {
      onNavigate?.(label)
    }
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Side Menu Drawer */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-background border-r border-border/30 z-50 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border/30">
          <h2 className="text-lg font-bold text-foreground">Menu</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-background/50 transition-all text-muted-foreground hover:text-foreground"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col py-4">
            {menuItems.map((item, index) => {
              const Icon = item.icon
              const label = t[item.label as keyof typeof t]
              return (
                <button
                  key={index}
                  onClick={() => handleItemClick(item.label)}
                  className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 transition-colors text-left"
                >
                  <Icon size={18} className="text-muted-foreground" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Separator */}
        <Separator className="bg-border/30" />

        {/* Bottom Items */}
        <nav className="flex flex-col py-4">
          {bottomItems.map((item, index) => {
            const Icon = item.icon
            const label = t[item.label as keyof typeof t]
            return (
              <button
                key={index}
                onClick={() => handleItemClick(item.label)}
                className="flex items-center gap-3 px-4 py-3 text-foreground hover:bg-primary/10 transition-colors text-left"
              >
                <Icon size={18} className="text-muted-foreground" />
                <span className="text-sm font-medium">{label}</span>
              </button>
            )
          })}
        </nav>
      </div>
    </>
  )
}
