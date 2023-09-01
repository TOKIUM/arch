import { ArchEntry } from './ArchEntry';
import { ArchDirectory } from './ArchDirectory';

describe('ArchEntry', () => {
  describe('match', () => {
    describe('when not allowed', () => {
      it('should return false', () => {
        const entry = new ArchEntry(
          new ArchDirectory('foo'),
          'Foo',
          [],
          [],
        );
        const archDirectories = [new ArchDirectory('foo')];
        const actual = entry.match(archDirectories);
        expect(actual).toBe(false);
      });
    });
    describe('when arch directories shorter than entry directory', () => {
      describe('when allow is subdirectories only', () => {
        it('should return false', () => {
          const entry = new ArchEntry(
            new ArchDirectory('foo'),
            'Foo',
            ['subdirectories'],
            [new ArchEntry(new ArchDirectory('bar'), 'Bar', ['subdirectories'], [])],
          );
          const archDirectories = [new ArchDirectory('foo')];
          const actual = entry.match(archDirectories);
          expect(actual).toBe(false);
        });
      });
      describe('when allow is files', () => {
        it('should return true', () => {
          const entry = new ArchEntry(
            new ArchDirectory('foo'),
            'Foo',
            ['files'],
            [],
          );
          const archDirectories = [new ArchDirectory('foo')];
          const actual = entry.match(archDirectories);
          expect(actual).toBe(true);
        });
      });
    });
    describe('when arch directories longer than entry directory', () => {
      describe('when entry has no subdirectories', () => {
        it('should return true', () => {
          const entry = new ArchEntry(
            new ArchDirectory('foo'),
            'Foo',
            ['subdirectories'],
            [],
          );
          const archDirectories = [new ArchDirectory('foo'), new ArchDirectory('bar')];
          const actual = entry.match(archDirectories);
          expect(actual).toBe(true);
        });
      });
      describe('when entry has subdirectories', () => {
        it('should return true if any child matches', () => {
          const entry = new ArchEntry(
            new ArchDirectory('foo'),
            'Foo',
            ['subdirectories'],
            [new ArchEntry(new ArchDirectory('bar'), 'Bar', ['files'], [])],
          );
          const archDirectories = [new ArchDirectory('foo'), new ArchDirectory('bar')];
          const actual = entry.match(archDirectories);
          expect(actual).toBe(true);
        });
        it('should return false if no child matches', () => {
          const entry = new ArchEntry(
            new ArchDirectory('foo'),
            'Foo',
            ['subdirectories'],
            [new ArchEntry(new ArchDirectory('bar'), 'Bar', ['subdirectories'], [])],
          );
          const archDirectories = [new ArchDirectory('foo'), new ArchDirectory('baz')];
          const actual = entry.match(archDirectories);
          expect(actual).toBe(false);
        });
      });
    });
  });
});
