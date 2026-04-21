'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface AnalyticsEvent {
  name: string
  timestamp: number
  value?: number | string
  userId: string
}

interface AnalyticsContextType {
  // Legacy
  foundationPurchases: number
  facultyClicks: {
    digitalProtection: number
    economyOfInfluence: number
    defi: number
    trading: number
    nft: number
    presale: number
  }
  
  // New analytics
  appOpens: number
  uniqueUsers: Set<string>
  foundationOpens: number
  lessonOpens: number
  notifyClicks: number
  unlockBlock1Count: number
  
  // Conversion tracking
  openIntroCount: number
  openBlock1Count: number
  viewUnlockCount: number
  clickUnlockCount: number
  confirmUnlockCount: number
  blockUnlockedCount: number
  trackedEvents: Set<string>
  
  events: AnalyticsEvent[]
  sessionId: string
  userId: string
  appOpenedThisSession: boolean
  
  // Methods
  recordFacultyClick: (faculty: 'digitalProtection' | 'economyOfInfluence' | 'defi' | 'trading' | 'nft' | 'presale') => void
  recordFoundationPurchase: () => void
  recordAppOpen: () => void
  recordFoundationOpen: () => void
  recordLessonOpen: (lessonId: number) => void
  recordNotifyClick: () => void
  recordUnlockBlock1: () => void
  recordOpenIntro: () => void
  recordOpenBlock1: () => void
  recordViewUnlock: () => void
  recordClickUnlock: () => void
  recordConfirmUnlock: () => void
  recordBlockUnlocked: () => void
  resetMetrics: () => void
  getAnalyticsSummary: () => {
    totalAppOpens: number
    uniqueUsers: number
    foundationOpens: number
    lessonOpens: number
    notifyClicks: number
    unlockBlock1Count: number
    conversionMetrics: {
      openIntro: number
      openBlock1: number
      viewUnlock: number
      clickUnlock: number
      confirmUnlock: number
      blockUnlocked: number
    }
  }
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined)

function generateSessionId() {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

function generateUserId() {
  if (typeof window === 'undefined') return 'server'
  
  let userId = localStorage.getItem('analytics_user_id')
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    localStorage.setItem('analytics_user_id', userId)
  }
  return userId
}

