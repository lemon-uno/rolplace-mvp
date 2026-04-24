'use client';

import { useState } from 'react';
import { ChevronDown, X } from 'lucide-react';
import { VehicleFilters as VehicleFiltersType, VehicleTransmission, VehicleFuelType, VehicleType } from '../types/vehicle.types';
import { RangeSlider } from './RangeSlider';

interface VehicleFiltersProps {
  makes: string[];
  models: string[];
  onFiltersChange: (filters: VehicleFiltersType) => void;
  filters: VehicleFiltersType;
  total: number;
  onClose: () => void;
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

function AccordionSection({ title, count, open, onToggle, children }: {
  title: string;
  count?: number;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-gray-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-[#333]">{title}</span>
        <div className="flex items-center gap-2">
          {count !== undefined && count > 0 && (
            <span className="text-[10px] text-[#3498DB] bg-[#3498DB]/10 px-1.5 py-0.5 rounded">
              {count}
            </span>
          )}
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  );
}

export function VehicleFilters({ makes, models, onFiltersChange, filters, total, onClose }: VehicleFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({ marca: true });

  const toggle = (key: string) => {
    setOpenSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const update = (patch: Partial<VehicleFiltersType>) => {
    const next = { ...filters, ...patch };
    onFiltersChange(next);
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.keys(filters).length > 0;

  const pillClass = (active: boolean) =>
    `px-3 py-1.5 text-xs font-medium rounded-full border transition-colors cursor-pointer ${
      active
        ? 'bg-[#3498DB] text-white border-[#3498DB]'
        : 'bg-white text-[#555] border-gray-200 hover:border-[#3498DB]/50'
    }`;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 shrink-0">
        <h2 className="text-base font-bold text-[#333]">Filtros</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-[#3498DB] font-medium hover:underline">
              Borrar filtros
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Marca */}
        <AccordionSection
          title="Marca"
          count={filters.make ? 1 : undefined}
          open={!!openSections.marca}
          onToggle={() => toggle('marca')}
        >
          <div className="flex flex-wrap gap-1.5">
            {makes.map(make => (
              <button
                key={make}
                onClick={() => update({ make: filters.make === make ? undefined : make, model: undefined })}
                className={pillClass(filters.make === make)}
              >
                {make}
              </button>
            ))}
          </div>
        </AccordionSection>

        {/* Modelo */}
        {filters.make && models.length > 0 && (
          <AccordionSection
            title="Modelo"
            count={filters.model ? 1 : undefined}
            open={!!openSections.modelo}
            onToggle={() => toggle('modelo')}
          >
            <div className="flex flex-wrap gap-1.5">
              {models.map(model => (
                <button
                  key={model}
                  onClick={() => update({ model: filters.model === model ? undefined : model })}
                  className={pillClass(filters.model === model)}
                >
                  {model}
                </button>
              ))}
            </div>
          </AccordionSection>
        )}

        {/* Precio */}
        <AccordionSection
          title="Precio"
          count={filters.price ? 1 : undefined}
          open={!!openSections.precio}
          onToggle={() => toggle('precio')}
        >
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
        </AccordionSection>

        {/* Kilometraje */}
        <AccordionSection
          title="Kilometraje"
          count={filters.mileage ? 1 : undefined}
          open={!!openSections.kilometraje}
          onToggle={() => toggle('kilometraje')}
        >
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
        </AccordionSection>

        {/* Año */}
        <AccordionSection
          title="Año"
          count={filters.year ? 1 : undefined}
          open={!!openSections.anio}
          onToggle={() => toggle('anio')}
        >
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
        </AccordionSection>

        {/* Transmisión */}
        <AccordionSection
          title="Transmisión"
          count={filters.transmission ? 1 : undefined}
          open={!!openSections.transmision}
          onToggle={() => toggle('transmision')}
        >
          <div className="flex flex-wrap gap-1.5">
            {TRANSMISSION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ transmission: filters.transmission === opt.value ? undefined : opt.value })}
                className={pillClass(filters.transmission === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </AccordionSection>

        {/* Combustible */}
        <AccordionSection
          title="Combustible"
          count={filters.fuelType ? 1 : undefined}
          open={!!openSections.combustible}
          onToggle={() => toggle('combustible')}
        >
          <div className="flex flex-wrap gap-1.5">
            {FUEL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ fuelType: filters.fuelType === opt.value ? undefined : opt.value })}
                className={pillClass(filters.fuelType === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </AccordionSection>

        {/* Tipo de vehículo */}
        <AccordionSection
          title="Tipo de vehículo"
          count={filters.vehicleType ? 1 : undefined}
          open={!!openSections.tipo}
          onToggle={() => toggle('tipo')}
        >
          <div className="flex flex-wrap gap-1.5">
            {TYPE_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => update({ vehicleType: filters.vehicleType === opt.value ? undefined : opt.value })}
                className={pillClass(filters.vehicleType === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </AccordionSection>
      </div>

      {/* Apply button */}
      <div className="p-4 border-t border-gray-200 shrink-0">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#3498DB] text-white text-sm font-semibold rounded hover:bg-[#2980B9] transition-colors"
        >
          Ver {total} vehículos
        </button>
      </div>
    </div>
  );
}
