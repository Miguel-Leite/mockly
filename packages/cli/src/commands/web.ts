import { spawn, ChildProcess } from 'child_process';
import { resolve } from 'path';

interface WebOptions {
  port: string;
  server: string;
}

let webProcess: ChildProcess | null = null;

export async function webCommand(options: WebOptions): Promise<void> {
  const { port, server } = options;

  console.log('\n🌐 Starting Mockly Web Interface...\n');

  webProcess = spawn('npm', ['run', 'dev'], {
    cwd: resolve(__dirname, '../../../web'),
    stdio: 'inherit',
    env: { ...process.env, VITE_WEB_PORT: port, VITE_API_URL: server },
    detached: false,
  });

  console.log(`✅ Web interface running at http://localhost:${port}`);
  console.log(`   Connected to server: ${server}`);
  console.log('\nPress Ctrl+C to stop.\n');

  process.on('SIGINT', () => {
    console.log('\n\n👋 Shutting down web...');
    if (webProcess) webProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n\n👋 Shutting down web...');
    if (webProcess) webProcess.kill();
    process.exit(0);
  });
}
