import type { APIRoute } from 'astro';
import { findGuest, readGuests, saveGuests } from '../../../lib/guests';

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

    const guest = findGuest(name);

    if (!guest) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invitado no encontrado' }),
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (guest.confirmed) {
      return new Response(
        JSON.stringify({
          ok: true,
          alreadyConfirmed: true,
          name: guest.name,
          passes: guest.passes,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const guests = readGuests();
    const target = guests.find((g) => g.name === guest.name);
    if (target) {
      target.confirmed = true;
      target.confirmedAt = new Date().toISOString();
      saveGuests(guests);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        alreadyConfirmed: false,
        name: guest.name,
        passes: guest.passes,
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