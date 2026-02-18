import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';

interface ServerOptions {
  port: string;
}

let serverProcess: ChildProcess | null = null;

export async function serverCommand(options: ServerOptions): Promise<void> {
  const { port } = options;

  console.log('\n📦 Starting Mockly Server...\n');

  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: resolve(__dirname, '../../../server'),
    stdio: 'inherit',
    env: { ...process.env, PORT: port },
    detached: false,
  });

  console.log(`✅ Server running at http://localhost:${port}`);
  console.log('\nPress Ctrl+C to stop.\n');

  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down server...');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down server...');
    if (serverProcess) serverProcess.kill();
    process.exit(0);
  });
}
