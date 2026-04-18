'use client';

import Link from 'next/link';
import { Vehicle } from '../types/vehicle.types';
import { motion } from 'framer-motion';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('es-MX').format(mileage) + ' km';
  };

  const transmissionLabels = {
    'automatic': 'Automático',
    'manual': 'Manual',
    'tiptronic': 'Tiptronic'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group"
    >
      <Link href={`/inventory/${vehicle.slug}`} className="block h-full">
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full border border-gray-200 hover:border-blue-500">
          {/* Imagen */}
          <div className="relative h-48 overflow-hidden bg-gray-100">
            {vehicle.featuredImage || (vehicle.images && vehicle.images.length > 0) ? (
              <img
                src={vehicle.featuredImage || vehicle.images[0]}
                alt={vehicle.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Sin imagen
              </div>
            )}

            {/* Etiquetas */}
            <div className="absolute top-2 left-2 flex gap-2">
              {vehicle.featured && (
                <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                  Destacado
                </span>
              )}
              <span className={`text-xs font-semibold px-2 py-1 rounded ${
                vehicle.condition === 'new'
                  ? 'bg-green-500 text-white'
                  : vehicle.condition === 'semi-new'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-500 text-white'
              }`}>
                {vehicle.condition === 'new' ? 'Nuevo' : vehicle.condition === 'semi-new' ? 'Seminuevo' : 'Usado'}
              </span>
            </div>

            {/* Vistas */}
            {vehicle.views !== undefined && vehicle.views > 0 && (
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                👁 {vehicle.views}
              </div>
            )}
          </div>

          {/* Información */}
          <div className="p-4">
            {/* Título */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
              {vehicle.title}
            </h3>

            {/* Especificaciones clave */}
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                📅 {vehicle.year}
              </span>
              <span className="flex items-center gap-1">
                🚗 {formatMileage(vehicle.mileage)}
              </span>
              <span className="flex items-center gap-1">
                ⚙️ {transmissionLabels[vehicle.transmission]}
              </span>
            </div>

            {/* Precio */}
            <div className="mb-3">
              <span className="text-2xl font-bold text-blue-600">
                {formatPrice(vehicle.price)}
              </span>
            </div>

            {/* Ubicación */}
            {vehicle.location && (
              <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                📍 {vehicle.location}
              </div>
            )}

            {/* Features destacadas */}
            {vehicle.features.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {vehicle.features.slice(0, 3).map((feature, i) => (
                  <span
                    key={i}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                  >
                    {feature}
                  </span>
                ))}
                {vehicle.features.length > 3 && (
                  <span className="text-xs text-gray-500">
                    +{vehicle.features.length - 3} más
                  </span>
                )}
              </div>
            )}

            {/* Botón */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-sm font-semibold text-blue-600 group-hover:text-blue-700">
                Ver detalles →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
