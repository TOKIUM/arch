export type ArchAllow = 'files' | 'submodules';

export const ArchAllow = {
  from(allowStr: string): ArchAllow[] {
    switch (allowStr) {
      case 'files':
        return ['files'];
      case 'submodules':
        return ['submodules'];
      case 'none':
        return [];
      default: // 'all'
        return ['files', 'submodules'];
    }
  }
}