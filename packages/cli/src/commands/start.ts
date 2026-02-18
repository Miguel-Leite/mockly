import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';

interface StartOptions {
  port: string;
  webPort: string;
  open: boolean;
}

let serverProcess: ChildProcess | null = null;
let webProcess: ChildProcess | null = null;

export async function startCommand(options: StartOptions): Promise<void> {
  const { port, webPort, open } = options;

  console.log('\n🚀 Starting Mockly...\n');

  // Start server
  console.log(`📦 Starting mock server on port ${port}...`);
  serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: resolve(__dirname, '../../../server'),
    stdio: 'inherit',
    env: { ...process.env, PORT: port },
    detached: false,
  });

  // Wait a bit for server to start
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Start web
  console.log(`🌐 Starting web interface on port ${webPort}...`);
  webProcess = spawn('npm', ['run', 'dev'], {
    cwd: resolve(__dirname, '../../../web'),
    stdio: 'inherit',
    env: { ...process.env, VITE_WEB_PORT: webPort },
    detached: false,
  });

  // Open browser
  if (open) {
    await new Promise(resolve => setTimeout(resolve, 3000));
    const { default: open } = await import('open');
    console.log(`🌍 Opening browser at http://localhost:${webPort}...\n`);
    open(`http://localhost:${webPort}`);
  }

  console.log('\n✅ Mockly is running!');
  console.log(`   Server:   http://localhost:${port}`);
  console.log(`   Web:      http://localhost:${webPort}`);
  console.log('\nPress Ctrl+C to stop.\n');

  // Handle cleanup
  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down Mockly...');
    if (serverProcess) serverProcess.kill();
    if (webProcess) webProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down Mockly...');
    if (serverProcess) serverProcess.kill();
    if (webProcess) webProcess.kill();
    process.exit(0);
  });
}
