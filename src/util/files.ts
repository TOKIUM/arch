import * as fs from 'fs';

export function listFiles(filepath: string): string[] {
  const stats = fs.statSync(filepath);

  if (stats.isFile()) { return [filepath]; }

  if (stats.isDirectory()) {
    return fs.readdirSync(filepath).map(filename => listFiles(`${filepath}/${filename}`)).flat();
  }

  return [];
}
