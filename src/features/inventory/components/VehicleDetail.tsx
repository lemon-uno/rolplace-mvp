'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Vehicle } from '../types/vehicle.types';
import { InventoryService } from '../services/inventoryService';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  Calendar,
  Gauge,
  Settings2,
  Fuel,
  DoorOpen,
  Armchair,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Wrench,
  FileText,
} from 'lucide-react';

type FeatureTab = 'exterior' | 'interior' | 'equipment' | 'safety' | 'entertainment';

const FEATURE_TABS: { id: FeatureTab; label: string }[] = [
  { id: 'exterior', label: 'Exterior' },
  { id: 'interior', label: 'Interior' },
  { id: 'equipment', label: 'Equipamiento' },
  { id: 'safety', label: 'Seguridad' },
  { id: 'entertainment', label: 'Entretenimiento' },
];

const FEATURE_MAP: Record<string, string> = {
  xenon_headlights: 'Faros de xenón',
  aluminum_rims: 'Rines de aluminio',
  fog_lights: 'Luces de niebla',
  front_fog_lights: 'Luces de niebla frontales',
  rear_fog_lights: 'Luces de niebla traseras',
  roof_rack: 'Barra porta equipaje',
  color_matched_bumpers: 'Defensas a color',
  tow_bar: 'Barra remolcadora',
  rear_wiper: 'Limpiaparabrisas trasero',
  folding_rear_seats: 'Asientos traseros abatibles',
  cup_holders: 'Portavasos',
  leather_upholstery: 'Tapicería de piel',
  rear_headrests: 'Cabeceras asientos traseros',
  cruise_control: 'Piloto automático',
  lights_reminder: 'Recordatorio de luces encendidas',
  trip_computer: 'Computadora de viaje',
  sunroof: 'Techo corredizo',
  climate_control: 'Control de clima',
  rain_sensor: 'Sensor de lluvia',
  rear_defroster: 'Desempañador trasero',
  air_conditioning: 'Aire acondicionado',
  power_mirrors: 'Espejos eléctricos',
  headlight_control: 'Control de faros',
  power_driver_seat: 'Asiento piloto eléctricos',
  light_sensor: 'Sensor de luces',
  parking_sensor: 'Sensor de estacionamiento',
  power_windows: 'Cristales eléctricos',
  remote_trunk_release: 'Apertura remota de cajuela',
  power_seats: 'Asientos eléctricos',
  central_locking: 'Cerradura centralizada',
  spare_tire: 'Llanta de refacción',
  abs_brakes: 'Frenos ABS',
  alarm: 'Alarma',
  driver_airbag: 'Bolsas de aire conductor',
  electronic_brake_assist: 'Asistente de frenado electrónico',
  engine_immobilizer: 'Inmovilizador de motor',
  passenger_airbag: 'Bolsas de aire pasajero',
  side_airbags: 'Bolsas de aire laterales',
  stability_control: 'Control de estabilidad',
  steering_wheel_controls: 'Controles en volante',
  third_brake_light: 'Tercer luz trasera',
  curtain_airbags: 'Bolsas de aire de cortina',
  armor: 'Blindaje',
  gps: 'GPS',
  am_fm_radio: 'Radio AM/FM',
  bluetooth: 'Bluetooth',
  cd_player: 'CD player',
  dvd_player: 'DVD',
  mp3_player: 'MP3',
  sd_card: 'SD card',
  usb_port: 'USB',
};

const EXTERIOR_KEYS = ['xenon_headlights','aluminum_rims','fog_lights','front_fog_lights','rear_fog_lights','roof_rack','color_matched_bumpers','tow_bar','rear_wiper'];
const INTERIOR_KEYS = ['folding_rear_seats','cup_holders','leather_upholstery','rear_headrests'];
const EQUIPMENT_KEYS = ['cruise_control','lights_reminder','trip_computer','sunroof','climate_control','rain_sensor','rear_defroster','air_conditioning','power_mirrors','headlight_control','power_driver_seat','light_sensor','parking_sensor','power_windows','remote_trunk_release','power_seats','central_locking','spare_tire'];
const SAFETY_KEYS = ['abs_brakes','alarm','driver_airbag','electronic_brake_assist','engine_immobilizer','passenger_airbag','side_airbags','stability_control','steering_wheel_controls','third_brake_light','curtain_airbags','armor'];
const ENTERTAINMENT_KEYS = ['gps','am_fm_radio','bluetooth','cd_player','dvd_player','mp3_player','sd_card','usb_port'];

const TAB_KEYS: Record<FeatureTab, string[]> = {
  exterior: EXTERIOR_KEYS,
  interior: INTERIOR_KEYS,
  equipment: EQUIPMENT_KEYS,
  safety: SAFETY_KEYS,
  entertainment: ENTERTAINMENT_KEYS,
};

