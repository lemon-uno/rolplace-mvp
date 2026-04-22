'use client';

import Link from 'next/link';
import { Vehicle } from '../types/vehicle.types';
import { Gauge } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

export function VehicleCard({ vehicle, index = 0 }: VehicleCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('es-MX').format(mileage) + ' km';

  const transmissionLabel: Record<string, string> = {
    automatic: 'Automático',
    manual: 'Manual',
    cvt: 'CVT',
  };

  return (
    <Link href={`/inventory/${vehicle.slug}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-[#69eac9]">
        {/* Imagen */}
        <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
          {vehicle.featuredImage || (vehicle.images && vehicle.images.length > 0) ? (
            <img
              src={vehicle.featuredImage || vehicle.images[0]}
              alt={vehicle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}
          {vehicle.featured && (
            <span className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-semibold px-2.5 py-1 rounded">
              Destacado
            </span>
          )}
        </div>

        {/* Info */}
        <div className="px-4 pt-3 pb-4">
          {/* Título / Descripción del auto */}
          <h3 className="text-[15px] font-semibold leading-snug mb-2 line-clamp-2" style={{ color: '#13141A' }}>
            {vehicle.title}
          </h3>

          {/* Precio + Kilometraje + Transmisión */}
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-xl font-bold" style={{ color: '#13141A' }}>
              {formatPrice(vehicle.price)}
            </span>
            <div className="flex items-center gap-3 text-xs shrink-0" style={{ color: '#5E5E5E' }}>
              <span className="flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5" style={{ color: '#5E5E5E' }} />
                {formatMileage(vehicle.mileage)}
              </span>
              <span className="flex items-center gap-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#5E5E5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 6v12M12 6v12M19 6v12M5 12h14M5 6h7M12 6h7M5 18h7M12 18h7" />
                </svg>
                {transmissionLabel[vehicle.transmission]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
