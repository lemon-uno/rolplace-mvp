'use client';

import { useState } from 'react';
import { VehicleFilters as VehicleFiltersType, VehicleTransmission, VehicleFuelType, VehicleCondition } from '../types/vehicle.types';

interface VehicleFiltersProps {
  makes: string[];
  onFiltersChange: (filters: VehicleFiltersType) => void;
  loading?: boolean;
}

export function VehicleFilters({ makes, onFiltersChange, loading = false }: VehicleFiltersProps) {
  const [filters, setFilters] = useState<VehicleFiltersType>({});

  const handleFilterChange = (key: keyof VehicleFiltersType, value: any) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handlePriceChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    const newPriceRange = {
      ...filters.price,
      [field]: numValue
    };
    handleFilterChange('price', newPriceRange);
  };

  const handleYearChange = (field: 'min' | 'max', value: string) => {
    const numValue = value ? parseInt(value) : undefined;
    const newYearRange = {
      ...filters.year,
      [field]: numValue
    };
    handleFilterChange('year', newYearRange);
  };

  const clearFilters = () => {
    const emptyFilters: VehicleFiltersType = {};
    setFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Limpiar
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Búsqueda */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            🔍 Buscar
          </label>
          <input
            type="text"
            placeholder="Marca, modelo, características..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Marca
          </label>
          <select
            value={filters.make || ''}
            onChange={(e) => handleFilterChange('make', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas las marcas</option>
            {makes.map(make => (
              <option key={make} value={make}>
                {make}
              </option>
            ))}
          </select>
        </div>

        {/* Modelo (solo si hay marca seleccionada) */}
        {filters.make && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Modelo
            </label>
            <input
              type="text"
              placeholder="Ej: Corolla, Civic..."
              value={filters.model || ''}
              onChange={(e) => handleFilterChange('model', e.target.value || undefined)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Año */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Año
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              min={2010}
              max={2024}
              value={filters.year?.min || ''}
              onChange={(e) => handleYearChange('min', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Máx"
              min={2010}
              max={2024}
              value={filters.year?.max || ''}
              onChange={(e) => handleYearChange('max', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio (MXN)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Mín"
              step={10000}
              min={0}
              value={filters.price?.min || ''}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Máx"
              step={10000}
              min={0}
              value={filters.price?.max || ''}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Transmisión */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Transmisión
          </label>
          <select
            value={filters.transmission || ''}
            onChange={(e) => handleFilterChange('transmission', e.target.value as VehicleTransmission || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="automatic">Automática</option>
            <option value="manual">Manual</option>
            <option value="tiptronic">Tiptronic</option>
          </select>
        </div>

        {/* Tipo de combustible */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Combustible
          </label>
          <select
            value={filters.fuelType || ''}
            onChange={(e) => handleFilterChange('fuelType', e.target.value as VehicleFuelType || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Condición
          </label>
          <select
            value={filters.condition || ''}
            onChange={(e) => handleFilterChange('condition', e.target.value as VehicleCondition || undefined)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas</option>
            <option value="new">Nuevo</option>
            <option value="semi-new">Seminuevo</option>
            <option value="used">Usado</option>
          </select>
        </div>
      </div>
    </div>
  );
}
