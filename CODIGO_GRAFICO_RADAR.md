# Código del Gráfico Radar - Distribución por Categorías

## 📋 Código completo para implementar en otro archivo

### 1. Preparar los datos en el frontmatter (Astro)

```astro
---
import { getCollection } from 'astro:content';

// Obtener TODOS los datos de pacientes
const todosPacientes = await getCollection('datosPrincipales');

// Distribución por categoría de ingreso
const categorias = todosPacientes.reduce((acc, p) => {
  const categoria = p.data.categoria_ingreso_descripcion || 'Sin categoría';
  acc[categoria] = (acc[categoria] || 0) + 1;
  return acc;
}, {} as Record<string, number>);
---
```

### 2. HTML del contenedor

```html
<div class="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
  <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Distribución por Categoría</h2>
  <div id="chartCategorias" style="height: 400px;"></div>
</div>
```

### 3. Script para pasar datos a JavaScript

```astro
<script is:inline define:vars={{ categoriasData: categorias }}>
  window.categoriasData = categoriasData;
</script>
```

### 4. Script principal del gráfico

```astro
<script>
  import * as echarts from 'echarts';

  // Detectar tema oscuro
  const isDark = document.documentElement.classList.contains('dark');
  const theme = isDark ? 'dark' : 'light';

  // Colores para tema claro y oscuro
  const colors = {
    light: {
      text: '#374151',
      background: '#ffffff',
      grid: '#e5e7eb',
    },
    dark: {
      text: '#d1d5db',
      background: '#1f2937',
      grid: '#374151',
    }
  };

  const currentColors = isDark ? colors.dark : colors.light;

  // Gráfica: Distribución por Categoría (Radar Chart con puntos individuales)
  const chartCategorias = echarts.init(document.getElementById('chartCategorias'));
  const categoriaEntries = Object.entries(window.categoriasData);
  const maxValorCategoria = Math.max(...Object.values(window.categoriasData));
  
  // Crear múltiples series, una por cada categoría
  const radarSeries = categoriaEntries.map(([categoria, valor], index) => {
    const values = new Array(categoriaEntries.length).fill(0);
    values[index] = valor;
    return {
      name: categoria,
      type: 'radar',
      symbol: 'circle',
      symbolSize: 8,
      lineStyle: {
        width: 1.5,
        opacity: 0.8
      },
      areaStyle: {
        opacity: 0.1
      },
      data: [
        {
          value: values,
          name: categoria,
          itemStyle: {
            color: `hsl(${(index * 360) / categoriaEntries.length}, 70%, 60%)`
          }
        }
      ]
    };
  });
  
  chartCategorias.setOption({
    tooltip: {
      trigger: 'item',
      confine: true,
      appendToBody: true,
      className: 'custom-tooltip',
      formatter: function(params: any) {
        return `<strong>${params.seriesName}</strong><br/>Pacientes: ${params.value.find((v: number) => v > 0) || 0}`;
      },
      extraCssText: 'z-index: 10000;'
    },
    legend: {
      show: false
    },
    radar: {
      indicator: categoriaEntries.map(([key]) => ({
        name: key.length > 15 ? key.substring(0, 15) + '...' : key,
        max: maxValorCategoria
      })),
      axisName: {
        color: currentColors.text,
        fontSize: 11
      }
    },
    series: radarSeries
  });

  // Hacer el gráfico responsive
  window.addEventListener('resize', () => {
    chartCategorias.resize();
  });
</script>
```

### 5. CSS adicional (añadir en global.css)

```css
/* Asegurar que los tooltips de ECharts queden por encima del sidebar */
.custom-tooltip,
div[class*="echarts-tooltip"] {
  z-index: 10000 !important;
}
```

## 📦 Requisitos

1. **Instalar Apache ECharts:**
   ```bash
   pnpm add echarts
   ```

2. **Importar en el script:**
   ```javascript
   import * as echarts from 'echarts';
   ```

## 🎯 Características del gráfico

✅ **Tooltips individuales** - Solo muestra datos del punto específico  
✅ **Z-index alto** - Aparece por encima del sidebar  
✅ **Responsive** - Se adapta al tamaño de pantalla  
✅ **Nombres truncados** - Etiquetas de 15 caracteres máximo  
✅ **Tooltip con nombre completo** - Muestra el nombre original  
✅ **Colores únicos** - Cada categoría tiene su propio color  
✅ **Modo oscuro/claro** - Compatible con ambos temas  

## 💡 Notas de implementación

- Las etiquetas en el radar muestran máximo 15 caracteres + "..."
- El tooltip muestra siempre el nombre completo de la categoría
- Cada punto tiene un color único generado con HSL
- El gráfico tiene áreas semitransparentes para mejor visualización
- Compatible con Astro y layout DashboardLayout
