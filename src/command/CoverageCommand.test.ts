import path from 'path';
import { CoverageCommand } from './CoverageCommand';

describe('CoverageCommand', () => {
  describe('execute', () => {
    it('return 0', async () => {
      const actual = await CoverageCommand.execute(
        path.join('fixtures', 'command', 'arch.yml'),
        [
          path.join('fixtures', 'command', 'valid'),
          path.join('fixtures', 'command', 'invalid'),
        ],
      );
      expect(actual).toBe(0);
    });
  });
});

