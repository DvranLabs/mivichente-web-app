# Changelog - Vichente Eats

## 2025-07-08

### ✅ US 1.1 - Visualización de catálogo de negocios
- **Problema:** Placeholder images no cargaban correctamente
- **Solución:** 
  - Implementado `cached_network_image` para mejor performance
  - Agregado fallback con iconos específicos por categoría
  - Cambiado URLs de `via.placeholder.com` a Unsplash
- **Archivos modificados:**
  - `lib/widgets/business_list.dart` - Mejorado manejo de imágenes
  - `lib/data/mock_business_data.dart` - URLs de imágenes actualizadas
  - `pubspec.yaml` - Agregada dependencia `cached_network_image`

### ✅ US 2.1 - Búsqueda en el catálogo
- **Implementación completa del sistema de búsqueda:**

#### Barra de búsqueda mejorada
- **Archivo:** `lib/widgets/custom_search_bar.dart`
- **Cambios:** Rediseño completo con botón clear, sombras, estado visual

#### Algoritmo de búsqueda inteligente
- **Archivo:** `lib/main.dart`
- **Funcionalidad:** Búsqueda multi-término con priorización
- **Lógica:** Nombre > Tags/Descripción > Categoría/Horarios

#### Widgets nuevos creados:
1. **`lib/widgets/search_results.dart`**
   - Estado sin resultados con sugerencias
   - Contador de resultados
   - Sugerencias clickeables

2. **`lib/widgets/advanced_search.dart`**
   - `QuickSearchChips` - Historial + sugerencias predefinidas
   - `AdvancedSearchFilters` - Panel colapsable con filtros

#### Datos de prueba
- **Archivo:** `lib/data/mock_business_data.dart`
- **Cambios:** Expandido de 4 a 8 negocios para mejor testing

#### Funcionalidades implementadas:
- ✅ Búsqueda multi-término
- ✅ Historial de búsquedas (límite 5)
- ✅ Chips de búsqueda rápida
- ✅ Filtros avanzados (ubicación, horarios, distancia)
- ✅ Sugerencias cuando no hay resultados
- ✅ Búsqueda instantánea

### Archivos relacionados:
- [[US 1.1 - Poder visualizar catalogo de negocios de comida]]
- [[US 1.1 - Busqueda en el catalogo]]
- [[Release 1.0]]


