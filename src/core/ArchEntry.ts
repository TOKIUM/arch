import { ArchAllow } from './ArchAllow';
import { ArchDirectory } from './ArchDirectory';

export class ArchEntry {
  constructor(
    public readonly directory: ArchDirectory,
    public readonly description: string,
    public readonly allow: ArchAllow[],
    public readonly subdirectories: ArchEntry[],
  ) {}

  match(archDirectories: ArchDirectory[]): boolean {
    if (archDirectories.length === 0) return false;

    const first = archDirectories[0];

    if (first.value !== this.directory.value) return false;
    
    const isFile = archDirectories.length === 1;
    const isDirectory = archDirectories.length > 1;

    // 何も許可されていないならば、拒否
    if (this.allow.length === 0) return false;
    // ファイルならば、それ以降のモジュールは考慮不要 許可されているかどうかだけチェック
    if (isFile) return this.allow.includes('files');
    // モジュールならば、それ以降のモジュールは後で考慮するものの、モジュールが拒否されていないかチェック
    if (isDirectory && !this.allow.includes('subdirectories')) return false;

    // それ以上subdirectoriesの指定がなければ、それ以下はすべて許可
    if (isDirectory && this.subdirectories.length === 0) return true;

    const rest = archDirectories.slice(1);
    return this.subdirectories.some((child) => child.match(rest));
  }
}
