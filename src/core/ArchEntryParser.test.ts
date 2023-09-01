import { ArchEntry } from './ArchEntry';
import { ArchDirectory } from './ArchDirectory';
import { ArchEntryParser } from './ArchEntryParser';
import path from 'path';

describe('ArchEntryParser', () => {
  describe('parseObject', () => {
    it('should be able to be created from an object', () => {
      const object = {
        directory: 'foo',
        description: 'Foo',
        subdirectories: [
          {
            directory: 'bar',
            description: 'Bar',
            subdirectories: [],
          },
        ],
        includes: [
          path.join('fixtures', 'core', 'arch.yml'),
        ]
      };
      const actual = ArchEntryParser.parseObject(object);
      expect(actual).toEqual(new ArchEntry(new ArchDirectory('foo'), 'Foo', ['files', 'subdirectories'], [
        new ArchEntry(new ArchDirectory('bar'), 'Bar', ['files', 'subdirectories'], []),
        new ArchEntry(new ArchDirectory('example'), 'example', ['files', 'subdirectories'], []),
      ]));
    });
    it('should be empty subdirectories from invalid subdirectories object', () => {
      const object = {
        directory: 'foo',
        description: 'Foo',
        subdirectories: 'invalid'
      };
      const actual = ArchEntryParser.parseObject(object);
      expect(actual).toEqual(new ArchEntry(new ArchDirectory('foo'), 'Foo', ['files', 'subdirectories'], []));
    });
    it('should be undefined from invalid object', () => {
      const object = {
        directory: 'foo',
        invalid: 'Foo',
      };
      const actual = ArchEntryParser.parseObject(object);
      expect(actual).toBeUndefined();
    });
  });
});
