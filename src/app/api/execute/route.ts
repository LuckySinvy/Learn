import { NextRequest, NextResponse } from 'next/server';
import { dockerRun, LANG_CONFIG, isDockerAvailable } from '@/lib/runner/docker-runner';
import type { ExecuteRequest, ExecuteResponse, Language, ExecutableLanguage } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_CODE_LEN = 50_000;
const VALID_LANGS: Language[] = ['python', 'go', 'java'];

// 简单限流：进程并发上限 5
let inFlight = 0;
const MAX_INFLIGHT = 5;

export async function POST(req: NextRequest) {
  if (inFlight >= MAX_INFLIGHT) {
    return NextResponse.json(
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: '服务繁忙，请稍后再试' } satisfies ExecuteResponse,
      { status: 503 },
    );
  }

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
      { status: 'internal_error', stdout: '', stderr: '', exitCode: null, durationMs: 0, timedOut: false, message: 'language 必须是 python/go/java 且 code 必填' } satisfies ExecuteResponse,
      { status: 400 },
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

  inFlight++;
  try {
    const result = await dockerRun(cfg, code, body.stdin ?? '');

    let status: ExecuteResponse['status'] = 'success';
    if (result.timedOut) status = 'timeout';
    else if (result.exitCode !== 0) {
      // 启发式：stderr 包含 javac 错误 → compile_error
      if (body.language === 'java' && /Main\.java|error:/i.test(result.stderr)) {
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
    inFlight--;
  }
}
