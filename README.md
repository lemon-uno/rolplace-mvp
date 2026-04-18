# Rolplace MVP v1.1 🚗

Marketplace de autos seminuevos con **autenticación completa**, **panel de inventario** y **backend vinculado con Supabase**. Basado en las funcionalidades del plugin Motors de WordPress.

[![GitHub release](https://img.shields.io/badge/version-1.1-blue)](https://github.com/lemon-uno/rolplace-mvp)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)](https://supabase.com/)

## ✨ Características

### 🔐 Sistema de Autenticación (NUEVO v1.1)
- **Google OAuth (funcionando)** - Registro/login con Google en un clic
- **Email/Password** - Autenticación tradicional con recuperación de contraseña
- **Protección de rutas** - Dashboard y panel administrativo protegidos
- **Gestión de perfiles** - Perfiles de usuario automáticos con datos de Google
- **Verificación de email** - Flujo completo de confirmación
- **Password reset** - Recuperación de contraseña funcional
- **Session management** - Sesiones SSR con Supabase

### 📦 Panel de Inventario (NUEVO v1.1)
- **Dashboard protegido** - Área privada para usuarios autenticados
- **CRUD completo de autos** - Crear, leer, actualizar y eliminar vehículos
- **Formulario validado** - Campos requeridos y validación de tipos
- **Gestión de imágenes** - Soporte para URLs de imágenes
- **Estados de vehículos** - Disponible, Vendido, Reservado
- **Autos destacados** - Opción de destacar en página principal
- **Vista de inventario personal** - Cada usuario ve solo sus autos
- **Interfaz moderna** - Diseño oscuro con gradientes cyan-to-blue

### 🗄️ Backend con Supabase (NUEVO v1.1)
- **Base de datos real** - Conexión completa con Supabase PostgreSQL
- **Row Level Security (RLS)** - Políticas de seguridad a nivel de fila
- **Tablas creadas**:
  - `public.profiles` - Perfiles de usuario con trigger automático
  - `public.cars` - Inventario de autos con índices optimizados
- **Server Actions** - Mutaciones de datos type-safe
- **Real-time updates** - Invalidación de caché automática
- **Type-safe queries** - Interfaces TypeScript generadas

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
- **Header inteligente** con botón Sign In/Dashboard dinámico
- **Diseño oscuro moderno** (#0a0a0a) inspirado en Rolplace.com
- **Gradientes cyan-to-blue** en botones y acentos
- **Glassmorphism effects** en cards y contenedores
- **100% responsive** (móvil, tablet, desktop)
- **Animaciones suaves** con Framer Motion
- **Navbar sticky** con backdrop-blur
- **Bordes con hover effects** micro-interacciones

### 🔒 Seguridad (v1.1)
- **Row Level Security (RLS)** en Supabase
- **Usuarios solo ven sus propios autos**
- **Políticas de seguridad** a nivel de base de datos
- **Sessions seguras** con httpOnly cookies
- **OAuth 2.0** flow para Google
- **Type validation** con Zod schemas

## 🛠️ Tech Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16 | Framework React con App Router + SSR |
| **React** | 19 | Biblioteca UI |
| **TypeScript** | 5 | Tipado estático completo |
| **Tailwind CSS** | 3.4 | Estilos utility-first |
| **Framer Motion** | Latest | Animaciones suaves |
| **Supabase** | Latest | **Backend real** (Auth + Database + RLS) |
| **Supabase SSR** | Latest | Server-side rendering con cookies |
| **Zod** | Latest | Validación de datos |
| **React Hooks** | Latest | useAuth para estado global |

## 📦 Estructura del Proyecto

```
rolplace-mvp/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Rutas principales
│   │   │   ├── page.tsx             # 🏠 Homepage (con nuevo diseño)
│   │   │   ├── layout.tsx           # Root layout
│   │   │   ├── dashboard/           # 📊 Dashboard (v1.1)
│   │   │   │   ├── cars/            # 🚗 Panel de inventario
│   │   │   │   │   ├── page.tsx     # Lista de mis autos
│   │   │   │   │   └── new/         # Formulario agregar auto
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx         # Dashboard home
│   │   │   └── inventory/           # 🚗 Inventario público
│   │   │       ├── page.tsx         # Lista de vehículos
│   │   │       └── [slug]/page.tsx  # Detalle de vehículo
│   │   ├── (auth)/                  # Rutas de autenticación (v1.1)
│   │   │   ├── login/               # 🔐 Login
│   │   │   ├── signup/              # 📝 Registro
│   │   │   ├── callback/            # OAuth callback
│   │   │   ├── check-email/          # Verificación email
│   │   │   ├── forgot-password/      # Recuperar password
│   │   │   └── update-password/      # Actualizar password
│   │   └── layout.tsx               # Root layout
│   │
│   ├── features/
│   │   ├── auth/                    # 🔐 Feature de autenticación (v1.1)
│   │   │   └── components/
│   │   │       ├── LoginForm.tsx       # Login form
│   │   │       ├── SignupForm.tsx      # Signup form
│   │   │       ├── GoogleSignInButton.tsx # Google OAuth
│   │   │       ├── AuthDivider.tsx     # UI component
│   │   │       ├── ForgotPasswordForm.tsx
│   │   │       └── UpdatePasswordForm.tsx
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
│   ├── actions/                     # ⚡ Server Actions (v1.1)
│   │   ├── auth.ts                  # Auth server actions
│   │   └── cars.ts                  # Cars CRUD operations
│   │
│   ├── hooks/                       # 🪝 Custom Hooks (v1.1)
│   │   └── useAuth.ts               # Auth global state hook
│   │
│   ├── lib/
│   │   └── supabase/                # 🗄️ Supabase client (v1.1)
│   │       ├── client.ts            # Browser client
│   │       ├── server.ts            # Server client
│   │       └── proxy.ts             # SSR middleware
│   │
│   ├── types/                       # 📋 TypeScript types (v1.1)
│   │   └── database.ts              # DB type definitions
│   │
│   └── shared/
│       └── components/              # Componentes compartidos
│           ├── Header.tsx          # Navegación principal
│           ├── Footer.tsx          # Pie de página
│           └── Navbar.tsx          # Navbar con auth state (v1.1)
│
├── proxy.ts                        # 🔄 Next.js middleware (v1.1)
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
# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Supabase (REQUERIDO para v1.1)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# n8n Webhook (opcional para contact form)
N8N_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rolplace-contact
```

**Importante**: La **v1.1 requiere Supabase configurado** para:
- ✅ Autenticación de usuarios
- ✅ Panel de inventario
- ✅ Base de datos de autos
- ✅ Google OAuth

Para configurar Supabase:
1. Crea un proyecto en https://supabase.com
2. Copia la URL y Anon Key del proyecto
3. Habilita Google OAuth en Authentication > Providers > Google

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

## 🎨 Uso del Panel de Inventario

### 1. Iniciar Sesión

1. Ve a `/login` 
2. Usa **"Continuar con Google"** para registro/login rápido
3. O usa email/password tradicional

### 2. Dashboard Principal

Una vez autenticado, accede a `/dashboard` para ver:
- **Resumen** de tu inventario
- **Accesos rápidos** a gestión de autos
- **Estadísticas** básicas

### 3. Agregar Nuevo Auto

1. Ve a `/dashboard/cars/new`
2. Completa el formulario:
   - **Título**: "Toyota Corolla LE 2021"
   - **Precio**: 285000
   - **Marca/Modelo**: Toyota/Corolla
   - **Año**: 2021
   - **Kilometraje**: "35,000 km"
   - **URL de imagen**: https://ejemplo.com/auto.jpg
   - **Descripción**: Detalles del vehículo
   - **Destacar**: Marca para mostrar en homepage
3. Click "Agregar Auto"

### 4. Gestión de Autos

En `/dashboard/cars` puedes:
- **Ver** todos tus autos
- **Editar** información existente
- **Eliminar** autos vendidos
- **Ver estado**: Disponible/Vendido/Reservado

## 🎨 Personalización

### Agregar Más Vehículos

**Opción A**: Usar el Panel de Inventario (recomendado)
- Ve a `/dashboard/cars/new`
- Llena el formulario

**Opción B**: Directamente en Supabase
- Ve a tu dashboard de Supabase
- Edita la tabla `cars`
- Inserta nuevos registros

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

## 📊 Métricas del Proyecto v1.1

- **147 archivos** en el repositorio (+26 archivos)
- **23,450+ líneas de código** (+3,759 líneas)
- **12 componentes** principales (+6 componentes)
- **15 páginas** en total (+6 páginas)
- **Tablas de base de datos**: 2 (profiles, cars)
- **Server Actions**: 8 (auth + cars)
- **Autenticación**: ✅ Google OAuth funcional
- **Backend**: ✅ Supabase PostgreSQL con RLS
- **Tiempo de desarrollo v1.1**: ~4 horas

## 🗺️ Roadmap

### ✅ v1.1 - Completado (Abril 2026)
- [x] **Autenticación completa** (Google OAuth + Email/Password)
- [x] **Panel de administración** para inventario de autos
- [x] **Base de datos real** con Supabase + RLS
- [x] **CRUD de vehículos** (Create, Read, Update, Delete)
- [x] **Perfiles de usuario** con datos de Google
- [x] **Password reset** y verificación de email
- [x] **Diseño moderno** inspirado en Rolplace.com
- [x] **Server Actions** type-safe

### 🚀 Próximas Versiones

- [ ] **Comparador de vehículos** (v1.2)
- [ ] **Sistema de favoritos** (v1.2)
- [ ] **Alertas de nuevos vehículos** (v1.3)
- [ ] **SEO avanzado** (sitemap, robots.txt, meta tags) (v1.3)
- [ ] **Blog** de contenido automotriz (v2.0)
- [ ] **Integración con APIs** de financieras (v2.0)
- [ ] **Chat en vivo** integrado (v2.0)
- [ ] **Panel de analytics** (v2.0)
- [ ] **Exportación de inventario** a MercadoLibre/Facebook (v2.1)

## 📄 Licencia

MIT License - Copyright © 2026 Lemon Uno

## 👥 Créditos

Desarrollado con **SaaS Factory V4** | Agent-First Software Factory

**Versión 1.1** - Abril 2026  
**Autenticación**: ✅ Google OAuth Funcionando  
**Backend**: ✅ Supabase PostgreSQL  
**Inventario**: ✅ Panel Administrativo  

---

**🌐 Demo en Vivo**: https://pr-1-kappa.vercel.app  
**📦 GitHub**: https://github.com/lemon-uno/rolplace-mvp  
**🚀 Versión**: v1.1.0  
**📅 Última actualización**: Abril 2026
