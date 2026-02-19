import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';

interface StartOptions {
  port: string;
  webPort: string;
  open: boolean;
}

let serverProcess: ChildProcess | null = null;

export async function startCommand(options: StartOptions): Promise<void> {
  const { port, webPort, open } = options;

  console.log('\n🚀 Starting Mockly...\n');

  console.log(`📦 Starting mock server on port ${port}...`);
  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: resolve(__dirname, '../../../server'),
    stdio: 'inherit',
    env: { ...process.env, PORT: port },
    detached: false,
  });

  // Open browser
  if (open) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const { default: open } = await import('open');
    console.log(`🌍 Opening browser at http://localhost:${port}...\n`);
    open(`http://localhost:${port}`);
  }

  console.log('\n✅ Mockly is running!');
  console.log(`   Server & UI: http://localhost:${port}`);
  console.log('\nPress Ctrl+C to stop.\n');

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down Mockly...');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down Mockly...');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  });
}
