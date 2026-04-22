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

  // ================= PI SDK =================
  useEffect(() => {
    const startPi = () => {
      const Pi = (window as any).Pi

      if (!Pi) {
        console.log('❌ Pi SDK НЕ найден')
        return
      }

      try {
        // 1. INIT (БЕЗ await)
        Pi.init({
          version: '2.0',
          sandbox: true
        })

        console.log('✅ Pi init OK')

        // 2. AUTH
        Pi.authenticate(['username', 'payments'], (payment: any) => {
          console.log('💡 Незавершённый платеж:', payment)
        })
          .then((auth: any) => {
            console.log('✅ AUTH SUCCESS:', auth.user.username)
          })
          .catch((err: any) => {
            console.error('❌ AUTH ERROR:', err)
          })

      } catch (err) {
        console.error('❌ Pi INIT ERROR:', err)
      }
    }

    // даём SDK время загрузиться
    setTimeout(startPi, 1000)

  }, [])
  // ==========================================

  // 📊 аналитика
  useEffect(() => {
    migrateProgress()
    recordAppOpen()
  }, [recordAppOpen])

  // 🛠 dev dashboard
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

  // 💰 ПЛАТЕЖИ
  const handlePayment = async (lessonId: number) => {
    const Pi = (window as any).Pi
    if (!Pi) return

    // бесплатный первый блок
    if (lessonId === 1) {
      setCompletedLessons(prev => [...new Set([...prev, 1])])
      alert('Блок 1 открыт!')
      return
    }

    try {
      await Pi.createPayment({
        amount: 1.0,
        memo: `Доступ к блоку #${lessonId}`,
        metadata: { lessonId },
      }, {
        onReadyForServerApproval: (paymentId: string) => {
          console.log('⏳ Ожидает сервер:', paymentId)
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          setCompletedLessons(prev => [...new Set([...prev, lessonId])])
          alert(`✅ Блок ${lessonId} открыт`)
        },
        onCancel: () => console.log('❌ Отмена'),
        onError: (err: Error) => alert(err.message),
      })
    } catch (e) {
      console.error('❌ Payment error:', e)
    }
  }

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
          // если нужно подключишь:
          // onPurchase={handlePayment}
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
