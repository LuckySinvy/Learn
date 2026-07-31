import { spawn } from 'node:child_process';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import type { ExecutableLanguage } from '@/lib/types';

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

export const LANG_CONFIG: Record<ExecutableLanguage, Omit<DockerRunConfig, 'cmd' | 'filename'> & { cmd: string; filename: string }> = {
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
  rust: {
    image: 'rust:slim',
    // /code 以只读挂载；rustc 会在工作目录写 rmeta 临时文件，故复制到可写的 /tmp 再编译运行
    cmd: 'cp /code/main.rs /tmp/main.rs && cd /tmp && rustc -O /tmp/main.rs -o /tmp/main && /tmp/main',
    timeoutMs: 20000,
    memoryMb: 256,
    cpus: 1.0,
    filename: 'main.rs',
  },
  typescript: {
    // 自建镜像（docker/ts-runner/Dockerfile）：node:22-alpine + typescript + @types/node，
    // 预置 /opt/tsenv（package.json 里 "type": "module"，故支持顶层 await）。
    image: 'learn-ts:1',
    // 先用 tsc 做严格类型检查（输出重定向到 stderr，保持 stdout 干净），通过后再执行。
    cmd:
      'cp /code/main.ts /opt/tsenv/main.ts && cd /opt/tsenv && ' +
      './node_modules/.bin/tsc --strict --target ES2022 --module NodeNext --moduleResolution NodeNext --lib ES2022 --types node --skipLibCheck --noEmit main.ts 1>&2 && ' +
      'node --disable-warning=ExperimentalWarning --experimental-transform-types main.ts',
    timeoutMs: 20000,
    memoryMb: 512,
    cpus: 1.0,
    filename: 'main.ts',
  },
  redis: {
    // 自建镜像（docker/redis-runner）：redis:7-alpine + 执行脚本。
    // 一次性容器：起纯内存 redis-server（~300ms），逐行回显并执行 /code/main.redis，
    // 输出与 redis-cli 交互模式一致。每行一条命令，不支持跨行 MULTI/SUBSCRIBE。
    image: 'learn-redis:1',
    cmd: 'sh /usr/local/bin/run-redis.sh',
    timeoutMs: 10000,
    memoryMb: 128,
    cpus: 0.5,
    filename: 'main.redis',
  },
  mysql: {
    // 自建镜像（docker/mysql-runner）：MariaDB 11（MySQL 兼容），构建期已预初始化
    // datadir 并灌入电商示例库 shop（users/categories/products/orders/order_items）。
    // 冷启动约 2-4s；mariadb --table -v 输出 MySQL 风格 ASCII 表格。
    image: 'learn-mysql:1',
    cmd: 'bash /usr/local/bin/run-mysql.sh',
    timeoutMs: 20000,
    memoryMb: 512,
    cpus: 1.0,
    filename: 'main.sql',
  },
  // linux / git / http 共用 learn-shell:1（docker/shell-runner）。
  // /code 只读，脚本在可写的 /work 里执行；--network none 下 loopback 可用。
  linux: {
    image: 'learn-shell:1',
    cmd: 'cd /work && bash /code/main.sh',
    timeoutMs: 10000,
    memoryMb: 128,
    cpus: 0.5,
    filename: 'main.sh',
  },
  git: {
    image: 'learn-shell:1',
    cmd: 'cd /work && bash /code/main.sh',
    timeoutMs: 10000,
    memoryMb: 128,
    cpus: 0.5,
    filename: 'main.sh',
  },
  http: {
    image: 'learn-shell:1',
    cmd: 'cd /work && bash /code/main.sh',
    timeoutMs: 15000,
    memoryMb: 128,
    cpus: 0.5,
    filename: 'main.sh',
  },
};
