'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { getContactPhone } from '@/actions/auth';

export default function HomePage() {
  const [contactPhone, setContactPhone] = useState<string | null>(null);

  useEffect(() => {
    getContactPhone().then(setContactPhone);
  }, []);
  const featuredVehicles = [
    {
      id: '1',
      title: 'Toyota Corolla LE 2021',
      price: '$285,000',
      image: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
      year: 2021,
      mileage: '35,000 km'
    },
    {
      id: '2',
      title: 'Honda Civic Touring 2022',
      price: '$345,000',
      image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      year: 2022,
      mileage: '28,000 km'
    },
    {
      id: '4',
      title: 'Nissan Versa Advance 2023',
      price: '$268,000',
      image: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
      year: 2023,
      mileage: '15,000 km'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 py-24 md:py-32 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Encuentra tu Auto Perfecto
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-cyan-100">
              Tu destino de confianza para autos seminuevos de calidad
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inventory"
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20"
              >
                Ver Inventario
              </Link>
              {contactPhone ? (
                <a
                  href={`tel:${contactPhone}`}
                  className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-white font-bold rounded-lg hover:bg-cyan-400 hover:text-black transition-colors text-center"
                >
                  Contáctanos
                </a>
              ) : (
                <button className="px-8 py-4 bg-transparent border-2 border-cyan-400 text-white font-bold rounded-lg hover:bg-cyan-400 hover:text-black transition-colors opacity-50 cursor-not-allowed">
                  Contáctanos
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* Decorative waves */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-16 md:h-24 fill-[#0a0a0a]">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { number: '500+', label: 'Autos Disponibles' },
              { number: '20+', label: 'Marcas' },
              { number: '1000+', label: 'Clientes Satisfechos' },
              { number: '5 años', label: 'De Experiencia' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Destacados Recientes
            </h2>
            <p className="text-gray-600 text-lg">
              Los mejores autos seminuevos seleccionados para ti
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {featuredVehicles.map((vehicle, index) => (
              <motion.div
                key={vehicle.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all"
              >
                <div className="relative">
                  <img
                    src={vehicle.image}
                    alt={vehicle.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Destacado
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {vehicle.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>{vehicle.year}</span>
                    <span>•</span>
                    <span>{vehicle.mileage}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                      {vehicle.price}
                    </span>
                    <Link
                      href={`/inventory/${vehicle.id}`}
                      className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all text-sm font-semibold"
                    >
                      Ver detalles
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/inventory"
              className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all"
            >
              Ver Todo el Inventario
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir Rolplace?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: '🔍',
                title: 'Inspección Rigurosa',
                description: 'Cada vehículo pasa por una inspección completa de 150 puntos'
              },
              {
                icon: '💰',
                title: 'Mejores Precios',
                description: 'Precios competitivos y opciones de financiamiento flexibles'
              },
              {
                icon: '🤝',
                title: 'Confianza Garantizada',
                description: 'Historial completo y garantía extendida en todos nuestros autos'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-gray-900/50 backdrop-blur border border-gray-800 p-8 rounded-lg text-center hover:border-cyan-500/50 transition-all"
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para encontrar tu próximo auto?
            </h2>
            <p className="text-xl mb-8 text-cyan-100">
              Explora nuestro inventario o contáctanos para ayuda personalizada
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/inventory"
                className="px-8 py-4 bg-white text-blue-600 font-bold rounded-lg hover:bg-gray-100 transition-colors"
              >
                Ver Inventario
              </Link>
              <a
                href="https://wa.me/5215512345678"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-colors"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
