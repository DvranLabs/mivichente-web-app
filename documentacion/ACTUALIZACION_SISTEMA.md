# Mivichente Admin - Actualización del Sistema

## Resumen de Cambios

El sistema ha sido completamente actualizado para corresponder con el esquema de Supabase implementado en `SUPABASE_SETUP.md`. Los cambios principales incluyen:

### 1. Actualización de Tipos de Datos

**Antes:**

- `BusinessWithCategories` con relación many-to-many con categorías
- Campos como `municipality` (string), `google_maps_url`, `image_url`, `is_active`
- IDs como strings

**Después:**

- `BusinessWithDetails` con relación one-to-many con categorías
- Estructura completa con `Town`, `State`, `BusinessCategory`, `BusinessImage`
- IDs como números (siguiendo el esquema de Supabase)
- Campos actualizados: `town_id`, `category_id`, `google_maps_link`, `active`, etc.

### 2. Nuevas Entidades

#### States (Estados)

```typescript
interface State {
  id: number;
  name: string;
  code: string;
  created_at: string;
  updated_at: string;
}
```

#### Towns (Municipios)

```typescript
interface Town {
  id: number;
  name: string;
  state_id: number;
  latitude?: number;
  longitude?: number;
  postal_code?: string;
  created_at: string;
  updated_at: string;
  state?: State;
}
```

#### Business Categories (Categorías de Negocio)

```typescript
interface BusinessCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

#### Business Images (Imágenes de Negocio)

```typescript
interface BusinessImage {
  id: number;
  business_id: number;
  image_url: string;
  alt_text?: string;
  is_main: boolean;
  sort_order: number;
  created_at: string;
}
```

### 3. Estructura Actualizada de Business

```typescript
interface Business {
  id: number;
  name: string;
  slug: string;
  description?: string;
  address: string;
  town_id: number;
  category_id: number;

  // Información de contacto
  phone?: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  google_maps_link?: string;
  latitude?: number;
  longitude?: number;

  // Horarios de operación
  monday_hours?: string;
  tuesday_hours?: string;
  wednesday_hours?: string;
  thursday_hours?: string;
  friday_hours?: string;
  saturday_hours?: string;
  sunday_hours?: string;

  // Búsqueda y estado
  keywords: string[];
  active: boolean;
  featured: boolean;

  // Información del propietario (sin acceso al sistema)
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;

  created_at: string;
  updated_at: string;

  // Relaciones
  town?: Town;
  category?: BusinessCategory;
  images?: BusinessImage[];
}
```

### 4. Servicios Actualizados

#### BusinessService

- `getBusinessesWithDetails()` - Obtiene negocios con toda la información relacionada
- `searchBusinesses(filters)` - Búsqueda avanzada con filtros
- `createBusiness(data)` - Crear negocio con auto-generación de slug
- `updateBusiness(id, data)` - Actualizar negocio
- `deleteBusiness(id)` - Eliminar negocio
- `toggleBusinessStatus(id, active)` - Cambiar estado activo/inactivo
- `uploadBusinessImage(file, businessId)` - Subir imagen
- `addBusinessImage(businessId, imageUrl, altText, isMain)` - Agregar imagen a negocio

#### CategoryService

- `getAllCategories()` - Obtener todas las categorías activas
- `createCategory(data)` - Crear nueva categoría
- `updateCategory(id, data)` - Actualizar categoría
- `deleteCategory(id)` - Eliminar categoría

#### LocationService

- `getAllStates()` - Obtener todos los estados
- `getAllTowns()` - Obtener todos los municipios con estados
- `getTownsByState(stateId)` - Obtener municipios por estado
- `createState(data)` - Crear nuevo estado
- `createTown(data)` - Crear nuevo municipio
- `deleteState(id)` - Eliminar estado
- `deleteTown(id)` - Eliminar municipio

### 5. Componentes Actualizados

#### BusinessFormModal

- Ahora requiere `categories` y `towns` como props
- Campos actualizados para incluir redes sociales, WhatsApp, email, etc.
- Validación actualizada para `town_id` y `category_id`
- Checkbox para `active` y `featured`
- Campos del propietario organizados en sección separada

#### BusinessCard

- Muestra información completa del negocio
- Imagen principal de la colección de imágenes
- Información de municipio y estado
- Enlaces a redes sociales y Google Maps
- Estado activo/inactivo y destacado

#### AdminPage

- Carga datos de negocios, categorías y municipios
- Filtros actualizados para trabajar con la nueva estructura
- Estadísticas incluyen negocios destacados
- Manejo de IDs numéricos

### 6. Configuración de Base de Datos

#### Pasos para Configurar:

1. **Crear el esquema:** Ejecutar el SQL en `documentacion/SUPABASE_SETUP.md`
2. **Poblar datos iniciales:** Ejecutar el SQL en `documentacion/INITIAL_DATA.sql`
3. **Configurar variables de entorno:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
   SUPABASE_SERVICE_ROLE_KEY=tu_clave_de_servicio
   ```

#### Datos Iniciales Incluidos:

- 6 estados de Venezuela
- 20+ municipios distribuidos en los estados
- 15 categorías de negocios con íconos y descripciones
- 4 negocios de ejemplo con imágenes

### 7. Funcionalidades Nuevas

#### Gestión de Ubicaciones

- Estados y municipios estructurados jerárquicamente
- Soporte para coordenadas GPS y códigos postales
- Filtros por estado y municipio

#### Categorías Avanzadas

- Slug automático para URLs amigables
- Íconos para cada categoría
- Orden personalizable (`sort_order`)
- Estado activo/inactivo

#### Gestión de Imágenes

- Múltiples imágenes por negocio
- Imagen principal marcada como `is_main`
- Texto alternativo para accesibilidad
- Orden personalizable

#### Información Extendida

- Horarios de operación por día de la semana
- Múltiples métodos de contacto (teléfono, WhatsApp, email)
- Redes sociales (Facebook, Instagram)
- Información del propietario para contacto directo

### 8. Mejoras de Búsqueda

- Búsqueda por nombre, descripción y palabras clave
- Filtros por municipio, estado y categoría
- Filtro por negocios destacados
- Filtro por estado activo/inactivo

### 9. Próximos Pasos Recomendados

1. **Implementar Storage de Supabase** para subida de imágenes
2. **Añadir geolocalización** usando latitude/longitude
3. **Implementar horarios de operación** en la interfaz
4. **Añadir sistema de reviews/calificaciones**
5. **Implementar notificaciones** para propietarios
6. **Crear panel público** para usuarios finales

### 10. Archivos Modificados

- `src/types/business.ts` - Tipos completamente actualizados
- `src/services/businessService.ts` - Servicios reorganizados y expandidos
- `src/components/BusinessFormModal.tsx` - Formulario extendido
- `src/components/BusinessCard.tsx` - Visualización actualizada
- `src/app/admin/page.tsx` - Página administrativa actualizada
- `documentacion/INITIAL_DATA.sql` - Datos iniciales para la base de datos

El sistema ahora está completamente alineado con el esquema de Supabase y ofrece una funcionalidad mucho más robusta para la gestión de negocios locales.
