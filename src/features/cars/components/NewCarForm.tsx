'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createCar } from '@/actions/cars'
import { ImageUploadForm } from '@/features/inventory/components/ImageUploadForm'

type TabId = 'general' | 'exterior' | 'interior' | 'equipment' | 'safety' | 'entertainment'

interface TabConfig {
  id: TabId
  label: string
}

const TABS: TabConfig[] = [
  { id: 'general', label: 'General' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'equipment', label: 'Equipamiento y Confort' },
  { id: 'safety', label: 'Seguridad' },
  { id: 'entertainment', label: 'Entretenimiento' },
]

const INITIAL_BOOLEAN_FIELDS = {
  // Exterior
  xenon_headlights: false,
  aluminum_rims: false,
  fog_lights: false,
  front_fog_lights: false,
  rear_fog_lights: false,
  roof_rack: false,
  color_matched_bumpers: false,
  tow_bar: false,
  rear_wiper: false,
  // Interior
  folding_rear_seats: false,
  cup_holders: false,
  leather_upholstery: false,
  rear_headrests: false,
  // Equipment & Comfort
  cruise_control: false,
  lights_reminder: false,
  trip_computer: false,
  sunroof: false,
  climate_control: false,
  rain_sensor: false,
  rear_defroster: false,
  air_conditioning: false,
  power_mirrors: false,
  headlight_control: false,
  power_driver_seat: false,
  light_sensor: false,
  parking_sensor: false,
  power_windows: false,
  remote_trunk_release: false,
  power_seats: false,
  central_locking: false,
  spare_tire: false,
  // Safety
  abs_brakes: false,
  alarm: false,
  driver_airbag: false,
  electronic_brake_assist: false,
  engine_immobilizer: false,
  passenger_airbag: false,
  side_airbags: false,
  stability_control: false,
  steering_wheel_controls: false,
  third_brake_light: false,
  curtain_airbags: false,
  armor: false,
  // Entertainment
  gps: false,
  am_fm_radio: false,
  bluetooth: false,
  cd_player: false,
  dvd_player: false,
  mp3_player: false,
  sd_card: false,
  usb_port: false,
}

interface FormData {
  make: string
  model: string
  version: string
  year: string
  price: string
  mileage: string
  invoice: string
  motor: string
  owners: string
  description: string
  featured: boolean
  images: string[]
  video_url: string
  exterior_color: string
  interior_color: string
  transmission: string
  fuel_type: string
  condition: string
  vehicle_type: string
  [key: string]: string | boolean | string[]
}

const INITIAL_FORM: FormData = {
  make: '',
  model: '',
  version: '',
  year: '',
  price: '',
  mileage: '',
  invoice: '',
  motor: '',
  owners: '',
  description: '',
  featured: false,
  images: [],
  video_url: '',
  exterior_color: '',
  interior_color: '',
  transmission: '',
  fuel_type: '',
  condition: '',
  vehicle_type: '',
  ...INITIAL_BOOLEAN_FIELDS,
}

interface CheckboxField {
  name: string
  label: string
}

const EXTERIOR_CHECKBOXES: CheckboxField[] = [
  { name: 'xenon_headlights', label: 'Faros de xenón' },
  { name: 'aluminum_rims', label: 'Rines de aluminio' },
  { name: 'fog_lights', label: 'Luces de niebla' },
  { name: 'front_fog_lights', label: 'Luces de niebla frontales' },
  { name: 'rear_fog_lights', label: 'Luces de niebla traseras' },
  { name: 'roof_rack', label: 'Barra porta equipaje' },
  { name: 'color_matched_bumpers', label: 'Defensas a color' },
  { name: 'tow_bar', label: 'Barra remolcadora' },
  { name: 'rear_wiper', label: 'Limpiaparabrisas trasero' },
]

const INTERIOR_CHECKBOXES: CheckboxField[] = [
  { name: 'folding_rear_seats', label: 'Asientos traseros abatibles' },
  { name: 'cup_holders', label: 'Portavasos' },
  { name: 'leather_upholstery', label: 'Tapicería de piel' },
  { name: 'rear_headrests', label: 'Cabeceras asientos traseros' },
]

