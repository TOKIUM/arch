import path from 'path';
import { CheckCommand } from './CheckCommend';

describe('CheckCommand', () => {
  describe('execute', () => {
    it('return 0 when valid', async () => {
      const actual = await CheckCommand.execute(
        path.join('fixtures', 'command', 'arch.yml'),
        [
          path.join('fixtures', 'command', 'valid'),
        ],
      );
      expect(actual).toBe(0);
    });
    it('return 1 when invalid', async () => {
      const actual = await CheckCommand.execute(
        path.join('fixtures', 'command', 'arch.yml'),
        [
          path.join('fixtures', 'command', 'invalid'),
        ],
      );
      expect(actual).toBe(1);
    });
  });
});
