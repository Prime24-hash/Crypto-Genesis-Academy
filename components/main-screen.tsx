'use client'

import { useState, useEffect } from 'react'
import { Shield, Book, Zap, Users, Award, Globe, Lock, Bell, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function MainScreen() {
  const [username, setUsername] = useState<string | null>(null)
  const [status, setStatus] = useState('Загрузка...')
  const [piReady, setPiReady] = useState(false)

  // 🔑 INIT PI
  useEffect(() => {
    const checkPi = () => {
      const pi = (window as any).Pi

      if (!pi) {
        setStatus('❌ Открой через Pi Browser')
        return
      }

      try {
        pi.init({ version: '2.0', sandbox: true })

        setPiReady(true)
        setStatus('Авторизация...')

        pi.authenticate(['username'], (auth: any) => {
          setUsername(auth?.user?.username || 'Pioneer')
          setStatus('Готово')
        })
      } catch (e) {
        setStatus('❌ Ошибка SDK')
      }
    }

    setTimeout(checkPi, 1000)
  }, [])

  // 💰 PAYMENT
  const handlePayment = async () => {
    const pi = (window as any).Pi

    if (!piReady || !pi) {
      alert('Открой через Pi Browser')
      return
    }

    try {
      setStatus('Создание платежа...')

      await pi.createPayment(
        {
          amount: 3.14,
          memo: 'Crypto Genesis Full Access',
          metadata: { type: 'course_unlock' }
        },
        {
          onReadyForServerApproval: () => {},

          onReadyForServerCompletion: () => {
            setStatus('✅ ОПЛАЧЕНО')
            alert('Доступ открыт!')
          },

          onCancel: () => {
            setStatus('❌ Отменено')
          },

          onError: (err: any) => {
            setStatus('❌ Ошибка')
            alert(err.message)
          }
        }
      )
    } catch (e) {
      setStatus('❌ Ошибка оплаты')
    }
  }

  return (
    <div className="w-full h-screen flex flex-col justify-between bg-black text-white p-4">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Shield />
          <div>
            <h1 className="font-bold">Crypto Genesis</h1>
            <p className="text-xs opacity-70">Academy</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Bell />
          <Menu />
        </div>
      </div>

      {/* CENTER */}
      <div className="flex flex-col items-center gap-4 text-center">

        <h2 className="text-xl font-bold">
          {username ? `Welcome, ${username}` : 'Loading...'}
        </h2>

        <p className="text-sm opacity-70">
          Start your crypto journey
        </p>

        <p className="text-xs opacity-50">
          {status}
        </p>

        {/* COURSE CARD */}
        <div className="border p-4 rounded-xl w-full">
          <div className="flex items-center gap-2 mb-2">
            <Book />
            <span>Genesis Foundation</span>
          </div>
          <p className="text-xs opacity-70">
            52 lessons • 8 blocks
          </p>
        </div>

        {/* PAYMENT BUTTON */}
        <Button
          onClick={handlePayment}
          className="w-full mt-4"
        >
          Unlock Full Course — 3.14 Pi
        </Button>

      </div>

      {/* FOOTER */}
      <div className="flex justify-around text-xs opacity-70">
        <div className="flex flex-col items-center">
          <Book size={16} />
          Learn
        </div>
        <div className="flex flex-col items-center">
          <Zap size={16} />
          Upgrade
        </div>
        <div className="flex flex-col items-center">
          <Users size={16} />
          Community
        </div>
        <div className="flex flex-col items-center">
          <Award size={16} />
          Certificate
        </div>
      </div>
    </div>
  )
}
