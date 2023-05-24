import { ArchAllow } from './ArchAllow';
import { ArchModule } from './ArchModule';
import YAML from 'yaml'

export class ArchEntry {
  constructor(
    public readonly module: ArchModule,
    public readonly description: string,
    public readonly allow: ArchAllow[],
    public readonly submodules: ArchEntry[],
  ) {}

  static fromYaml(yamlStr: string): ArchEntry[] {
    const loaded = YAML.parse(yamlStr);
    if (loaded === undefined || !(loaded instanceof Array)) return [];

    return loaded.map(ArchEntry.fromObject).filter((entry): entry is ArchEntry => entry !== undefined);
  }

  static fromObject(object: any): ArchEntry | undefined {
    if (object.module === undefined || object.description === undefined) return undefined;
    const allowStr = object.allow === undefined ? '' : object.allow;
    const allow = ArchAllow.from(allowStr);

    if (object.submodules === undefined || !(object.submodules instanceof Array)) return new ArchEntry(new ArchModule(object.module), object.description, allow, []);

    const submodules = object.submodules.map((child: any) => ArchEntry.fromObject(child)).filter((child): child is ArchEntry => child !== undefined); 
    return new ArchEntry(new ArchModule(object.module), object.description, allow, submodules);
  }

  match(archModules: ArchModule[]): boolean {
    if (archModules.length === 0) return false;

    const first = archModules[0];

    if (first.value !== this.module.value) return false;

    // 何も許可されていないならば、すべて拒否
    if (this.allow.length === 0) return false;
    // fileが許可されていて、最後のmoduleならばそのあとに続くのはファイルなので、許可
    if (archModules.length === 1 && this.allow.includes('files')) return true;
    // submoduleが許可されていなくて、最後のmoduleならばそのあとに続くのはsubmoduleなので、拒否
    if (archModules.length > 1 && !this.allow.includes('submodules')) return false;

    // それ以上submoduleの指定がなければ、それ以下のmoduleはすべて許可
    if (this.submodules.length === 0) return true;

    const rest = archModules.slice(1);
    return this.submodules.some((child) => child.match(rest));
  }
}
