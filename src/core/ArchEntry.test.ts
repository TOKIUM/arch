import { ArchEntry } from './ArchEntry';
import { ArchModule } from './ArchModule';

describe('ArchEntry', () => {
  describe('fromYaml', () => {
    it('should be able to be created from YAML', () => {
      const yamlStr = "- module: foo\n  description: Foo\n  allow: none\n  submodules:\n  - module: bar\n    description: Bar\n    submodules: []\n";
      const actual = ArchEntry.fromYaml(yamlStr);
      expect(actual).toEqual([
        new ArchEntry(new ArchModule('foo'), 'Foo', [], [
          new ArchEntry(new ArchModule('bar'), 'Bar', ['submodules'], []),
        ]),
      ]);
    });
  });

  describe('fromObject', () => {
    it('should be able to be created from an object', () => {
      const object = {
        module: 'foo',
        description: 'Foo',
        submodules: [
          {
            module: 'bar',
            description: 'Bar',
            submodules: [],
          },
        ],
      };
      const actual = ArchEntry.fromObject(object);
      expect(actual).toEqual(new ArchEntry(new ArchModule('foo'), 'Foo', ['submodules'], [
        new ArchEntry(new ArchModule('bar'), 'Bar', ['submodules'], []),
      ]));
    });
    it('should be empty submodules from invalid submodules object', () => {
      const object = {
        module: 'foo',
        description: 'Foo',
        submodules: 'invalid'
      };
      const actual = ArchEntry.fromObject(object);
      expect(actual).toEqual(new ArchEntry(new ArchModule('foo'), 'Foo', ['submodules'], []));
    });
    it('should be undefined from invalid object', () => {
      const object = {
        module: 'foo',
        invalid: 'Foo',
      };
      const actual = ArchEntry.fromObject(object);
      expect(actual).toBeUndefined();
    });
  });

  describe('match', () => {
    describe('when not allowed', () => {
      it('should return false', () => {
        const entry = new ArchEntry(
          new ArchModule('foo'),
          'Foo',
          [],
          [],
        );
        const archModules = [new ArchModule('foo')];
        const actual = entry.match(archModules);
        expect(actual).toBe(false);
      });
    });
    describe('when arch modules shorter than entry module', () => {
      describe('when allow is submodules only', () => {
        it('should return false', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            ['submodules'],
            [new ArchEntry(new ArchModule('bar'), 'Bar', ['submodules'], [])],
          );
          const archModules = [new ArchModule('foo')];
          const actual = entry.match(archModules);
          expect(actual).toBe(false);
        });
      });
      describe('when allow is files', () => {
        it('should return true', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            ['files'],
            [],
          );
          const archModules = [new ArchModule('foo')];
          const actual = entry.match(archModules);
          expect(actual).toBe(true);
        });
      });
    });
    describe('when arch modules longer than entry module', () => {
      describe('when entry has no submodules', () => {
        it('should return true', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            ['submodules'],
            [],
          );
          const archModules = [new ArchModule('foo'), new ArchModule('bar')];
          const actual = entry.match(archModules);
          expect(actual).toBe(true);
        });
      });
      describe('when entry has submodules', () => {
        it('should return true if any child matches', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            ['submodules'],
            [new ArchEntry(new ArchModule('bar'), 'Bar', ['submodules'], [])],
          );
          const archModules = [new ArchModule('foo'), new ArchModule('bar')];
          const actual = entry.match(archModules);
          expect(actual).toBe(true);
        });
        it('should return false if no child matches', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            ['submodules'],
            [new ArchEntry(new ArchModule('bar'), 'Bar', ['submodules'], [])],
          );
          const archModules = [new ArchModule('foo'), new ArchModule('baz')];
          const actual = entry.match(archModules);
          expect(actual).toBe(false);
        });
      });
    });
  });
});
