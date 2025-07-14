---
tags:
  - tarea
date: "2025-07-08"
---

# US 2.1 - Look and Feel

## Descripción

Como usuario, quiero una interfaz que combine la modernidad y usabilidad de Uber Eats con la calidez y el colorido característico de los Pueblos Mágicos mexicanos.

## Criterios de Aceptación

### 1. Logo

- [x] Diseñar un logotipo que:
  - Refleje la fusión entre lo moderno y lo tradicional mexicano
  - Sea legible tanto en tamaños pequeños como grandes
  - Funcione en versión monocromática y a color
  - Incluya una versión para favicon y app icon

### 2. Paleta de Colores

- [x] Establecer una paleta principal que incluya:
  - Color principal: Un tono vibrante inspirado en la arquitectura colonial mexicana (como el rosa mexicano o el azul añil)
  - Colores secundarios: Inspirados en artesanías y textiles mexicanos
  - Colores neutros: Para balance y legibilidad
  - Esquema sugerido:
    - Rosa mexicano (#E63E8F) para elementos principales
    - Azul añil (#1B4B95) para acentos
    - Amarillo maíz (#F2B705) para destacados
    - Terracota (#9E4624) para elementos decorativos
    - Blanco (#FFFFFF) y gris oscuro (#333333) para texto y fondos

### 3. Tipografía

- [x] Seleccionar una combinación de fuentes que incluya:
  - Fuente principal para títulos: Sans-serif moderna y limpia (tipo Uber Move)
  - Fuente secundaria para cuerpo: Alta legibilidad en dispositivos móviles
  - Fuente decorativa (uso limitado): Para elementos que requieran un toque más tradicional mexicano

### 4. Elementos de Diseño

- [x] Incorporar elementos visuales distintivos:
  - Patrones geométricos inspirados en textiles mexicanos para fondos y separadores
  - Iconografía que mezcle el estilo minimalista con toques artesanales
  - Elementos decorativos sutiles inspirados en papel picado
  - Sombras y elevaciones al estilo de aplicaciones modernas

## Notas

- Mantener el equilibrio entre la funcionalidad moderna de Uber Eats y la riqueza visual de la cultura mexicana
- Asegurar que todos los elementos cumplan con las pautas de accesibilidad
- La interfaz debe ser intuitiva y fácil de usar, priorizando la experiencia del usuario
- Los elementos tradicionales mexicanos deben integrarse de manera sutil y moderna, evitando caer en estereotipos

## Estado de Implementación

✅ **ACTUALIZADO** - Fecha: 2025-01-09

### Cambios Realizados:

1. **Nueva paleta de colores tradicional** - Reemplazada la paleta vibrante por colores tierra inspirados en la arquitectura colonial mexicana:

   - Rojo Talavera (#B91C1C) - Color principal tradicional
   - Azul Talavera (#1E3A8A) - Azul cobalto de cerámica
   - Ocre Dorado (#D97706) - Ocre mexicano tradicional
   - Terracota Oscuro (#7C2D12) - Terracota quemada
   - Blanco Caliza (#FEFEFE) - Blanco cal
   - Gris Piedra (#374151) - Gris cantera
   - Beige Piedra (#F5F5DC) - Beige piedra caliza
   - Marrón Chocolate (#451A03) - Marrón cacao

2. **Tipografías más elegantes** - Cambio a fuentes serif tradicionales:

   - Playfair Display para títulos principales
   - Merriweather para subtítulos
   - Roboto Slab para títulos de sección
   - Crimson Text para texto de cuerpo

3. **Diseño más sobrio** - Eliminación de elementos muy coloridos:

   - Reducción de gradientes vibrantes
   - Sombras más sutiles y elegantes
   - Bordes redondeados más conservadores (12px vs 20px+)
   - Eliminación de efectos neón y muy brillantes

4. **Estilo retro mexicano** - Inspiración en pueblos coloniales:
   - Colores tierra y naturales
   - Elementos decorativos más tradicionales
   - Gradientes inspirados en cerámica talavera
   - Estética más masculina y tradicional

### Archivos Actualizados:

- `lib/theme/vichente_theme.dart` - Tema completamente renovado
- `lib/main.dart` - Aplicación simplificada y más tradicional
- `lib/widgets/custom_search_bar_simple.dart` - Barra de búsqueda tradicional
- `lib/widgets/vichente_logo.dart` - Logo actualizado con nuevos colores

### Próximos Pasos:

- Verificar compatibilidad con todos los widgets
- Ajustar elementos decorativos para el nuevo estilo
- Optimizar contraste y accesibilidad
- Pruebas de usuario con el nuevo diseño
