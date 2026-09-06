import type { APIRoute } from 'astro';
import { confirmGuest } from '../../../lib/guests';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body?.name === 'string' ? body.name.trim() : '';

    if (!name) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Escribe tu nombre' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const result = await confirmGuest(name);

    if (!result) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invitado no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        alreadyConfirmed: result.alreadyConfirmed,
        name: result.guest.name,
        passes: result.guest.passes,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Error interno' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
