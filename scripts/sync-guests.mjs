import { readFileSync, writeFileSync } from 'node:fs';

const seedPath = process.argv[2];
const targetPath = process.argv[3];

const signature = (list) =>
  JSON.stringify(list.map(({ name, passes }) => [name, passes]));

const seed = JSON.parse(readFileSync(seedPath, 'utf8'));
const seedSig = signature(seed);

let currentSig = null;
try {
  currentSig = signature(JSON.parse(readFileSync(targetPath, 'utf8')));
} catch {}

if (seedSig !== currentSig) {
  writeFileSync(targetPath, JSON.stringify(seed, null, 2) + '\n', 'utf8');
  console.log('guests.json actualizado con la nueva lista de invitados');
} else {
  console.log('guests.json sin cambios (lista idéntica)');
}