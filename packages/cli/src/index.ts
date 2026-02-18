#!/usr/bin/env node

import { Command } from 'commander';
import { startCommand } from './commands/start';
import { serverCommand } from './commands/server';
import { webCommand } from './commands/web';

const program = new Command();

program
  .name('mockly')
  .description('Mock APIs rapidinho, desenvolva sem esperar o backend')
  .version('1.0.0');

program
  .command('start')
  .description('Start Mockly with both server and web interface')
  .option('-p, --port <port>', 'Server port', '3001')
  .option('-w, --web-port <port>', 'Web interface port', '5173')
  .option('--no-open', 'Do not open browser automatically')
  .action(startCommand);

program
  .command('server')
  .description('Start only the mock server')
  .option('-p, --port <port>', 'Server port', '3001')
  .action(serverCommand);

program
  .command('web')
  .description('Start only the web interface')
  .option('-p, --port <port>', 'Web interface port', '5173')
  .option('-s, --server <url>', 'Mock server URL', 'http://localhost:3001')
  .action(webCommand);

program.parse();
