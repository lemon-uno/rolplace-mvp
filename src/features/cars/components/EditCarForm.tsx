'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCar } from '@/actions/cars'
import { ImageUploadForm } from '@/features/inventory/components/ImageUploadForm'
import type { Car } from '@/types/database'

type TabId = 'general' | 'exterior' | 'interior' | 'equipment' | 'safety' | 'entertainment'

const TABS: { id: TabId; label: string }[] = [
  { id: 'general', label: 'General' },
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'equipment', label: 'Equipamiento' },
  { id: 'safety', label: 'Seguridad' },
  { id: 'entertainment', label: 'Entretenimiento' },
]

interface CheckboxField { name: string; label: string }

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
  { name: 'power_driver_seat', label: 'Asiento piloto eléctricos' },
  { name: 'light_sensor', label: 'Sensor de luces' },
  { name: 'parking_sensor', label: 'Sensor de estacionamiento' },
  { name: 'power_windows', label: 'Cristales eléctricos' },
  { name: 'remote_trunk_release', label: 'Apertura remota de cajuela' },
  { name: 'power_seats', label: 'Asientos eléctricos' },
  { name: 'central_locking', label: 'Cerradura centralizada' },
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

interface FormData {
  make: string; model: string; version: string; year: string
  price: string; mileage: string; invoice: string; owners: string
  description: string; featured: boolean; status: string
  images: string[]; exterior_color: string; interior_color: string
  [key: string]: string | boolean | string[]
}

