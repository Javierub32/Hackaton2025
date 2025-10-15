// src/pages/api/datosMedicos.json.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';

// Schema de validación con Zod - coincide con la API de datos médicos
const datoMedicoSchema = z.object({
  "comunidad autónoma": z.string(),
  fecha_de_nacimiento: z.string(),
  sexo: z.number(),
  ccaa_residencia: z.string().nullable(),
  fecha_de_ingreso: z.string(),
  circunstancia_de_contacto: z.number(),
  fecha_de_fin_contacto: z.string(),
  tipo_alta: z.number(),
  "estancia días": z.number(),
  "diagnóstico principal": z.string(),
  categoría: z.string(),
  "diagnóstico 2": z.string().nullable(),
  "diagnóstico 3": z.string().nullable(),
  "diagnóstico 4": z.string().nullable(),
  "diagnóstico 5": z.string().nullable(),
  "diagnóstico 6": z.string().nullable(),
  "diagnóstico 7": z.string().nullable(),
  "diagnóstico 8": z.string().nullable(),
  "diagnóstico 9": z.string().nullable(),
  "diagnóstico 10": z.string().nullable(),
  "diagnóstico 11": z.string().nullable(),
  "diagnóstico 12": z.string().nullable(),
  "diagnóstico 13": z.string().nullable(),
  "diagnóstico 14": z.string().nullable(),
  "fecha de intervención": z.string().nullable(),
  procedimiento_1: z.string().nullable(),
  procedimiento_2: z.string().nullable(),
  procedimiento_3: z.string().nullable(),
  procedimiento_4: z.string().nullable(),
  procedimiento_5: z.string().nullable(),
  procedimiento_6: z.string().nullable(),
  procedimiento_7: z.string().nullable(),
  procedimiento_8: z.string().nullable(),
  procedimiento_9: z.string().nullable(),
  procedimiento_10: z.string().nullable(),
  procedimiento_11: z.string().nullable(),
  procedimiento_12: z.string().nullable(),
  procedimiento_13: z.string().nullable(),
  procedimiento_14: z.string().nullable(),
  procedimiento_15: z.string().nullable(),
  procedimiento_16: z.string().nullable(),
  procedimiento_17: z.string().nullable(),
  procedimiento_18: z.string().nullable(),
  procedimiento_19: z.string().nullable(),
  procedimiento_20: z.string().nullable(),
  gdr_ap: z.union([z.string(), z.number()]).nullable(),
  cdm_ap: z.union([z.string(), z.number()]).nullable(),
  tipo_gdr_ap: z.string().nullable(),
  "valor peso español": z.string().nullable(),
  grd_apr: z.number(),
  cdm_apr: z.number(),
  tipo_gdr_apr: z.string().nullable(),
  valor_peso_americano_apr: z.string().nullable(),
  nivel_severidad_apr: z.number(),
  riesgo_mortalidad_apr: z.number(),
  servicio: z.string(),
  edad: z.number(),
  reingreso: z.union([z.string(), z.number()]).nullable(),
  coste_apr: z.number(),
  gdr_ir: z.union([z.string(), z.number()]).nullable(),
  tipo_gdr_ir: z.string().nullable(),
  tipo_proceso_ir: z.string().nullable(),
  cie: z.number(),
  "número de registro anual": z.number(),
  centro_recodificado: z.string(),
  cip_sns_recodificado: z.string().nullable(),
  "país nacimiento": z.string(),
  "país residencia": z.string(),
  fecha_de_inicio_contacto: z.string(),
  "régimen financiación": z.number(),
  procedencia: z.number(),
  continuidad_asistencial: z.number(),
  ingreso_en_uci: z.number(),
  "días uci": z.union([z.string(), z.number()]).nullable(),
  "diagnóstico 15": z.string().nullable(),
  "diagnóstico 16": z.string().nullable(),
  "diagnóstico 17": z.string().nullable(),
  "diagnóstico 18": z.string().nullable(),
  "diagnóstico 19": z.string().nullable(),
  "diagnóstico 20": z.string().nullable(),
  "poa diagnóstico principal": z.string().nullable(),
  "poa diagnóstico 2": z.string().nullable(),
  "poa diagnóstico 3": z.string().nullable(),
  "poa diagnóstico 4": z.string().nullable(),
  "poa diagnóstico 5": z.string().nullable(),
  "poa diagnóstico 6": z.string().nullable(),
  "poa diagnóstico 7": z.string().nullable(),
  "poa diagnóstico 8": z.string().nullable(),
  "poa diagnóstico 9": z.string().nullable(),
  "poa diagnóstico 10": z.string().nullable(),
  "poa diagnóstico 11": z.string().nullable(),
  "poa diagnóstico 12": z.string().nullable(),
  "poa diagnóstico 13": z.string().nullable(),
  "poa diagnóstico 14": z.string().nullable(),
  "poa diagnóstico 15": z.string().nullable(),
  "poa diagnóstico 16": z.string().nullable(),
  "poa diagnóstico 17": z.string().nullable(),
  "poa diagnóstico 18": z.string().nullable(),
  "poa diagnóstico 19": z.string().nullable(),
  "poa diagnóstico 20": z.string().nullable(),
  procedimiento_externo_1: z.string().nullable(),
  procedimiento_externo_2: z.string().nullable(),
  procedimiento_externo_3: z.string().nullable(),
  procedimiento_externo_4: z.string().nullable(),
  procedimiento_externo_5: z.string().nullable(),
  procedimiento_externo_6: z.string().nullable(),
  tipo_grd_apr: z.string().nullable(),
  "peso español apr": z.string().nullable(),
  edad_en_ingreso: z.number(),
  mes_de_ingreso: z.string(),
  id_usuario: z.number(),
  links: z.array(z.object({
    rel: z.string(),
    href: z.string()
  })).optional()
});

