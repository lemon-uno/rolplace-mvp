'use client'

import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const { user, loading } = useAuth()

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-800 bg-gray-950/95 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">Rolplace</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link
                href="/inventory"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Inventario
              </Link>
              <Link
                href="#features"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Servicios
              </Link>
              <Link
                href="#about"
                className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
              >
                Nosotros
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {loading ? (
              <div className="h-9 w-20 animate-pulse rounded-md bg-gray-800" />
            ) : user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600 hover:shadow-cyan-500/30"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600 hover:shadow-cyan-500/30"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
