import { Vehicle } from '../types/vehicle.types';

/**
 * Datos de prueba de vehículos para Rolplace MVP
 * Basado en inventario típico de comercializadora de autos en México
 */

export const mockVehicles: Vehicle[] = [
  {
    id: '1',
    title: 'Toyota Corolla LE 2021',
    slug: 'toyota-corolla-le-2021',
    make: 'Toyota',
    model: 'Corolla',
    year: 2021,
    version: 'LE',
    color: 'Blanco Perla',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: 35000,
    doors: 4,
    seats: 5,
    price: 285000,
    description: 'Toyota Corolla LE 2021 en excelentes condiciones. Un solo dueño, mantenimiento completo en agencia. Sin accidentes, facturas originales. Perfecto para ciudad y carretera.',
    features: [
      'Cámara de reversa',
      'Bluetooth',
      'Control de crucero',
      'Rines de lujo',
      'Sensores de estacionamiento',
      'Aire acondicionado automático',
      'Faros de LED',
      'Asientos de tela'
    ],
    images: [
      'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
      'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1623869675781-80aa31012a5a?w=800',
    condition: 'semi-new',
    status: 'available',
    location: 'CDMX',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    publishedAt: new Date('2024-01-15'),
    views: 245,
    featured: true,
    vehicleType: 'sedan',
  },
  {
    id: '2',
    title: 'Honda Civic Touring 2022',
    slug: 'honda-civic-touring-2022',
    make: 'Honda',
    model: 'Civic',
    year: 2022,
    version: 'Touring',
    color: 'Rojo Brillante',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: 28000,
    doors: 4,
    seats: 5,
    price: 345000,
    description: 'Honda Civic Touring 2022 con paquete completo. Sistema de sonido premium, navegador integrado, asientos en piel. Mantenimiento al día, historia de servicio completa.',
    features: [
      'Pantalla táctil 9"',
      'Navegador GPS',
      'Apple CarPlay / Android Auto',
      'Asientos en piel',
      'Techo panorámico',
      'Sistema de sonido Bose',
      'Cámara 360°',
      'Asientos con calefacción'
    ],
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    condition: 'semi-new',
    status: 'available',
    location: 'Guadalajara',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    publishedAt: new Date('2024-01-20'),
    views: 189,
    featured: true,
    vehicleType: 'suv',
  },
  {
    id: '3',
    title: 'Volkswagen Jetta GLI 2020',
    slug: 'volkswagen-jetta-gli-2020',
    make: 'Volkswagen',
    model: 'Jetta',
    year: 2020,
    version: 'GLI',
    color: 'Gris Platino',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: 45000,
    doors: 4,
    seats: 5,
    price: 298000,
    description: 'Volkswagen Jetta GLI 2020, versión deportiva. Motor 2.0L turbo, transmisión DSG. Ideal para los amantes del manejo deportivo con comodidad.',
    features: [
      'Motor 2.0L Turbo',
      'Transmisión DSG de 6 velocidades',
      'Asientos deportivos',
      'Pedaleras de aluminio',
      'Sistema de escape deportivo',
      'Pantalla digital',
      'Faros自适应'
    ],
    images: [
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
    condition: 'semi-new',
    status: 'available',
    location: 'Monterrey',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    publishedAt: new Date('2024-02-01'),
    views: 156,
    featured: false,
    vehicleType: 'sedan',
  },
  {
    id: '4',
    title: 'Nissan Versa Advance 2023',
    slug: 'nissan-versa-advance-2023',
    make: 'Nissan',
    model: 'Versa',
    year: 2023,
    version: 'Advance',
    color: 'Azul Noche',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: 15000,
    doors: 4,
    seats: 5,
    price: 268000,
    description: 'Nissan Versa Advance 2023, prácticamente nuevo. Un solo dueño, todas las facturas. Equipo completo con tecnología de seguridad Nissan Safety Shield 360.',
    features: [
      'Frenado autónomo de emergencia',
      'Alerta de punto ciego',
      'Control de crucero adaptativo',
      'Asistencia de permanencia en carril',
      'Cámara de 360°',
      'Alerta de tráfico cruzado trasero',
      'Faro自动高低调节'
    ],
    images: [
      'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800',
    condition: 'semi-new',
    status: 'available',
    location: 'CDMX',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2024-02-15'),
    publishedAt: new Date('2024-02-15'),
    views: 312,
    featured: true,
    vehicleType: 'pickup',
  },
  {
    id: '5',
    title: 'Mazda 3 Grand Touring 2021',
    slug: 'mazda-3-grand-touring-2021',
    make: 'Mazda',
    model: 'Mazda 3',
    year: 2021,
    version: 'Grand Touring',
    color: 'Negro Mica',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: 32000,
    doors: 4,
    seats: 5,
    price: 315000,
    description: 'Mazda 3 Grand Touring 2021 en color negro elegante. Interior en piel de alta calidad, sistema Bose premium. Tecnología SkyActiv de Mazda para mejor rendimiento.',
    features: [
      'Asientos en piel',
      'Sistema de sonido Bose',
      'Pantalla TFT de 7"',
      'Apple CarPlay / Android Auto',
      'Navegador',
      'Cámara de reversa',
      'Sensores delanteros y traseros',
      'Rines de 18"'
    ],
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=800',
    condition: 'semi-new',
    status: 'available',
    location: 'Puebla',
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-20'),
    publishedAt: new Date('2024-02-20'),
    views: 198,
    featured: false,
    vehicleType: 'hatchback',
  },
  {
    id: '6',
    title: 'Hyundai Tucson Limited 2022',
    slug: 'hyundai-tucson-limited-2022',
    make: 'Hyundai',
    model: 'Tucson',
    year: 2022,
    version: 'Limited',
    color: 'Plata',
    transmission: 'automatic',
    fuelType: 'gasoline',
    mileage: 22000,
    doors: 4,
    seats: 5,
    price: 425000,
    description: 'Hyundai Tucson Limited 2022, SUV compacto con tecnología de vanguardia. Tracción en las cuatro ruedas, perfecta para cualquier terreno.',
    features: [
      'Tracción 4WD',
      'Asientos en piel con ventilación',
      'Pantalla de 10.25"',
      'Sistema de sonido premium',
      'Techo panorámico',
      'Puerta trasera eléctrica',
      'Cámara 360°',
      'Sistema HTRAC AWD'
    ],
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800'
    ],
    featuredImage: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
    condition: 'semi-new',
    status: 'available',
    location: 'Querétaro',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    publishedAt: new Date('2024-03-01'),
    views: 267,
    featured: true,
    vehicleType: 'suv',
  }
];

// Helper functions
export const getVehicleBySlug = (slug: string): Vehicle | undefined => {
  return mockVehicles.find(v => v.slug === slug);
};

export const getVehicleById = (id: string): Vehicle | undefined => {
  return mockVehicles.find(v => v.id === id);
};

export const getFeaturedVehicles = (): Vehicle[] => {
  return mockVehicles.filter(v => v.featured && v.status === 'available');
};

export const getAvailableVehicles = (): Vehicle[] => {
  return mockVehicles.filter(v => v.status === 'available');
};

export const getMakes = (): string[] => {
  return Array.from(new Set(mockVehicles.map(v => v.make))).sort();
};

export const getModelsByMake = (make: string): string[] => {
  return Array.from(new Set(
    mockVehicles
      .filter(v => v.make === make)
      .map(v => v.model)
  )).sort();
};
