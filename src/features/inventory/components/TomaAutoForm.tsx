'use client'

import { useState, useRef, useCallback, Fragment } from 'react'
import { X, Camera, Check, ChevronRight, ChevronLeft, Trash2 } from 'lucide-react'
import { submitTomaAuto } from '@/actions/toma-auto'

interface TomaAutoFormProps {
  vehicleId: string
  vehicleTitle: string
  open: boolean
  onClose: () => void
}

interface PhotoItem {
  file: File
  preview: string
}

const STEPS = [
  { number: 1, label: 'Información\ndel Auto' },
  { number: 2, label: 'Estado\ndel Auto' },
  { number: 3, label: 'Datos de\nContacto' },
]

const CONDITION_OPTIONS = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
]

const TRANSMISSION_OPTIONS = [
  { value: 'automatica', label: 'Automática' },
  { value: 'manual', label: 'Manual' },
  { value: 'cvt', label: 'CVT' },
]

const inputBase = "w-full px-3 py-2 border border-[#E0E0E0] rounded text-sm text-[#2C3E50] placeholder-[#95A5A6] focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]/20"

export function TomaAutoForm({ vehicleId, vehicleTitle, open, onClose }: TomaAutoFormProps) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [photos, setPhotos] = useState<PhotoItem[]>([])
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    tradeInMake: '', tradeInModel: '', tradeInYear: '',
    tradeInTransmission: '', tradeInMileage: '',
    tradeInExteriorColor: '', tradeInInteriorColor: '',
    paintCondition: '', interiorCondition: '',
    engineCondition: '', transmissionCondition: '',
    additionalNotes: '',
    contactName: '', contactPhone: '', contactEmail: '',
  })

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError(null)
  }

  const addPhotos = useCallback((files: File[]) => {
    const images = files.filter(f => f.type.startsWith('image/'))
    const newItems = images.map(file => ({ file, preview: URL.createObjectURL(file) }))
    setPhotos(prev => [...prev, ...newItems].slice(0, 10))
  }, [])

  const removePhoto = (idx: number) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[idx].preview)
      return prev.filter((_, i) => i !== idx)
    })
  }

  const validate = (): boolean => {
    if (step === 1) {
      if (!form.tradeInMake.trim()) { setError('Marca es requerida'); return false }
      if (!form.tradeInModel.trim()) { setError('Modelo es requerido'); return false }
      if (!form.tradeInYear || form.tradeInYear.length < 4) { setError('Año es requerido (4 dígitos)'); return false }
    }
    if (step === 2) {
      const fields: [string, string][] = [
        ['paintCondition', 'Pintura'], ['interiorCondition', 'Interiores'],
        ['engineCondition', 'Motor'], ['transmissionCondition', 'Transmisión'],
      ]
      for (const [key, name] of fields) {
        if (!form[key as keyof typeof form]) { setError(`Estado de ${name} es requerido`); return false }
      }
    }
    if (step === 3) {
      if (!form.contactName || form.contactName.length < 2) { setError('Nombre es requerido'); return false }
      if (!form.contactPhone || form.contactPhone.length < 6) { setError('Teléfono es requerido'); return false }
      if (!form.contactEmail || !/\S+@\S+\.\S+/.test(form.contactEmail)) { setError('Email es inválido'); return false }
    }
    return true
  }

  const next = () => { if (validate()) setStep(s => Math.min(s + 1, 3)) }
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const submit = async () => {
    if (!validate()) return
    setSubmitting(true)
    setError(null)

    const fd = new FormData()
    Object.entries(form).forEach(([k, v]) => fd.set(k, v))
    fd.set('vehicleId', vehicleId)
    photos.forEach(p => fd.append('photos', p.file))

    const result = await submitTomaAuto(fd)
    if (result.error) { setError(result.error); setSubmitting(false); return }
    setSuccess(true)
    setSubmitting(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#1b2064] px-5 py-4 shrink-0">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <p className="text-[10px] font-semibold text-white/60 tracking-widest uppercase">Toma de auto a cuenta de:</p>
              <h2 className="text-sm font-bold text-white mt-0.5 leading-snug">{vehicleTitle}</h2>
            </div>
            <button onClick={onClose} className="p-1 rounded hover:bg-white/10 transition-colors shrink-0">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>
        </div>

        {!success ? (
          <>
            {/* Step Indicator */}
            <div className="px-5 pt-5 pb-3 shrink-0">
              <div className="flex items-start">
                {STEPS.map((s, i) => (
                  <Fragment key={s.number}>
                    <div className="flex flex-col items-center" style={{ flex: '0 0 auto', width: '60px' }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                        ${step >= s.number ? 'bg-[#3498DB] text-white' : 'border-2 border-[#E0E0E0] text-[#95A5A6]'}`}>
                        {step > s.number ? <Check className="w-3.5 h-3.5" /> : s.number}
                      </div>
                      <span className={`text-[9px] mt-1 text-center leading-tight whitespace-pre-line
                        ${step >= s.number ? 'text-[#3498DB] font-medium' : 'text-[#95A5A6]'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className={`flex-1 h-0.5 mt-3.5 rounded-full transition-colors mx-1
                        ${step > s.number ? 'bg-[#3498DB]' : 'bg-[#E0E0E0]'}`} />
                    )}
                  </Fragment>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mx-5 mb-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded px-3 py-2 shrink-0">
                {error}
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 pb-4">
              {step === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Marca" required>
                      <input value={form.tradeInMake} onChange={set('tradeInMake')} placeholder="Toyota" className={inputBase} />
                    </Field>
                    <Field label="Modelo" required>
                      <input value={form.tradeInModel} onChange={set('tradeInModel')} placeholder="Corolla" className={inputBase} />
                    </Field>
                    <Field label="Año" required>
                      <input value={form.tradeInYear} onChange={set('tradeInYear')} placeholder="2020" maxLength={4} className={inputBase} />
                    </Field>
                    <Field label="Transmisión">
                      <select value={form.tradeInTransmission} onChange={set('tradeInTransmission')} className={`${inputBase} bg-white`}>
                        <option value="">Seleccionar</option>
                        {TRANSMISSION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Kilometraje">
                      <input value={form.tradeInMileage} onChange={set('tradeInMileage')} placeholder="45,000" className={inputBase} />
                    </Field>
                    <Field label="Color Exterior">
                      <input value={form.tradeInExteriorColor} onChange={set('tradeInExteriorColor')} placeholder="Blanco" className={inputBase} />
                    </Field>
                    <div className="col-span-2">
                      <Field label="Color Interior">
                        <input value={form.tradeInInteriorColor} onChange={set('tradeInInteriorColor')} placeholder="Negro" className={inputBase} />
                      </Field>
                    </div>
                  </div>

                  {/* Photo Upload */}
                  <div>
                    <label className="block text-xs font-medium text-[#7F8C8D] mb-1.5">Fotos del auto</label>
                    <div
                      onDrop={e => { e.preventDefault(); setDragOver(false); addPhotos(Array.from(e.dataTransfer.files)) }}
                      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                      onDragLeave={() => setDragOver(false)}
                      onClick={() => fileRef.current?.click()}
                      className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer transition-colors
                        ${dragOver ? 'border-[#3498DB] bg-[#3498DB]/5' : 'border-[#B0BEC5] bg-[#F8F9FA] hover:border-[#3498DB]/50'}`}
                    >
                      <Camera className="w-7 h-7 text-[#95A5A6] mx-auto mb-2" />
                      <p className="text-xs text-[#7F8C8D]">Arrastra imágenes aquí o</p>
                      <p className="text-[10px] text-[#95A5A6] mb-2.5">JPG, PNG — Máximo 10 MB</p>
                      <span className="inline-block px-4 py-1.5 bg-[#3498DB] text-white text-xs font-semibold rounded">
                        Seleccionar imágenes
                      </span>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                      onChange={e => { if (e.target.files) addPhotos(Array.from(e.target.files)); e.target.value = '' }} />
                  </div>

                  {/* Previews */}
                  {photos.length > 0 && (
                    <div className="grid grid-cols-4 gap-2">
                      {photos.map((p, i) => (
                        <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-[#E0E0E0] group">
                          <img src={p.preview} alt="" className="w-full h-full object-cover" />
                          <button onClick={() => removePhoto(i)}
                            className="absolute top-0.5 right-0.5 w-5 h-5 bg-red-500/90 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Pintura" required>
                      <select value={form.paintCondition} onChange={set('paintCondition')} className={`${inputBase} bg-white`}>
                        <option value="">Seleccionar</option>
                        {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Interiores" required>
                      <select value={form.interiorCondition} onChange={set('interiorCondition')} className={`${inputBase} bg-white`}>
                        <option value="">Seleccionar</option>
                        {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Motor" required>
                      <select value={form.engineCondition} onChange={set('engineCondition')} className={`${inputBase} bg-white`}>
                        <option value="">Seleccionar</option>
                        {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                    <Field label="Transmisión" required>
                      <select value={form.transmissionCondition} onChange={set('transmissionCondition')} className={`${inputBase} bg-white`}>
                        <option value="">Seleccionar</option>
                        {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#7F8C8D] mb-1.5">Notas adicionales</label>
                    <textarea value={form.additionalNotes} onChange={set('additionalNotes')} rows={3}
                      placeholder="Detalles extra del vehículo..."
                      className="w-full px-3 py-2 border border-[#E0E0E0] rounded text-sm text-[#2C3E50] placeholder-[#95A5A6] focus:outline-none focus:border-[#3498DB] resize-none" />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <Field label="Nombre completo" required>
                    <input value={form.contactName} onChange={set('contactName')} placeholder="Juan Pérez" className={inputBase} />
                  </Field>
                  <Field label="Teléfono" required>
                    <input value={form.contactPhone} onChange={set('contactPhone')} placeholder="5512345678" className={inputBase} />
                  </Field>
                  <Field label="Email" required>
                    <input value={form.contactEmail} onChange={set('contactEmail')} type="email" placeholder="correo@ejemplo.com" className={inputBase} />
                  </Field>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="border-t border-[#E0E0E0] px-5 py-3 flex items-center justify-between shrink-0">
              {step > 1 ? (
                <button onClick={prev} className="flex items-center gap-1 text-sm text-[#7F8C8D] hover:text-[#2C3E50] font-medium transition-colors">
                  <ChevronLeft className="w-4 h-4" /> Anterior
                </button>
              ) : <div />}
              <button
                onClick={step === 3 ? submit : next}
                disabled={submitting}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#3498DB] text-white text-sm font-semibold rounded hover:bg-[#2980B9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : step === 3 ? 'Enviar solicitud' : 'Guarda y continúa'}
                {!submitting && step < 3 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-[#2C3E50]">Solicitud enviada</h3>
            <p className="text-sm text-[#7F8C8D] mt-1">El publicante recibió tu propuesta.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-[#3498DB] text-white font-semibold rounded hover:bg-[#2980B9] transition-colors">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-[#7F8C8D] mb-1.5">
        {label} {required && <span className="text-[#E74C3C]">*</span>}
      </label>
      {children}
    </div>
  )
}
