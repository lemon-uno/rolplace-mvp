# Rolplace MVP v1.0 🚗

Marketplace de autos seminuevos con inventario completo, filtros avanzados y gestión de leads. Basado en las funcionalidades del plugin Motors de WordPress.

[![GitHub release](https://img.shields.io/badge/version-1.0-blue)](https://github.com/lemon-uno/rolplace-mvp)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## ✨ Características

### 🏠 Página de Inicio
- **Hero Section** con gradiente azul profesional
- **Estadísticas**: 500+ autos, 20+ marcas, 1000+ clientes satisfechos
- **Vehículos Destacados** con cards atractivos
- **Secciones de información**: "¿Por qué elegir Rolplace?"
- **Call-to-Actions** con integración de WhatsApp

### 🚗 Inventario de Autos
- **6 vehículos de muestra** (Toyota Corolla, Honda Civic, VW Jetta, Nissan Versa, Mazda 3, Hyundai Tucson)
- **Filtros avanzados**:
  - Búsqueda por texto
  - Marca y Modelo
  - Rango de Años
  - Rango de Precios
  - Transmisión (Automática/Manual/Tiptronic)
  - Tipo de Combustible
  - Condición (Nuevo/Seminuevo/Usado)
- **Paginación** (12 vehículos por página)
- **Ordenamiento** por precio, año, kilometraje

### 📄 Ficha de Vehículo
- **Galería de imágenes** con vista principal y miniaturas
- **Especificaciones completas**: Año, Kilometraje, Transmisión, Combustible, Puertas, Asientos
- **Lista de características** con checkmarks
- **Descripción detallada**
- **Ubicación** del vehículo
- **Contador de vistas**
- **Formulario de contacto** integrado

### 📧 Formulario de Contacto
- **Validación completa** de campos
- **Integración con n8n webhook** → Chatwoot
- **Envío de datos del vehículo** junto con el mensaje
- **Preferencia de contacto** (Email/Llamada/WhatsApp)
- **Feedback visual** de éxito/error

### 🎨 Diseño Profesional
- **Header** con logo ROLPLACE y navegación completa
- **Footer** con información de contacto y redes sociales
- **Diseño 100% responsive** (móvil, tablet, desktop)
- **Animaciones suaves** con Framer Motion
- **Colores profesionales** (azul corporativo)
- **Tipografía clara** y legible

## 🛠️ Tech Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16 | Framework React con App Router |
| **React** | 19 | Biblioteca UI |
| **TypeScript** | 5 | Tipado estático |
| **Tailwind CSS** | 3.4 | Estilos utility-first |
| **Framer Motion** | Latest | Animaciones |
| **Supabase** | Latest | Backend (configurado, mock data en MVP) |

## 📦 Estructura del Proyecto

```
rolplace-mvp/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Rutas principales
│   │   │   ├── page.tsx             # 🏠 Homepage
│   │   │   ├── layout.tsx           # Header + Footer
│   │   │   └── inventory/           # 🚗 Inventario
│   │   │       ├── page.tsx         # Lista de vehículos
│   │   │       └── [slug]/page.tsx  # Detalle de vehículo
│   │   └── layout.tsx               # Root layout
│   │
│   ├── features/
│   │   └── inventory/               # Feature de inventario
│   │       ├── components/          # UI Components
│   │       │   ├── VehicleCard.tsx     # Card de vehículo
│   │       │   ├── VehicleFilters.tsx  # Filtros avanzados
│   │       │   ├── VehicleDetail.tsx   # Página de detalle
│   │       │   └── InventoryList.tsx   # Grid de vehículos
│   │       ├── services/           # Lógica de negocio
│   │       │   └── inventoryService.ts # API + n8n webhook
│   │       ├── types/              # TypeScript interfaces
│   │       │   └── vehicle.types.ts    # Vehicle, Filters, etc.
│   │       └── data/               # Mock data (MVP)
│   │           └── mockVehicles.ts     # 6 vehículos de muestra
│   │
│   └── shared/
│       └── components/              # Componentes compartidos
│           ├── Header.tsx          # Navegación principal
│           └── Footer.tsx          # Pie de página
│
├── Dockerfile                       # 🐳 Deployment Docker
├── docker-compose.yml               # Desarrollo local
├── .env.local.example               # Variables de entorno
└── package.json                     # Dependencias
```

## 🚀 Quick Start

### Requisitos Previos

- Node.js 18+ 
- npm o yarn

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local`:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# n8n Webhook (opcional para MVP)
N8N_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rolplace-contact

# Supabase (opcional para MVP)
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-key
```

**Nota**: El MVP funciona completamente con **mock data** sin necesidad de configurar Supabase o n8n.

### 3. Ejecutar Servidor de Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

### 4. Build de Producción

```bash
npm run build
npm start
```

## 🐳 Docker + Coolify

### Opción A: Docker Compose (Local)

```bash
# Crear archivo .env
cat > .env << EOF
NEXT_PUBLIC_APP_URL=http://localhost:3000
N8N_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rolplace-contact
EOF

# Ejecutar
docker-compose up -d
```

### Opción B: Deploy en Coolify

1. **Conectar repositorio** en Coolify
2. **Configurar**:
   - Build Type: Dockerfile
   - Dockerfile Path: `./Dockerfile`
   - Port: 3000
3. **Variables de entorno**:
   - `NEXT_PUBLIC_APP_URL=https://your-domain.com`
   - `N8N_CONTACT_WEBHOOK_URL=your-webhook-url`

## 🔗 Integración con n8n + Chatwoot

El formulario de contacto envía datos a un webhook de n8n:

```typescript
{
  "vehicleId": "string",
  "name": "string",
  "email": "string",
  "phone": "string",
  "message": "string",
  "preferredContact": "email" | "phone" | "whatsapp",
  "vehicle": {
    "id": "string",
    "title": "string",
    "make": "string",
    "model": "string",
    "year": number,
    "price": number,
    "url": "string"
  },
  "timestamp": "ISO string",
  "source": "rolplace-web"
}
```

## 🎨 Personalización

### Agregar Más Vehículos

Edita `src/features/inventory/data/mockVehicles.ts`:

```typescript
export const mockVehicles: Vehicle[] = [
  {
    id: 'unique-id',
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
    // ... más campos
  }
];
```

### Cambiar Colores

Edita las clases de Tailwind en los componentes:

```tsx
// Ejemplo: cambiar azul por verde
className="bg-green-600 text-white"
```

## 📊 Métricas del Proyecto

- **121 archivos** en el repositorio
- **19,691 líneas de código**
- **6 componentes** principales
- **9 páginas** en total
- **Tiempo de desarrollo**: ~2 horas

## 🗺️ Roadmap (Post-MVP)

- [ ] **Autenticación** (NextAuth + Supabase)
- [ ] **Panel de administración** para inventario
- [ ] **Base de datos real** con Supabase
- [ ] **Comparador de vehículos**
- [ ] **Sistema de favoritos**
- [ ] **Alertas de nuevos vehículos**
- [ ] **SEO avanzado** (sitemap, robots.txt, meta tags)
- [ ] **Blog** de contenido automotriz
- [ ] **Integración con APIs** de financieras
- [ ] **Chat en vivo** integrado

## 📄 Licencia

MIT License - Copyright © 2026 Lemon Uno

## 👥 Créditos

Desarrollado con **SaaS Factory V4** | Agent-First Software Factory

---

**🌐 Demo**: http://localhost:3000 | **📦 GitHub**: https://github.com/lemon-uno/rolplace-mvp
