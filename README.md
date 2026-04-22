# Rolplace MVP v1.3 🚗

Marketplace de autos seminuevos con **autenticación completa**, **panel de inventario**, **sistema de imágenes moderno**, **emails transaccionales**, **formulario Toma de Auto**, **calculadora de financiamiento** y **backend vinculado con Supabase**.

[![GitHub release](https://img.shields.io/badge/version-1.3-blue)](https://github.com/lemon-uno/rolplace-mvp)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Integrated-green)](https://supabase.com/)

## ✨ Características

### 🔐 Sistema de Autenticación (v1.1)
- **Google OAuth** - Registro/login con Google en un clic
- **Email/Password** - Autenticación tradicional con recuperación de contraseña
- **Protección de rutas** - Dashboard y panel administrativo protegidos
- **Gestión de perfiles** - Perfiles de usuario automáticos con datos de Google
- **Verificación de email** - Flujo completo de confirmación
- **Password reset** - Recuperación de contraseña funcional
- **Session management** - Sesiones SSR con Supabase

### 📦 Panel de Inventario (v1.1)
- **Dashboard protegido** - Área privada para usuarios autenticados
- **CRUD completo de autos** - Crear, leer, actualizar y eliminar vehículos
- **Formulario validado** - Campos requeridos y validación de tipos
- **Gestión de imágenes** - Upload Drag & Drop con Supabase Storage
- **Estados de vehículos** - Disponible, Vendido, Reservado
- **Autos destacados** - Opción de destacar en página principal
- **Vista de inventario personal** - Cada usuario ve solo sus autos
- **Interfaz moderna** - Diseño oscuro con gradientes cyan-to-blue

### 📸 Sistema de Imágenes (v1.2)
- **Upload Drag & Drop** - Arrastra o selecciona múltiples archivos (hasta 20 imágenes)
- **Supabase Storage** - Bucket público con políticas RLS configuradas
- **Reordenamiento** - Drag & drop para reordenar imágenes
- **Validaciones** - Máx. 10MB por imagen, formats: JPEG/PNG/WebP/GIF
- **Galería interactiva** - Navegación con flechas, click en miniaturas, contador de posición
- **Lightbox zoom** - Vista ampliada de imágenes con navegación por teclado

### 📧 Sistema de Emails Transaccionales (v1.3)
- **Resend + React Email** - Emails profesionales con templates HTML
- **Welcome Email** - Correo de bienvenida automático al registrarse
- **Toma de Auto Email** - Notificación al publisher cuando un buyer solicita trade-in
- **Batch sending** - Envío masivo de correos
- **Unsubscribe management** - Gestión de desuscripción con página dedicada

### 🔄 Toma de Auto / Trade-In (v1.3)
- **Wizard de 3 pasos** - Formulario paso a paso para solicitar evaluación de auto
- **Datos del vehículo** - Marca, modelo, año, kilometraje, condición, transmisión
- **Subida de fotos** - Hasta 5 fotos del vehículo a evaluar
- **Datos de contacto** - Nombre, email, teléfono del interesado
- **Modal integrado** - Se abre desde la ficha de cada vehículo
- **Notificación por email** - El publisher recibe los datos del trade-in

### 💰 Calculadora de Financiamiento (v1.3)
- **Configuración por publisher** - Tasa de interés, plazo y enganche por defecto en Settings
- **Calculadora interactiva** - Se muestra en la ficha de cada vehículo
- **Cálculo en tiempo real** - Pago mensual, enganche, total a pagar, intereses
- **Valores editables** - El buyer puede ajustar los valores desde la ficha
- **Settings con tabs** - Panel de configuración con tabs Perfil y Calculadora

### 🚗 Inventario de Autos
- **Datos dinámicos** - Conectado a Supabase, muestra autos reales
- **Búsqueda inteligente** - Encuentra por marca, modelo, título o descripción
- **Filtros avanzados con sliders** (v1.3):
  - Búsqueda por texto
  - Marca y Modelo
  - **Año** - Slider de rango 2000–2026
  - **Precio** - Slider de rango $0–$3M MXN
  - **Kilometraje** - Slider de rango 0–300k km (nuevo)
  - Transmisión (Automática/Manual/CVT)
  - Tipo de Combustible (Gasolina/Diésel/Eléctrico/Híbrido)
  - Condición (Nuevo/Seminuevo/Certificado)
  - Tipo de Vehículo (Sedán/SUV/Pickup/Hatchback/Convertible/Minivan/Van/Deportivo/Todo Terreno/Station Wagon/Compacto)
- **Diseño oscuro** - Filtros con fondo #35475a y texto blanco
- **Mobile responsive** - Filtros colapsables en móvil
- **Paginación** (12 vehículos por página)

### 📄 Ficha de Vehículo (v1.3 mejorada)
- **Galería de imágenes** con vista principal, miniaturas y lightbox
- **Video de YouTube** integrado en la galería
- **Especificaciones completas**: Año, Kilometraje, Transmisión, Combustible, Condición, Tipo de vehículo, Puertas, Asientos, Motor, Factura
- **Características** organizadas por tabs (Exterior, Interior, Equipamiento, Seguridad, Entretenimiento)
- **Descripción detallada**
- **Botón WhatsApp** con mensaje prellenado
- **Botón Toma de Auto** con wizard modal
- **Calculadora de financiamiento** interactiva en sidebar
- **Vehículos similares** en sidebar
- **Formulario de contacto** integrado

### ⚙️ Formulario de Auto Mejorado (v1.3)
- **Tab General** - Datos básicos + 4 campos nuevos requeridos:
  - Transmisión (Manual/Automática/CVT)
  - Combustible (Gasolina/Diésel/Eléctrico/Híbrido)
  - Condición (Nuevo/Seminuevo/Certificado)
  - Tipo de vehículo (11 opciones)
- **Tab Exterior** - Color exterior + 9 checkboxes
- **Tab Interior** - Color interior + 4 checkboxes
- **Tab Equipamiento** - 18 checkboxes de confort
- **Tab Seguridad** - 12 checkboxes de seguridad
- **Tab Entretenimiento** - 8 checkboxes
- **Navegación entre tabs** con botones Anterior/Siguiente
- **Subida de imágenes** drag & drop con reordenamiento
- **Video de YouTube** opcional

### 🏠 Página de Inicio
- **Hero Section** con gradiente azul profesional
- **Estadísticas**: 500+ autos, 20+ marcas, 1000+ clientes satisfechos
- **Vehículos Destacados** con cards atractivos
- **Secciones de información**: "¿Por qué elegir Rolplace?"
- **Call-to-Actions** con integración de WhatsApp

### 🎨 Diseño Profesional
- **Header inteligente** con botón Sign In/Dashboard dinámico
- **Diseño oscuro moderno** (#0a0a0a) inspirado en Rolplace.com
- **Gradientes cyan-to-blue** en botones y acentos
- **Glassmorphism effects** en cards y contenedores
- **100% responsive** (móvil, tablet, desktop)
- **Filtros oscuros** (#35475a) con sliders blancos
- **Navbar sticky** con backdrop-blur
- **Sidebar Albacar-style** en ficha de vehículo

### 🔒 Seguridad
- **Row Level Security (RLS)** en Supabase
- **Usuarios solo ven sus propios autos**
- **Políticas de seguridad** a nivel de base de datos
- **Sessions seguras** con httpOnly cookies
- **OAuth 2.0** flow para Google
- **Type validation** con Zod schemas

## 🛠️ Tech Stack

| Tecnología | Versión | Uso |
|------------|---------|-----|
| **Next.js** | 16 | Framework React con App Router + Turbopack |
| **React** | 19 | Biblioteca UI |
| **TypeScript** | 5 | Tipado estático completo |
| **Tailwind CSS** | 3.4 | Estilos utility-first |
| **Supabase** | Latest | Backend (Auth + Database + Storage + RLS) |
| **Resend** | Latest | Emails transaccionales |
| **React Email** | Latest | Templates HTML para emails |
| **Zod** | Latest | Validación de datos |
| **Lucide React** | Latest | Iconos |

## 📦 Estructura del Proyecto

```
rolplace-mvp/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (main)/                   # Rutas principales
│   │   │   ├── page.tsx             # Homepage
│   │   │   ├── layout.tsx           # Main layout
│   │   │   ├── dashboard/           # Dashboard protegido
│   │   │   │   ├── cars/            # Panel de inventario
│   │   │   │   │   ├── page.tsx     # Lista de mis autos
│   │   │   │   │   ├── new/         # Agregar auto
│   │   │   │   │   └── [id]/edit/   # Editar auto
│   │   │   │   ├── settings/        # Configuración (Perfil + Calculadora)
│   │   │   │   └── page.tsx         # Dashboard home
│   │   │   └── inventory/           # Inventario público
│   │   │       ├── page.tsx         # Lista de vehículos
│   │   │       └── [slug]/page.tsx  # Detalle de vehículo
│   │   ├── (auth)/                  # Autenticación
│   │   │   ├── login/               # Login
│   │   │   ├── signup/              # Registro
│   │   │   ├── callback/            # OAuth callback
│   │   │   ├── check-email/         # Verificación email
│   │   │   ├── forgot-password/     # Recuperar password
│   │   │   └── update-password/     # Actualizar password
│   │   ├── email-unsubscribed/      # Página de desuscripción
│   │   └── api/                     # API Routes
│   │       └── email/unsubscribe/   # Email unsubscribe endpoint
│   │
│   ├── features/
│   │   ├── auth/                    # Autenticación
│   │   │   └── components/
│   │   │       ├── LoginForm.tsx
│   │   │       ├── SignupForm.tsx
│   │   │       ├── GoogleSignInButton.tsx
│   │   │       ├── SettingsForm.tsx
│   │   │       └── CalculatorSettingsForm.tsx  # Config calculadora
│   │   ├── cars/                    # Gestión de autos
│   │   │   └── components/
│   │   │       ├── NewCarForm.tsx       # Formulario nuevo auto
│   │   │       └── EditCarForm.tsx      # Formulario editar auto
│   │   ├── email/                   # Sistema de emails (v1.3)
│   │   │   ├── services/emailService.ts
│   │   │   └── templates/
│   │   │       ├── WelcomeEmail.tsx
│   │   │       └── TomaAutoEmail.tsx
│   │   └── inventory/               # Inventario público
│   │       ├── components/
│   │       │   ├── VehicleCard.tsx
│   │       │   ├── VehicleFilters.tsx  # Filtros con sliders
│   │       │   ├── RangeSlider.tsx     # Slider de rango dual
│   │       │   ├── VehicleDetail.tsx   # Detalle de vehículo
│   │       │   ├── InventoryList.tsx   # Grid responsive
│   │       │   ├── FinancingCalculator.tsx  # Calculadora
│   │       │   ├── TomaAutoForm.tsx    # Wizard Toma de Auto
│   │       │   └── ImageUploadForm.tsx
│   │       ├── services/inventoryService.ts
│   │       ├── lib/calculateFinancing.ts  # Cálculo de pagos
│   │       ├── types/vehicle.types.ts
│   │       └── data/mockVehicles.ts
│   │
│   ├── actions/                     # Server Actions
│   │   ├── auth.ts                  # Auth + profile
│   │   ├── cars.ts                  # Cars CRUD
│   │   └── financing.ts             # Financing settings
│   │
│   ├── lib/supabase/                # Supabase clients
│   │   ├── client.ts
│   │   └── server.ts
│   │
│   └── types/
│       └── database.ts              # DB type definitions
│
├── proxy.ts                         # Next.js middleware
├── Dockerfile                       # Docker deployment
├── docker-compose.yml               # Desarrollo local
├── .env.local.example               # Variables de entorno
└── package.json
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

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Resend (emails transaccionales)
RESEND_API_KEY=re_xxxxxxxxxxxx

# n8n Webhook (opcional, formulario de contacto)
N8N_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rolplace-contact
```

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

## 🗄️ Base de Datos

### Tabla `profiles`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid (PK) | ID de usuario de Supabase Auth |
| full_name | text | Nombre del negocio |
| phone | text | Teléfono |
| whatsapp | text | WhatsApp (con código de país) |
| tasa_interes_anual | numeric(5,2) | Tasa default para calculadora |
| plazo_credito_meses | integer | Plazo default para calculadora |
| enganche_porcentaje | numeric(5,2) | Enganche default para calculadora |

### Tabla `cars`
| Columna | Tipo | Descripción |
|---------|------|-------------|
| id | uuid (PK) | ID único |
| user_id | uuid (FK) | Propietario del auto |
| title | text | Título generado |
| make, model, version | text | Marca, modelo, versión |
| year | integer | Año |
| price | numeric | Precio en MXN |
| mileage | text | Kilometraje |
| transmission | text | manual / automatic / cvt |
| fuel_type | text | gasoline / diesel / electric / hybrid |
| condition | text | new / semi-new / certified |
| vehicle_type | text | sedan / suv / pickup / hatchback / etc. |
| invoice | text | original / refactura |
| motor | text | Motor (3.4L, 2.0L, etc.) |
| images | text[] | URLs de imágenes |
| video_url | text | URL de YouTube |
| featured | boolean | Destacado en homepage |
| status | text | available / sold / reserved |
| +30 feature booleans | boolean | Características del vehículo |

## 🐳 Docker + Coolify

### Docker Compose (Local)

```bash
docker-compose up -d
```

### Deploy en Coolify

1. Conectar repositorio en Coolify
2. Configurar: Build Type: Dockerfile, Port: 3000
3. Agregar variables de entorno

## 🎨 Uso del Panel de Inventario

### 1. Iniciar Sesión

Ve a `/login` y usa Google OAuth o email/password.

### 2. Agregar Nuevo Auto

1. Ve a `/dashboard/cars/new`
2. Completa los 6 tabs del formulario:
   - **General**: Marca, Modelo, Versión, Año, Precio, Kilometraje, Transmisión, Combustible, Condición, Tipo de vehículo, Imágenes, Video, Descripción
   - **Exterior**: Color, 9 características
   - **Interior**: Color, 4 características
   - **Equipamiento**: 18 características
   - **Seguridad**: 12 características
   - **Entretenimiento**: 8 características
3. Click "Agregar Auto"

### 3. Configurar Calculadora

1. Ve a `/dashboard/settings`
2. Tab "Calculadora"
3. Configura: Tasa de interés anual, Plazo en meses, Enganche %
4. Los compradores verán estos valores por defecto en la calculadora de cada vehículo

## 🗺️ Roadmap

### ✅ v1.1 - Autenticación + Panel Admin (Abril 2026)
- [x] Autenticación completa (Google OAuth + Email/Password)
- [x] Panel de administración para inventario
- [x] Base de datos real con Supabase + RLS
- [x] CRUD de vehículos
- [x] Perfiles de usuario
- [x] Server Actions type-safe

### ✅ v1.2 - Sistema de Imágenes (Abril 2026)
- [x] Upload Drag & Drop (hasta 20 imágenes)
- [x] Supabase Storage con RLS
- [x] Galería interactiva con lightbox
- [x] Inventario dinámico conectado a Supabase

### ✅ v1.3 - Financiamiento + Emails + UX (Abril 2026)
- [x] **Sistema de emails transaccionales** (Resend + React Email)
- [x] **Formulario Toma de Auto** - Wizard de 3 pasos con fotos
- [x] **Calculadora de financiamiento** - Configurable por publisher
- [x] **4 campos nuevos en formulario**: Transmisión, Combustible, Condición, Tipo de vehículo
- [x] **Especificaciones en ficha**: Condición y Tipo de vehículo visibles
- [x] **Sliders de rango** para filtros de Año, Precio y Kilometraje
- [x] **Filtro de Kilometraje** (nuevo)
- [x] **Filtros oscuros** (#35475a) con texto blanco
- [x] **Inventario mobile responsive** - Filtros colapsables
- [x] **Video de YouTube** en galería de vehículos
- [x] **Botón WhatsApp** con mensaje prellenado
- [x] **Botón Toma de Auto** en sidebar
- [x] **Settings con tabs** - Perfil + Calculadora
- [x] **Motor** visible en ficha de vehículo
- [x] **Edición de autos** con reordenamiento de imágenes

### 🚀 Próximas Versiones
- [ ] **Comparador de vehículos** (v1.4)
- [ ] **Sistema de favoritos** (v1.4)
- [ ] **Alertas de nuevos vehículos** (v1.5)
- [ ] **SEO avanzado** (sitemap, robots.txt, meta tags) (v1.5)
- [ ] **Blog** de contenido automotriz (v2.0)
- [ ] **Integración con APIs** de financieras (v2.0)
- [ ] **Chat en vivo** integrado (v2.0)
- [ ] **Panel de analytics** (v2.0)
- [ ] **Exportación de inventario** a MercadoLibre/Facebook (v2.1)

## 📄 Licencia

MIT License - Copyright © 2026 Lemon Uno

## 👥 Créditos

Desarrollado con **SaaS Factory V4** | Agent-First Software Factory

**Versión 1.3** - Abril 2026
**Autenticación**: Google OAuth + Email/Password
**Backend**: Supabase PostgreSQL + Storage + RLS
**Emails**: Resend + React Email
**Inventario**: Panel Admin + Upload de Imágenes + Filtros con Sliders
**Financiamiento**: Calculadora interactiva configurable
**Trade-In**: Wizard Toma de Auto con fotos

---

**🌐 Demo en Vivo**: https://pr-1-kappa.vercel.app
**📦 GitHub**: https://github.com/lemon-uno/rolplace-mvp
**🚀 Versión**: v1.3.0
**📅 Última actualización**: Abril 2026
