import { ArchEntry } from './ArchEntry';
import * as fs from 'fs';
import YAML from 'yaml';
import { ArchDirectory } from './ArchDirectory';
import { ArchAllow } from './ArchAllow';

interface ArchEntryObject {
  directory: string;
  description: string;
  allow: string | undefined;
  subdirectories: ArchEntryObject[] | undefined;
  includes: string[] | undefined;
}

export class ArchEntryParser {
  static parse(filePath: string | undefined): ArchEntry[] {
    const yaml = fs.readFileSync(filePath ?? 'arch.yml', 'utf-8');
    const parsedYaml = YAML.parse(yaml);
    if (parsedYaml === undefined || !(parsedYaml instanceof Array)) return [];

    return parsedYaml.map(ArchEntryParser.parseObject).filter((entry): entry is ArchEntry => entry !== undefined);
  }

  static parseObject(object: any): ArchEntry | undefined {
    const directory = (typeof object.directory === 'string') ? object.directory : undefined;
    const description = (typeof object.description === 'string') ? object.description : undefined;
    const allow = (typeof object.allow === 'string') ? object.allow : undefined;
    const subdirectories = (object.subdirectories instanceof Array) ? object.subdirectories : undefined; 
    const includes = (object.includes instanceof Array) ? object.includes : undefined;

    const aeo: ArchEntryObject = {
      directory,
      description,
      allow,
      subdirectories,
      includes,
    };

    if (aeo.directory === undefined || aeo.description === undefined) return undefined;

    const includeEntries = aeo.includes?.flatMap(ArchEntryParser.parse) ?? [];

    const subdirectoryEntries = aeo.subdirectories?.flatMap(ArchEntryParser.parseObject).filter((entry): entry is ArchEntry => entry !== undefined) ?? [];

    return new ArchEntry(
      new ArchDirectory(aeo.directory),
      aeo.description,
      ArchAllow.from(aeo.allow),
      [...subdirectoryEntries, ...includeEntries]
    );
  }
}