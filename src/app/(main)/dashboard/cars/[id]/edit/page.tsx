import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCarById } from '@/actions/cars'
import { EditCarForm } from '@/features/cars/components/EditCarForm'
import Link from 'next/link'

export default async function EditCarPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const car = await getCarById(id)

  if (!car || car.user_id !== user.id) {
    redirect('/dashboard/cars')
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <nav className="border-b border-gray-800 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center gap-6">
              <Link href="/dashboard" className="text-xl font-bold text-white">
                Rolplace
              </Link>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/cars"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Mis Autos
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Editar Auto</h1>
          <p className="mt-2 text-gray-400">
            Modifica la información de tu vehículo
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur p-8">
          <EditCarForm car={car} />
        </div>
      </main>
    </div>
  )
}
