'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Vehicle } from '../types/vehicle.types';
import { InventoryService } from '../services/inventoryService';

export function VehicleDetail() {
  const params = useParams();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (params.slug) {
      loadVehicle(params.slug as string);
    }
  }, [params.slug]);

  // Reset selected image when vehicle changes
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
        setTimeout(() => {
          setShowContactForm(false);
          setMessage(null);
        }, 3000);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al enviar el mensaje. Por favor intenta nuevamente.'
      });
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
          <p className="text-gray-600 mb-4">El vehículo que buscas no existe o no está disponible.</p>
          <button
            onClick={() => router.push('/inventory')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Volver al inventario
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (mileage: number) => {
    return new Intl.NumberFormat('es-MX').format(mileage) + ' km';
  };

  const transmissionLabels = {
    'automatic': 'Automática',
    'manual': 'Manual',
    'tiptronic': 'Tiptronic'
  };

  const fuelTypeLabels = {
    'gasoline': 'Gasolina',
    'diesel': 'Diésel',
    'electric': 'Eléctrico',
    'hybrid': 'Híbrido'
  };

  const conditionLabels = {
    'new': 'Nuevo',
    'semi-new': 'Seminuevo',
    'used': 'Usado'
  };

  const handlePreviousImage = () => {
    if (!vehicle?.images || vehicle.images.length === 0) return;
    setSelectedImageIndex((prev) =>
      prev === 0 ? vehicle.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!vehicle?.images || vehicle.images.length === 0) return;
    setSelectedImageIndex((prev) =>
      prev === vehicle.images.length - 1 ? 0 : prev + 1
    );
  };

  const selectedImage = vehicle?.images && vehicle.images.length > 0
    ? vehicle.images[selectedImageIndex]
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <button
            onClick={() => router.push('/inventory')}
            className="text-blue-600 hover:text-blue-700"
          >
            ← Volver al inventario
          </button>
        </nav>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Galería de imágenes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            <div>
              {vehicle.images && vehicle.images.length > 0 && (
                <>
                  {/* Imagen principal con navegación */}
                  <div className="relative mb-4">
                    <img
                      src={selectedImage || vehicle.featuredImage || vehicle.images[0]}
                      alt={`${vehicle.title} - Imagen ${selectedImageIndex + 1}`}
                      className="w-full h-96 object-cover rounded-lg"
                    />

                    {/* Contador de imágenes */}
                    <div className="absolute top-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {selectedImageIndex + 1} de {vehicle.images.length}
                    </div>

                    {/* Flechas de navegación */}
                    {vehicle.images.length > 1 && (
                      <>
                        <button
                          onClick={handlePreviousImage}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          title="Imagen anterior"
                        >
                          ←
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                          title="Siguiente imagen"
                        >
                          →
                        </button>
                      </>
                    )}
                  </div>

                  {/* Miniaturas */}
                  <div className="grid grid-cols-4 gap-2">
                    {vehicle.images.map((imageUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={`relative w-full h-20 rounded-lg overflow-hidden transition-all ${
                          index === selectedImageIndex
                            ? 'ring-2 ring-blue-500 ring-offset-2'
                            : 'hover:opacity-75'
                        }`}
                      >
                        <img
                          src={imageUrl}
                          alt={`${vehicle.title} - Imagen ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === selectedImageIndex && (
                          <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">●</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </>
              )}
              {(!vehicle.images || vehicle.images.length === 0) && (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Sin imágenes</span>
                </div>
              )}
            </div>

            {/* Información principal */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {vehicle.title}
                  </h1>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    {vehicle.location && (
                      <span>📍 {vehicle.location}</span>
                    )}
                    {vehicle.views !== undefined && vehicle.views > 0 && (
                      <span>👁 {vehicle.views} vistas</span>
                    )}
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  vehicle.condition === 'new'
                    ? 'bg-green-100 text-green-800'
                    : vehicle.condition === 'semi-new'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {conditionLabels[vehicle.condition]}
                </span>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <span className="text-4xl font-bold text-blue-600">
                  {formatPrice(vehicle.price)}
                </span>
              </div>

              {/* Especificaciones */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Año</div>
                  <div className="font-semibold">{vehicle.year}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Kilometraje</div>
                  <div className="font-semibold">{formatMileage(vehicle.mileage)}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Transmisión</div>
                  <div className="font-semibold">{transmissionLabels[vehicle.transmission]}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Combustible</div>
                  <div className="font-semibold">{fuelTypeLabels[vehicle.fuelType]}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-600">Puertas</div>
                  <div className="font-semibold">{vehicle.doors}</div>
                </div>
                {vehicle.seats && (
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="text-sm text-gray-600">Asientos</div>
                    <div className="font-semibold">{vehicle.seats}</div>
                  </div>
                )}
              </div>

              {/* Descripción */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                <p className="text-gray-600">{vehicle.description}</p>
              </div>

              {/* Características */}
              {vehicle.features.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Características</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                        <span className="text-green-500">✓</span>
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Botón de contacto */}
              <button
                onClick={() => setShowContactForm(!showContactForm)}
                className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                {showContactForm ? 'Ocultar formulario' : '📞 Me interesa este auto'}
              </button>
            </div>
          </div>

          {/* Formulario de contacto */}
          {showContactForm && (
            <div className="border-t border-gray-200 p-8 bg-gray-50">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Contáctanos sobre este vehículo
              </h3>

              {message && (
                <div className={`mb-4 p-4 rounded-lg ${
                  message.type === 'success'
                    ? 'bg-green-50 text-green-800 border border-green-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message.text}
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prefiero contacto por
                    </label>
                    <select
                      name="preferredContact"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="email">Email</option>
                      <option value="phone">Llamada</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Hola, me interesa este vehículo. ¿Podrían darme más información?"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Enviando...' : 'Enviar mensaje'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
