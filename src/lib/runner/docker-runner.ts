import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { Language } from '@/lib/types';

export type DockerRunConfig = {
  image: string;
  cmd: string;
  timeoutMs: number;
  memoryMb: number;
  cpus: number;
  filename: string;
};

export type RunResult = {
  stdout: string;
  stderr: string;
  exitCode: number | null;
  durationMs: number;
  timedOut: boolean;
};

const MAX_OUTPUT = 1_000_000;
const MAX_STDIN = 10_000;

export async function dockerRun(cfg: DockerRunConfig, code: string, stdin: string = ''): Promise<RunResult> {
  const tmpDir = await mkdtemp(join(tmpdir(), 'learn-'));
  const filePath = join(tmpDir, cfg.filename);
  await writeFile(filePath, code, { mode: 0o600 });

  const dockerArgs = [
    'run', '--rm', '-i',
    '-v', `${tmpDir}:/code:ro`,
    '-w', '/code',
    '--network', 'none',
    '--memory', `${cfg.memoryMb}m`,
    '--cpus', cfg.cpus.toString(),
    '--pids-limit', '64',
    '-e', 'LANG=C.UTF-8',
    '-e', 'HOME=/root',
    cfg.image,
    'sh', '-c', cfg.cmd,
  ];

  const start = Date.now();
  // 用 pipe 而不是 ignore：这样 input() 至少能拿到 EOF（空 stdin）而不是
  // 直接抛 EOFError。如果调用方传了 stdin，则喂进去。
  const proc = spawn('docker', dockerArgs, { stdio: ['pipe', 'pipe', 'pipe'] });

  let stdout = '';
  let stderr = '';
  let killed = false;

  proc.stdout.on('data', (d) => {
    stdout += d.toString();
    if (stdout.length > MAX_OUTPUT) {
      killed = true;
      proc.kill('SIGKILL');
    }
  });
  proc.stderr.on('data', (d) => {
    stderr += d.toString();
    if (stderr.length > MAX_OUTPUT) {
      killed = true;
      proc.kill('SIGKILL');
    }
  });

  // 写 stdin 后立即 end —— 容器内 input() 第一次调用就会拿到 EOF/数据。
  // Python 的 input() 行为：
  //   - 拿到数据 + \n → 返回去掉换行的字符串
  //   - 拿到 EOF 且无数据 → 抛 EOFError
  // 所以当调用方没传 stdin 时，补一个 "\n"，让 input() 优雅返回空串。
  // 注意用 || 而非 ??：API 传过来的 '' 也算"没传"，要回退到 \n
  const safeStdin = (stdin || '\n').slice(0, MAX_STDIN);
  proc.stdin.end(safeStdin);

  const killTimer = setTimeout(() => {
    killed = true;
    proc.kill('SIGKILL');
  }, cfg.timeoutMs);

  const exitCode = await new Promise<number | null>((resolve) => {
    proc.on('exit', (code) => resolve(code));
    proc.on('error', () => resolve(null));
  });

  clearTimeout(killTimer);
  const durationMs = Date.now() - start;

  await rm(tmpDir, { recursive: true, force: true }).catch(() => {});

  return { stdout, stderr, exitCode, durationMs, timedOut: killed };
}

export async function isDockerAvailable(): Promise<boolean> {
  return new Promise((resolve) => {
    const p = spawn('docker', ['info'], { stdio: 'ignore' });
    p.on('exit', (code) => resolve(code === 0));
    p.on('error', () => resolve(false));
  });
}

export const LANG_CONFIG: Record<Language, Omit<DockerRunConfig, 'cmd' | 'filename'> & { cmd: string; filename: string }> = {
  python: {
    image: 'python:3.12-alpine',
    cmd: 'python -u /code/main.py',
    timeoutMs: 5000,
    memoryMb: 128,
    cpus: 1.0,
    filename: 'main.py',
  },
  go: {
    image: 'golang:1.22-alpine',
    cmd: 'GOCACHE=/root/.cache go run /code/main.go',
    timeoutMs: 15000,
    memoryMb: 256,
    cpus: 1.0,
    filename: 'main.go',
  },
  java: {
    image: 'eclipse-temurin:21-jdk-jammy',
    cmd: 'cd /root && cp /code/Main.java . && javac Main.java && java -cp . Main',
    timeoutMs: 20000,
    memoryMb: 256,
    cpus: 1.0,
    filename: 'Main.java',
  },
};
