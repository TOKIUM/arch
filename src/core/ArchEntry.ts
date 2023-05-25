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
    
    const isFile = archModules.length === 1;
    const isModule = archModules.length > 1;

    // 何も許可されていないならば、拒否
    if (this.allow.length === 0) return false;
    // ファイルならば、それ以降のモジュールは考慮不要 許可されているかどうかだけチェック
    if (isFile) return this.allow.includes('files');
    // モジュールならば、それ以降のモジュールは後で考慮するものの、モジュールが拒否されていないかチェック
    if (isModule && !this.allow.includes('submodules')) return false;

    // それ以上submoduleの指定がなければ、それ以下はすべて許可
    if (isModule && this.submodules.length === 0) return true;

    const rest = archModules.slice(1);
    return this.submodules.some((child) => child.match(rest));
  }
}
