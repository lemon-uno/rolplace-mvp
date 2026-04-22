'use client'

import { useState, useMemo } from 'react'
import { calculateMonthlyPayment } from '../lib/calculateFinancing'
import { Calculator } from 'lucide-react'

interface FinancingDefaults {
  tasaInteresAnual: number | null
  plazoCreditoMeses: number | null
  enganchePorcentaje: number | null
}

export function FinancingCalculator({ price, defaults }: { price: number; defaults: FinancingDefaults | null }) {
  const [tasa, setTasa] = useState(defaults?.tasaInteresAnual ?? 12)
  const [plazo, setPlazo] = useState(defaults?.plazoCreditoMeses ?? 48)
  const [enganche, setEnganche] = useState(defaults?.enganchePorcentaje ?? 20)

  const result = useMemo(() => {
    if (tasa < 0 || plazo <= 0 || enganche < 0 || enganche >= 100) return null
    return calculateMonthlyPayment(price, tasa, plazo, enganche)
  }, [price, tasa, plazo, enganche])

  const fmt = (n: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(n)

  const inputClass = 'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow p-5">
      <div className="flex items-center gap-2 mb-4">
        <Calculator className="w-5 h-5 text-blue-600" />
        <h3 className="font-semibold text-gray-900">Calcular Financiamiento</h3>
      </div>

      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Tasa anual (%)</label>
          <input type="number" step="0.1" min="0" value={tasa} onChange={e => setTasa(parseFloat(e.target.value) || 0)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Plazo (meses)</label>
          <input type="number" min="1" max="120" value={plazo} onChange={e => setPlazo(parseInt(e.target.value) || 1)} className={inputClass} />
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">Enganche (%)</label>
          <input type="number" step="0.1" min="0" max="99" value={enganche} onChange={e => setEnganche(parseFloat(e.target.value) || 0)} className={inputClass} />
        </div>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Enganche</span>
            <span className="font-medium text-gray-900">{fmt(result.downPayment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Pago mensual</span>
            <span className="font-bold text-blue-600 text-lg">{fmt(result.monthly)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Total a pagar</span>
            <span className="font-medium text-gray-900">{fmt(result.totalPayment)}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-400">
            <span>Intereses totales</span>
            <span>{fmt(result.interestTotal)}</span>
          </div>
        </div>
      )}
    </div>
  )
}
