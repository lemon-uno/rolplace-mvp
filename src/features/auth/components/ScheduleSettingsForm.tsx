'use client'

import { useState } from 'react'
import { updateSchedule } from '@/actions/auth'

interface DaySchedule {
  start: string
  end: string
  closed: boolean
}

interface ScheduleData {
  monday: DaySchedule
  tuesday: DaySchedule
  wednesday: DaySchedule
  thursday: DaySchedule
  friday: DaySchedule
  saturday: DaySchedule
  sunday: DaySchedule
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo',
}

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

const DEFAULT_SCHEDULE: ScheduleData = {
  monday: { start: '10:00', end: '18:00', closed: false },
  tuesday: { start: '10:00', end: '18:00', closed: false },
  wednesday: { start: '10:00', end: '18:00', closed: false },
  thursday: { start: '10:00', end: '18:00', closed: false },
  friday: { start: '10:00', end: '18:00', closed: false },
  saturday: { start: '10:00', end: '14:00', closed: false },
  sunday: { start: '10:00', end: '14:00', closed: true },
}

export function ScheduleSettingsForm({ schedule }: { schedule: ScheduleData | null }) {
  const [form, setForm] = useState<ScheduleData>(schedule || DEFAULT_SCHEDULE)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const updateDay = (day: string, field: string, value: string | boolean) => {
    setForm(prev => ({
      ...prev,
      [day]: { ...prev[day as keyof ScheduleData], [field]: value },
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMsg(null)

    const fd = new FormData()
    fd.set('schedule', JSON.stringify(form))
    const result = await updateSchedule(fd)

    if (result?.error) {
      setMsg({ type: 'error', text: result.error })
    } else {
      setMsg({ type: 'success', text: 'Horarios guardados correctamente' })
    }
    setSaving(false)
  }

  const inputClass = 'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white text-sm focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {msg && (
        <div className={`p-3 rounded-lg text-sm ${msg.type === 'success' ? 'bg-green-900/30 text-green-400 border border-green-800' : 'bg-red-900/30 text-red-400 border border-red-800'}`}>
          {msg.text}
        </div>
      )}

      <p className="text-xs text-gray-500">Define tus horarios de atención. Las citas se agendarán 1 hora después de tu hora de entrada.</p>

      {DAY_ORDER.map(day => {
        const d = form[day as keyof ScheduleData]
        return (
          <div key={day} className="flex items-center gap-3 border border-gray-700 rounded-lg p-3">
            <span className="w-24 text-sm font-medium text-gray-300 shrink-0">{DAY_LABELS[day]}</span>

            <label className="flex items-center gap-2 text-sm text-gray-400 shrink-0 cursor-pointer">
              <input
                type="checkbox"
                checked={d.closed}
                onChange={e => updateDay(day, 'closed', e.target.checked)}
                className="rounded border-gray-600 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
              />
              Inhábil
            </label>

            {!d.closed && (
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-gray-500">De</span>
                <input
                  type="time"
                  value={d.start}
                  onChange={e => updateDay(day, 'start', e.target.value)}
                  className={inputClass}
                  style={{ width: '110px' }}
                />
                <span className="text-xs text-gray-500">A</span>
                <input
                  type="time"
                  value={d.end}
                  onChange={e => updateDay(day, 'end', e.target.value)}
                  className={inputClass}
                  style={{ width: '110px' }}
                />
              </div>
            )}

            {d.closed && (
              <span className="ml-auto text-xs text-gray-600 italic">Cerrado</span>
            )}
          </div>
        )
      })}

      <div className="pt-4 border-t border-gray-700">
        <button type="submit" disabled={saving} className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Horarios'}
        </button>
      </div>
    </form>
  )
}
