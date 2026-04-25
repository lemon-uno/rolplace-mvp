'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { VehicleFilters as VehicleFiltersType, VehicleTransmission, VehicleFuelType, VehicleType } from '../types/vehicle.types';
import { RangeSlider } from './RangeSlider';

interface ModelEntry {
  make: string;
  model: string;
}

interface VehicleFiltersProps {
  makes: string[];
  makeCounts: Record<string, number>;
  models: ModelEntry[];
  modelCounts: Record<string, number>;
  transmissionCounts: Record<string, number>;
  fuelTypeCounts: Record<string, number>;
  vehicleTypeCounts: Record<string, number>;
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

export function VehicleFilters({ makes, makeCounts, models, modelCounts, transmissionCounts, fuelTypeCounts, vehicleTypeCounts, onFiltersChange, filters, total }: VehicleFiltersProps) {
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

  const toggleArrayItem = (field: keyof Pick<VehicleFiltersType, 'make' | 'model' | 'transmission' | 'fuelType' | 'vehicleType'>, value: string) => {
    const current = (pendingFilters[field] as string[] | undefined) || [];
    const next = current.includes(value) ? current.filter(v => v !== value) : [...current, value];
    updatePending({ [field]: next.length > 0 ? next : undefined });
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
      <span className="flex-1">{label} ({count})</span>
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

  const hasActive = (field: keyof VehicleFiltersType) => {
    const val = filters[field];
    return Array.isArray(val) ? val.length > 0 : val !== undefined;
  };

  const selectedMakeCount = (pendingFilters.make || []).length;
  const showMakeLabel = (pendingFilters.make || []).length > 1;

  // Split models into 3 columns, max 9 rows each
  const modelColumns = useMemo(() => {
    const cols: ModelEntry[][] = [[], [], []];
    const MAX_ROWS = 9;
    for (let i = 0; i < models.length; i++) {
      const colIdx = Math.floor(i / MAX_ROWS);
      if (colIdx >= 3) break;
      cols[colIdx].push(models[i]);
    }
    return cols;
  }, [models]);

  return (
    <div>
      {/* Filter bar — centered horizontal */}
      <div className="flex items-center justify-center bg-[#f8f8f8] border-b border-gray-200 overflow-x-auto">
        <div className="flex items-center">
          <button onClick={() => toggle('marca')} className={barClass('marca')}>
            Marca
            {hasActive('make') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'marca' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('modelo')} className={barClass('modelo')}>
            Modelo
            {hasActive('model') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'modelo' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('precio')} className={barClass('precio')}>
            Precio
            {hasActive('price') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'precio' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('kilometraje')} className={barClass('kilometraje')}>
            Kilometraje
            {hasActive('mileage') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'kilometraje' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('anio')} className={barClass('anio')}>
            Año
            {hasActive('year') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'anio' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('transmision')} className={barClass('transmision')}>
            Transmisión
            {hasActive('transmission') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'transmision' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('combustible')} className={barClass('combustible')}>
            Combustible
            {hasActive('fuelType') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'combustible' ? 'rotate-180' : ''}`} />
          </button>

          <button onClick={() => toggle('tipo')} className={`${barClass('tipo')} border-r-0`}>
            Tipo
            {hasActive('vehicleType') && <span className="w-1.5 h-1.5 rounded-full bg-[#3498DB]" />}
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openSection === 'tipo' ? 'rotate-180' : ''}`} />
          </button>
        </div>
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
                      <div key={make} onClick={() => toggleArrayItem('make', make)}>
                        {checkboxItem(make, makeCounts[make] || 0, (pendingFilters.make || []).includes(make), () => {})}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Modelo */}
              {openSection === 'modelo' && (
                <div>
                  {selectedMakeCount === 0 ? (
                    <p className="text-sm text-[#999]">Selecciona entre 1 y 3 marcas para ver modelos</p>
                  ) : selectedMakeCount > 3 ? (
                    <p className="text-sm text-[#999]">Selecciona máximo 3 marcas para ver modelos</p>
                  ) : models.length === 0 ? (
                    <p className="text-sm text-[#999]">No hay modelos disponibles</p>
                  ) : (
                    <>
                      <div className="grid grid-cols-3 gap-x-6 max-h-[320px] overflow-y-auto">
                        {modelColumns.map((col, ci) => (
                          <div key={ci}>
                            {col.map((m, ri) => {
                              const label = showMakeLabel ? `${m.model} (${m.make})` : m.model;
                              const isFirstInMake = ri === 0 || col[ri - 1]?.make !== m.make;
                              return (
                                <div key={`${m.make}-${m.model}`}>
                                  {isFirstInMake && showMakeLabel && (
                                    <p className="text-[11px] font-bold text-[#1b2064] uppercase tracking-wide px-2 pt-2 pb-0.5">{m.make}</p>
                                  )}
                                  <div onClick={() => toggleArrayItem('model', m.model)}>
                                    {checkboxItem(label, modelCounts[m.model] || 0, (pendingFilters.model || []).includes(m.model), () => {})}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 max-w-xs">{applyBtn}</div>
                    </>
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-0">
                    {TRANSMISSION_OPTIONS.map(opt => (
                      <div key={opt.value} onClick={() => toggleArrayItem('transmission', opt.value)}>
                        {checkboxItem(opt.label, transmissionCounts[opt.value] || 0, (pendingFilters.transmission || []).includes(opt.value), () => {})}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Combustible */}
              {openSection === 'combustible' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-0">
                    {FUEL_OPTIONS.map(opt => (
                      <div key={opt.value} onClick={() => toggleArrayItem('fuelType', opt.value)}>
                        {checkboxItem(opt.label, fuelTypeCounts[opt.value] || 0, (pendingFilters.fuelType || []).includes(opt.value), () => {})}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 max-w-xs">{applyBtn}</div>
                </div>
              )}

              {/* Tipo */}
              {openSection === 'tipo' && (
                <div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-4 gap-y-0">
                    {TYPE_OPTIONS.map(opt => (
                      <div key={opt.value} onClick={() => toggleArrayItem('vehicleType', opt.value)}>
                        {checkboxItem(opt.label, vehicleTypeCounts[opt.value] || 0, (pendingFilters.vehicleType || []).includes(opt.value), () => {})}
                      </div>
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