export function EditCarForm({ car }: { car: Car }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('general')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    make: car.make || '',
    model: car.model || '',
    version: car.version || '',
    year: String(car.year),
    price: String(car.price),
    mileage: car.mileage || '',
    invoice: car.invoice || '',
    owners: car.owners ? String(car.owners) : '',
    description: car.description || '',
    featured: car.featured,
    status: car.status,
    images: car.images || [],
    exterior_color: car.exterior_color || '',
    interior_color: car.interior_color || '',
    xenon_headlights: car.xenon_headlights,
    aluminum_rims: car.aluminum_rims,
    fog_lights: car.fog_lights,
    front_fog_lights: car.front_fog_lights,
    rear_fog_lights: car.rear_fog_lights,
    roof_rack: car.roof_rack,
    color_matched_bumpers: car.color_matched_bumpers,
    tow_bar: car.tow_bar,
    rear_wiper: car.rear_wiper,
    folding_rear_seats: car.folding_rear_seats,
    cup_holders: car.cup_holders,
    leather_upholstery: car.leather_upholstery,
    rear_headrests: car.rear_headrests,
    cruise_control: car.cruise_control,
    lights_reminder: car.lights_reminder,
    trip_computer: car.trip_computer,
    sunroof: car.sunroof,
    climate_control: car.climate_control,
    rain_sensor: car.rain_sensor,
    rear_defroster: car.rear_defroster,
    air_conditioning: car.air_conditioning,
    power_mirrors: car.power_mirrors,
    headlight_control: car.headlight_control,
    power_driver_seat: car.power_driver_seat,
    light_sensor: car.light_sensor,
    parking_sensor: car.parking_sensor,
    power_windows: car.power_windows,
    remote_trunk_release: car.remote_trunk_release,
    power_seats: car.power_seats,
    central_locking: car.central_locking,
    spare_tire: car.spare_tire,
    abs_brakes: car.abs_brakes,
    alarm: car.alarm,
    driver_airbag: car.driver_airbag,
    electronic_brake_assist: car.electronic_brake_assist,
    engine_immobilizer: car.engine_immobilizer,
    passenger_airbag: car.passenger_airbag,
    side_airbags: car.side_airbags,
    stability_control: car.stability_control,
    steering_wheel_controls: car.steering_wheel_controls,
    third_brake_light: car.third_brake_light,
    curtain_airbags: car.curtain_airbags,
    armor: car.armor,
    gps: car.gps,
    am_fm_radio: car.am_fm_radio,
    bluetooth: car.bluetooth,
    cd_player: car.cd_player,
    dvd_player: car.dvd_player,
    mp3_player: car.mp3_player,
    sd_card: car.sd_card,
    usb_port: car.usb_port,
  })

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
    formPayload.append('owners', formData.owners)
    formPayload.append('description', formData.description)
    formPayload.append('featured', formData.featured ? 'true' : 'false')
    formPayload.append('status', formData.status)
    formPayload.append('images', JSON.stringify(formData.images))
    formPayload.append('exterior_color', formData.exterior_color)
    formPayload.append('interior_color', formData.interior_color)

    for (const [key, val] of Object.entries(formData)) {
      if (typeof val === 'boolean') {
        formPayload.append(key, val ? 'true' : 'false')
      }
    }

    try {
      const result = await updateCar(car.id, formPayload)
      if (result?.error) {
        alert('Error: ' + result.error)
        setIsSubmitting(false)
      } else {
        router.push('/dashboard/cars')
        router.refresh()
      }
    } catch {
      alert('Error inesperado. Intenta de nuevo.')
      setIsSubmitting(false)
    }
  }

  const inputClass = 'w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500'

  return (
    <form onSubmit={handleSubmit}>
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

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Título del Auto *</label>
            <input type="text" value={generateTitle()} readOnly className="w-full rounded-md border border-gray-700 bg-gray-800/50 px-3 py-2 text-gray-400 cursor-not-allowed" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Marca *</label>
              <input name="make" type="text" required value={formData.make} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Modelo *</label>
              <input name="model" type="text" required value={formData.model} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Versión</label>
              <input name="version" type="text" value={formData.version} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Año *</label>
              <input name="year" type="number" required min="1900" max={new Date().getFullYear() + 1} value={formData.year} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Precio (MXN) *</label>
              <input name="price" type="number" required min="0" step="0.01" value={formData.price} onChange={handleInputChange} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Propietarios</label>
              <input name="owners" type="text" inputMode="numeric" value={formData.owners} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Factura</label>
              <select name="invoice" value={formData.invoice} onChange={handleInputChange} className={inputClass}>
                <option value="">Seleccionar...</option>
                <option value="original">Original</option>
                <option value="refactura">Refactura</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Kilometraje</label>
              <input name="mileage" type="text" value={formData.mileage} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Estatus</label>
              <select name="status" value={formData.status} onChange={handleInputChange} className={inputClass}>
                <option value="available">Disponible</option>
                <option value="reserved">Reservado</option>
                <option value="sold">Vendido</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Imágenes del Auto</label>
            <p className="text-xs text-gray-500 mb-4">Arrastra para reordenar. Máx. 20 imágenes.</p>
            <ImageUploadForm name="images" initialImages={car.images || []} onImagesChange={(images) => setFormData(prev => ({ ...prev, images }))} />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Descripción</label>
            <textarea name="description" rows={4} value={formData.description} onChange={handleInputChange} className={inputClass} />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input name="featured" type="checkbox" checked={formData.featured as boolean} onChange={handleInputChange} className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-cyan-500 focus:ring-cyan-500" />
            <span className="text-sm font-medium text-gray-300">Destacar en la página principal</span>
          </label>
        </div>
      )}

      {activeTab === 'exterior' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Color Exterior</label>
            <input name="exterior_color" type="text" value={formData.exterior_color} onChange={handleInputChange} className={inputClass} />
          </div>
          <CheckboxGroup fields={EXTERIOR_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {activeTab === 'interior' && (
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Color Interior</label>
            <input name="interior_color" type="text" value={formData.interior_color} onChange={handleInputChange} className={inputClass} />
          </div>
          <CheckboxGroup fields={INTERIOR_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
        </div>
      )}

      {activeTab === 'equipment' && (
        <CheckboxGroup fields={EQUIPMENT_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
      )}

      {activeTab === 'safety' && (
        <CheckboxGroup fields={SAFETY_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
      )}

      {activeTab === 'entertainment' && (
        <CheckboxGroup fields={ENTERTAINMENT_CHECKBOXES} values={formData} onChange={handleCheckboxChange} />
      )}

      <div className="mt-8 flex items-center justify-between border-t border-gray-700 pt-6">
        <div className="flex gap-2">
          {activeTab !== 'general' && (
            <button type="button" onClick={() => { const idx = TABS.findIndex(t => t.id === activeTab); if (idx > 0) setActiveTab(TABS[idx - 1].id) }} className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700">Anterior</button>
          )}
          {activeTab !== 'entertainment' && (
            <button type="button" onClick={() => { const idx = TABS.findIndex(t => t.id === activeTab); if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].id) }} className="rounded-md border border-gray-700 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700">Siguiente</button>
          )}
        </div>
        <div className="flex gap-4">
          <button type="button" onClick={() => router.push('/dashboard/cars')} className="rounded-md border border-gray-700 bg-gray-800 px-6 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-700">Cancelar</button>
          <button type="submit" disabled={isSubmitting} className="rounded-md bg-gradient-to-r from-cyan-500 to-blue-500 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </form>
  )
}
