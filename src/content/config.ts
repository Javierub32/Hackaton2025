import { z, defineCollection } from 'astro:content';

// Mapeo de categorías de ingreso
const CATEGORIAS_INGRESO: Record<number, string> = {
  0: "Trastornos del humor [afectivos]",
  1: "Trastornos mentales y del comportamiento debidos al uso de sustancias psicoactivas",
  2: "Esquizofrenia, trastornos esquizotípicos y trastornos delirantes",
  3: "Trastornos neuróticos, trastornos relacionados con el estrés y trastornos somatomorfos",
  4: "Trastornos de la personalidad y del comportamiento en adultos",
  5: "Trastornos emocionales y del comportamiento que aparecen habitualmente en la niñez y en la adolescencia",
  6: "Síndromes del comportamiento asociados con alteraciones fisiológicas y factores físicos",
};

// Esquema de validación para los datos principales de pacientes
const datosPrincipalesSchema = z.object({
  paciente_id: z.number().int(),
  fecha_nacimiento: z.string(), // Formato: M/D/YY
  sexo: z.number().int(), // Sin restricción min/max para aceptar todos los valores de la DB
  estancia_dias: z.number().int().nonnegative(),
  fecha_ingreso: z.string(), // Formato: M/D/YY
  fecha_alta: z.string(), // Formato: DD/MM/YYYY
  diagnostico_principal: z.string(),
  servicio: z.string(), // Ej: "PSQ", "PED"
  categoria_ingreso: z.number().int(),
  categoria_ingreso_descripcion: z.string().optional(), // Descripción de la categoría
  edad: z.number().int().nonnegative(),
  ccaa: z.number().int(), // Comunidad Autónoma
});

// Loader personalizado para cargar datos desde Oracle ORDS
async function loadDatosPrincipales() {
  const ORDS_BASE = import.meta.env.ORDS_BASE;
  const ORDS_PATH = import.meta.env.ORDS_PATH;
  const ORDS_USER = import.meta.env.ORDS_USER;
  const ORDS_PASS = import.meta.env.ORDS_PASS;

  // Validar que las variables de entorno estén configuradas
  if (!ORDS_BASE || !ORDS_PATH) {
    console.error('❌ Variables de entorno ORDS no configuradas');
    return [];
  }
  
  try {
    // Crear cabeceras con autenticación Basic
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Agregar autenticación Basic si hay credenciales
    if (ORDS_USER && ORDS_PASS) {
      const credentials = btoa(`${ORDS_USER}:${ORDS_PASS}`);
      headers['Authorization'] = `Basic ${credentials}`;
    }

    console.log('🔄 Cargando TODOS los datos desde Oracle ORDS...');
    
    let allPacientes: any[] = [];
    let offset = 0;
    const limit = 10000; // Aumentar el tamaño de página a máximo permitido por ORDS
    let hasMore = true;
    let pageCount = 0;

    // Paginación para obtener todos los registros
    while (hasMore) {
      pageCount++;
      const url = `${ORDS_BASE}${ORDS_PATH}?limit=${limit}&offset=${offset}`;
      
      console.log(`📄 Cargando página ${pageCount} (offset: ${offset})...`);
      
      const response = await fetch(url, { headers });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Verificar si hay items
      if (data.items && data.items.length > 0) {
        allPacientes = [...allPacientes, ...data.items];
        console.log(`📊 Total acumulado: ${allPacientes.length} registros`);
        
        // Verificar si hay más datos
        // Si recibimos exactamente 'limit' registros, probablemente hay más
        hasMore = data.items.length === limit;
        
        // Incrementar offset para la siguiente página
        offset += data.items.length;
        
        // Seguridad: límite máximo de páginas para evitar loop infinito
        if (pageCount > 100) {
          console.warn('⚠️ Se alcanzó el límite de 100 páginas. Deteniendo la carga.');
          hasMore = false;
        }
      } else {
        console.log('🏁 No hay más registros disponibles.');
        hasMore = false;
      }
    }
    
    // Mapear los datos excluyendo los links y añadiendo descripción de categoría
    const pacientes = allPacientes.map((item: any, index: number) => {
      const { links, ...rest } = item;
      return {
        id: `paciente-${item.id_usuario}-${item.estancia_dias}-${index}`, // ID único para cada entrada
        paciente_id: item.id_usuario, // Mapear id_usuario a paciente_id para compatibilidad
        ...rest,
        categoria_ingreso_descripcion: CATEGORIAS_INGRESO[item.categoria_ingreso] || `Categoría ${item.categoria_ingreso}`,
      };
    });

    console.log(`✅ ${pacientes.length} pacientes cargados exitosamente en ${pageCount} páginas (TOTAL)`);
    return pacientes;
    
  } catch (error) {
    console.error('❌ Error al cargar datos desde ORDS:', error);
    return [];
  }
}

// Definición de la colección con loader personalizado
const datosPrincipalesCollection = defineCollection({
  loader: loadDatosPrincipales,
  schema: datosPrincipalesSchema,
});

// Exportar las colecciones
export const collections = {
  datosPrincipales: datosPrincipalesCollection,
};

// Exportar el tipo para usar en otras partes de la aplicación
export type DatosPrincipales = z.infer<typeof datosPrincipalesSchema>;

// Exportar el mapeo de categorías para uso en otras partes de la aplicación
export { CATEGORIAS_INGRESO };
