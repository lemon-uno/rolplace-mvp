import { Vehicle, VehicleFilters, VehicleListResponse } from '../types/vehicle.types';
import { mockVehicles } from '../data/mockVehicles';

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
    // Simular delay de API
    await new Promise(resolve => setTimeout(resolve, 300));

    let filtered = [...mockVehicles];

    // Filtrar por estado (solo disponibles por defecto)
    filtered = filtered.filter(v => v.status === 'available');

    // Filtrar por marca
    if (filters.make) {
      filtered = filtered.filter(v =>
        v.make.toLowerCase() === filters.make?.toLowerCase()
      );
    }

    // Filtrar por modelo
    if (filters.model) {
      filtered = filtered.filter(v =>
        v.model.toLowerCase() === filters.model?.toLowerCase()
      );
    }

    // Filtrar por año
    if (filters.year?.min) {
      filtered = filtered.filter(v => v.year >= filters.year!.min!);
    }
    if (filters.year?.max) {
      filtered = filtered.filter(v => v.year <= filters.year!.max!);
    }

    // Filtrar por precio
    if (filters.price?.min) {
      filtered = filtered.filter(v => v.price >= filters.price!.min!);
    }
    if (filters.price?.max) {
      filtered = filtered.filter(v => v.price <= filters.price!.max!);
    }

    // Filtrar por transmisión
    if (filters.transmission) {
      filtered = filtered.filter(v => v.transmission === filters.transmission);
    }

    // Filtrar por tipo de combustible
    if (filters.fuelType) {
      filtered = filtered.filter(v => v.fuelType === filters.fuelType);
    }

    // Filtrar por condición
    if (filters.condition) {
      filtered = filtered.filter(v => v.condition === filters.condition);
    }

    // Búsqueda general
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(v =>
        v.title.toLowerCase().includes(searchTerm) ||
        v.make.toLowerCase().includes(searchTerm) ||
        v.model.toLowerCase().includes(searchTerm) ||
        v.description.toLowerCase().includes(searchTerm) ||
        v.features.some(f => f.toLowerCase().includes(searchTerm))
      );
    }

    // Ordenar por fecha de publicación (más recientes primero)
    filtered.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

    // Paginación
    const total = filtered.length;
    const startIndex = (page - 1) * pageSize;
    const paginated = filtered.slice(startIndex, startIndex + pageSize);

    return {
      vehicles: paginated,
      total,
      page,
      pageSize
    };
  }

  /**
   * Obtiene un vehículo por slug
   */
  static async getVehicleBySlug(slug: string): Promise<Vehicle | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    const vehicle = mockVehicles.find(v => v.slug === slug);

    if (vehicle) {
      // Incrementar vistas (simulado)
      vehicle.views = (vehicle.views || 0) + 1;
    }

    return vehicle || null;
  }

  /**
   * Obtiene un vehículo por ID
   */
  static async getVehicleById(id: string): Promise<Vehicle | null> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return mockVehicles.find(v => v.id === id) || null;
  }

  /**
   * Obtiene vehículos destacados
   */
  static async getFeaturedVehicles(limit: number = 6): Promise<Vehicle[]> {
    await new Promise(resolve => setTimeout(resolve, 200));

    return mockVehicles
      .filter(v => v.featured && v.status === 'available')
      .slice(0, limit);
  }

  /**
   * Obtiene marcas únicas
   */
  static async getMakes(): Promise<string[]> {
    const makes = Array.from(new Set(mockVehicles.map(v => v.make)));
    return makes.sort();
  }

  /**
   * Obtiene modelos por marca
   */
  static async getModelsByMake(make: string): Promise<string[]> {
    const models = Array.from(new Set(
      mockVehicles
        .filter(v => v.make.toLowerCase() === make.toLowerCase())
        .map(v => v.model)
    ));
    return models.sort();
  }

  /**
   * Obtiene rangos de precios
   */
  static async getPriceRanges(): Promise<{ min: number; max: number }> {
    const prices = mockVehicles.map(v => v.price);
    return {
      min: Math.floor(Math.min(...prices) / 10000) * 10000,
      max: Math.ceil(Math.max(...prices) / 10000) * 10000
    };
  }

  /**
   * Obtiene rangos de años
   */
  static async getYearRanges(): Promise<{ min: number; max: number }> {
    const years = mockVehicles.map(v => v.year);
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
          url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/inventory/${vehicle.slug}`
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
