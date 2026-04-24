'use client';

import { useState } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { VehicleFilters as VehicleFiltersType, VehicleTransmission, VehicleFuelType, VehicleType } from '../types/vehicle.types';
import { RangeSlider } from './RangeSlider';

interface VehicleFiltersProps {
  makes: string[];
  makeCounts: Record<string, number>;
  models: string[];
  modelCounts: Record<string, number>;
  onFiltersChange: (filters: VehicleFiltersType) => void;
  filters: VehicleFiltersType;
  total: number;
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

const TRANSMISSION_OPTIONS: { value: VehicleTransmission; label: string }[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatic', label: 'Automático' },
  { value: 'cvt', label: 'CVT' },
];

const FUEL_OPTIONS: { value: VehicleFuelType; label: string }[] = [
  { value: 'gasoline', label: 'Gasolina' },
  { value: 'diesel', label: 'Diésel' },
  { value: 'electric', label: 'Eléctrico' },
  { value: 'hybrid', label: 'Híbrido' },
];

const TYPE_OPTIONS: { value: VehicleType; label: string }[] = [
  { value: 'sedan', label: 'Sedán' },
  { value: 'suv', label: 'SUV' },
  { value: 'hatchback', label: 'Hatchback' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'compacto', label: 'Compacto' },
  { value: 'convertible', label: 'Convertible' },
  { value: 'minivan', label: 'Minivan' },
  { value: 'station_wagon', label: 'Station Wagon' },
  { value: 'van', label: 'Van' },
  { value: 'deportivo', label: 'Deportivo' },
  { value: 'todo_terreno', label: 'Todo Terreno' },
];

type FilterSection = 'marca' | 'modelo' | 'precio' | 'kilometraje' | 'anio' | 'transmision' | 'combustible' | 'tipo';

export function VehicleFilters({ makes, makeCounts, models, modelCounts, onFiltersChange, filters, total }: VehicleFiltersProps) {
  const [openSection, setOpenSection] = useState<FilterSection | null>(null);
  const [pendingFilters, setPendingFilters] = useState<VehicleFiltersType>(filters);

  const toggle = (section: FilterSection) => {
    if (openSection === section) {
      setOpenSection(null);
    } else {
      setPendingFilters(filters);
      setOpenSection(section);
    }
  };

  const updatePending = (patch: Partial<VehicleFiltersType>) => {
    setPendingFilters(prev => ({ ...prev, ...patch }));
  };

  const apply = () => {
    onFiltersChange(pendingFilters);
    setOpenSection(null);
  };

  const close = () => {
    setOpenSection(null);
    setPendingFilters(filters);
  };

  const barClass = (section: FilterSection) =>
    `flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-r border-gray-200 cursor-pointer select-none transition-colors whitespace-nowrap ${
      openSection === section ? 'text-[#3498DB] bg-white' : 'text-[#333] hover:text-[#3498DB] hover:bg-white'
    }`;

  const checkboxItem = (label: string, count: number, checked: boolean, onChange: () => void) => (
    <label className="flex items-center gap-2 py-1.5 px-2 rounded hover:bg-gray-50 cursor-pointer text-sm text-[#333]">
      <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
        checked ? 'bg-[#3498DB] border-[#3498DB]' : 'border-gray-300 bg-white'
      }`}>
        {checked && <Check className="w-3 h-3 text-white" />}
      </div>
      <span className="flex-1">{label}</span>
      <span className="text-[11px] text-[#999]">({count})</span>
    </label>
  );

  const applyBtn = (
    <button
      onClick={apply}
      className="flex items-center justify-center gap-2 w-full py-2.5 bg-white border border-gray-300 text-[#1b2064] font-semibold rounded hover:bg-gray-50 transition-colors text-sm"
    >
      Ver {total} autos
    </button>
  );

  return (
    <div>
      {/* Filter bar — horizontal */}
      <div className="flex items-center bg-[#f8f8f8] border-b border-gray-200 overflow-x-auto">
        <button onClick={() => toggle('marca')} className={barClass('marca')}>
          Marca
          {(filters.make) && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'marca' ? 'rotate-180' : ''}`} />
        </button>

        {filters.make && (
          <button onClick={() => toggle('modelo')} className={barClass('modelo')}>
            Modelo
            {filters.model && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'modelo' ? 'rotate-180' : ''}`} />
          </button>
        )}

        <button onClick={() => toggle('precio')} className={barClass('precio')}>
          Precio
          {filters.price && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'precio' ? 'rotate-180' : ''}`} />
        </button>

        <button onClick={() => toggle('kilometraje')} className={barClass('kilometraje')}>
          Kilometraje
          {filters.mileage && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'kilometraje' ? 'rotate-180' : ''}`} />
        </button>

        <button onClick={() => toggle('anio')} className={barClass('anio')}>
          Año
          {filters.year && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'anio' ? 'rotate-180' : ''}`} />
        </button>

