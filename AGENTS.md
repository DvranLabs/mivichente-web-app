# Vichente Landing — vichente.com

Landing pública de Vichente (Next.js 15, App Router). Tiene dos trabajos: la home (`/`) capta dueños de negocio, y `/negocio/:id` y `/:slug` son los links compartibles del directorio, con SSR y Open Graph por negocio. También sirve los archivos de deep link nativos en `/.well-known/`.

Contexto completo, flujo de la home y arquitectura de links: `$OBSIDIAN_VAULT/Workbench/Vichente App/02 Apps/v2-landing/index.md`.

## Reglas que no dan síntoma si se rompen

- **Cada push a `master` despliega a producción.** Vercel autodespliega desde `origin/master`. El trabajo va en una rama y se mergea a `master` solo cuando está listo para salir.
- **No hay entorno local.** `.env.local` apunta a la Supabase de producción: lo que corre `npm run dev` lee y escribe datos reales. Por ejemplo, el form de la home inserta en `business_registrations`. Para probar contra datos locales hay que sobreescribir `SUPABASE_URL` y `SUPABASE_ANON_KEY` con los de la DB local del minipc.
- **"Web app" no es este repo.** Sin calificar, en Vichente "web app" es la app de Flutter compilada a web (`app.vichente.com`, repo `mobile/`). A este repo se le dice "landing".
- **Al consultar `businesses` con su categoría, el hint `categories!businesses_category_id_fkey` es obligatorio.** Hay dos relaciones entre `businesses` y `categories`: la FK directa `category_id` y la many-to-many `business_categories`. Sin el hint, PostgREST responde 300 y la query devuelve vacío sin error. Ya pasó dos veces.
- **Las fotos remotas tienen que estar en dos listas a la vez.** Una `photo_url` de un host que no está en `remotePatterns` de `next.config.ts` hace que `next/image` responda 500 y tumba la home entera. Por eso `src/components/negocios/fotos.ts` tiene una allowlist que debe ir a la par del config: una foto de host desconocido no se pinta, en vez de romper la página.

## Comandos

```bash
npm run dev     # puerto 3019, contra la Supabase de producción
npm run build
npm run lint
```

No hay runner de tests.
