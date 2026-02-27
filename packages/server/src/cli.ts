#!/usr/bin/env node

import { Command } from 'commander';
import { MockServer } from './server';

const program = new Command();

program
  .name('mockario')
  .description('Mock APIs rapidinho - Server + UI for creating mock endpoints')
  .version('1.2.3');

program
  .command('start')
  .description('Start Mockario with server and built-in web interface')
  .option('-p, --port <port>', 'Server port', '3001')
  .option('--no-open', 'Do not open browser automatically')
  .action(async (options) => {
    const port = parseInt(options.port || '3001');
    const open = options.open !== false;

    console.log('\n🚀 Starting Mockario...\n');
    console.log(`📦 Starting mock server on port ${port}...`);

    const server = new MockServer({ port });
    await server.start();

    console.log(`✔ Server running at http://localhost:${port}`);
    console.log(`✔ Web UI at http://localhost:${port}`);

    if (open) {
      const { default: open } = await import('open');
      console.log(`🌍 Opening browser...\n`);
      open(`http://localhost:${port}`);
    }

    console.log('\n✔ Mockario is running!');
    console.log(`   Server & UI: http://localhost:${port}`);
    console.log('\nPress Ctrl+C to stop.\n');

    process.on('SIGINT', async () => {
      console.log('\n\n👋 Shutting down Mockario...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n👋 Shutting down Mockario...');
      await server.stop();
      process.exit(0);
    });
  });

program
  .command('server')
  .description('Start only the mock server (without web UI)')
  .option('-p, --port <port>', 'Server port', '3001')
  .action(async (options) => {
    const port = parseInt(options.port || '3001');

    console.log('\n📦 Starting Mockario Server...\n');

    const server = new MockServer({ port });
    await server.start();

    console.log(`✔ Server running at http://localhost:${port}`);
    console.log('\nPress Ctrl+C to stop.\n');

    process.on('SIGINT', async () => {
      console.log('\n\n👋 Shutting down server...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n👋 Shutting down server...');
      await server.stop();
      process.exit(0);
    });
  });

program.parse();
