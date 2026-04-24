'use client'

import { useState, useEffect, Fragment } from 'react'
import { X, Check, ChevronRight, ChevronLeft } from 'lucide-react'
import { submitAgendarCita } from '@/actions/agendar-cita'
import { getOwnerSchedule } from '@/actions/auth'

interface DaySchedule {
  start: string
  end: string
  closed: boolean
}

interface AgendarCitaFormProps {
  vehicleId: string
  vehicleTitle: string
  open: boolean
  onClose: () => void
}

const STEPS = [
  { number: 1, label: 'Elige el\ndía y hora' },
  { number: 2, label: 'Confirma\ntu cita' },
]

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function getWeekDates(): { date: Date; label: string; dayName: string; dayNum: number }[] {
  const today = new Date()
  const dates: { date: Date; label: string; dayName: string; dayNum: number }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    dates.push({
      date: d,
      dayName: DIAS[d.getDay()].substring(0, 3),
      dayNum: d.getDate(),
      label: `${DIAS[d.getDay()]} ${d.getDate()}`,
    })
  }
  return dates
}

function generateSlots(start: string, end: string): string[] {
  const slots: string[] = []
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let h = sh, m = sm
  while (h < eh || (h === eh && m <= em)) {
    slots.push(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`)
    m += 15
    if (m >= 60) { m = 0; h++ }
  }
  return slots
}

// Start 1 hour after configured start, end at configured end
function slotsFromSchedule(daySchedule: DaySchedule): { morning: string[]; afternoon: string[] } {
  if (daySchedule.closed) return { morning: [], afternoon: [] }
  const [sh, sm] = daySchedule.start.split(':').map(Number)
  const adjustedStart = `${String(sh + 1).padStart(2, '0')}:${String(sm).padStart(2, '0')}`
  const allSlots = generateSlots(adjustedStart, daySchedule.end)
  const morning = allSlots.filter(s => parseInt(s.split(':')[0]) < 14)
  const afternoon = allSlots.filter(s => parseInt(s.split(':')[0]) >= 14)
  return { morning, afternoon }
}

const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']

const inputBase = "w-full px-3 py-2 border border-[#E0E0E0] rounded text-sm text-[#2C3E50] placeholder-[#95A5A6] focus:outline-none focus:border-[#3498DB] focus:ring-1 focus:ring-[#3498DB]/20"

export function AgendarCitaForm({ vehicleId, vehicleTitle, open, onClose }: AgendarCitaFormProps) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [schedule, setSchedule] = useState<Record<string, DaySchedule> | null>(null)
  const [form, setForm] = useState({ contactName: '', contactEmail: '', contactPhone: '' })

  useEffect(() => {
    if (open) getOwnerSchedule(vehicleId).then(setSchedule)
  }, [open, vehicleId])

  const set = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }))
    setError(null)
  }

  const weekDates = getWeekDates()

  const validateStep1 = (): boolean => {
    if (!selectedDate) { setError('Selecciona una fecha'); return false }
    if (!selectedTime) { setError('Selecciona un horario'); return false }
    return true
  }

  const next = () => {
    if (validateStep1()) { setError(null); setStep(2) }
  }
  const prev = () => setStep(s => Math.max(s - 1, 1))

  const submit = async () => {
    if (!selectedDate || !selectedTime) return
    if (!form.contactName || form.contactName.length < 2) { setError('Nombre es requerido'); return }
    if (!form.contactEmail || !/\S+@\S+\.\S+/.test(form.contactEmail)) { setError('Email inválido'); return }
    if (!form.contactPhone || form.contactPhone.length < 6) { setError('Celular es requerido'); return }

    setSubmitting(true)
    setError(null)

    const fd = new FormData()
    fd.set('vehicleId', vehicleId)
    fd.set('date', selectedDate.toISOString())
    fd.set('time', selectedTime)
    fd.set('contactName', form.contactName)
    fd.set('contactEmail', form.contactEmail)
    fd.set('contactPhone', form.contactPhone)

    const result = await submitAgendarCita(fd)
    if (result.error) { setError(result.error); setSubmitting(false); return }
    setSuccess(true)
    setSubmitting(false)
  }

  if (!open) return null

  const formatDate = (d: Date) => `${DIAS[d.getDay()]} ${d.getDate()} de ${MESES[d.getMonth()]}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-[#1b2064] px-5 py-4 shrink-0">
          <div className="flex items-start justify-between">
            <div className="pr-4">
              <p className="text-[10px] font-semibold text-white/60 tracking-widest uppercase">Agendar cita para:</p>
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
                    <div className="flex flex-col items-center" style={{ flex: '0 0 auto', width: '80px' }}>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                        ${step >= s.number ? 'bg-[#3498DB] text-white' : 'border-2 border-[#E0E0E0] text-[#95A5A6]'}`}>
                        {step > s.number ? <Check className="w-3.5 h-3.5" /> : s.number}
                      </div>
                      <span className={`text-[9px] mt-1 text-center leading-tight whitespace-pre-line
                        ${step >= s.number ? 'text-[#3498DB] font-medium' : 'text-[#95A5A6]'}`}>
                        {s.label}
                      </span>
                    </div>
                    {i < 1 && (
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
              {step === 1 && (() => {
                const getDaySchedule = (date: Date) => {
                  const key = DAY_KEYS[date.getDay()]
                  return schedule?.[key] ?? null
                }
                const isDayClosed = (date: Date) => getDaySchedule(date)?.closed ?? false
                const availableDates = weekDates.filter(d => !isDayClosed(d.date))

                const selectedDaySchedule = selectedDate ? getDaySchedule(selectedDate) : null
                const { morning: morningSlots, afternoon: afternoonSlots } = selectedDaySchedule
                  ? slotsFromSchedule(selectedDaySchedule)
                  : { morning: [] as string[], afternoon: [] as string[] }

                return (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-[#7F8C8D] mb-2">Selecciona un día</label>
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        {availableDates.map((d, i) => {
                          const isSelected = selectedDate && d.date.toDateString() === selectedDate.toDateString()
                          return (
                            <button
                              key={i}
                              type="button"
                              onClick={() => { setSelectedDate(d.date); setSelectedTime(null); setError(null) }}
                              className={`flex-shrink-0 w-14 py-2 rounded-lg border text-center transition-colors
                                ${isSelected
                                  ? 'bg-[#3498DB] text-white border-[#3498DB]'
                                  : 'bg-white text-[#2C3E50] border-[#E0E0E0] hover:border-[#3498DB]/50'}`}
                            >
                              <p className="text-[10px] font-medium">{d.dayName}</p>
                              <p className="text-lg font-bold">{d.dayNum}</p>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {selectedDate && morningSlots.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-[#7F8C8D] mb-2">Por la mañana</label>
                        <div className="grid grid-cols-4 gap-2">
                          {morningSlots.map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => { setSelectedTime(t); setError(null) }}
                              className={`py-2 rounded text-xs font-medium border transition-colors
                                ${selectedTime === t
                                  ? 'bg-[#3498DB] text-white border-[#3498DB]'
                                  : 'bg-white text-[#2C3E50] border-[#E0E0E0] hover:border-[#3498DB]/50'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDate && afternoonSlots.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-[#7F8C8D] mb-2">Por la tarde</label>
                        <div className="grid grid-cols-4 gap-2">
                          {afternoonSlots.map(t => (
                            <button
                              key={t}
                              type="button"
                              onClick={() => { setSelectedTime(t); setError(null) }}
                              className={`py-2 rounded text-xs font-medium border transition-colors
                                ${selectedTime === t
                                  ? 'bg-[#3498DB] text-white border-[#3498DB]'
                                  : 'bg-white text-[#2C3E50] border-[#E0E0E0] hover:border-[#3498DB]/50'}`}
                            >
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedDate && morningSlots.length === 0 && afternoonSlots.length === 0 && (
                      <p className="text-xs text-[#95A5A6] text-center py-4">No hay horarios disponibles para este día.</p>
                    )}
                  </div>
                )
              })()}

              {step === 2 && (
                <div className="space-y-4">
                  {/* Summary */}
                  <div className="bg-[#F8F9FA] rounded-lg p-4 border border-[#E0E0E0]">
                    <p className="text-xs text-[#7F8C8D] font-medium mb-1">Tu cita</p>
                    <p className="text-sm font-bold text-[#2C3E50]">
                      {selectedDate && formatDate(selectedDate)} a las {selectedTime}
                    </p>
                    <p className="text-xs text-[#7F8C8D] mt-1">{vehicleTitle}</p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#7F8C8D] mb-1.5">Nombre completo <span className="text-[#E74C3C]">*</span></label>
                    <input value={form.contactName} onChange={set('contactName')} placeholder="Juan Pérez" className={inputBase} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#7F8C8D] mb-1.5">Email <span className="text-[#E74C3C]">*</span></label>
                    <input value={form.contactEmail} onChange={set('contactEmail')} type="email" placeholder="correo@ejemplo.com" className={inputBase} />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#7F8C8D] mb-1.5">Celular <span className="text-[#E74C3C]">*</span></label>
                    <input value={form.contactPhone} onChange={set('contactPhone')} type="tel" placeholder="5512345678" className={inputBase} />
                  </div>
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
                onClick={step === 2 ? submit : next}
                disabled={submitting || (step === 1 && (!selectedDate || !selectedTime))}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#3498DB] text-white text-sm font-semibold rounded hover:bg-[#2980B9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Enviando...' : step === 2 ? 'Confirmar cita' : 'Siguiente'}
                {!submitting && step === 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          </>
        ) : (
          <div className="px-5 py-12 text-center">
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-7 h-7 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-[#2C3E50]">Cita agendada</h3>
            <p className="text-sm text-[#7F8C8D] mt-1">Recibirás confirmación pronto.</p>
            <button onClick={onClose} className="mt-6 px-6 py-2.5 bg-[#3498DB] text-white font-semibold rounded hover:bg-[#2980B9] transition-colors">
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
