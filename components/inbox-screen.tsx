'use client'

import { ArrowLeft, Book, Trophy, Zap, Bell, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LanguageSwitcher } from '@/components/language-switcher'
import { useState, useEffect } from 'react'

interface InboxScreenProps {
  onBack: () => void
  language: 'en' | 'ru'
  onLanguageChange: (lang: 'en' | 'ru') => void
  onMarkAsRead?: () => void
}

interface Notification {
  id: string
  type: 'lesson' | 'progress' | 'faculty' | 'announcement'
  title: string
  message: string
  timestamp: number
  read: boolean
}

const content = {
  en: {
    inbox: 'Inbox',
    unread: 'unread',
    noNotifications: 'No notifications yet',
    checkBackSoon: 'Check back soon for updates on lessons, progress, and Pi Network news',
    markAllAsRead: 'Mark all as read',
    newLessonAvailable: 'New Lesson Available',
    block1Unlocked: 'Congratulations! Block 1 is now unlocked. Start learning and earn your certificate.',
    progressUpdate: 'Progress Update',
    lesson1Completed: 'Great job! You completed Lesson 1. Keep the momentum going!',
    facultyUpdate: 'Faculty Update',
    newDefiContent: 'New DeFi content has been added. Explore trading strategies and yield farming.',
    systemAnnouncement: 'System Announcement',
    mainnetComingSoon: 'Pi Network Mainnet launch is just around the corner. Stay tuned for updates!',
  },
  ru: {
    inbox: 'Входящие',
    unread: 'непрочитанное',
    noNotifications: 'Нет уведомлений',
    checkBackSoon: 'Проверяйте позже обновления о уроках, прогрессе и новостях Pi Network',
    markAllAsRead: 'Отметить все как прочитанные',
    newLessonAvailable: 'Новый урок доступен',
    block1Unlocked: 'Поздравляем! Блок 1 теперь разблокирован. Начните обучение и получите сертификат.',
    progressUpdate: 'Обновление прогресса',
    lesson1Completed: 'Отлично! Вы завершили урок 1. Продолжайте в том же духе!',
    facultyUpdate: 'Обновление факультета',
    newDefiContent: 'В DeFi добавлено новое содержание. Изучите торговые стратегии и фермерство доходности.',
    systemAnnouncement: 'Системное объявление',
    mainnetComingSoon: 'Запуск Pi Network Mainnet уже близко. Следите за обновлениями!',
  },
}

export function InboxScreen({
  onBack,
  language,
  onLanguageChange,
  onMarkAsRead,
}: InboxScreenProps) {
  const t = content[language]
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    // Initialize with sample notifications - in production, this would fetch from backend/state
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'lesson',
        title: t.newLessonAvailable,
        message: t.block1Unlocked,
        timestamp: Date.now() - 3600000, // 1 hour ago
        read: false,
      },
      {
        id: '2',
        type: 'progress',
        title: t.progressUpdate,
        message: t.lesson1Completed,
        timestamp: Date.now() - 86400000, // 1 day ago
        read: false,
      },
      {
        id: '3',
        type: 'faculty',
        title: t.facultyUpdate,
        message: t.newDefiContent,
        timestamp: Date.now() - 259200000, // 3 days ago
        read: true,
      },
      {
        id: '4',
        type: 'announcement',
        title: t.systemAnnouncement,
        message: t.mainnetComingSoon,
        timestamp: Date.now() - 604800000, // 1 week ago
        read: true,
      },
    ]
    setNotifications(initialNotifications)
  }, [language, t])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'lesson':
        return <Book size={20} className="text-blue-500" />
      case 'progress':
        return <Trophy size={20} className="text-emerald-500" />
      case 'faculty':
        return <Zap size={20} className="text-amber-500" />
      case 'announcement':
        return <Bell size={20} className="text-purple-500" />
      default:
        return <Bell size={20} className="text-muted-foreground" />
    }
  }

  const formatTime = (timestamp: number) => {
    const now = Date.now()
    const diff = now - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return language === 'en' ? 'Now' : 'Сейчас'
    if (minutes < 60) return `${minutes}m ${language === 'en' ? 'ago' : 'назад'}`
    if (hours < 24) return `${hours}h ${language === 'en' ? 'ago' : 'назад'}`
    if (days < 30) return `${days}d ${language === 'en' ? 'ago' : 'назад'}`
    return new Date(timestamp).toLocaleDateString()
  }

  const unreadCount = notifications.filter(n => !n.read).length
  const hasUnread = unreadCount > 0

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    onMarkAsRead?.()
  }

  const markAsRead = (id: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    )
    setNotifications(updatedNotifications)
    if (!updatedNotifications.some(n => !n.read)) {
      onMarkAsRead?.()
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card/80 border-b border-border/50 px-4 py-4 flex-shrink-0 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-secondary/20 rounded-lg transition-all text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-foreground">{t.inbox}</h1>
              {hasUnread && (
                <p className="text-xs text-blue-500 font-semibold">
                  {unreadCount} {t.unread}
                </p>
              )}
            </div>
          </div>
          <LanguageSwitcher language={language} onLanguageChange={onLanguageChange} />
        </div>

        {/* Mark all as read button */}
        {hasUnread && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            size="sm"
            className="w-full text-xs h-auto py-2 border-border/50 hover:bg-secondary/20"
          >
            <Check size={14} className="mr-2" />
            {t.markAllAsRead}
          </Button>
        )}
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-6">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell size={48} className="text-muted-foreground/50 mb-4" />
            <h2 className="text-lg font-semibold text-foreground mb-2">{t.noNotifications}</h2>
            <p className="text-sm text-muted-foreground max-w-sm">{t.checkBackSoon}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(notification => (
              <button
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`w-full text-left border rounded-xl p-4 transition-all ${
                  notification.read
                    ? 'border-border/30 bg-card/30 hover:bg-card/50'
                    : 'border-blue-500/40 bg-blue-500/5 hover:bg-blue-500/10 backdrop-blur-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="pt-0.5 flex-shrink-0">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-foreground leading-snug">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-snug">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground/70 mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
