# Diagrama de Arquitectura - Portal de Datos Médicos "Left Joiners"

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE PRESENTACIÓN                               │
│                              (Frontend - Astro)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Layout System                                    │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │            DashboardLayout.astro                                │  │  │
│  │  │  ┌──────────────┐  ┌─────────────┐  ┌──────────────────────┐  │  │  │
│  │  │  │   Sidebar    │  │   Header    │  │  Theme Switcher      │  │  │  │
│  │  │  │   (Desktop)  │  │  (Fijo)     │  │  (Dark/Light)        │  │  │  │
│  │  │  └──────────────┘  └─────────────┘  └──────────────────────┘  │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────────┐   │
│  │  dashboard.astro│  │ pacientes.astro │  │  accesibilidad.astro     │   │
│  │                 │  │                 │  │                          │   │
│  │  ┌───────────┐  │  │  ┌───────────┐ │  │  ┌────────────────────┐  │   │
│  │  │ 6 Gráficas│  │  │  │  Filtros  │ │  │  │ Modo Oscuro        │  │   │
│  │  │ Interactivas│ │  │  │  Búsqueda │ │  │  │ OpenDyslexic       │  │   │
│  │  │ (ECharts) │  │  │  │  Paginación│ │  │  └────────────────────┘  │   │
│  │  └───────────┘  │  │  └───────────┘ │  │                          │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────────────┘   │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │              paciente/[id].astro (Vista Detallada)                    │  │
│  │    Información completa del paciente con parámetros dinámicos         │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Peticiones
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CAPA DE LÓGICA Y DATOS                               │
│                      (Content Collections + API)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                    Content Collections System                         │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  src/content/config.ts (Schema & Validación)                    │ │  │
│  │  │  ┌─────────────────────────────────────────────────────────┐    │ │  │
│  │  │  │  • defineCollection('datosPrincipales')                 │    │ │  │
│  │  │  │  • Schema de datos de pacientes                         │    │ │  │
│  │  │  │  • Validación de tipos con Zod                          │    │ │  │
│  │  │  │  • CATEGORIAS_INGRESO (Mapeo de códigos)               │    │ │  │
│  │  │  └─────────────────────────────────────────────────────────┘    │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐ │  │
│  │  │  getCollection('datosPrincipales')                              │ │  │
│  │  │  • Obtención de datos de pacientes                              │ │  │
│  │  │  • Filtrado en servidor                                          │ │  │
│  │  │  • Agregaciones y estadísticas                                   │ │  │
│  │  └─────────────────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                         API Endpoints                                 │  │
│  │                                                                        │  │
│  │  ┌───────────────────────────┐  ┌────────────────────────────┐      │  │
│  │  │ /api/datosMedicos.json.ts │  │  /api/pokemon.json.ts      │      │  │
│  │  │ (Exposición de datos)     │  │  (Endpoint de ejemplo)     │      │  │
│  │  └───────────────────────────┘  └────────────────────────────┘      │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
                                      │ Procesamiento
                                      ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CAPA DE DATOS                                      │
