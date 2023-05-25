export type ArchAllow = 'files' | 'subdirectories';

export const ArchAllow = {
  from(allowStr: string): ArchAllow[] {
    switch (allowStr) {
      case 'files':
        return ['files'];
      case 'subdirectories':
        return ['subdirectories'];
      case 'none':
        return [];
      default: // 'all'
        return ['files', 'subdirectories'];
    }
  }
}