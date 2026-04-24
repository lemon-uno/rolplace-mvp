'use client';

import { useState, useEffect, useMemo } from 'react';
import { VehicleFilters as VehicleFiltersType } from '../types/vehicle.types';
import { InventoryService } from '../services/inventoryService';
import { VehicleCard } from './VehicleCard';
import { VehicleFilters } from './VehicleFilters';
import { ChevronDown, X } from 'lucide-react';

type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'year_asc' | 'year_desc' | 'km_asc';

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Más recientes' },
  { value: 'price_asc', label: 'Precio: menor a mayor' },
  { value: 'price_desc', label: 'Precio: mayor a menor' },
  { value: 'year_desc', label: 'Año: más nuevo' },
  { value: 'year_asc', label: 'Año: más antiguo' },
  { value: 'km_asc', label: 'Km: menor' },
];

export function InventoryList() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [makes, setMakes] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VehicleFiltersType>({});
  const [sort, setSort] = useState<SortOption>('newest');
  const [showSort, setShowSort] = useState(false);

  useEffect(() => {
    loadMakes();
    loadVehicles();
  }, [filters, page]);

  useEffect(() => {
    if (filters.make && filters.make.length > 0) {
      InventoryService.getModelsByMake(filters.make).then(setModels);
    } else {
      setModels([]);
    }
  }, [filters.make]);

  const loadMakes = async () => {
    const makesData = await InventoryService.getMakes();
    setMakes(makesData);
  };

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await InventoryService.getVehicles(filters, page, 12);
      let sorted = [...response.vehicles];
      sorted = applySorting(sorted, sort);
      setVehicles(sorted);
      setTotal(response.total);
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (vehicles: any[], sort: SortOption) => {
    const copy = [...vehicles];
    switch (sort) {
      case 'price_asc': return copy.sort((a, b) => a.price - b.price);
      case 'price_desc': return copy.sort((a, b) => b.price - a.price);
      case 'year_desc': return copy.sort((a, b) => b.year - a.year);
      case 'year_asc': return copy.sort((a, b) => a.year - b.year);
      case 'km_asc': return copy.sort((a, b) => a.mileage - b.mileage);
      default: return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  };

  const handleFiltersChange = (newFilters: VehicleFiltersType) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSortChange = (value: SortOption) => {
    setSort(value);
    setShowSort(false);
    if (vehicles.length > 0) {
      setVehicles(applySorting([...vehicles], value));
    }
  };

  const activeFilterCount = Object.values(filters).filter(v =>
    Array.isArray(v) ? v.length > 0 : v !== undefined
  ).length;

  const makeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.make] = (counts[v.make] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const modelCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      if (v.model) counts[v.model] = (counts[v.model] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const transmissionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.transmission] = (counts[v.transmission] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const fuelTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.fuelType] = (counts[v.fuelType] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  const vehicleTypeCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    vehicles.forEach(v => {
      counts[v.vehicleType] = (counts[v.vehicleType] || 0) + 1;
    });
    return counts;
  }, [vehicles]);

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Sticky top bar with sort + active chips */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-sm text-[#777] hidden sm:inline">
                <span className="font-semibold text-[#333]">{total}</span> vehículos disponibles
              </span>
            </div>

            {/* Sort */}
            <div className="relative">
              <button
                onClick={() => setShowSort(!showSort)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#555] hover:text-[#333] transition-colors"
              >
                <span className="hidden sm:inline">Ordenar por:</span>
                <span className="font-medium text-[#333]">{SORT_OPTIONS.find(o => o.value === sort)?.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSort ? 'rotate-180' : ''}`} />
              </button>
              {showSort && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSort(false)} />
                  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 w-56">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => handleSortChange(opt.value)}
                        className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                          sort === opt.value ? 'text-[#3498DB] bg-[#3498DB]/5 font-medium' : 'text-[#333] hover:bg-gray-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Active filter chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 mt-2">
              {filters.make && filters.make.length > 0 && (
                <Chip label={`Marca: ${filters.make.join(', ')}`} onRemove={() => handleFiltersChange({ ...filters, make: undefined, model: undefined })} />
              )}
              {filters.model && filters.model.length > 0 && (
                <Chip label={`Modelo: ${filters.model.join(', ')}`} onRemove={() => handleFiltersChange({ ...filters, model: undefined })} />
              )}
              {filters.transmission && filters.transmission.length > 0 && (
                <Chip label={`Transmisión: ${filters.transmission.join(', ')}`} onRemove={() => handleFiltersChange({ ...filters, transmission: undefined })} />
              )}
              {filters.fuelType && filters.fuelType.length > 0 && (
                <Chip label={`Combustible: ${filters.fuelType.join(', ')}`} onRemove={() => handleFiltersChange({ ...filters, fuelType: undefined })} />
              )}
              {filters.vehicleType && filters.vehicleType.length > 0 && (
                <Chip label={`Tipo: ${filters.vehicleType.join(', ')}`} onRemove={() => handleFiltersChange({ ...filters, vehicleType: undefined })} />
              )}
              {(filters.price || filters.year || filters.mileage) && (
                <Chip label="Rangos" onRemove={() => handleFiltersChange({ ...filters, price: undefined, year: undefined, mileage: undefined })} />
              )}
              <button
                onClick={() => handleFiltersChange({})}
                className="text-xs text-[#3498DB] font-medium hover:underline ml-1"
              >
                Borrar todo
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal filter bar — above the grid */}
      <VehicleFilters
        makes={makes}
        makeCounts={makeCounts}
        models={models}
        modelCounts={modelCounts}
        transmissionCounts={transmissionCounts}
        fuelTypeCounts={fuelTypeCounts}
        vehicleTypeCounts={vehicleTypeCounts}
        onFiltersChange={handleFiltersChange}
        filters={filters}
        total={total}
      />

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Mobile count */}
        <p className="text-sm text-[#777] mb-4 sm:hidden">
          <span className="font-semibold text-[#333]">{total}</span> vehículos disponibles
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded overflow-hidden border border-gray-200 animate-pulse">
                <div className="aspect-[16/10] bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-5 bg-gray-200 rounded w-2/3" />
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded border border-gray-200">
            <div className="text-5xl mb-4">🚗</div>
            <h3 className="text-lg font-semibold text-[#333] mb-2">No se encontraron vehículos</h3>
            <p className="text-sm text-[#777] mb-4">Intenta con otros filtros de búsqueda</p>
            <button
              onClick={() => handleFiltersChange({})}
              className="px-6 py-2 bg-[#3498DB] text-white text-sm font-semibold rounded hover:bg-[#2980B9] transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>

            {/* Pagination */}
            {total > 12 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 bg-white border border-gray-200 rounded text-sm text-[#333] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Anterior
                </button>
                <span className="px-4 py-2 text-sm text-[#777]">
                  {page} / {Math.ceil(total / 12)}
                </span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= Math.ceil(total / 12)}
                  className="px-4 py-2 bg-white border border-gray-200 rounded text-sm text-[#333] hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Siguiente
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-[#3498DB]/10 text-[#3498DB] text-xs font-medium rounded-full">
      {label}
      <button onClick={onRemove} className="hover:bg-[#3498DB]/20 rounded-full p-0.5">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