│                      (Almacenamiento y Fuentes)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │              src/content/datosPrincipales/                            │  │
│  │                                                                        │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │  Archivos JSON con datos de pacientes                          │  │  │
│  │  │  • paciente_id                                                  │  │  │
│  │  │  • edad, sexo                                                   │  │  │
│  │  │  • diagnostico_principal                                        │  │  │
│  │  │  • servicio, estancia_dias                                      │  │  │
│  │  │  • fecha_ingreso, ccaa                                          │  │  │
│  │  │  • categoria_ingreso                                            │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                      CAPA DE ESTILOS Y UI/UX                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                        Tailwind CSS                                   │  │
│  │  ┌────────────────────────────────────────────────────────────────┐  │  │
│  │  │  • Configuración custom (tailwind.config.mjs)               │  │  │
│  │  │  • Color primary: #3B82F6                                      │  │  │
│  │  │  • Dark mode: class-based                                      │  │  │
│  │  │  • Plugin: @tailwindcss/forms                                  │  │  │
│  │  └────────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                   Componentes de Iconos                              │  │
│  │  • Material Symbols Outlined                                         │  │
│  │  • Componentes Astro para íconos (MoonIcon, SunIcon, SystemIcon)    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │                      Accesibilidad                                    │  │
│  │  • OpenDyslexic Font (CDN)                                           │  │
│  │  • Persistencia en localStorage                                      │  │
│  │  • ARIA labels y semantic HTML                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                    BIBLIOTECAS Y HERRAMIENTAS                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────────────────┐   │
│  │   Apache        │  │   TypeScript    │  │    PNPM                  │   │
│  │   ECharts       │  │   (Tipado)      │  │    (Package Manager)     │   │
│  │   (Gráficas)    │  │                 │  │                          │   │
│  └─────────────────┘  └─────────────────┘  └──────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘


═══════════════════════════════════════════════════════════════════════════════
                              FLUJO DE DATOS
═══════════════════════════════════════════════════════════════════════════════

1. Usuario accede a la página
                │
                ▼
2. Astro renderiza la página (SSR/SSG)
                │
                ▼
3. Se obtienen datos mediante getCollection()
                │
                ▼
4. Procesamiento y filtrado de datos en servidor
                │
                ▼
5. Datos se pasan a los componentes como props
                │
                ▼
6. ECharts renderiza gráficas interactivas en cliente
                │
                ▼
7. Usuario interactúa (filtros, búsqueda, paginación)
                │
                ▼
8. Navegación con parámetros URL (mantiene estado)
                │
                ▼
9. Nueva renderización con datos filtrados


═══════════════════════════════════════════════════════════════════════════════
                        CARACTERÍSTICAS PRINCIPALES
═══════════════════════════════════════════════════════════════════════════════

✅ Responsive Design (Mobile, Tablet, Desktop)
✅ Dark Mode / Light Mode
✅ Accesibilidad (OpenDyslexic, ARIA, Semantic HTML)
✅ Gráficas Interactivas (6 tipos diferentes)
✅ Sistema de Filtrado Avanzado (6 criterios)
✅ Búsqueda por ID con validación
✅ Paginación (25 resultados por página)
✅ Vista Detallada de Pacientes
✅ Persistencia de Estado (localStorage + URL params)
✅ Performance Optimizado (Static Site Generation)
✅ TypeScript para tipado fuerte
✅ Componentes Reutilizables
```

## Tecnologías Principales

| Categoría | Tecnología | Propósito |
|-----------|-----------|-----------|
| **Framework** | Astro | SSG/SSR, Arquitectura basada en componentes |
| **Lenguaje** | TypeScript | Tipado estático, mejor DX |
| **Estilos** | Tailwind CSS | Utility-first CSS, responsive design |
| **Gráficas** | Apache ECharts | Visualización de datos interactiva |
| **Gestión de Paquetes** | PNPM | Instalación rápida y eficiente |
| **Iconos** | Material Symbols | Iconografía consistente |
| **Formularios** | @tailwindcss/forms | Estilos de formularios mejorados |

## Patrón de Arquitectura

**JAMstack (JavaScript, APIs, Markup)**
- **JavaScript**: Interactividad en el cliente (ECharts, theme switcher)
- **APIs**: Content Collections de Astro + API endpoints
- **Markup**: HTML pre-renderizado para máximo rendimiento

## Ventajas de esta Arquitectura

1. **Performance**: Páginas estáticas generadas en build time
2. **SEO**: HTML renderizado en servidor
3. **Escalabilidad**: Fácil agregar nuevas páginas y funcionalidades
4. **Mantenibilidad**: Componentes reutilizables y código tipado
5. **Accesibilidad**: Diseñada desde el inicio con a11y en mente
6. **UX**: Responsive, dark mode, fuente para dislexia
