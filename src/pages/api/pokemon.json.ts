// src/pages/api/pokemon.json.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';

// Schema de validación con Zod - coincide con tu API de Oracle
const pokemonSchema = z.object({
  id: z.number(),
  identifier: z.string(),
  species_id: z.number(),
  height: z.number(),
  weight: z.number(),
  base_experience: z.number(),
  order_rw: z.number().optional(),
  is_default: z.number().optional(),
  sprite: z.string().nullable().optional(),
  types: z.array(z.string()).optional(),
  links: z.array(z.object({
    rel: z.string(),
    href: z.string()
  })).optional()
});

// Schema para la respuesta completa
const apiResponseSchema = z.object({
  items: z.array(pokemonSchema)
});

// URL de tu API de Oracle
const ORACLE_API_URL = 'https://gfb6b8e87d5150f-malahackatondbprueba.adb.eu-madrid-1.oraclecloudapps.com/ords/usuarioleftjoiners/pokemon_with_sprites/';

// Credenciales de autenticación (si las necesitas)
// const ORACLE_USERNAME = import.meta.env.ORACLE_USERNAME;
// const ORACLE_PASSWORD = import.meta.env.ORACLE_PASSWORD;

export const GET: APIRoute = async ({ request }) => {
  try {
    // Obtener parámetros de query (para filtros dinámicos)
    const url = new URL(request.url);
    const limit = url.searchParams.get('limit') || '1200';
    const offset = url.searchParams.get('offset') || '0';
    const type = url.searchParams.get('type'); // Filtro opcional por tipo

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

    // Validar con Zod
    const validationResult = apiResponseSchema.safeParse(data);

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

    // Filtrar por tipo si se especificó
    let items = validationResult.data.items;
    if (type) {
      items = items.filter(pokemon => 
        pokemon.types?.some(t => t.toLowerCase() === type.toLowerCase())
      );
    }

    // Retornar los datos validados
    return new Response(
      JSON.stringify({ items }),
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
