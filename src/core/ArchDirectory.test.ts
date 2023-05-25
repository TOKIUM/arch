import { ArchDirectory } from './ArchDirectory';

describe('ArchPath', () => {
  describe('fromPath', () => {
    it('should be able to be created from a path', () => {
      const actual1 = ArchDirectory.fromFilePath('/foo/bar/baz.txt');
      expect(actual1).toEqual([
        new ArchDirectory('foo'),
        new ArchDirectory('bar'),
      ]);

      const actual2 = ArchDirectory.fromFilePath('foo/bar/baz');
      expect(actual2).toEqual([
        new ArchDirectory('foo'),
        new ArchDirectory('bar'),
      ]);

      const actual3 = ArchDirectory.fromFilePath('baz.txt');
      expect(actual3).toEqual([]);
    });
  });
});
