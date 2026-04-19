import { Vehicle, VehicleFilters, VehicleListResponse } from '../types/vehicle.types';
import { getCars, getCarById } from '@/actions/cars';
import type { Car } from '@/types/database';

/**
 * Convierte un Car de la base de datos a Vehicle de la aplicación
 */
function carToVehicle(car: Car): Vehicle {
  const featureMap: Record<string, string> = {
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
    power_driver_seat: 'Asiento piloto ajustes eléctricos',
    light_sensor: 'Sensor de luces',
    parking_sensor: 'Sensor de estacionamiento',
    power_windows: 'Cristales eléctricos',
    remote_trunk_release: 'Apertura remota de cajuela',
    power_seats: 'Asientos ajustes eléctricos',
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
  }

  const features: string[] = []
  for (const [key, label] of Object.entries(featureMap)) {
    if ((car as any)[key] === true) {
      features.push(label)
    }
  }

  return {
    id: car.id,
    title: car.title,
    slug: car.id,
    make: car.make || 'Marca',
    model: car.model || 'Modelo',
    year: car.year,
    version: car.version || car.model || '',
    color: car.exterior_color || 'Blanco',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: car.mileage ? parseInt(car.mileage.replace(/[^\d]/g, '')) || 0 : 0,
    doors: 4,
    seats: 5,
    price: Number(car.price),
    description: car.description || 'Sin descripción',
    features,
    images: car.images || [],
    featuredImage: car.images && car.images.length > 0 ? car.images[0] : undefined,
    condition: 'used',
    status: car.status as any,
    location: 'México',
    createdAt: new Date(car.created_at),
    updatedAt: new Date(car.updated_at),
    publishedAt: new Date(car.created_at),
    views: 0,
    featured: car.featured || false,
  }
}

/**
 * Servicio de inventario de vehículos
 * Maneja filtrado, búsqueda y paginación de vehículos
 */

export class InventoryService {
  /**
   * Obtiene todos los vehículos con filtros opcionales
   */
  static async getVehicles(
    filters: VehicleFilters = {},
    page: number = 1,
    pageSize: number = 12
  ): Promise<VehicleListResponse> {
    // Obtener todos los autos de Supabase
    const cars = await getCars();

    // Convertir Cars a Vehicles
    let vehicles = cars.map(carToVehicle);

    // Filtrar por estado (solo disponibles por defecto)
    vehicles = vehicles.filter(v => v.status === 'available');

    // Filtrar por marca
    if (filters.make) {
      vehicles = vehicles.filter(v =>
        v.make.toLowerCase() === filters.make?.toLowerCase()
      );
    }

    // Filtrar por modelo
    if (filters.model) {
      vehicles = vehicles.filter(v =>
        v.model.toLowerCase() === filters.model?.toLowerCase()
      );
    }

    // Filtrar por año
    if (filters.year?.min) {
      vehicles = vehicles.filter(v => v.year >= filters.year!.min!);
    }
    if (filters.year?.max) {
      vehicles = vehicles.filter(v => v.year <= filters.year!.max!);
    }

    // Filtrar por precio
    if (filters.price?.min) {
      vehicles = vehicles.filter(v => v.price >= filters.price!.min!);
    }
    if (filters.price?.max) {
      vehicles = vehicles.filter(v => v.price <= filters.price!.max!);
    }

    // Búsqueda general (mejorada)
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      vehicles = vehicles.filter(v =>
        v.title.toLowerCase().includes(searchTerm) ||
        v.make.toLowerCase().includes(searchTerm) ||
        v.model.toLowerCase().includes(searchTerm) ||
        v.description.toLowerCase().includes(searchTerm)
      );
    }

    // Ordenar por fecha de publicación (más recientes primero)
    vehicles.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Paginación
    const total = vehicles.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = vehicles.slice(startIndex, startIndex + pageSize);

    return {
      vehicles: paginated,
      total,
      page,
      pageSize
    };
  }

  /**
   * Obtiene un vehículo por slug (ahora usa ID)
   */
  static async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    const car = await getCarById(slug);

    if (!car) {
      return null;
    }

    return carToVehicle(car);
  }

  /**
   * Obtiene un vehículo por ID
   */
  static async getVehicleById(id: string): Promise<Vehicle | null> {
    const car = await getCarById(id);
    return car ? carToVehicle(car) : null;
  }

  /**
   * Obtiene vehículos destacados
   */
  static async getFeaturedVehicles(limit: number = 6): Promise<Vehicle[]> {
    const cars = await getCars();
    return cars
      .filter(car => car.featured && car.status === 'available')
      .slice(0, limit)
      .map(carToVehicle);
  }

  /**
   * Obtiene marcas únicas
   */
  static async getMakes(): Promise<string[]> {
    const cars = await getCars();
    const makes = Array.from(new Set(
      cars
        .map(car => car.make)
        .filter((make): make is string => make !== null)
    ));
    return makes.sort();
  }

  /**
   * Obtiene modelos por marca
   */
  static async getModelsByMake(make: string): Promise<string[]> {
    const cars = await getCars();
    const models = Array.from(new Set(
      cars
        .filter(car => car.make?.toLowerCase() === make.toLowerCase())
        .map(car => car.model)
        .filter((model): model is string => model !== null)
    ));
    return models.sort();
  }

  /**
   * Obtiene rangos de precios
   */
  static async getPriceRanges(): Promise<{ min: number; max: number }> {
    const cars = await getCars();
    const prices = cars.map(car => Number(car.price));
    if (prices.length === 0) {
      return { min: 100000, max: 500000 };
    }
    return {
      min: Math.floor(Math.min(...prices) / 10000) * 10000,
      max: Math.ceil(Math.max(...prices) / 10000) * 10000
    };
  }

  /**
   * Obtiene rangos de años
   */
  static async getYearRanges(): Promise<{ min: number; max: number }> {
    const cars = await getCars();
    const years = cars.map(car => car.year);
    if (years.length === 0) {
      return { min: 2015, max: new Date().getFullYear() };
    }
    return {
      min: Math.min(...years),
      max: Math.max(...years)
    };
  }

  /**
   * Envía formulario de contacto a n8n webhook
   */
  static async sendContactForm(data: {
    vehicleId: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    preferredContact?: 'email' | 'phone' | 'whatsapp';
  }): Promise<{ success: boolean; message: string }> {
    try {
      const vehicle = await this.getVehicleById(data.vehicleId);

      if (!vehicle) {
        return { success: false, message: 'Vehículo no encontrado' };
      }

      // Preparar payload para n8n
      const webhookUrl = process.env.N8N_CONTACT_WEBHOOK_URL;

      if (!webhookUrl) {
        console.warn('N8N_CONTACT_WEBHOOK_URL no configurado, usando modo demo');
        // Modo demo: simular envío exitoso
        console.log('Datos de contacto (demo):', {
          ...data,
          vehicle: vehicle.title,
          vehiclePrice: vehicle.price,
          timestamp: new Date().toISOString()
        });
        return { success: true, message: 'Mensaje enviado correctamente' };
      }

      const payload = {
        ...data,
        vehicle: {
          id: vehicle.id,
          title: vehicle.title,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          price: vehicle.price,
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inventory/${vehicle.id}`
        },
        timestamp: new Date().toISOString(),
        source: 'rolplace-web'
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Error del webhook: ${response.statusText}`);
      }

      return { success: true, message: 'Mensaje enviado correctamente' };
    } catch (error) {
      console.error('Error enviando formulario de contacto:', error);
      return {
        success: false,
        message: 'Error al enviar el mensaje. Por favor intenta nuevamente.'
      };
    }
  }
}
