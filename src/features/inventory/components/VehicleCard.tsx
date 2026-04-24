'use client';

import Link from 'next/link';
import { Vehicle } from '../types/vehicle.types';

interface VehicleCardProps {
  vehicle: Vehicle;
  index?: number;
}

const fuelLabels: Record<string, string> = {
  gasoline: 'Gasolina',
  diesel: 'Diésel',
  electric: 'Eléctrico',
  hybrid: 'Híbrido',
};

const transmissionLabels: Record<string, string> = {
  automatic: 'Automático',
  manual: 'Manual',
  cvt: 'CVT',
};

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const formatKm = (km: number) =>
    new Intl.NumberFormat('es-MX').format(km) + ' km';

  const estimatedMonthly = Math.round(vehicle.price / 48);

  return (
    <Link href={`/inventory/${vehicle.slug}`} className="block group">
      <div className="bg-white rounded overflow-hidden border border-gray-200 hover:shadow-md transition-shadow duration-200">
        {/* Image */}
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
            <span className="absolute top-2 left-2 bg-[#3498DB] text-white text-[10px] font-semibold px-2 py-0.5 rounded">
              Destacado
            </span>
          )}
        </div>

        {/* Body */}
        <div className="p-3">
          {/* Title: Make bold + model + version */}
          <h3 className="text-sm font-semibold text-[#13141A] leading-tight mb-1 line-clamp-2">
            <span className="font-bold">{vehicle.make}</span>{' '}
            {vehicle.model}
            {vehicle.version && vehicle.version !== vehicle.model ? ` ${vehicle.version}` : ''}
          </h3>

          {/* Specs row */}
          <p className="text-[11px] text-[#777] mb-2">
            {vehicle.year} &middot; {formatKm(vehicle.mileage)}
            {vehicle.motor ? ` · ${vehicle.motor}` : ''} &middot; {transmissionLabels[vehicle.transmission] || vehicle.transmission}
          </p>

          {/* Price */}
          <p className="text-lg font-bold text-[#13141A] leading-tight">
            {formatPrice(vehicle.price)}
          </p>

          {/* Badges + monthly */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex gap-1.5">
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-[#555] border border-gray-200">
                {transmissionLabels[vehicle.transmission]}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-[#555] border border-gray-200">
                {fuelLabels[vehicle.fuelType] || vehicle.fuelType}
              </span>
            </div>
          </div>

          {/* Monthly estimate */}
          <p className="text-[11px] text-[#3498DB] font-medium mt-1.5">
            Desde {formatPrice(estimatedMonthly)}/mes
          </p>
        </div>
      </div>
    </Link>
  );
}
