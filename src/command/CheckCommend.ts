import { ArchDirectory } from '../core/ArchDirectory';
import { listFiles } from '../util/files';
import { ArchEntryParser } from '../core/ArchEntryParser';

export class CheckCommand {
  static async execute(
    settingPath: string | undefined,
    inputFilePaths: string[],
  ): Promise<number> {
    const archEntries = ArchEntryParser.parse(settingPath);
    const extractedPaths = inputFilePaths.flatMap(listFiles);
    const result = extractedPaths.flatMap((fp) => {
      const directories = ArchDirectory.fromFilePath(fp);
      const found = archEntries.find((entry) => entry.match(directories));

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
