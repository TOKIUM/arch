import { ArchModule } from './ArchModule';

describe('ArchPath', () => {
  describe('fromPath', () => {
    it('should be able to be created from a path', () => {
      const actual1 = ArchModule.fromFilePath('/foo/bar/baz.txt');
      expect(actual1).toEqual([
        new ArchModule('foo'),
        new ArchModule('bar'),
      ]);

      const actual2 = ArchModule.fromFilePath('foo/bar/baz');
      expect(actual2).toEqual([
        new ArchModule('foo'),
        new ArchModule('bar'),
      ]);

      const actual3 = ArchModule.fromFilePath('baz.txt');
      expect(actual3).toEqual([]);
    });
  });
});
