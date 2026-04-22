'use client'

import { useState } from 'react'
import { updateProfile } from '@/actions/auth'

interface CalculatorSettings {
  tasa_interes_anual: number | null
  plazo_credito_meses: number | null
  enganche_porcentaje: number | null
}

export function CalculatorSettingsForm({ settings }: { settings: CalculatorSettings }) {
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateProfile(formData)

    if (result?.error) {
      setMsg({ type: 'error', text: result.error })
    } else {
      setMsg({ type: 'success', text: 'Configuración de calculadora guardada' })
    }
    setSaving(false)
  }

  const inputClass = 'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {msg && (
        <div className={`p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
          {msg.text}
        </div>
      )}

      <p className="text-sm text-gray-400">
        Configura los valores por defecto que verán los compradores en la calculadora de financiamiento de tus vehículos.
      </p>

      <div className="space-y-2">
        <label htmlFor="tasa_interes_anual" className="block text-sm font-medium text-gray-300">Tasa de interés anual (%)</label>
        <input
          id="tasa_interes_anual"
          name="tasa_interes_anual"
          type="number"
          step="0.01"
          min="0"
          max="99.99"
          defaultValue={settings.tasa_interes_anual ?? ''}
          placeholder="Ej: 12.5"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="plazo_credito_meses" className="block text-sm font-medium text-gray-300">Plazo del crédito (meses)</label>
        <input
          id="plazo_credito_meses"
          name="plazo_credito_meses"
          type="number"
          min="1"
          max="120"
          defaultValue={settings.plazo_credito_meses ?? ''}
          placeholder="Ej: 48"
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="enganche_porcentaje" className="block text-sm font-medium text-gray-300">Enganche (%)</label>
        <input
          id="enganche_porcentaje"
          name="enganche_porcentaje"
          type="number"
          step="0.01"
          min="0"
          max="100"
          defaultValue={settings.enganche_porcentaje ?? ''}
          placeholder="Ej: 20"
          className={inputClass}
        />
      </div>

      <div className="pt-4 border-t border-gray-700">
        <button type="submit" disabled={saving} className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Calculadora'}
        </button>
      </div>
    </form>
  )
}
