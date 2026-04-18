import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserCars } from '@/actions/cars'
import { signout } from '@/actions/auth'
import Link from 'next/link'

export default async function DashboardCarsPage() {
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

  const cars = await getUserCars()

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
                className="text-sm font-medium text-cyan-400"
              >
                Mis Autos
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">
                {profile?.full_name || user.email}
              </span>
              <form action={signout}>
                <button
                  type="submit"
                  className="rounded-md border border-gray-700 bg-gray-900 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Mis Autos</h1>
            <p className="mt-2 text-gray-400">
              Gestiona tu inventario de autos
            </p>
          </div>
          <Link
            href="/dashboard/cars/new"
            className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600"
          >
            Agregar Auto
          </Link>
        </div>

        {cars.length === 0 ? (
          <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
            <p className="text-lg text-gray-400">
              No tienes autos en tu inventario aún
            </p>
            <Link
              href="/dashboard/cars/new"
              className="mt-4 inline-block text-cyan-400 hover:text-cyan-300"
            >
              Agrega tu primer auto →
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <div
                key={car.id}
                className="overflow-hidden rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur"
              >
                {car.image_url && (
                  <img
                    src={car.image_url}
                    alt={car.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white">
                    {car.title}
                  </h3>
                  <p className="mt-1 text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    ${car.price.toLocaleString()}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-400">
                    <span>{car.year}</span>
                    {car.mileage && (
                      <>
                        <span>•</span>
                        <span>{car.mileage}</span>
                      </>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="rounded-full bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                      {car.status === 'available' ? 'Disponible' : car.status}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/dashboard/cars/${car.id}/edit`}
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        Editar
                      </Link>
                      <span className="text-gray-600">•</span>
                      <button className="text-sm text-red-400 hover:text-red-300">
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