function SimilarVehicleCard({ vehicle, onClick }: { vehicle: Vehicle; onClick: () => void }) {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-shadow"
    >
      {vehicle.images && vehicle.images.length > 0 ? (
        <img src={vehicle.images[0]} alt={vehicle.title} className="w-full h-32 object-cover" />
      ) : (
        <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-400 text-sm">Sin imagen</div>
      )}
      <div className="p-3">
        <h4 className="text-sm font-semibold text-gray-900 truncate">{vehicle.title}</h4>
        <p className="text-sm font-bold text-blue-600">{formatPrice(vehicle.price)}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
          <span>{vehicle.year}</span>
          <span>•</span>
          <span>{vehicle.mileage?.toLocaleString()} km</span>
        </div>
      </div>
    </button>
  );
}

export function VehicleDetail() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [similarVehicles, setSimilarVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeFeatureTab, setActiveFeatureTab] = useState<FeatureTab>('exterior');

  useEffect(() => {
    if (params.slug) {
      loadVehicle(params.slug as string);
    }
  }, [params.slug]);

  useEffect(() => {
    if (!lightboxOpen || !vehicle?.images) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowLeft') handlePreviousImage();
      if (e.key === 'ArrowRight') handleNextImage();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lightboxOpen, vehicle?.images, selectedImageIndex]);

  useEffect(() => {
    if (vehicle) {
      setSelectedImageIndex(0);
    }
  }, [vehicle]);

  const loadVehicle = async (slug: string) => {
    setLoading(true);
    try {
      const data = await InventoryService.getVehicleBySlug(slug);
      setVehicle(data);
      if (data) {
        const similar = await InventoryService.getSimilarVehicles(data.id, data.make, data.price, 4);
        setSimilarVehicles(similar);
      }
    } catch (error) {
      console.error('Error cargando vehículo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!vehicle) return;
    setSubmitting(true);
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      vehicleId: vehicle.id,
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      message: formData.get('message') as string,
      preferredContact: formData.get('preferredContact') as 'email' | 'phone' | 'whatsapp' | undefined,
    };
    try {
      const result = await InventoryService.sendContactForm(data);
      if (result.success) {
        setMessage({ type: 'success', text: result.message });
        (e.currentTarget as HTMLFormElement).reset();
        setTimeout(() => { setShowContactForm(false); setMessage(null); }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch {
      setMessage({ type: 'error', text: 'Error al enviar el mensaje.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando vehículo...</p>
        </div>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Vehículo no encontrado</h2>
          <button onClick={() => router.push('/inventory')} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Volver al inventario</button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(price);

  const formatMileage = (mileage: number) =>
    new Intl.NumberFormat('es-MX').format(mileage) + ' km';

  const handlePreviousImage = () => {
    if (!vehicle?.images || vehicle.images.length === 0) return;
    setSelectedImageIndex((prev) => prev === 0 ? vehicle.images.length - 1 : prev - 1);
  };

  const handleNextImage = () => {
    if (!vehicle?.images || vehicle.images.length === 0) return;
    setSelectedImageIndex((prev) => prev === vehicle.images.length - 1 ? 0 : prev + 1);
  };

  // Get features for current tab
  const currentTabKeys = TAB_KEYS[activeFeatureTab];
  const currentTabFeatures = currentTabKeys
    .filter(key => vehicle.features.includes(FEATURE_MAP[key]))
    .map(key => FEATURE_MAP[key]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <nav className="mb-4 text-sm">
          <button onClick={() => router.push('/inventory')} className="text-blue-600 hover:text-blue-700">
            ← Volver al inventario
          </button>
        </nav>

        {/* Main layout: content + sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: main content (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery - full width */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              {vehicle.images && vehicle.images.length > 0 ? (
                <div>
                  {/* Main image */}
                  <div className="relative group">
                    <img
                      src={vehicle.images[selectedImageIndex]}
                      alt={`${vehicle.title} - Imagen ${selectedImageIndex + 1}`}
                      className="w-full h-[400px] object-cover cursor-zoom-in"
                      onClick={() => setLightboxOpen(true)}
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/10 transition-colors cursor-zoom-in"
                      onClick={() => setLightboxOpen(true)}
                    >
                      <ZoomIn className="w-10 h-10 text-white opacity-0 group-hover:opacity-80 transition-opacity drop-shadow-lg" />
                    </div>
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} / {vehicle.images.length}
                    </div>
                    {vehicle.images.length > 1 && (
                      <>
                        <button onClick={handlePreviousImage} className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors">
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                  {/* Thumbnails */}
                  <div className="flex gap-2 p-3 overflow-x-auto">
                    {vehicle.images.map((imageUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`shrink-0 w-20 h-14 rounded overflow-hidden transition-all ${
                          index === selectedImageIndex ? 'ring-2 ring-blue-500' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={imageUrl} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="w-full h-[400px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">Sin imágenes</span>
                </div>
              )}
            </div>

            {/* Title + Price */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{vehicle.title}</h1>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                    <MapPin className="w-4 h-4" />
                    <span>{vehicle.location || 'México'}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-bold text-blue-600">{formatPrice(vehicle.price)}</span>
                </div>
              </div>
            </div>

            {/* Specs */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="grid grid-cols-3 gap-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-gray-400 shrink-0" />
                  <div><div className="text-xs text-gray-500">Año</div><div className="font-semibold text-gray-900">{vehicle.year}</div></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Gauge className="w-5 h-5 text-gray-400 shrink-0" />
                  <div><div className="text-xs text-gray-500">Kilometraje</div><div className="font-semibold text-gray-900">{formatMileage(vehicle.mileage)}</div></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Settings2 className="w-5 h-5 text-gray-400 shrink-0" />
                  <div><div className="text-xs text-gray-500">Transmisión</div><div className="font-semibold text-gray-900">
                    {{ automatic: 'Automática', manual: 'Manual', tiptronic: 'Tiptronic' }[vehicle.transmission]}
                  </div></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Fuel className="w-5 h-5 text-gray-400 shrink-0" />
                  <div><div className="text-xs text-gray-500">Combustible</div><div className="font-semibold text-gray-900">
                    {{ gasoline: 'Gasolina', diesel: 'Diésel', electric: 'Eléctrico', hybrid: 'Híbrido' }[vehicle.fuelType]}
                  </div></div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <DoorOpen className="w-5 h-5 text-gray-400 shrink-0" />
                  <div><div className="text-xs text-gray-500">Puertas</div><div className="font-semibold text-gray-900">{vehicle.doors}</div></div>
                </div>
                {vehicle.seats && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Armchair className="w-5 h-5 text-gray-400 shrink-0" />
                    <div><div className="text-xs text-gray-500">Asientos</div><div className="font-semibold text-gray-900">{vehicle.seats}</div></div>
                  </div>
                )}
                {vehicle.motor && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Wrench className="w-5 h-5 text-gray-400 shrink-0" />
                    <div><div className="text-xs text-gray-500">Motor</div><div className="font-semibold text-gray-900">{vehicle.motor}</div></div>
                  </div>
                )}
                {vehicle.invoice && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                    <div><div className="text-xs text-gray-500">Factura</div><div className="font-semibold text-gray-900 capitalize">{vehicle.invoice === 'original' ? 'Original' : 'Refactura'}</div></div>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {vehicle.description && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600 whitespace-pre-line">{vehicle.description}</p>
              </div>
            )}

            {/* Features in Tabs */}
            {vehicle.features.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Características del Vehículo</h3>
                <div className="flex gap-1 overflow-x-auto border-b border-gray-200 pb-px mb-4">
                  {FEATURE_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveFeatureTab(tab.id)}
                      className={`whitespace-nowrap px-4 py-2 text-sm font-medium transition-all rounded-t-md ${
                        activeFeatureTab === tab.id
                          ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
                {currentTabFeatures.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {currentTabFeatures.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-700 py-1">
                        <span className="text-green-500 text-xs">●</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">Sin características en esta categoría</p>
                )}
              </div>
            )}

            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showContactForm ? 'Ocultar formulario' : 'Me interesa este auto'}
              </button>

              {showContactForm && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Contáctanos sobre este vehículo</h3>
                  {message && (
                    <div className={`mb-4 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                      {message.text}
                    </div>
                  )}
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input type="text" name="name" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                        <input type="email" name="email" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono *</label>
                        <input type="tel" name="phone" required className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Contacto por</label>
                        <select name="preferredContact" className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="whatsapp">WhatsApp</option>
                          <option value="phone">Llamada</option>
                          <option value="email">Email</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Mensaje</label>
                      <textarea name="message" rows={3} placeholder="Hola, me interesa este vehículo..." className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button type="submit" disabled={submitting} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                      {submitting ? 'Enviando...' : 'Enviar mensaje'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar: Similar vehicles */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Vehículos Similares</h3>
              {similarVehicles.length > 0 ? (
                <div className="space-y-4">
                  {similarVehicles.map(v => (
                    <SimilarVehicleCard
                      key={v.id}
                      vehicle={v}
                      onClick={() => router.push(`/inventory/${v.id}`)}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400">No hay vehículos similares</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && vehicle.images && vehicle.images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button onClick={() => setLightboxOpen(false)} className="absolute top-4 right-4 z-10 text-white/80 hover:text-white p-2">
            <X className="w-8 h-8" />
          </button>
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/70 text-sm font-medium">
            {selectedImageIndex + 1} / {vehicle.images.length}
          </div>
          <div className="relative max-w-[90vw] max-h-[90vh] flex items-center justify-center">
            <img
              src={vehicle.images[selectedImageIndex]}
              alt={`${vehicle.title} - Imagen ${selectedImageIndex + 1}`}
              className="max-w-full max-h-[85vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            {vehicle.images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); handlePreviousImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleNextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full">
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto px-4 py-2" onClick={(e) => e.stopPropagation()}>
            {vehicle.images.map((imageUrl, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`shrink-0 w-16 h-12 rounded overflow-hidden transition-all ${
                  index === selectedImageIndex ? 'ring-2 ring-white opacity-100' : 'opacity-50 hover:opacity-80'
                }`}
              >
                <img src={imageUrl} alt={`Miniatura ${index + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
