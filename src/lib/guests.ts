import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Guest {
  name: string;
  passes: number;
  confirmed: boolean;
  confirmedAt: string | null;
}

const dataDir = resolve(process.cwd(), 'data');
const guestsFile = resolve(dataDir, 'guests.json');

export function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export function readGuests(): Guest[] {
  if (!existsSync(guestsFile)) {
    throw new Error('No se encontró la lista de invitados (data/guests.json)');
  }
  return JSON.parse(readFileSync(guestsFile, 'utf-8')) as Guest[];
}

export function saveGuests(guests: Guest[]): void {
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  writeFileSync(guestsFile, JSON.stringify(guests, null, 2), 'utf-8');
}

export function findGuest(name: string): Guest | undefined {
  const normalized = normalizeName(name);
  if (!normalized) return undefined;
  return readGuests().find((guest) => normalizeName(guest.name) === normalized);
}