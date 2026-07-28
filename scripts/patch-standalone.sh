#!/usr/bin/env bash
# Next.js 14 standalone + pnpm 已知问题：顶层 node_modules 会缺 styled-jsx
# （Next.js 内部需要）和 unist-util-visit-parents（MDX rehype 依赖）。
# Next.js 的 outputFileTracingIncludes 对 pnpm 嵌套布局不起作用
# （见 https://github.com/vercel/next.js/issues/64700），所以这里后处理。
#
# 使用：在 pnpm build 之后调用 ./scripts/patch-standalone.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SB="$ROOT/.next/standalone/node_modules"
PNPM_SRC="$ROOT/node_modules/.pnpm"

[[ -d "$SB" ]] || { echo "❌ $SB 不存在，先跑 pnpm build"; exit 1; }

# 1) styled-jsx 顶层 symlink
if [[ ! -e "$SB/styled-jsx/package.json" ]]; then
  ver=$(ls "$SB/.pnpm" | grep -E '^styled-jsx@5\.' | head -1 || true)
  if [[ -n "$ver" ]]; then
    cd "$SB"
    ln -sf ".pnpm/$ver/node_modules/styled-jsx" styled-jsx
    cd - > /dev/null
    echo "✓ linked styled-jsx -> .pnpm/$ver"
  else
    echo "⚠ styled-jsx 在 .pnpm 里也没有，跳过"
  fi
fi

# 2) unist-util-visit-parents（@5.1.3）补齐子模块
ver="unist-util-visit-parents@5.1.3"
dst="$SB/.pnpm/$ver/node_modules"
if [[ ! -d "$dst" ]]; then
  src="$PNPM_SRC/$ver/node_modules"
  if [[ -d "$src" ]]; then
    mkdir -p "$dst"
    cp -RL "$src/." "$dst/"
    echo "✓ copied $ver/node_modules"
  else
    echo "⚠ 源 $src 不存在，跳过"
  fi
fi

echo "--- broken symlink check ---"
n=$(find "$ROOT/.next/standalone" -type l ! -exec test -e {} \; -print 2>/dev/null | wc -l | tr -d ' ')
echo "broken symlinks: $n"
exit 0
