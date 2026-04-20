'use client'

import { useState } from 'react'
import { updateProfile } from '@/actions/auth'

interface ProfileData {
  full_name: string | null
  email: string
  phone: string | null
  whatsapp: string | null
}

export function SettingsForm({ profile, userEmail }: { profile: ProfileData; userEmail: string }) {
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
      setMsg({ type: 'success', text: 'Cambios guardados correctamente' })
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

      <div className="space-y-2">
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-300">Nombre del negocio</label>
        <input id="full_name" name="full_name" type="text" defaultValue={profile.full_name || ''} placeholder="Ej: Rolplace Autos" className={inputClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300">Correo electrónico</label>
        <input id="email" name="email" type="email" defaultValue={userEmail} readOnly className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-gray-400 cursor-not-allowed" />
        <p className="text-xs text-gray-500">El correo se gestiona desde tu cuenta</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-300">Teléfono</label>
        <input id="phone" name="phone" type="tel" defaultValue={profile.phone || ''} placeholder="Ej: 8112345678" className={inputClass} />
      </div>

      <div className="space-y-2">
        <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-300">WhatsApp</label>
        <input id="whatsapp" name="whatsapp" type="tel" defaultValue={profile.whatsapp || ''} placeholder="Ej: 528112345678 (con código de país)" className={inputClass} />
        <p className="text-xs text-gray-500">Número con código de país, sin espacios ni signos. Se usará para el botón de WhatsApp en las publicaciones.</p>
      </div>

      <div className="pt-4 border-t border-gray-700">
        <button type="submit" disabled={saving} className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50">
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
