import { ArchEntry } from '../core/ArchEntry';
import * as fs from 'fs';
import { ArchModule } from '../core/ArchModule';
import { listFiles } from '../util/files';

export class CheckCommand {
  static async execute(
    settingPath: string | undefined,
    inputFilePaths: string[],
  ): Promise<number> {
    const yaml = fs.readFileSync(settingPath ?? 'arch-sentry.yml', 'utf-8');
    const archEntries = ArchEntry.fromYaml(yaml);
    const extractedPaths = inputFilePaths.flatMap(listFiles);
    const result = extractedPaths.flatMap((fp) => {
      const modules = ArchModule.fromFilePath(fp);
      const found = archEntries.find((entry) => entry.match(modules));

      if (found === undefined) { return [fp]; }

      return [];
    });

    if (result.length === 0) {
      console.log('All files are valid');
      return 0;
    }

    console.log('Invalid files:');
    result.forEach((fp) => console.log(`  - ${fp}`));
    return 1;
  }
}
