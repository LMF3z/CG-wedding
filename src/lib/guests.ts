import pool from './db';

export interface Guest {
  name: string;
  passes: number;
  confirmed: boolean;
  confirmedAt: string | null;
}

export function normalizeName(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export async function getGuests(): Promise<Guest[]> {
  const { rows } = await pool.query(
    'SELECT name, passes, confirmed, confirmed_at AS "confirmedAt" FROM guests ORDER BY name ASC'
  );
  return rows;
}

export async function findGuest(name: string): Promise<Guest | undefined> {
  const normalized = normalizeName(name);
  if (!normalized) return undefined;
  const { rows } = await pool.query(
    'SELECT name, passes, confirmed, confirmed_at AS "confirmedAt" FROM guests WHERE normalized_name = $1',
    [normalized]
  );
  return rows[0];
}

export async function confirmGuest(
  name: string
): Promise<{ guest: Guest; alreadyConfirmed: boolean } | undefined> {
  const guest = await findGuest(name);
  if (!guest) return undefined;
  if (guest.confirmed) return { guest, alreadyConfirmed: true };

  const normalized = normalizeName(name);
  await pool.query(
    'UPDATE guests SET confirmed = true, confirmed_at = NOW() WHERE normalized_name = $1',
    [normalized]
  );

  return { guest: { ...guest, confirmed: true, confirmedAt: new Date().toISOString() }, alreadyConfirmed: false };
}
