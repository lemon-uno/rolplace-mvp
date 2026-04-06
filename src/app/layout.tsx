import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rolplace - Tu destino de confianza para autos seminuevos',
  description: 'Encuentra el auto seminuevo perfecto en Rolplace. Amplio inventario de vehículos verificados con los mejores precios del mercado.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
