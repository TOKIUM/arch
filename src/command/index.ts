#!/usr/bin/env node

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { CheckCommand } from './CheckCommend';

(async () => {
  try {
    await yargs(hideBin(process.argv))
      .command(
        'check',
        'Check dictionary files.',
        (yargs) => {
          return yargs
            .array('input').alias('i', 'input').describe('input', 'Input directory path.').demandOption('input')
            .string('config').alias('f', 'config').describe('config', 'File path for arch.yml')
        },
        async (argv) => {
          const statusCode = await CheckCommand.execute(argv.config?.toString(), argv.input.map((v) => v.toString()));
          process.exit(statusCode);
        },
      ).parse();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
