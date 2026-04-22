'use client'

import { useState } from 'react'
import { User, Calculator } from 'lucide-react'

type Tab = 'profile' | 'calculator'

export function SettingsTabs({
  profileTab,
  calculatorTab,
}: {
  profileTab: React.ReactNode
  calculatorTab: React.ReactNode
}) {
  const [active, setActive] = useState<Tab>('profile')

  return (
    <div>
      <div className="flex gap-1 border-b border-gray-800 mb-6">
        <button
          onClick={() => setActive('profile')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-t-md ${
            active === 'profile'
              ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900/50'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <User className="w-4 h-4" />
          Perfil
        </button>
        <button
          onClick={() => setActive('calculator')}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all rounded-t-md ${
            active === 'calculator'
              ? 'text-cyan-400 border-b-2 border-cyan-400 bg-gray-900/50'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Calculator className="w-4 h-4" />
          Calculadora
        </button>
      </div>

      <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur p-8">
        {active === 'profile' ? profileTab : calculatorTab}
      </div>
    </div>
  )
}
