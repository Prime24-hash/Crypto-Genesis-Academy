'use client'

import { useState, useEffect } from 'react'
import { MainScreen } from '@/components/main-screen'
import { FoundationScreen } from '@/components/foundation-screen'
import { InboxScreen } from '@/components/inbox-screen'
import { CertificateScreen } from '@/components/certificate-screen'
import { FacultiesScreen } from '@/components/faculties-screen'
import { ProfileScreen } from '@/components/profile-screen'
import { DeveloperDashboard } from '@/components/developer-dashboard'
import { AnalyticsProvider, useAnalytics } from '@/contexts/analytics-context'
import { migrateProgress } from '@/lib/lesson-progress'

function PageContent() {
  const [currentScreen, setCurrentScreen] = useState<'main' | 'foundation' | 'inbox' | 'certificate' | 'faculties' | 'profile'>('main')
  const [language, setLanguage] = useState<'en' | 'ru'>('en')
  const [isDashboardOpen, setIsDashboardOpen] = useState(false)
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true)
  const { recordAppOpen } = useAnalytics()

  // Track app open (once per session) and run migration
  useEffect(() => {
    migrateProgress()
    recordAppOpen()
  }, [recordAppOpen])

  // Developer mode: Press Ctrl+Shift+D to open dashboard
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.code === 'KeyD') {
        e.preventDefault()
        setIsDashboardOpen(prev => !prev)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {currentScreen === 'main' ? (
        <MainScreen
          onNavigate={() => setCurrentScreen('foundation')}
          onOpenInbox={() => {
            setCurrentScreen('inbox')
            setHasUnreadNotifications(false)
          }}
          onOpenCertificate={() => setCurrentScreen('certificate')}
          onOpenFaculties={() => setCurrentScreen('faculties')}
          onOpenProfile={() => setCurrentScreen('profile')}
          language={language}
          onLanguageChange={setLanguage}
          onOpenStats={() => setIsDashboardOpen(true)}
          completedLessons={completedLessons}
          hasUnreadNotifications={hasUnreadNotifications}
        />
      ) : currentScreen === 'profile' ? (
        <ProfileScreen
          onBack={() => setCurrentScreen('main')}
          language={language}
          onLanguageChange={setLanguage}
          completedLessons={completedLessons}
          onOpenLessonDetail={() => setCurrentScreen('foundation')}
          onNavigateToFaculties={() => setCurrentScreen('faculties')}
          onNavigateToCertificate={() => setCurrentScreen('certificate')}
        />
      ) : currentScreen === 'faculties' ? (
        <FacultiesScreen
          onBack={() => setCurrentScreen('main')}
          language={language}
          onLanguageChange={setLanguage}
        />
      ) : currentScreen === 'certificate' ? (
        <CertificateScreen
          onBack={() => setCurrentScreen('main')}
          language={language}
          onLanguageChange={setLanguage}
        />
      ) : currentScreen === 'inbox' ? (
        <InboxScreen
          onBack={() => setCurrentScreen('main')}
          language={language}
          onLanguageChange={setLanguage}
          onMarkAsRead={() => setHasUnreadNotifications(false)}
        />
      ) : (
        <FoundationScreen
          onBack={() => setCurrentScreen('main')}
          language={language}
          onLanguageChange={setLanguage}
          onOpenStats={() => setIsDashboardOpen(true)}
          completedLessons={completedLessons}
          onCompletedLessonsChange={setCompletedLessons}
        />
      )}

      <DeveloperDashboard isOpen={isDashboardOpen} onClose={() => setIsDashboardOpen(false)} />
    </div>
  )
}

export default function Page() {
  return (
    <AnalyticsProvider>
      <PageContent />
    </AnalyticsProvider>
  )
}
