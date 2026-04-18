/**
 * Tipos de datos para vehículos de Rolplace
 * Basado en el schema del plugin Motors de WordPress
 */

export type VehicleCondition = 'new' | 'used' | 'semi-new';

export type VehicleTransmission = 'manual' | 'automatic' | 'tiptronic';

export type VehicleFuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid';

export type VehicleStatus = 'available' | 'sold' | 'reserved' | 'pending';

export interface VehicleImages {
  id: string;
  url: string;
  alt?: string;
  order: number;
}

export interface Vehicle {
  id: string;
  title: string;
  slug: string;

  // Información básica
  make: string;        // Marca (Toyota, Honda, etc.)
  model: string;       // Modelo (Corolla, Civic, etc.)
  year: number;        // Año
  version?: string;    // Versión (LE, XLE, etc.)
  color: string;

  // Especificaciones
  transmission: VehicleTransmission;
  fuelType: VehicleFuelType;
  mileage: number;     // Kilometraje
  doors: number;       // Número de puertas
  seats?: number;      // Número de asientos

  // Precios
  price: number;       // Precio en MXN
  priceUSD?: number;   // Precio en USD (opcional)

  // Descripción
  description: string;
  features: string[];  // Características adicionales

  // Imágenes - Array de URLs (string[])
  images: string[];
  featuredImage?: string; // URL de la imagen principal (si no se usa, se toma images[0])

  // Estado y ubicación
  condition: VehicleCondition;
  status: VehicleStatus;
  location?: string;   // Ciudad/Estado
  vin?: string;        // Número de serie

  // Metadata
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date;
  views?: number;      // Vistas del vehículo
  featured?: boolean;  // Si es destacado
}

export interface VehicleFilters {
  make?: string;
  model?: string;
  year?: { min?: number; max?: number };
  price?: { min?: number; max?: number };
  transmission?: VehicleTransmission;
  fuelType?: VehicleFuelType;
  condition?: VehicleCondition;
  search?: string;     // Búsqueda general
}

export interface VehicleListResponse {
  vehicles: Vehicle[];
  total: number;
  page: number;
  pageSize: number;
}

export interface ContactForm {
  vehicleId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  preferredContact?: 'email' | 'phone' | 'whatsapp';
}
