export class ArchDirectory {
  constructor(
    public readonly value: string,
  ) {}

  static fromFilePath(filePath: string): ArchDirectory[] {
    const splitted = filePath.split('/');
    const noFile = splitted.slice(0, splitted.length - 1);
    const noEmpty = noFile.filter((p) => p !== '' && p !== '.');
    return noEmpty.map((p) => new ArchDirectory(p));
  }
}
