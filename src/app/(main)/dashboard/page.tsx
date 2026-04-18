import Link from 'next/link'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Panel de Administración
          </h1>
          <p className="text-gray-400">
            Gestiona tu inventario de vehículos
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Ver Inventario Card */}
          <Link href="/dashboard/cars" className="group">
            <div className="bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="text-white">
                <div className="text-4xl mb-4">🚗</div>
                <h3 className="text-xl font-bold mb-2">Mi Inventario</h3>
                <p className="text-cyan-100 text-sm">
                  Ver y gestionar todos tus vehículos
                </p>
              </div>
            </div>
          </Link>

          {/* Agregar Auto Card */}
          <Link href="/dashboard/cars/new" className="group">
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="text-white">
                <div className="text-4xl mb-4">➕</div>
                <h3 className="text-xl font-bold mb-2">Agregar Vehículo</h3>
                <p className="text-purple-100 text-sm">
                  Publica un nuevo auto en tu inventario
                </p>
              </div>
            </div>
          </Link>

          {/* Ver Sitio Card */}
          <Link href="/" className="group">
            <div className="bg-gradient-to-br from-gray-700 to-gray-600 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105">
              <div className="text-white">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="text-xl font-bold mb-2">Ver Sitio Público</h3>
                <p className="text-gray-300 text-sm">
                  Ver cómo se ve tu marketplace
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Welcome Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-4">
            🎉 ¡Bienvenido a Rolplace!
          </h2>
          <p className="text-gray-300 mb-6">
            Tu panel de administración está listo. Comienza agregando tu primer vehículo
            o gestiona tu inventario existente.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/dashboard/cars/new"
              className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all hover:scale-105"
            >
              Agregar Mi Primer Auto
            </Link>
            <Link
              href="/dashboard/cars"
              className="bg-white/10 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              Ver Inventario
            </Link>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-cyan-400 mb-2">0</div>
            <div className="text-gray-400 text-sm">Vehículos Activos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-green-400 mb-2">0</div>
            <div className="text-gray-400 text-sm">Vendidos</div>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
            <div className="text-3xl font-bold text-yellow-400 mb-2">0</div>
            <div className="text-gray-400 text-sm">Destacados</div>
          </div>
        </div>
      </div>
    </div>
  )
}
