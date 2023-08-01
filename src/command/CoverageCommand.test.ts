import path from 'path';
import { CoverageCommand } from './CoverageCommand';

describe('CoverageCommand', () => {
  describe('execute', () => {
    it('return 0', async () => {
      const actual = await CoverageCommand.execute(
        path.join('fixtures', 'arch.yml'),
        [
          path.join('fixtures', 'valid'),
          path.join('fixtures', 'invalid'),
        ],
      );
      expect(actual).toBe(0);
    });
  });
});

