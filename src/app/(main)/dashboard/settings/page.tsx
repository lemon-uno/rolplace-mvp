import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/features/auth/components/SettingsForm'
import { CalculatorSettingsForm } from '@/features/auth/components/CalculatorSettingsForm'
import Link from 'next/link'
import { SettingsTabs } from './SettingsTabs'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-xl font-bold text-white">Rolplace</Link>
              <Link href="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white">Dashboard</Link>
              <Link href="/dashboard/cars" className="text-sm font-medium text-gray-300 hover:text-white">Mis Autos</Link>
              <Link href="/dashboard/settings" className="text-sm font-medium text-cyan-400">Configuración</Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Configuración</h1>
          <p className="mt-2 text-gray-400">Administra tu cuenta y preferencias</p>
        </div>

        <SettingsTabs
          profileTab={
            <SettingsForm
              profile={profile || { full_name: null, email: '', phone: null, whatsapp: null }}
              userEmail={user.email || ''}
            />
          }
          calculatorTab={
            <CalculatorSettingsForm
              settings={{
                tasa_interes_anual: profile?.tasa_interes_anual ?? null,
                plazo_credito_meses: profile?.plazo_credito_meses ?? null,
                enganche_porcentaje: profile?.enganche_porcentaje ?? null,
              }}
            />
          }
        />
      </main>
    </div>
  )
}