        <button onClick={() => toggle('transmision')} className={barClass('transmision')}>
          Transmisión
          {filters.transmission && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'transmision' ? 'rotate-180' : ''}`} />
        </button>

        <button onClick={() => toggle('combustible')} className={barClass('combustible')}>
          Combustible
          {filters.fuelType && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'combustible' ? 'rotate-180' : ''}`} />
        </button>

        <button onClick={() => toggle('tipo')} className={`${barClass('tipo')} border-r-0`}>
          Tipo
          {filters.vehicleType && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'tipo' ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Expanded dropdown panel */}
      {openSection && (
        <>
          <div className="fixed inset-0 z-30" onClick={close} />
          <div className="relative z-40 bg-white border-b border-gray-200 shadow-lg">
            <div className="container mx-auto px-4 py-4">

              {/* Marca */}
              {openSection === 'marca' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-0 max-h-64 overflow-y-auto">
                    {makes.map(make => (
                      <div key={make} onClick={() => updatePending({ make: pendingFilters.make === make ? undefined : make, model: undefined })}>
                        {checkboxItem(make, makeCounts[make] || 0, pendingFilters.make === make, () => {})}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Modelo */}
              {openSection === 'modelo' && (
                <div>
                  {models.length > 0 ? (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-0 max-h-64 overflow-y-auto">
                        {models.map(model => (
                          <div key={model} onClick={() => updatePending({ model: pendingFilters.model === model ? undefined : model })}>
                            {checkboxItem(model, modelCounts[model] || 0, pendingFilters.model === model, () => {})}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 max-w-xs">{applyBtn}</div>
                    </>
                  ) : (
                    <p className="text-sm text-[#999]">Selecciona una marca primero</p>
                  )}
                </div>
              )}

              {/* Precio */}
              {openSection === 'precio' && (
                <div className="max-w-md">
                  <RangeSlider
                    label="Precio (MXN)"
                    min={PRICE_MIN}
                    max={PRICE_MAX}
                    step={PRICE_STEP}
                    value={{
                      min: pendingFilters.price?.min ?? PRICE_MIN,
                      max: pendingFilters.price?.max ?? PRICE_MAX,
                    }}
                    onChange={(v) => updatePending({
                      price: (v.min === PRICE_MIN && v.max === PRICE_MAX) ? undefined : v,
                    })}
                    formatLabel={fmtPrice}
                  />
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Kilometraje */}
              {openSection === 'kilometraje' && (
                <div className="max-w-md">
                  <RangeSlider
                    label="Kilometraje"
                    min={MILEAGE_MIN}
                    max={MILEAGE_MAX}
                    step={MILEAGE_STEP}
                    value={{
                      min: pendingFilters.mileage?.min ?? MILEAGE_MIN,
                      max: pendingFilters.mileage?.max ?? MILEAGE_MAX,
                    }}
                    onChange={(v) => updatePending({
                      mileage: (v.min === MILEAGE_MIN && v.max === MILEAGE_MAX) ? undefined : v,
                    })}
                    formatLabel={fmtMileage}
                  />
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Año */}
              {openSection === 'anio' && (
                <div className="max-w-md">
                  <RangeSlider
                    label="Año"
                    min={YEAR_MIN}
                    max={YEAR_MAX}
                    step={1}
                    value={{
                      min: pendingFilters.year?.min ?? YEAR_MIN,
                      max: pendingFilters.year?.max ?? YEAR_MAX,
                    }}
                    onChange={(v) => updatePending({
                      year: (v.min === YEAR_MIN && v.max === YEAR_MAX) ? undefined : v,
                    })}
                    formatLabel={(v) => String(v)}
                  />
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Transmisión */}
              {openSection === 'transmision' && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {TRANSMISSION_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updatePending({ transmission: pendingFilters.transmission === opt.value ? undefined : opt.value })}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                          pendingFilters.transmission === opt.value
                            ? 'bg-[#3498DB] text-white border-[#3498DB]'
                            : 'bg-white text-[#333] border-gray-300 hover:border-[#3498DB]/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Combustible */}
              {openSection === 'combustible' && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {FUEL_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updatePending({ fuelType: pendingFilters.fuelType === opt.value ? undefined : opt.value })}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                          pendingFilters.fuelType === opt.value
                            ? 'bg-[#3498DB] text-white border-[#3498DB]'
                            : 'bg-white text-[#333] border-gray-300 hover:border-[#3498DB]/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Tipo */}
              {openSection === 'tipo' && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {TYPE_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => updatePending({ vehicleType: pendingFilters.vehicleType === opt.value ? undefined : opt.value })}
                        className={`px-4 py-2 text-sm rounded-full border transition-colors ${
                          pendingFilters.vehicleType === opt.value
                            ? 'bg-[#3498DB] text-white border-[#3498DB]'
                            : 'bg-white text-[#333] border-gray-300 hover:border-[#3498DB]/50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