const EQUIPMENT_CHECKBOXES: CheckboxField[] = [
  { name: 'cruise_control', label: 'Piloto automático' },
  { name: 'lights_reminder', label: 'Recordatorio de luces encendidas' },
  { name: 'trip_computer', label: 'Computadora de viaje' },
  { name: 'sunroof', label: 'Techo corredizo' },
  { name: 'climate_control', label: 'Control de clima' },
  { name: 'rain_sensor', label: 'Sensor de lluvia' },
  { name: 'rear_defroster', label: 'Desempañador trasero' },
  { name: 'air_conditioning', label: 'Aire acondicionado' },
  { name: 'power_mirrors', label: 'Espejos eléctricos' },
  { name: 'headlight_control', label: 'Control de faros' },
  { name: 'power_driver_seat', label: 'Asiento piloto ajustes eléctricos' },
  { name: 'light_sensor', label: 'Sensor de luces' },
  { name: 'parking_sensor', label: 'Sensor de estacionamiento' },
  { name: 'power_windows', label: 'Cristales eléctricos' },
  { name: 'remote_trunk_release', label: 'Apertura remota de cajuela' },
  { name: 'power_seats', label: 'Asientos ajustes eléctricos' },
  { name: 'central_locking', label: 'Cerradura centralizada de puertas' },
  { name: 'spare_tire', label: 'Llanta de refacción' },
]

const SAFETY_CHECKBOXES: CheckboxField[] = [
  { name: 'abs_brakes', label: 'Frenos ABS' },
  { name: 'alarm', label: 'Alarma' },
  { name: 'driver_airbag', label: 'Bolsas de aire conductor' },
  { name: 'electronic_brake_assist', label: 'Asistente de frenado electrónico' },
  { name: 'engine_immobilizer', label: 'Inmovilizador de motor' },
  { name: 'passenger_airbag', label: 'Bolsas de aire pasajero' },
  { name: 'side_airbags', label: 'Bolsas de aire laterales' },
  { name: 'stability_control', label: 'Control de estabilidad' },
  { name: 'steering_wheel_controls', label: 'Controles en volante' },
  { name: 'third_brake_light', label: 'Tercer luz trasera' },
  { name: 'curtain_airbags', label: 'Bolsas de aire de cortina' },
  { name: 'armor', label: 'Blindaje' },
]

const ENTERTAINMENT_CHECKBOXES: CheckboxField[] = [
  { name: 'gps', label: 'GPS' },
  { name: 'am_fm_radio', label: 'Radio AM/FM' },
  { name: 'bluetooth', label: 'Bluetooth' },
  { name: 'cd_player', label: 'CD player' },
  { name: 'dvd_player', label: 'DVD' },
  { name: 'mp3_player', label: 'MP3' },
  { name: 'sd_card', label: 'SD card' },
  { name: 'usb_port', label: 'USB' },
]

function CheckboxGroup({ fields, values, onChange }: {
  fields: CheckboxField[]
  values: Record<string, string | boolean | string[]>
  onChange: (name: string, checked: boolean) => void
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {fields.map(({ name, label }) => (
        <label
          key={name}
          className={`flex items-center gap-3 rounded-lg border px-4 py-3 cursor-pointer transition-all ${
            values[name]
              ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
              : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
          }`}
        >
          <input
            type="checkbox"
            name={name}
            checked={!!values[name]}
            onChange={(e) => onChange(name, e.target.checked)}
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
          />
          <span className="text-sm">{label}</span>
        </label>
      ))}
    </div>
  )
}

