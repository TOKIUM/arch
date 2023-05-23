import { ArchModule } from './ArchModule';
import YAML from 'yaml'

export class ArchEntry {
  constructor(
    public readonly module: ArchModule,
    public readonly description: string,
    public readonly allow: boolean,
    public readonly children: ArchEntry[],
  ) {}

  static fromYaml(yamlStr: string): ArchEntry[] {
    const loaded = YAML.parse(yamlStr);
    if (loaded === undefined || !(loaded instanceof Array)) return [];

    return loaded.map(ArchEntry.fromObject).filter((entry): entry is ArchEntry => entry !== undefined);
  }

  static fromObject(object: any): ArchEntry | undefined {
    if (object.module === undefined || object.description === undefined) return undefined;
    const allow = object.allow === undefined ? true : object.allow;

    if (object.children === undefined || !(object.children instanceof Array)) return new ArchEntry(new ArchModule(object.module), object.description, allow, []);

    const children = object.children.map((child: any) => ArchEntry.fromObject(child)).filter((child): child is ArchEntry => child !== undefined); 
    return new ArchEntry(new ArchModule(object.module), object.description, allow, children);
  }

  match(archModules: ArchModule[]): boolean {
    if (archModules.length === 0) return false;

    const first = archModules[0];

    if (first.value !== this.module.value) return false;

    if (this.allow === false) return false;

    if (this.children.length === 0) return true;

    const rest = archModules.slice(1);
    return this.children.some((child) => child.match(rest));
  }
}
