# Rolplace MVP

MVP de comercializadora de autos usados basado en las funcionalidades del plugin Motors de WordPress.

## 🚗 Características

- **Inventario de autos** con filtros avanzados (Marca, Modelo, Año, Precio, Transmisión, Combustible)
- **Ficha técnica completa** de cada vehículo
- **Formulario de contacto** integrado con n8n → Chatwoot
- **Diseño responsive** y profesional
- **Optimizado para SEO** (Next.js 16 + App Router)
- **Listo para Docker** y despliegue en Coolify

## 🛠️ Tech Stack

- **Framework**: Next.js 16 + React 19 + TypeScript
- **Estilos**: Tailwind CSS 3.4
- **Animaciones**: Framer Motion
- **Base de datos**: Supabase (opcional, usando mock data en MVP)
- **Integraciones**: n8n (webhook para contactos)

## 📦 Estructura del Proyecto

```
src/features/inventory/
├── components/          # Componentes de UI
│   ├── InventoryList.tsx
│   ├── VehicleCard.tsx
│   ├── VehicleFilters.tsx
│   └── VehicleDetail.tsx
├── services/           # Lógica de negocio
│   └── inventoryService.ts
├── types/              # Tipos TypeScript
│   └── vehicle.types.ts
└── data/               # Mock data
    └── mockVehicles.ts

src/app/(main)/inventory/
├── page.tsx            # Lista de vehículos
└── [id]/page.tsx       # Detalle de vehículo
```

## 🚀 Quick Start (Desarrollo)

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# n8n Webhook (opcional para MVP)
N8N_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rolplace-contact
```

**Nota**: En MVP mode, sin configurar el webhook, los formularios funcionan en modo demo (solo console.log).

### 3. Ejecutar servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000/inventory](http://localhost:3000/inventory)

## 🐳 Docker + Coolify (Producción)

### Opción A: Usar docker-compose (Local)

```bash
# Crear archivo .env
cat > .env << EOF
NEXT_PUBLIC_APP_URL=https://your-domain.com
N8N_CONTACT_WEBHOOK_URL=https://your-n8n-instance.com/webhook/rolplace-contact
EOF

# Ejecutar con docker-compose
docker-compose up -d
```

### Opción B: Desplegar en Coolify

1. **Preparar repositorio git**

```bash
git init
git add .
git commit -m "Initial commit: Rolplace MVP"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Configurar en Coolify**

   - Crea un nuevo proyecto en Coolify
   - Conecta tu repositorio Git
   - Configura:
     - **Build Type**: Dockerfile
     - **Dockerfile Path**: `./Dockerfile`
     - **Port**: 3000
   - Añade variables de entorno:
     - `NEXT_PUBLIC_APP_URL`: `https://your-domain.com`
     - `N8N_CONTACT_WEBHOOK_URL`: Tu URL de webhook n8n

3. **Deploy**

   Coolify construirá y desplegará automáticamente cada vez que hagas push a main.

## 📝 Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `NEXT_PUBLIC_APP_URL` | URL pública de la app | Sí |
| `N8N_CONTACT_WEBHOOK_URL` | Webhook de n8n para contactos | No* |

*No requerido para MVP (funciona en modo demo sin él)

## 🎨 Personalización

### Agregar más vehículos

Edita `src/features/inventory/data/mockVehicles.ts`:

```typescript
export const mockVehicles: Vehicle[] = [
  // Agrega tus vehículos aquí
  {
    id: 'unique-id',
    title: 'Toyota Corolla LE 2021',
    make: 'Toyota',
    model: 'Corolla',
    // ... más campos
  }
];
```

### Cambiar colores/estilos

Edita los componentes en `src/features/inventory/components/` para ajustar Tailwind classes.

## 🔗 Integración con n8n + Chatwoot

### 1. Crear workflow en n8n

```javascript
// Webhook POST recibe:
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

### 2. Enviar a Chatwoot

Usa el nodo **HTTP Request** en n8n para enviar a la API de Chatwoot:

```
POST {CHATWOOT_URL}/api/v1/accounts/{ACCOUNT_ID}/conversations
Headers:
  - api_access_token: {CHATWOOT_TOKEN}
Body:
  - source_id: {email del cliente}
  - name: {nombre del cliente}
  - conversation_messages: [
      {
        content: "Lead desde Rolplace web\n\nVehículo: {vehicle.title}\nPrecio: {vehicle.price}\n\n{message}"
      }
    ]
```

## 🧪 Testing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build
npm run build
```

## 📊 Próximos Pasos (Post-MVP)

- [ ] Conectar con Supabase para persistencia real
- [ ] Agregar autenticación (login para favoritos)
- [ ] Panel de admin para gestionar inventario
- [ ] Comparador de vehículos
- [ ] Alertas de nuevos vehículos
- [ ] SEO avanzado (sitemap, robots.txt)
- [ ] Blog de contenido automotriz
- [ ] Integración con APIs de financieras

## 📄 Licencia

MIT

---

**Desarrollado con SaaS Factory V4** | Agent-First Software Factory
