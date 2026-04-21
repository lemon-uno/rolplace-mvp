'use client'

import { useState } from 'react'
import { X, Car, ClipboardCheck, User } from 'lucide-react'
import { submitTomaAuto } from '@/actions/toma-auto'

interface TomaAutoFormProps {
  vehicleId: string
  vehicleTitle: string
  open: boolean
  onClose: () => void
}

const CONDITION_OPTIONS = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
]

export function TomaAutoForm({ vehicleId, vehicleTitle, open, onClose }: TomaAutoFormProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    formData.set('vehicleId', vehicleId)

    const result = await submitTomaAuto(formData)

    if (result.error) {
      setError(result.error)
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 rounded-t-xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-[#215add] tracking-wide uppercase">Toma de auto a cuenta de:</h2>
              <p className="text-lg font-bold text-[#1b2064] mt-0.5">{vehicleTitle}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {success ? (
          <div className="px-6 py-12 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Solicitud enviada</h3>
            <p className="text-sm text-gray-500 mt-1">El publicante recibió tu propuesta.</p>
            <button
              onClick={onClose}
              className="mt-6 px-6 py-2.5 bg-[#215add] text-white font-semibold rounded-lg hover:bg-[#1b4fd0] transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {/* Section 1: Info del Auto */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Car className="w-4 h-4 text-[#215add]" />
                <h3 className="text-sm font-semibold text-gray-900">Información del auto</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Marca *</label>
                  <input name="tradeInMake" required placeholder="Toyota" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Modelo *</label>
                  <input name="tradeInModel" required placeholder="Corolla" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Año *</label>
                  <input name="tradeInYear" required placeholder="2020" maxLength={4} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Versión</label>
                  <input name="tradeInVersion" placeholder="XLE" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Color</label>
                  <input name="tradeInColor" placeholder="Blanco" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Kilometraje</label>
                  <input name="tradeInMileage" placeholder="45000" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
              </div>
            </section>

            {/* Section 2: Estado del Auto */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <ClipboardCheck className="w-4 h-4 text-[#215add]" />
                <h3 className="text-sm font-semibold text-gray-900">Estado del auto</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Pintura *</label>
                  <select name="paintCondition" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]">
                    <option value="">Seleccionar</option>
                    {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Interiores *</label>
                  <select name="interiorCondition" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]">
                    <option value="">Seleccionar</option>
                    {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Motor *</label>
                  <select name="engineCondition" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]">
                    <option value="">Seleccionar</option>
                    {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Transmisión *</label>
                  <select name="transmissionCondition" required className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]">
                    <option value="">Seleccionar</option>
                    {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs font-medium text-gray-600 mb-1">Notas adicionales</label>
                <textarea name="additionalNotes" rows={2} placeholder="Detalles extra del vehículo..." className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add] resize-none" />
              </div>
            </section>

            {/* Section 3: Datos de Contacto */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <User className="w-4 h-4 text-[#215add]" />
                <h3 className="text-sm font-semibold text-gray-900">Tus datos de contacto</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Nombre completo *</label>
                  <input name="contactName" required placeholder="Juan Pérez" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Teléfono *</label>
                    <input name="contactPhone" required placeholder="5512345678" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                    <input name="contactEmail" type="email" required placeholder="correo@ejemplo.com" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#215add]/30 focus:border-[#215add]" />
                  </div>
                </div>
              </div>
            </section>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-[#215add] text-white font-semibold rounded-lg hover:bg-[#1b4fd0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Enviando...' : 'Enviar solicitud de toma'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
