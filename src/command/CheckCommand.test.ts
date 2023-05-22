import path from 'path';
import { CheckCommand } from './CheckCommend';

describe('CheckCommand', () => {
  describe('execute', () => {
    it('return 0 when valid', async () => {
      const actual = await CheckCommand.execute(
        path.join('fixtures', 'arch-sentry.yml'),
        [
          path.join('fixtures', 'valid'),
        ],
      );
      expect(actual).toBe(0);
    });
    it('return 1 when invalid', async () => {
      const actual = await CheckCommand.execute(
        path.join('fixtures', 'arch-sentry.yml'),
        [
          path.join('fixtures', 'invalid'),
        ],
      );
      expect(actual).toBe(1);
    });
  });
});
