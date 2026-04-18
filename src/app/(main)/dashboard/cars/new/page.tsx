import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createCar } from '@/actions/cars'
import Link from 'next/link'

export default async function NewCarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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
          <h1 className="text-3xl font-bold text-white">Agregar Nuevo Auto</h1>
          <p className="mt-2 text-gray-400">
            Completa el formulario para agregar un auto a tu inventario
          </p>
        </div>

        <div className="rounded-lg border border-gray-800 bg-gray-900/50 backdrop-blur p-8">
          <form action={createCar} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-300">
                  Título del Auto *
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  placeholder="Ej: Toyota Corolla LE 2021"
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="price" className="block text-sm font-medium text-gray-300">
                  Precio (MXN) *
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="285000"
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="make" className="block text-sm font-medium text-gray-300">
                  Marca
                </label>
                <input
                  id="make"
                  name="make"
                  type="text"
                  placeholder="Ej: Toyota"
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="model" className="block text-sm font-medium text-gray-300">
                  Modelo
                </label>
                <input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="Ej: Corolla"
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="year" className="block text-sm font-medium text-gray-300">
                  Año *
                </label>
                <input
                  id="year"
                  name="year"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  placeholder="2021"
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="mileage" className="block text-sm font-medium text-gray-300">
                  Kilometraje
                </label>
                <input
                  id="mileage"
                  name="mileage"
                  type="text"
                  placeholder="Ej: 35,000 km"
                  className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="image_url" className="block text-sm font-medium text-gray-300">
                URL de la Imagen
              </label>
              <input
                id="image_url"
                name="image_url"
                type="url"
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Describe las características del auto..."
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                value="true"
                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500"
              />
              <label htmlFor="featured" className="text-sm font-medium text-gray-300">
                Destacar este auto en la página principal
              </label>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/dashboard/cars"
                className="rounded-md border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700"
              >
                Cancelar
              </Link>
              <button
                type="submit"
                className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600"
              >
                Agregar Auto
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