export function AnalyticsProvider({ children }: { children: ReactNode }) {
  const userId = generateUserId()
  const [sessionId] = useState(generateSessionId())
  
  const [foundationPurchases, setFoundationPurchases] = useState(0)
  const [facultyClicks, setFacultyClicks] = useState({
    digitalProtection: 0,
    economyOfInfluence: 0,
    defi: 0,
    trading: 0,
    nft: 0,
    presale: 0,
  })
  
  // New analytics
  const [appOpens, setAppOpens] = useState(0)
  const [uniqueUsers, setUniqueUsers] = useState<Set<string>>(new Set())
  const [foundationOpens, setFoundationOpens] = useState(0)
  const [lessonOpens, setLessonOpens] = useState(0)
  const [notifyClicks, setNotifyClicks] = useState(0)
  const [unlockBlock1Count, setUnlockBlock1Count] = useState(0)
  
  // Conversion tracking
  const [openIntroCount, setOpenIntroCount] = useState(0)
  const [openBlock1Count, setOpenBlock1Count] = useState(0)
  const [viewUnlockCount, setViewUnlockCount] = useState(0)
  const [clickUnlockCount, setClickUnlockCount] = useState(0)
  const [confirmUnlockCount, setConfirmUnlockCount] = useState(0)
  const [blockUnlockedCount, setBlockUnlockedCount] = useState(0)
  
  const [events, setEvents] = useState<AnalyticsEvent[]>([])
  const [trackedEvents, setTrackedEvents] = useState<Set<string>>(new Set())
  const [appOpenedThisSession, setAppOpenedThisSession] = useState(false)

  // Helper function to track event only once per session
  const trackEventOnce = (eventName: string, value?: number | string) => {
    const eventKey = `${eventName}_${sessionId}`
    if (trackedEvents.has(eventKey)) return false

    setTrackedEvents(prev => new Set([...prev, eventKey]))
    
    const event: AnalyticsEvent = {
      name: eventName,
      timestamp: Date.now(),
      value,
      userId,
    }
    setEvents(prev => [...prev, event])
    return true
  }

  const recordFacultyClick = (faculty: 'digitalProtection' | 'economyOfInfluence' | 'defi' | 'trading' | 'nft' | 'presale') => {
    setFacultyClicks(prev => ({
      ...prev,
      [faculty]: prev[faculty] + 1,
    }))
  }

  const recordFoundationPurchase = () => {
    setFoundationPurchases(prev => prev + 1)
  }

  const recordAppOpen = () => {
    // Only track once per session
    if (appOpenedThisSession) return
    
    setUniqueUsers(prev => new Set([...prev, userId]))
    setAppOpens(prev => prev + 1)
    setAppOpenedThisSession(true)
    
    const event: AnalyticsEvent = {
      name: 'app_open',
      timestamp: Date.now(),
      userId,
    }
    setEvents(prev => [...prev, event])
  }

  const recordFoundationOpen = () => {
    setFoundationOpens(prev => prev + 1)
    
    const event: AnalyticsEvent = {
      name: 'open_foundation',
      timestamp: Date.now(),
      userId,
    }
    setEvents(prev => [...prev, event])
  }

  const recordLessonOpen = (lessonId: number) => {
    setLessonOpens(prev => prev + 1)
    
    const event: AnalyticsEvent = {
      name: 'open_lesson',
      timestamp: Date.now(),
      value: lessonId,
      userId,
    }
    setEvents(prev => [...prev, event])
  }

  const recordNotifyClick = () => {
    setNotifyClicks(prev => prev + 1)
    
    const event: AnalyticsEvent = {
      name: 'notify_click',
      timestamp: Date.now(),
      userId,
    }
    setEvents(prev => [...prev, event])
  }

  const recordUnlockBlock1 = () => {
    setUnlockBlock1Count(prev => prev + 1)
    
    const event: AnalyticsEvent = {
      name: 'unlock_block_1',
      timestamp: Date.now(),
      userId,
    }
    setEvents(prev => [...prev, event])
  }

  // Conversion tracking methods - track only once per session
  const recordOpenIntro = () => {
    if (trackEventOnce('open_intro')) {
      setOpenIntroCount(prev => prev + 1)
    }
  }

  const recordOpenBlock1 = () => {
    if (trackEventOnce('open_block_1')) {
      setOpenBlock1Count(prev => prev + 1)
    }
  }

  const recordViewUnlock = () => {
    if (trackEventOnce('view_unlock')) {
      setViewUnlockCount(prev => prev + 1)
    }
  }

  const recordClickUnlock = () => {
    if (trackEventOnce('click_unlock')) {
      setClickUnlockCount(prev => prev + 1)
    }
  }

  const recordConfirmUnlock = () => {
    if (trackEventOnce('confirm_unlock')) {
      setConfirmUnlockCount(prev => prev + 1)
    }
  }

  const recordBlockUnlocked = () => {
    if (trackEventOnce('block_unlocked')) {
      setBlockUnlockedCount(prev => prev + 1)
    }
  }

  const resetMetrics = () => {
    setFoundationPurchases(0)
    setFacultyClicks({
      digitalProtection: 0,
      economyOfInfluence: 0,
      defi: 0,
      trading: 0,
      nft: 0,
      presale: 0,
    })
    setAppOpens(0)
    setUniqueUsers(new Set())
    setFoundationOpens(0)
    setLessonOpens(0)
    setNotifyClicks(0)
    setUnlockBlock1Count(0)
    setOpenIntroCount(0)
    setOpenBlock1Count(0)
    setViewUnlockCount(0)
    setClickUnlockCount(0)
    setConfirmUnlockCount(0)
    setBlockUnlockedCount(0)
    setEvents([])
    setTrackedEvents(new Set())
    setAppOpenedThisSession(false)
  }

  const getAnalyticsSummary = () => ({
    totalAppOpens: appOpens,
    uniqueUsers: uniqueUsers.size,
    foundationOpens,
    lessonOpens,
    notifyClicks,
    unlockBlock1Count,
    conversionMetrics: {
      openIntro: openIntroCount,
      openBlock1: openBlock1Count,
      viewUnlock: viewUnlockCount,
      clickUnlock: clickUnlockCount,
      confirmUnlock: confirmUnlockCount,
      blockUnlocked: blockUnlockedCount,
    },
  })

  return (
    <AnalyticsContext.Provider
      value={{
        foundationPurchases,
        facultyClicks,
        appOpens,
        uniqueUsers,
        foundationOpens,
        lessonOpens,
        notifyClicks,
        unlockBlock1Count,
        openIntroCount,
        openBlock1Count,
        viewUnlockCount,
        clickUnlockCount,
        confirmUnlockCount,
        blockUnlockedCount,
        trackedEvents,
        events,
        sessionId,
        userId,
        appOpenedThisSession,
        recordFacultyClick,
        recordFoundationPurchase,
        recordAppOpen,
        recordFoundationOpen,
        recordLessonOpen,
        recordNotifyClick,
        recordUnlockBlock1,
        recordOpenIntro,
        recordOpenBlock1,
        recordViewUnlock,
        recordClickUnlock,
        recordConfirmUnlock,
        recordBlockUnlocked,
        resetMetrics,
        getAnalyticsSummary,
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return context
}
