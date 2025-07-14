# Guía para Manejo de Imágenes

## 🚀 Cómo Usar el Sistema de Imágenes

### 1. Configuración Inicial en Supabase

Antes de usar las imágenes, asegúrate de:

1. **Crear el bucket en Supabase:**

   - Ve a tu proyecto: https://agaqsrykcdcxggdfmaoj.supabase.co
   - Navega a **Storage** → **Create bucket**
   - Nombre: `business-images`
   - Marcarlo como **Public bucket**

2. **Configurar políticas de seguridad:**
   Ejecuta este SQL en el editor de Supabase:

   ```sql
   -- Permitir ver imágenes públicas
   CREATE POLICY "Public can view business images" ON storage.objects
   FOR SELECT USING (bucket_id = 'business-images');

   -- Permitir subir imágenes
   CREATE POLICY "Anyone can upload business images" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'business-images');

   -- Permitir actualizar imágenes
   CREATE POLICY "Anyone can update business images" ON storage.objects
   FOR UPDATE USING (bucket_id = 'business-images');

   -- Permitir eliminar imágenes
   CREATE POLICY "Anyone can delete business images" ON storage.objects
   FOR DELETE USING (bucket_id = 'business-images');
   ```

### 2. Uso del Componente ImageUpload

El componente `ImageUpload` ya está integrado en el formulario de negocios:

```tsx
<ImageUpload
  businessId={business?.id}
  images={formData.images || []}
  onImagesChange={(images) => handleChange("images", images)}
  maxImages={5} // Opcional, por defecto 5
/>
```

### 3. Funcionalidades Disponibles

#### ✅ **Subida de Imágenes**

- **Drag & Drop**: Arrastra imágenes directamente al área
- **Click para seleccionar**: Haz clic para abrir el selector de archivos
- **Múltiples archivos**: Selecciona varias imágenes a la vez

#### ✅ **Formatos Soportados**

- JPG/JPEG
- PNG
- WebP (recomendado para web)

#### ✅ **Limitaciones**

- Máximo 5MB por imagen
- Máximo 5 imágenes por negocio (configurable)
- Redimensionamiento automático a 1200x800px

#### ✅ **Gestión de Imágenes**

- **Imagen Principal**: La primera imagen es automáticamente principal
- **Cambiar Principal**: Botón "Principal" en cada imagen
- **Eliminar**: Botón "×" para eliminar imágenes
- **Reordenar**: Las imágenes mantienen un orden

### 4. Estructura de Almacenamiento

Las imágenes se organizan de la siguiente manera:

```
business-images/
├── businesses/
│   ├── 1/
│   │   ├── main.jpg          (imagen principal)
│   │   ├── gallery-167...jpg (imágenes adicionales)
│   │   └── gallery-167...jpg
│   ├── 2/
│   │   └── main.jpg
│   └── ...
└── categories/
    ├── pizza.jpg
    ├── hamburguesas.jpg
    └── ...
```

### 5. URLs de las Imágenes

Las imágenes tienen URLs públicas como:

```
https://agaqsrykcdcxggdfmaoj.supabase.co/storage/v1/object/public/business-images/businesses/1/main.jpg
```

### 6. Base de Datos

Las imágenes se almacenan en la tabla `business_images`:

```sql
CREATE TABLE business_images (
    id SERIAL PRIMARY KEY,
    business_id INTEGER NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(200),
    is_main BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

### 7. Servicios Disponibles

#### **ImageService**

- `uploadBusinessImage(file, businessId, isMain)` - Subir imagen
- `deleteImage(imageUrl)` - Eliminar imagen
- `resizeImage(file, maxWidth, maxHeight)` - Redimensionar
- `validateFile(file)` - Validar archivo

#### **BusinessService**

- `addBusinessImages(businessId, images)` - Agregar múltiples imágenes
- Integración automática en `createBusiness()` y `updateBusiness()`

### 8. Ejemplo de Uso Programático

```typescript
import { ImageService } from "@/services/imageService";

// Subir imagen principal
const result = await ImageService.uploadBusinessImage(file, businessId, true);
if (result.error) {
  console.error(result.error);
} else {
  console.log("Imagen subida:", result.url);
}

// Eliminar imagen
await ImageService.deleteImage(imageUrl);
```

### 9. Optimizaciones Automáticas

- **Redimensionamiento**: Las imágenes grandes se redimensionan automáticamente
- **Compresión**: Calidad optimizada para web (80%)
- **Cache**: Headers de cache para mejor rendimiento
- **Sobrescritura**: Las imágenes principales se pueden sobrescribir

### 10. Troubleshooting

#### **Error: "bucket does not exist"**

- Verifica que el bucket `business-images` esté creado en Supabase Storage

#### **Error: "RLS policy violation"**

- Ejecuta las políticas de seguridad mencionadas arriba

#### **Error: "File too large"**

- Verifica que la imagen sea menor a 5MB
- El componente redimensiona automáticamente, pero archivos muy grandes pueden fallar

#### **Imágenes no se ven**

- Verifica que el bucket sea público
- Confirma que las URLs sean correctas
- Revisa las políticas de CORS si tienes problemas de dominio

### 11. Próximas Mejoras

- [ ] Soporte para múltiples formatos (GIF, SVG)
- [ ] Compresión avanzada
- [ ] Thumbnails automáticos
- [ ] Watermarks para imágenes
- [ ] Galería con lightbox
- [ ] Edición básica de imágenes
