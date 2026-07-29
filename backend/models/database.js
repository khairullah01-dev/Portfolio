import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const databasePath = path.join(__dirname, '..', 'data', 'db.json');

export const readDatabase = () => JSON.parse(
  fs.readFileSync(databasePath, 'utf8').replace(/^\uFEFF/, ''),
);

export const saveDatabase = (database) => {
  fs.writeFileSync(databasePath, `${JSON.stringify(database, null, 2)}\n`);
};
