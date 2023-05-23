import { ArchEntry } from './ArchEntry';
import { ArchModule } from './ArchModule';

describe('ArchEntry', () => {
  describe('fromYaml', () => {
    it('should be able to be created from YAML', () => {
      const yamlStr = "- module: foo\n  description: Foo\n  allow: false\n  children:\n  - module: bar\n    description: Bar\n    children: []\n";
      const actual = ArchEntry.fromYaml(yamlStr);
      expect(actual).toEqual([
        new ArchEntry(new ArchModule('foo'), 'Foo', false, [
          new ArchEntry(new ArchModule('bar'), 'Bar', true, []),
        ]),
      ]);
    });
  });

  describe('fromObject', () => {
    it('should be able to be created from an object', () => {
      const object = {
        module: 'foo',
        description: 'Foo',
        children: [
          {
            module: 'bar',
            description: 'Bar',
            children: [],
          },
        ],
      };
      const actual = ArchEntry.fromObject(object);
      expect(actual).toEqual(new ArchEntry(new ArchModule('foo'), 'Foo', true, [
        new ArchEntry(new ArchModule('bar'), 'Bar', true, []),
      ]));
    });
    it('should be empty children from invalid children object', () => {
      const object = {
        module: 'foo',
        description: 'Foo',
        children: 'invalid'
      };
      const actual = ArchEntry.fromObject(object);
      expect(actual).toEqual(new ArchEntry(new ArchModule('foo'), 'Foo', true, []));
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
          false,
          [],
        );
        const archModules = [new ArchModule('foo')];
        const actual = entry.match(archModules);
        expect(actual).toBe(false);
      });
    });
    describe('when arch modules shorter than entry module', () => {
      it('should return false', () => {
        const entry = new ArchEntry(
          new ArchModule('foo'),
          'Foo',
          true,
          [new ArchEntry(new ArchModule('bar'), 'Bar', true, [])],
        );
        const archModules = [new ArchModule('foo')];
        const actual = entry.match(archModules);
        expect(actual).toBe(false);
      });
    });
    describe('when arch modules longer than entry module', () => {
      describe('when entry has no children', () => {
        it('should return true', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            true,
            [],
          );
          const archModules = [new ArchModule('foo'), new ArchModule('bar')];
          const actual = entry.match(archModules);
          expect(actual).toBe(true);
        });
      });
      describe('when entry has children', () => {
        it('should return true if any child matches', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            true,
            [new ArchEntry(new ArchModule('bar'), 'Bar', true, [])],
          );
          const archModules = [new ArchModule('foo'), new ArchModule('bar')];
          const actual = entry.match(archModules);
          expect(actual).toBe(true);
        });
        it('should return false if no child matches', () => {
          const entry = new ArchEntry(
            new ArchModule('foo'),
            'Foo',
            true,
            [new ArchEntry(new ArchModule('bar'), 'Bar', true, [])],
          );
          const archModules = [new ArchModule('foo'), new ArchModule('baz')];
          const actual = entry.match(archModules);
          expect(actual).toBe(false);
        });
      });
    });
  });
});
