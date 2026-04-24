'use client'

import { useState } from 'react'
import { User, Calculator, Clock } from 'lucide-react'

type Tab = 'profile' | 'calculator' | 'schedule'

export function SettingsTabs({
  profileTab,
  calculatorTab,
  scheduleTab,
}: {
  profileTab: React.ReactNode
  calculatorTab: React.ReactNode
  scheduleTab: React.ReactNode
}) {
  const [active, setActive] = useState<Tab>('profile')

  const tabButton = (tab: Tab, icon: React.ReactNode, label: string) => (
    <button
      onClick={() => setActive(tab)}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-t-md ${
        active === tab
          ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900/50'
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {icon}
      {label}
    </button>
  )

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-800 mb-6">
        {tabButton('profile', <User className="w-4 h-4" />, 'Perfil')}
        {tabButton('calculator', <Calculator className="w-4 h-4" />, 'Calculadora')}
        {tabButton('schedule', <Clock className="w-4 h-4" />, 'Horarios')}
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur p-8">
        {active === 'profile' && profileTab}
        {active === 'calculator' && calculatorTab}
        {active === 'schedule' && scheduleTab}
      </div>
    </div>
  )
}
