'use client';

import { useState } from 'react';
import { VehicleFilters as VehicleFiltersType, VehicleTransmission, VehicleFuelType, VehicleCondition, VehicleType } from '../types/vehicle.types';
import { RangeSlider } from './RangeSlider';

interface VehicleFiltersProps {
  makes: string[];
  onFiltersChange: (filters: VehicleFiltersType) => void;
  loading?: boolean;
}

const YEAR_MIN = 2000;
const YEAR_MAX = 2026;
const PRICE_MIN = 0;
const PRICE_MAX = 3000000;
const PRICE_STEP = 50000;
const MILEAGE_MIN = 0;
const MILEAGE_MAX = 300000;
const MILEAGE_STEP = 5000;

const fmtPrice = (v: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(v);

const fmtMileage = (v: number) =>
  `${(v / 1000).toFixed(0)}k km`;

export function VehicleFilters({ makes, onFiltersChange, loading = false }: VehicleFiltersProps) {
  const [filters, setFilters] = useState<VehicleFiltersType>({});

  const update = (patch: Partial<VehicleFiltersType>) => {
    const next = { ...filters, ...patch };
    setFilters(next);
    onFiltersChange(next);
  };

  const clearFilters = () => {
    setFilters({});
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const selectClass = 'w-full px-3 py-2 border border-gray-500 rounded-md bg-[#2a3a4a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500';
  const inputClass = 'w-full px-3 py-2 border border-gray-500 rounded-md bg-[#2a3a4a] text-white focus:outline-none focus:ring-2 focus:ring-cyan-500';

  return (
    <div className="rounded-lg shadow-md p-6 sticky top-4" style={{ backgroundColor: '#35475a' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-white">Filtros</h2>
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Buscar</label>
          <input
            type="text"
            placeholder="Marca, modelo, características..."
            value={filters.search || ''}
            onChange={(e) => update({ search: e.target.value || undefined })}
            className={inputClass}
          />
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Marca</label>
          <select
            value={filters.make || ''}
            onChange={(e) => update({ make: e.target.value || undefined })}
            className={selectClass}
          >
            <option value="">Todas las marcas</option>
            {makes.map(make => <option key={make} value={make}>{make}</option>)}
          </select>
        </div>

        {/* Modelo */}
        {filters.make && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">Modelo</label>
            <input
              type="text"
              placeholder="Ej: Corolla, Civic..."
              value={filters.model || ''}
              onChange={(e) => update({ model: e.target.value || undefined })}
              className={inputClass}
            />
          </div>
        )}

        {/* Año */}
        <RangeSlider
          label="Año"
          min={YEAR_MIN}
          max={YEAR_MAX}
          step={1}
          value={{
            min: filters.year?.min ?? YEAR_MIN,
            max: filters.year?.max ?? YEAR_MAX,
          }}
          onChange={(v) => update({
            year: (v.min === YEAR_MIN && v.max === YEAR_MAX) ? undefined : v,
          })}
          formatLabel={(v) => String(v)}
        />

        {/* Precio */}
        <RangeSlider
          label="Precio (MXN)"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={PRICE_STEP}
          value={{
            min: filters.price?.min ?? PRICE_MIN,
            max: filters.price?.max ?? PRICE_MAX,
          }}
          onChange={(v) => update({
            price: (v.min === PRICE_MIN && v.max === PRICE_MAX) ? undefined : v,
          })}
          formatLabel={fmtPrice}
        />

        {/* Kilometraje */}
        <RangeSlider
          label="Kilometraje"
          min={MILEAGE_MIN}
          max={MILEAGE_MAX}
          step={MILEAGE_STEP}
          value={{
            min: filters.mileage?.min ?? MILEAGE_MIN,
            max: filters.mileage?.max ?? MILEAGE_MAX,
          }}
          onChange={(v) => update({
            mileage: (v.min === MILEAGE_MIN && v.max === MILEAGE_MAX) ? undefined : v,
          })}
          formatLabel={fmtMileage}
        />

        {/* Transmisión */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Transmisión</label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => update({ transmission: (e.target.value as VehicleTransmission) || undefined })}
            className={selectClass}
          >
            <option value="">Todas</option>
            <option value="automatic">Automática</option>
            <option value="manual">Manual</option>
            <option value="cvt">CVT</option>
          </select>
        </div>

        {/* Combustible */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Combustible</label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => update({ fuelType: (e.target.value as VehicleFuelType) || undefined })}
            className={selectClass}
          >
            <option value="">Todos</option>
            <option value="gasoline">Gasolina</option>
            <option value="diesel">Diésel</option>
            <option value="electric">Eléctrico</option>
            <option value="hybrid">Híbrido</option>
          </select>
        </div>

        {/* Condición */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Condición</label>
          <select
            value={filters.condition || ''}
            onChange={(e) => update({ condition: (e.target.value as VehicleCondition) || undefined })}
            className={selectClass}
          >
            <option value="">Todas</option>
            <option value="new">Nuevo</option>
            <option value="semi-new">Seminuevo</option>
            <option value="certified">Certificado</option>
          </select>
        </div>

        {/* Tipo de vehículo */}
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de vehículo</label>
          <select
            value={filters.vehicleType || ''}
            onChange={(e) => update({ vehicleType: (e.target.value as VehicleType) || undefined })}
            className={selectClass}
          >
            <option value="">Todos</option>
            <option value="sedan">Sedán</option>
            <option value="suv">SUV</option>
            <option value="compacto">Compacto</option>
            <option value="convertible">Convertible</option>
            <option value="hatchback">Hatchback</option>
            <option value="minivan">Minivan</option>
            <option value="pickup">Pickup</option>
            <option value="station_wagon">Station Wagon</option>
            <option value="van">Van</option>
            <option value="deportivo">Deportivo</option>
            <option value="todo_terreno">Todo Terreno</option>
          </select>
        </div>
      </div>
    </div>
  );
}
