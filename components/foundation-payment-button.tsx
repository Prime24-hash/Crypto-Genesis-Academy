'use client'

import { useState } from 'react'
import { Unlock, CheckCircle2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useAnalytics } from '@/contexts/analytics-context'
import { usePiAuth } from '@/contexts/pi-auth-context'

// Declare Pi global
declare global {
  interface Window {
    Pi: any
  }
}

interface FoundationPaymentButtonProps {
  language: 'en' | 'ru'
  onSuccess?: () => void
  isUnlocked?: boolean
}

const content = {
  en: {
    unlockButton: 'Unlock Foundation (3.14 Pi)',
    processing: 'Processing...',
    unlocked: 'Foundation Unlocked!',
    error: 'Something went wrong',
    confirmTitle: 'Confirm Payment',
    confirmDescription: 'Confirm payment of 3.14 Pi to unlock the Foundation course and all 8 lessons.',
    confirmButton: 'Confirm Payment',
    cancelButton: 'Cancel',
    successTitle: 'Payment Successful',
    successDescription: 'Your Foundation course is now unlocked! You can access all 8 lessons.',
    successButton: 'Continue',
  },
  ru: {
    unlockButton: 'Разблокировать Foundation (3.14 Pi)',
    processing: 'Обработка...',
    unlocked: 'Foundation разблокирован!',
    error: 'Что-то пошло не так',
    confirmTitle: 'Подтвердить платеж',
    confirmDescription: 'Подтвердите платеж 3.14 Pi для разблокирования курса Foundation и всех 8 уроков.',
    confirmButton: 'Подтвердить платеж',
    cancelButton: 'Отмена',
    successTitle: 'Платеж выполнен',
    successDescription: 'Ваш курс Foundation теперь разблокирован! Вы можете получить доступ ко всем 8 урокам.',
    successButton: 'Продолжить',
  },
}

export function FoundationPaymentButton({
  language,
  onSuccess,
  isUnlocked = false,
}: FoundationPaymentButtonProps) {
  const { recordFoundationPurchase } = useAnalytics()
  const { isAuthenticated } = usePiAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  const t = content[language]

  const handleConfirmPayment = async () => {
    if (!isAuthenticated) {
      setError('Please login first.')
      console.error('[Payment] Not authenticated')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      console.log('[Payment] Creating transaction via Pi.createTransaction')
      
      // Create transaction using Pi Network payment protocol
      const paymentData = {
        amount: 3.14,
        memo: 'Unlock Foundation Course - Crypto Genesis Academy',
        metadata: {
          productId: 'foundation-course',
          courseName: 'Pi Genesis Foundation',
        },
      }

      // Call Pi.createPayment with proper callbacks
      window.Pi.createPayment(paymentData, {
        onReadyForServerApproval: async (paymentId: string) => {
          console.log('[Payment] Ready for server approval, paymentId:', paymentId)
          // Your backend would approve the payment here
          // For now, we'll complete it
          window.Pi.completePayment(paymentId, {
            txid: 'frontend-test-' + Date.now(),
          })
        },
        onReadyForServerCompletion: async (paymentId: string, txid: string) => {
          console.log('[Payment] Ready for server completion, paymentId:', paymentId, 'txid:', txid)
          // Backend would verify the transaction here
          // Complete the payment
          window.Pi.completePayment(paymentId, {
            txid: txid,
          })
        },
        onCancel: (paymentId: string) => {
          console.log('[Payment] Payment cancelled by user, paymentId:', paymentId)
          setError('Payment cancelled.')
          setShowConfirmDialog(false)
          setIsLoading(false)
        },
        onError: (error: any) => {
          console.error('[Payment] Payment error:', error)
          setError(error?.message || 'Payment failed. Please try again.')
          setShowConfirmDialog(false)
          setIsLoading(false)
        },
      })

      // Payment successful
      setShowConfirmDialog(false)
      setShowSuccessDialog(true)
      recordFoundationPurchase()
      console.log('[Payment] Payment flow initiated successfully')
    } catch (err: any) {
      console.error('[Payment] Error:', err)
      const errorMessage = err?.message || 'Payment failed. Please try again.'
      setError(errorMessage)
      setShowConfirmDialog(false)
      setIsLoading(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessDialog(false)
    onSuccess?.()
  }

  if (isUnlocked) {
    return (
      <Button
        disabled
        className="w-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-500 font-semibold py-3 rounded-xl hover:bg-emerald-500/20 flex items-center justify-center gap-2"
      >
        <CheckCircle2 size={18} />
        <span>{t.unlocked}</span>
      </Button>
    )
  }

  return (
    <>
      <div className="w-full space-y-2">
        <Button
          onClick={() => setShowConfirmDialog(true)}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-75 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              <span>{t.processing}</span>
            </>
          ) : (
            <>
              <Unlock size={18} />
              <span>{t.unlockButton}</span>
            </>
          )}
        </Button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-2">
            <X size={16} className="flex-shrink-0 mt-0.5 text-red-500" />
            <p className="text-xs text-red-500 font-medium">{error}</p>
          </div>
        )}
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="border-border/50 bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground">{t.confirmTitle}</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              {t.confirmDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-border/50 text-foreground hover:bg-secondary/10">
              {t.cancelButton}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmPayment}
              disabled={isLoading}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              {t.confirmButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="border-border/50 bg-card">
          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <AlertDialogTitle className="text-foreground">{t.successTitle}</AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              {t.successDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={handleSuccessClose}
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90"
            >
              {t.successButton}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
