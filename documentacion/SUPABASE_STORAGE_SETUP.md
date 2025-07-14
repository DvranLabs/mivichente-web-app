# Configuración de Supabase Storage para Imágenes

## Pasos para configurar el almacenamiento de imágenes:

### 1. Crear Bucket en Supabase Dashboard

1. Ve a tu proyecto de Supabase: https://agaqsrykcdcxggdfmaoj.supabase.co
2. Navega a **Storage** en el menú lateral
3. Crea un nuevo bucket llamado `business-images`
4. Configura como **Public bucket** para que las imágenes sean accesibles

### 2. Políticas de Seguridad (RLS)

Ejecuta estas políticas en el SQL Editor de Supabase:

```sql
-- Permitir que cualquiera pueda ver las imágenes públicas
CREATE POLICY "Public can view business images" ON storage.objects
FOR SELECT USING (bucket_id = 'business-images');

-- Permitir subir imágenes (puedes restringir esto más adelante)
CREATE POLICY "Anyone can upload business images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'business-images');

-- Permitir actualizar imágenes
CREATE POLICY "Anyone can update business images" ON storage.objects
FOR UPDATE USING (bucket_id = 'business-images');

-- Permitir eliminar imágenes
CREATE POLICY "Anyone can delete business images" ON storage.objects
FOR DELETE USING (bucket_id = 'business-images');
```

### 3. Estructura de Carpetas Recomendada

```
business-images/
├── businesses/
│   ├── 1/
│   │   ├── main.jpg
│   │   ├── gallery-1.jpg
│   │   └── gallery-2.jpg
│   ├── 2/
│   │   └── main.jpg
│   └── ...
└── categories/
    ├── pizza.jpg
    ├── hamburguesas.jpg
    └── ...
```

### 4. Formatos Soportados

- JPG/JPEG
- PNG
- WebP (recomendado para web)
- Tamaño máximo: 5MB por imagen
- Resolución recomendada: 1200x800px para imágenes principales