// URL de la API de Oracle
const ORACLE_API_URL = 'https://g4be99438af815a-malackathon2025.adb.eu-madrid-1.oraclecloudapps.com/ords/malackathon/saludmental/';

// Credenciales de autenticación (si las necesitas)
// const ORACLE_USERNAME = import.meta.env.ORACLE_USERNAME;
// const ORACLE_PASSWORD = import.meta.env.ORACLE_PASSWORD;

export const GET: APIRoute = async ({ request }) => {
  try {
	// Obtener parámetros de query (para filtros dinámicos)
	const url = new URL(request.url);
	const limit = url.searchParams.get('limit') || '25';
	const offset = url.searchParams.get('offset') || '0';
	const comunidad = url.searchParams.get('comunidad'); // Filtro opcional por comunidad autónoma
	const servicio = url.searchParams.get('servicio'); // Filtro opcional por servicio

	// Construir la URL con parámetros
	const apiUrl = `${ORACLE_API_URL}?limit=${limit}&offset=${offset}`;

	// Headers para la petición (incluir autenticación Basic si es necesaria)
	const headers: HeadersInit = {
	  'Content-Type': 'application/json',
	  // Si necesitas autenticación Basic:
	  // 'Authorization': `Basic ${btoa(`${ORACLE_USERNAME}:${ORACLE_PASSWORD}`)}`
	};

	// Hacer la petición a la API de Oracle
	const response = await fetch(apiUrl, {
	  method: 'GET',
	  headers
	});

	if (!response.ok) {
	  return new Response(
		JSON.stringify({
		  error: 'Error al obtener datos de Oracle',
		  status: response.status,
		  statusText: response.statusText
		}),
		{
		  status: response.status,
		  headers: {
			'Content-Type': 'application/json'
		  }
		}
	  );
	}

	// Obtener los datos
	const data = await response.json();

	// Validar con Zod - validar el array de items directamente
	const validationResult = z.array(datoMedicoSchema).safeParse(data.items);

	if (!validationResult.success) {
	  console.error('Error de validación Zod:', validationResult.error);
	  return new Response(
		JSON.stringify({
		  error: 'Error de validación de datos',
		  details: validationResult.error.issues
		}),
		{
		  status: 500,
		  headers: {
			'Content-Type': 'application/json'
		  }
		}
	  );
	}

	// Filtrar por comunidad autónoma o servicio si se especificó
	let items = validationResult.data;
	
	if (comunidad) {
	  items = items.filter((dato) => 
		dato["comunidad autónoma"].toLowerCase().includes(comunidad.toLowerCase())
	  );
	}
	
	if (servicio) {
	  items = items.filter((dato) => 
		dato.servicio.toLowerCase() === servicio.toLowerCase()
	  );
	}

	// Retornar los datos validados
	return new Response(
	  JSON.stringify({ 
		items,
		hasMore: data.hasMore,
		limit: data.limit,
		offset: data.offset,
		count: items.length,
		totalCount: data.count,
		links: data.links
	  }),
	  {
		status: 200,
		headers: {
		  'Content-Type': 'application/json',
		  // Headers de caché (opcional)
		  'Cache-Control': 'public, max-age=300, s-maxage=600', // 5 min client, 10 min CDN
		}
	  }
	);

  } catch (error) {
	console.error('Error en el endpoint:', error);
	return new Response(
	  JSON.stringify({
		error: 'Error interno del servidor',
		message: error instanceof Error ? error.message : 'Error desconocido'
	  }),
	  {
		status: 500,
		headers: {
		  'Content-Type': 'application/json'
		}
	  }
	);
  }
};



