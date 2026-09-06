import { readFileSync } from 'node:fs';
import pg from 'pg';

const seedPath = process.argv[2] || '/app/seed/guests.json';

function normalizeName(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

async function main() {
  const pool = new pg.Pool({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 5,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS guests (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      normalized_name VARCHAR(255) NOT NULL UNIQUE,
      passes INTEGER NOT NULL DEFAULT 1,
      confirmed BOOLEAN NOT NULL DEFAULT false,
      confirmed_at TIMESTAMPTZ
    )
  `);

  const guests = JSON.parse(readFileSync(seedPath, 'utf-8'));
  console.log(`Seed: ${guests.length} invitados en ${seedPath}`);

  for (const guest of guests) {
    const normalized = normalizeName(guest.name);
    const { rowCount } = await pool.query(
      `INSERT INTO guests (name, normalized_name, passes, confirmed, confirmed_at)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (normalized_name) DO NOTHING`,
      [guest.name, normalized, guest.passes, guest.confirmed || false, guest.confirmedAt || null]
    );
    if (rowCount > 0) {
      console.log(`  + ${guest.name}`);
    }
  }

  const { rows } = await pool.query('SELECT COUNT(*) AS total FROM guests');
  console.log(`Seed completo. Total en DB: ${rows[0].total}`);

  await pool.end();
}

main().catch((err) => {
  console.error('Error en seed:', err);
  process.exit(1);
});
