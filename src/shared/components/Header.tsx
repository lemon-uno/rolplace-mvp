'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function Header() {
  const [showNosotrosDropdown, setShowNosotrosDropdown] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold">
                <span className="text-blue-600">ROL</span>
                <span className="text-red-600">PLACE</span>
              </span>
            </div>
          </Link>

          {/* Navegación central */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-red-600 font-semibold hover:text-red-700 transition-colors border-b-2 border-red-600 pb-1"
            >
              INICIO
            </Link>
            <Link
              href="/inventory"
              className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
            >
              INVENTARIO
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setShowNosotrosDropdown(true)}
              onMouseLeave={() => setShowNosotrosDropdown(false)}
            >
              <button className="text-gray-700 font-semibold hover:text-blue-600 transition-colors flex items-center gap-1">
                NOSOTROS
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {showNosotrosDropdown && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border">
                  <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                    Quiénes Somos
                  </Link>
                  <Link href="/privacy" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                    Aviso de Privacidad
                  </Link>
                  <Link href="/terms" className="block px-4 py-2 text-gray-700 hover:bg-gray-100 hover:text-blue-600">
                    Términos y Condiciones
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Botones de acción */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/compare')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="font-semibold">COMPARA</span>
            </button>

            <button
              onClick={() => router.push('/profile')}
              className="hidden sm:flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="font-semibold">PERFIL</span>
            </button>

            <button className="px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
              Add your item
            </button>

            {/* Menú móvil */}
            <button className="md:hidden p-2 text-gray-700">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
