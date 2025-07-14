# Task: Configuración del Backend con Supabase para el MVP

**Epica Relacionada:** [[E1 - Catalogo]], [[E2 - Administracion]]
**User Stories Relacionadas:** [[US 1.1 - Poder visualizar catalogo de negocios de comida]], [[US 2.1 - Administrar negocios listados]]

**Descripción:**
Configurar y desplegar la infraestructura de backend utilizando Supabase para el MVP de "Vichente Eats". El objetivo es dar soporte a las funcionalidades básicas de visualización y administración de negocios de comida, que son el núcleo de la Fase 1 del proyecto.

---

## Criterios de Aceptación

### 1. Configuración del Proyecto en Supabase
- [ ] Crear un nuevo proyecto en Supabase con el nombre "vichente-eats".
- [ ] Guardar de forma segura las credenciales del proyecto (URL del proyecto y `anon` key) en un lugar apropiado para el equipo de desarrollo.

### 2. Diseño e Implementación de la Base de Datos
- [ ] **Tabla `businesses`:** Crear la tabla para almacenar la información de los negocios.
    - `id` (uuid, primary key, auto-generado)
    - `created_at` (timestamp with time zone, default now())
    - `name` (text, not null)
    - `phone` (text, not null)
    - `address` (text, not null)
    - `google_maps_url` (text, nullable)
    - `image_url` (text, nullable)
    - `description` (text, nullable)
    - `is_active` (boolean, default true)
- [ ] **Tabla `categories`:** Crear una tabla para las categorías de los negocios.
    - `id` (uuid, primary key, auto-generado)
    - `name` (text, not null, unique)
- [ ] **Tabla de Unión `business_categories`:** Crear una tabla para la relación muchos a muchos entre negocios y categorías.
    - `business_id` (uuid, foreign key a `businesses.id`)
    - `category_id` (uuid, foreign key a `categories.id`)
    - Definir una clave primaria compuesta (`business_id`, `category_id`).

### 3. Configuración de Autenticación
- [ ] Habilitar la autenticación por **Email/Contraseña** para los administradores del sistema.
- [ ] Configurar la plantilla de correo electrónico de confirmación y recuperación de contraseña si es necesario.
- [ ] **(Opcional para MVP)** Investigar y documentar los pasos para la integración con proveedores OAuth como Google para futuras fases.

### 4. Configuración del Almacenamiento (Storage)
- [ ] Crear un bucket de almacenamiento público llamado `business_images`.
- [ ] Definir las políticas de acceso para que las imágenes puedan ser leídas públicamente (`SELECT` para todos) pero solo los usuarios autenticados (administradores) puedan subir, modificar o eliminar imágenes (`INSERT`, `UPDATE`, `DELETE`).

### 5. API y Acceso a Datos
- [ ] Habilitar el acceso a través de la API para las tablas `businesses`, `categories` y `business_categories`.
- [ ] Implementar **Row Level Security (RLS)** en la tabla `businesses`:
    - **Acceso público:** Cualquier usuario (anónimo incluido) puede leer los negocios que estén marcados como `is_active = true`.
    - **Acceso de administrador:** Los usuarios autenticados con un rol específico (ej. `admin`) pueden realizar todas las operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en todos los negocios, sin importar su estado.
- [ ] Crear una **función de base de datos (RPC)** llamada `get_businesses_with_categories` que devuelva una lista de negocios activos con sus respectivas categorías anidadas en un solo array JSON. Esto optimizará las consultas desde el frontend.

### 6. Documentación y Entrega
- [ ] Crear un documento `SUPABASE_SETUP.md` en la carpeta `documentacion` que contenga:
    - La URL del proyecto y la `anon` key.
    - Una descripción de la estructura de la base de datos.
    - Instrucciones básicas sobre cómo conectar la aplicación frontend con Supabase.
    - Un ejemplo de cómo llamar a la función `get_businesses_with_categories`.

---

**Estado:** Pendiente
**Responsable:** Por Asignar
**Prioridad:** Muy Alta