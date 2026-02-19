#!/usr/bin/env node

import { Command } from 'commander';
import { startCommand } from './commands/start';
import { serverCommand } from './commands/server';

const program = new Command();

program
  .name('mockly')
  .description('Mock APIs rapidinho - Server + UI for creating mock endpoints')
  .version('1.0.0');

program
  .command('start')
  .description('Start Mockly with server and built-in web interface')
  .option('-p, --port <port>', 'Server port', '3001')
  .option('--no-open', 'Do not open browser automatically')
  .action(startCommand);

program
  .command('server')
  .description('Start only the mock server (without web UI)')
  .option('-p, --port <port>', 'Server port', '3001')
  .action(serverCommand);

program.parse();