export function NewCarForm() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({ ...INITIAL_FORM })

  const generateTitle = () => {
    const { make, model, version, year } = formData
    if (make || model || version || year) {
      return [make, model, version, year].filter(Boolean).join(' ')
    }
    return ''
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target

    if (name === 'owners') {
      const numValue = parseInt(value)
      if (value !== '' && (isNaN(numValue) || numValue === 0 || numValue > 99)) return
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    const formPayload = new FormData()
    formPayload.append('title', generateTitle())
    formPayload.append('make', formData.make)
    formPayload.append('model', formData.model)
    formPayload.append('version', formData.version)
    formPayload.append('year', formData.year)
    formPayload.append('price', formData.price)
    formPayload.append('mileage', formData.mileage)
    formPayload.append('invoice', formData.invoice)
    formPayload.append('motor', formData.motor as string)
    formPayload.append('owners', formData.owners)
    formPayload.append('description', formData.description)
    formPayload.append('featured', formData.featured ? 'true' : 'false')
    formPayload.append('images', JSON.stringify(formData.images))
    formPayload.append('video_url', formData.video_url as string)
    formPayload.append('exterior_color', formData.exterior_color)
    formPayload.append('interior_color', formData.interior_color)
    formPayload.append('transmission', formData.transmission)
    formPayload.append('fuel_type', formData.fuel_type)
    formPayload.append('condition', formData.condition)
    formPayload.append('vehicle_type', formData.vehicle_type)

    for (const [key, val] of Object.entries(formData)) {
      if (typeof val === 'boolean') {
        formPayload.append(key, val ? 'true' : 'false')
      }
    }

    try {
      const result = await createCar(formPayload)
      if (result?.error) {
        alert('Error: ' + result.error)
        setIsSubmitting(false)
      } else {
        router.push('/dashboard/cars')
        router.refresh()
      }
    } catch (err) {
      alert('Error inesperado. Intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'

  return (
    <form onSubmit={handleSubmit}>
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto border-b border-gray-700 pb-px mb-6 scrollbar-hide">
        {TABS.map(tab => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`whitespace-nowrap rounded-t-md px-4 py-2.5 text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-gray-800 text-cyan-400 border border-gray-700 border-b-gray-800 -mb-px'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: General */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Título del Auto *
            </label>
            <input
              type="text"
              value={generateTitle()}
              readOnly
              placeholder="Se genera con Marca + Modelo + Versión + Año"
              className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-gray-400 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500">
              Se genera automáticamente al completar Marca, Modelo, Versión y Año
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="make" className="block text-sm font-medium text-gray-300">Marca *</label>
              <input id="make" name="make" type="text" required placeholder="Ej: Toyota" value={formData.make} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="model" className="block text-sm font-medium text-gray-300">Modelo *</label>
              <input id="model" name="model" type="text" required placeholder="Ej: Corolla" value={formData.model} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="version" className="block text-sm font-medium text-gray-300">Versión *</label>
              <input id="version" name="version" type="text" required placeholder="Ej: LE, XLE, Limited" value={formData.version} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-gray-300">Año *</label>
              <input id="year" name="year" type="number" required min="1900" max={new Date().getFullYear() + 1} placeholder="2021" value={formData.year} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium text-gray-300">Precio (MXN) *</label>
              <input id="price" name="price" type="number" required min="0" step="0.01" placeholder="285000" value={formData.price} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label htmlFor="owners" className="block text-sm font-medium text-gray-300">Propietarios *</label>
              <input id="owners" name="owners" type="text" inputMode="numeric" required placeholder="1" value={formData.owners} onChange={handleInputChange} className={inputClass} />
              <p className="text-xs text-gray-500">Solo números del 1 al 99</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="invoice" className="block text-sm font-medium text-gray-300">Factura *</label>
              <select id="invoice" name="invoice" required value={formData.invoice} onChange={handleInputChange} className={inputClass}>
                <option value="">Seleccionar...</option>
                <option value="original">Original</option>
                <option value="refactura">Refactura</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="motor" className="block text-sm font-medium text-gray-300">Motor</label>
              <input id="motor" name="motor" type="text" placeholder="Ej: 3.4L, 2.0L, 1.8 Turbo" value={formData.motor} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="mileage" className="block text-sm font-medium text-gray-300">Kilometraje</label>
              <input id="mileage" name="mileage" type="text" placeholder="Ej: 35,000 km" value={formData.mileage} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="transmission" className="block text-sm font-medium text-gray-300">Transmisión *</label>
              <select id="transmission" name="transmission" required value={formData.transmission} onChange={handleInputChange} className={inputClass}>
                <option value="">Seleccionar...</option>
                <option value="manual">Manual</option>
                <option value="automatic">Automática</option>
                <option value="cvt">CVT</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="fuel_type" className="block text-sm font-medium text-gray-300">Combustible *</label>
              <select id="fuel_type" name="fuel_type" required value={formData.fuel_type} onChange={handleInputChange} className={inputClass}>
                <option value="">Seleccionar...</option>
                <option value="gasoline">Gasolina</option>
                <option value="diesel">Diésel</option>
                <option value="electric">Eléctrico</option>
                <option value="hybrid">Híbrido</option>
              </select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-300">Condición *</label>
              <select id="condition" name="condition" required value={formData.condition} onChange={handleInputChange} className={inputClass}>
                <option value="">Seleccionar...</option>
                <option value="new">Nuevo</option>
                <option value="semi-new">Seminuevo</option>
                <option value="certified">Certificado</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="vehicle_type" className="block text-sm font-medium text-gray-300">Tipo de vehículo *</label>
              <select id="vehicle_type" name="vehicle_type" required value={formData.vehicle_type} onChange={handleInputChange} className={inputClass}>
                <option value="">Seleccionar...</option>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Imágenes del Auto *</label>
            <p className="text-xs text-gray-500 mb-4">Arrastra o haz clic para seleccionar (máx. 20 imágenes, 10MB cada una)</p>
            <ImageUploadForm name="images" onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))} />
          </div>

          <div className="space-y-2">
            <label htmlFor="video_url" className="block text-sm font-medium text-gray-300">Video de YouTube</label>
            <input id="video_url" name="video_url" type="url" placeholder="https://www.youtube.com/watch?v=..." value={formData.video_url} onChange={handleInputChange} className={inputClass} />
            <p className="text-xs text-gray-500">Pega el enlace de un video de YouTube (opcional)</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descripción</label>
            <textarea id="description" name="description" rows={4} placeholder="Describe las características del auto..." value={formData.description} onChange={handleInputChange} className={inputClass} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input id="featured" name="featured" type="checkbox" checked={formData.featured} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500" />
            <span className="text-sm font-medium text-gray-300">Destacar en la página principal</span>
          </label>
        </div>
      )}

      {/* Tab: Exterior */}
      {activeTab === 'exterior' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="exterior_color" className="block text-sm font-medium text-gray-300">Color Exterior</label>
            <input id="exterior_color" name="exterior_color" type="text" placeholder="Ej: Blanco, Rojo, Gris" value={formData.exterior_color} onChange={handleInputChange} className={inputClass} />
          </div>
          <CheckboxGroup fields={EXTERIOR_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {/* Tab: Interior */}
      {activeTab === 'interior' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="interior_color" className="block text-sm font-medium text-gray-300">Color Interior</label>
            <input id="interior_color" name="interior_color" type="text" placeholder="Ej: Negro, Beige" value={formData.interior_color} onChange={handleInputChange} className={inputClass} />
          </div>
          <CheckboxGroup fields={INTERIOR_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {/* Tab: Equipment */}
      {activeTab === 'equipment' && (
        <div className="space-y-6">
          <CheckboxGroup fields={EQUIPMENT_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {/* Tab: Safety */}
      {activeTab === 'safety' && (
        <div className="space-y-6">
          <CheckboxGroup fields={SAFETY_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {/* Tab: Entertainment */}
      {activeTab === 'entertainment' && (
        <div className="space-y-6">
          <CheckboxGroup fields={ENTERTAINMENT_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {/* Navigation + Submit */}
      <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-6">
        <div className="flex gap-2">
          {activeTab !== 'general' && (
            <button
              type="button"
              onClick={() => {
                const idx = TABS.findIndex(t => t.id === activeTab)
                if (idx > 0) setActiveTab(TABS[idx - 1].id)
              }}
              className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              Anterior
            </button>
          )}
          {activeTab !== 'entertainment' && (
            <button
              type="button"
              onClick={() => {
                const idx = TABS.findIndex(t => t.id === activeTab)
                if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id)
              }}
              className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
            >
              Siguiente
            </button>
          )}
        </div>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => router.push('/dashboard/cars')}
            className="rounded-md border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !generateTitle()}
            className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Agregando...' : 'Agregar Auto'}
          </button>
        </div>
      </div>
    </form>
  )
}
