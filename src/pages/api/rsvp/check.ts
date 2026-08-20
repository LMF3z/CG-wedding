import type { APIRoute } from 'astro';
import { findGuest } from '../../../lib/guests';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return new Response(
        JSON.stringify({ ok: false, found: false, error: 'Escribe tu nombre' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const guest = findGuest(name);

    if (!guest) {
      return new Response(
        JSON.stringify({
          ok: false,
          found: false,
          error: 'No encontramos tu nombre en la lista de invitados',
        }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        found: true,
        name: guest.name,
        passes: guest.passes,
        confirmed: guest.confirmed,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, found: false, error: 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};