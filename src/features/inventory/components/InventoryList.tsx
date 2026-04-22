'use client';

import { useState, useEffect } from 'react';
import { VehicleFilters as VehicleFiltersType } from '../types/vehicle.types';
import { InventoryService } from '../services/inventoryService';
import { VehicleCard } from './VehicleCard';
import { VehicleFilters } from './VehicleFilters';
import { SlidersHorizontal, X } from 'lucide-react';

interface InventoryListProps {
  initialFilters?: VehicleFiltersType;
}

export function InventoryList({ initialFilters = {} }: InventoryListProps) {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VehicleFiltersType>(initialFilters);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadMakes();
    loadVehicles();
  }, [filters]);

  const loadMakes = async () => {
    const makesData = await InventoryService.getMakes();
    setMakes(makesData);
  };

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await InventoryService.getVehicles(filters, page, 12);
      setVehicles(response.vehicles);
      setTotal(response.total);
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Inventario de Autos
        </h1>
        <p className="text-gray-600">
          Encuentra el auto perfecto para ti
          {!loading && total > 0 && (
            <span className="ml-2 font-semibold text-blue-600">
              ({total} vehículos disponibles)
            </span>
          )}
        </p>
      </div>

      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden w-full flex items-center justify-center gap-2 py-3 mb-4 bg-white border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {showFilters ? 'Ocultar filtros' : 'Mostrar filtros'}
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar de filtros */}
        <aside className={`w-full lg:w-1/4 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="lg:hidden flex justify-end mb-2">
            <button onClick={() => setShowFilters(false)} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>
          <VehicleFilters
            makes={makes}
            onFiltersChange={handleFiltersChange}
            loading={loading}
          />
        </aside>

        {/* Grid de vehículos */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md p-4 animate-pulse"
                >
                  <div className="h-48 bg-gray-200 rounded mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2 w-2/3"></div>
                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🚗</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron vehículos
              </h3>
              <p className="text-gray-600 mb-4">
                Intenta con otros filtros de búsqueda
              </p>
              <button
                onClick={() => handleFiltersChange({})}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {vehicles.map((vehicle, index) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    index={index}
                  />
                ))}
              </div>

              {/* Paginación */}
              {total > 12 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <span className="px-4 py-2 bg-white border border-gray-300 rounded-md">
                    Página {Math.ceil(total / 12) > 0 ? page : 0} de {Math.ceil(total / 12)}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={page >= Math.ceil(total / 12)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
