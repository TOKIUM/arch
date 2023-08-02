import { ArchEntry } from '../core/ArchEntry';
import * as fs from 'fs';
import { ArchDirectory } from '../core/ArchDirectory';
import { listFiles } from '../util/files';

export class CoverageCommand {
  static async execute(
    settingPath: string | undefined,
    inputFilePaths: string[],
  ): Promise<number> {
    const yaml = fs.readFileSync(settingPath ?? 'arch.yml', 'utf-8');
    const archEntries = ArchEntry.fromYaml(yaml);
    const extractedPaths = inputFilePaths.flatMap(listFiles);
    const result = extractedPaths.reduce((acc, curr) => {
      const directories = ArchDirectory.fromFilePath(curr);
      const found = archEntries.find((entry) => entry.match(directories));

      if (found !== undefined) { acc.valid.push(curr); }
      if (found === undefined) { acc.invalid.push(curr); }

      return acc;
    }, { valid: [], invalid: [] });

    console.log('Coverage report:');
    console.log(`  - ${result.valid.length} valid files. (${(result.valid.length / extractedPaths.length * 100).toFixed(2)}%)`);
    console.log(`  - ${result.invalid.length} invalid files. (${(result.invalid.length / extractedPaths.length * 100).toFixed(2)}%)`);

    return 0;
  }
}
