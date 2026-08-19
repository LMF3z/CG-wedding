import type { APIRoute } from 'astro';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const prerender = false;

const dataDir = resolve(process.cwd(), 'data');
const rsvpFile = resolve(dataDir, 'rsvps.json');

interface RsvpEntry {
  id: string;
  name: string;
  guests: number;
  message: string;
  createdAt: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const name = typeof body?.name === 'string' ? body.name.trim() : '';
    const guests = body?.guests === 2 ? 2 : body?.guests === 1 ? 1 : 0;
    const message = typeof body?.message === 'string' ? body.message.trim() : '';

    if (!name || guests === 0) {
      return new Response(JSON.stringify({ ok: false, error: 'Campos inválidos' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!existsSync(dataDir)) {
      mkdirSync(dataDir, { recursive: true });
    }

    const entries = existsSync(rsvpFile)
      ? (JSON.parse(readFileSync(rsvpFile, 'utf-8')) as RsvpEntry[])
      : [];

    entries.push({
      id: crypto.randomUUID(),
      name,
      guests,
      message,
      createdAt: new Date().toISOString(),
    });

    writeFileSync(rsvpFile, JSON.stringify(entries, null, 2), 'utf-8');

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Error interno' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};