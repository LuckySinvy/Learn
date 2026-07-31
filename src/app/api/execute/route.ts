import { NextRequest, NextResponse } from 'next/server';
import { dockerRun, LANG_CONFIG, isDockerAvailable } from '@/lib/runner/docker-runner';
import type { ExecuteRequest, ExecuteResponse, Language, ExecutableLanguage } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_CODE_LEN = 50_000;
const VALID_LANGS: Language[] = ['python', 'go', 'java', 'rust', 'typescript', 'redis', 'mysql', 'linux', 'git', 'http'];

// 分语言限流：服务器仅 ~1.8GB 可用内存，MariaDB 单实例峰值 ~250MB，
// 必须单独收紧；Redis 极轻（~10MB）可放宽。另设全局上限兜底。
const MAX_INFLIGHT_BY_LANG: Record<string, number> = {
  python: 5, go: 4, java: 3, rust: 3, typescript: 3,
  redis: 5, mysql: 2,
  linux: 5, git: 5, http: 4,
};
const MAX_INFLIGHT_TOTAL = 8;
const inFlight: Record<string, number> = {};
let inFlightTotal = 0;

export async function POST(req: NextRequest) {
  let body: ExecuteRequest;
  try {
    body = (await req.json()) as ExecuteRequest;
  } catch {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: '无效的请求体' } satisfies ExecuteResponse,
      { status: 400 },
    );
  }

  if (!body || typeof body.code !== 'string' || !VALID_LANGS.includes(body.language)) {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: `language 必须是 ${VALID_LANGS.join('/')} 且 code 必填` } satisfies ExecuteResponse,
      { status: 400 },
    );
  }

  const langLimit = MAX_INFLIGHT_BY_LANG[body.language] ?? 2;
  if (inFlightTotal >= MAX_INFLIGHT_TOTAL || (inFlight[body.language] ?? 0) >= langLimit) {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: '服务繁忙，请稍后再试' } satisfies ExecuteResponse,
      { status: 503 },
    );
  }
  if (body.code.length > MAX_CODE_LEN) {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: `代码长度不能超过 ${MAX_CODE_LEN} 字符` } satisfies ExecuteResponse,
      { status: 400 },
    );
  }

  const dockerOk = await isDockerAvailable();
  if (!dockerOk) {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: 'Docker 未运行，请先启动 Docker Desktop' } satisfies ExecuteResponse,
      { status: 503 },
    );
  }

  const cfg = LANG_CONFIG[body.language as ExecutableLanguage];

  // Java: 将用户代码中的 `class X` 统一改写为 `class Main`，并将文件名命名为 Main.java
  let code = body.code;
  if (body.language === 'java') {
    code = code.replace(/\bclass\s+([A-Za-z_][A-Za-z0-9_]*)/g, (_m, _name) => 'class Main');
  }

  inFlight[body.language] = (inFlight[body.language] ?? 0) + 1;
  inFlightTotal++;
  try {
    const result = await dockerRun(cfg, code, body.stdin ?? '');

    let status: ExecuteResponse['status'] = 'success';
    if (result.timedOut) status = 'timeout';
    else if (result.exitCode !== 0) {
      // 启发式：stderr 包含 javac 错误 → compile_error
      if (body.language === 'java' && /Main\.java|error:/i.test(result.stderr)) {
        status = 'compile_error';
      } else if (body.language === 'rust' && /error(\[\d+]|[:,])/.test(result.stderr)) {
        // rustc 编译错误形如 `error[E0382]: ...` 或 `error: ...`
        status = 'compile_error';
      } else if (body.language === 'typescript' && /error TS\d+/.test(result.stderr)) {
        // tsc 类型检查错误形如 `main.ts(1,7): error TS2322: ...`
        status = 'compile_error';
      } else {
        status = 'runtime_error';
      }
    }

    return NextResponse.json({
      status,
      stdout: result.stdout,
      stderr: result.stderr,
      exitCode: result.exitCode,
      durationMs: result.durationMs,
      timedOut: result.timedOut,
    } satisfies ExecuteResponse);
  } catch (err) {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: `执行失败: ${String(err)}` } satisfies ExecuteResponse,
      { status: 500 },
    );
  } finally {
    inFlight[body.language]--;
    inFlightTotal--;
  }
}
