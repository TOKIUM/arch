import * as yaml from 'js-yaml';
import { ArchModule } from './ArchModule';

export class ArchEntry {
  constructor(
    public readonly module: ArchModule,
    public readonly description: string,
    public readonly children: ArchEntry[],
  ) {}

  static fromYaml(yamlStr: string): ArchEntry[] {
    const loaded = yaml.load(yamlStr)
    if (loaded === undefined || !(loaded instanceof Array)) return [];

    return loaded.map(ArchEntry.fromObject).filter((entry): entry is ArchEntry => entry !== undefined);
  }

  static fromObject(object: any): ArchEntry | undefined {
    if (object.module === undefined || object.description === undefined) return undefined;

    if (object.children === undefined || !(object.children instanceof Array)) return new ArchEntry(new ArchModule(object.module), object.description, []);

    const children = object.children.map((child: any) => ArchEntry.fromObject(child)).filter((child): child is ArchEntry => child !== undefined); 
    return new ArchEntry(new ArchModule(object.module), object.description, children);
  }

  match(archModules: ArchModule[]): boolean {
    if (archModules.length === 0) return false;

    const first = archModules[0];

    if (first.value !== this.module.value) return false;

    if (this.children.length === 0) return true;

    const rest = archModules.slice(1);
    return this.children.some((child) => child.match(rest));
  }
}
