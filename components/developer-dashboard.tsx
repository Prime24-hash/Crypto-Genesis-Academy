'use client'

import { useState } from 'react'
import { X, BarChart3, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAnalytics } from '@/contexts/analytics-context'

interface DeveloperDashboardProps {
  isOpen: boolean
  onClose: () => void
}

export function DeveloperDashboard({ isOpen, onClose }: DeveloperDashboardProps) {
  const { facultyClicks, resetMetrics, getAnalyticsSummary } = useAnalytics()
  const analytics = getAnalyticsSummary()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end">
      <div className="w-full max-w-md bg-card border-t border-border rounded-t-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 duration-300 max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={20} className="text-primary" />
            <h2 className="text-lg font-bold text-foreground">Developer Dashboard</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary/20 rounded-lg transition-all text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Analytics Summary */}
        <div className="space-y-3 mb-6">
          {/* Total App Opens */}
          <div className="bg-primary/10 border border-primary/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Total App Opens</p>
            <p className="text-2xl font-bold text-primary">{analytics.totalAppOpens}</p>
          </div>

          {/* Unique Users */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Unique Users</p>
            <p className="text-2xl font-bold text-emerald-500">{analytics.uniqueUsers}</p>
          </div>

          {/* Foundation Opens */}
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Foundation Opens</p>
            <p className="text-2xl font-bold text-accent">{analytics.foundationOpens}</p>
          </div>

          {/* Lesson Opens */}
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Lesson Opens</p>
            <p className="text-2xl font-bold text-foreground">{analytics.lessonOpens}</p>
          </div>

          {/* Notify Clicks */}
          <div className="bg-secondary/20 border border-border/50 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Notify Clicks</p>
            <p className="text-2xl font-bold text-foreground">{analytics.notifyClicks}</p>
          </div>

          {/* Block 1 Unlocks */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <p className="text-xs text-muted-foreground mb-1">Block 1 Unlocks</p>
            <p className="text-2xl font-bold text-emerald-500">{analytics.unlockBlock1Count}</p>
          </div>

          {/* Conversion Metrics Header */}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted-foreground mb-3">Conversion Funnel</p>
          </div>

          {/* Open Intro */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">open_intro</p>
              <p className="text-lg font-bold text-blue-500">{analytics.conversionMetrics.openIntro}</p>
            </div>
          </div>

          {/* Open Block 1 */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">open_block_1</p>
              <p className="text-lg font-bold text-blue-500">{analytics.conversionMetrics.openBlock1}</p>
            </div>
          </div>

          {/* View Unlock */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">view_unlock</p>
              <p className="text-lg font-bold text-purple-500">{analytics.conversionMetrics.viewUnlock}</p>
            </div>
          </div>

          {/* Click Unlock */}
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">click_unlock</p>
              <p className="text-lg font-bold text-purple-500">{analytics.conversionMetrics.clickUnlock}</p>
            </div>
          </div>

          {/* Confirm Unlock */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">confirm_unlock</p>
              <p className="text-lg font-bold text-orange-500">{analytics.conversionMetrics.confirmUnlock}</p>
            </div>
          </div>

          {/* Block Unlocked */}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">block_unlocked</p>
              <p className="text-lg font-bold text-emerald-500">{analytics.conversionMetrics.blockUnlocked}</p>
            </div>
          </div>
        </div>

        {/* Faculty Clicks */}
        <div className="bg-secondary/20 border border-border/50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={16} className="text-accent" />
            <span className="text-sm font-semibold text-muted-foreground">Faculty Clicks</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Digital Protection</p>
              <p className="font-bold text-foreground">{facultyClicks.digitalProtection}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Economy of Influence</p>
              <p className="font-bold text-foreground">{facultyClicks.economyOfInfluence}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">DeFi</p>
              <p className="font-bold text-foreground">{facultyClicks.defi}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Trading</p>
              <p className="font-bold text-foreground">{facultyClicks.trading}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">NFT</p>
              <p className="font-bold text-foreground">{facultyClicks.nft}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Presale</p>
              <p className="font-bold text-foreground">{facultyClicks.presale}</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <Button
          variant="outline"
          className="w-full border-border/50 hover:bg-secondary/20"
          onClick={resetMetrics}
        >
          Reset Metrics
        </Button>
      </div>
    </div>
  )
}
