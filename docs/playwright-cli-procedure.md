# Stable playwright-cli QA Procedure

> **MANDATORY** for any agent performing visual/UI QA on this project.
> Read this BEFORE starting any playwright-cli session.

## Why This Document Exists

Agent-driven playwright-cli runs have historically failed due to four root causes:
1. **Server dies when bash session closes** — the Astro preview/dev server is started as a child of a bash call; when the agent issues the next bash command, the previous session ends and the server receives SIGHUP.
2. **Port conflicts from zombie processes** — crashed servers don't release port 4321; the next server binds to 4322, but playwright-cli still targets 4321.
3. **Race condition** — the agent navigates before the server finishes binding.
4. **`mise exec --` mandatory for detached processes** — `mise exec --` solves tool resolution by resolving `node` and `pnpm` before exec-ing the child. This ensures the child inherits the correct environment even in a new session (like `setsid`), which raw `node` or `pnpm` commands would lack.

## Prerequisites

### playwright-cli must be installed globally

```bash
# Check if playwright-cli is available via mise exec
mise exec -- playwright-cli --version || mise exec -- npm install -g @playwright/cli@latest
```

The npm package is `@playwright/cli` (NOT `@anthropic-ai/playwright-cli`). `mise exec --` is required to ensure the correct Node.js version is used.

## The Procedure (step by step)

### Phase 1: Clean Environment

```bash
# 1. Kill any leftover server processes on the target port
lsof -ti :4321 | xargs kill -9 2>/dev/null || true

# 2. Wait briefly for port release
sleep 1

# 3. Verify port is free
lsof -i :4321 2>/dev/null && echo "PORT STILL IN USE - ABORT" || echo "Port 4321 free"
```

**STOP if port is still in use.** Investigate what holds it (`lsof -i :4321`) and kill it manually.

### Phase 2: Build the Site (if not already built)

Use a pre-built static site via `astro preview` instead of `pnpm dev`. The dev server (Vite HMR) is less stable, consumes more resources, and can interfere with Playwright browser processes.

```bash
# Build the site using mise exec
mise exec -- pnpm build
```

**Note:** `pnpm build` runs `astro build && pagefind --site dist`. This is CPU/IO-intensive. Do NOT run playwright-cli commands concurrently with the build.

### Phase 3: Start the Server (CRITICAL)

The server MUST be started in a way that:
- Survives bash session closure (use `setsid` + `nohup`)
- Uses `mise exec --` to resolve tools before detaching
- Uses an explicit port

```bash
# Start the server detached from the current session using mise exec
setsid nohup mise exec -- node_modules/.bin/astro preview --port 4321 > /tmp/astro-preview.log 2>&1 &
echo "Server PID: $!"
```

**Why `mise exec --`?**
`mise exec --` resolves the PATH and environment for the specified tools (Node.js, pnpm) before executing the child process. This environment is then inherited by the child, even when `setsid` starts a new session. This eliminates the need for temporary startup scripts.

**Why each part matters:**
- `setsid` — creates a new session; server won't receive SIGHUP when your bash session ends
- `nohup` — additional protection against hangup signals
- `mise exec --` — ensures `node` is on PATH and correctly resolved before detaching
- `--port 4321` — explicit port to avoid Astro auto-selecting a different port
- `> /tmp/astro-preview.log 2>&1` — captures stdout/stderr for debugging if it crashes
- `&` — backgrounds the process so the bash call returns immediately

### Phase 4: Wait for Server Ready

Do NOT immediately run `playwright-cli goto`. Wait for the server to bind.

**CRITICAL: Use `localhost`, not `127.0.0.1`.** Astro preview binds to IPv6 (`::1`) by default, not IPv4 (`127.0.0.1`). `localhost` resolves to `::1` which works; `127.0.0.1` will fail with "Connection refused".

```bash
# Wait up to 30 seconds for the server to be ready
for i in $(seq 1 30); do
  if curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/ 2>/dev/null | grep -q "200"; then
    echo "Server ready after ${i}s"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "TIMEOUT: Server did not start in 30s"
    echo "--- Server log ---"
    cat /tmp/astro-preview.log
    echo "--- End log ---"
  fi
  sleep 1
done
```

**Only proceed to Phase 5 after you see "Server ready".**

### Phase 5: Run playwright-cli Commands

Every bash call that uses `playwright-cli`, `node`, `pnpm`, or `npx` MUST be prefixed with `mise exec --`:

```bash
# Open browser and navigate
mise exec -- playwright-cli open http://localhost:4321/

# Take snapshots, interact, etc.
mise exec -- playwright-cli goto http://localhost:4321/tags/web-dev
mise exec -- playwright-cli snapshot
mise exec -- playwright-cli screenshot --filename=screenshot.png
```

**Important playwright-cli gotchas:**
- **Separate eval calls:** `setAttribute` + `getAttribute` in a single eval returns `undefined`. Always use two separate eval calls:
  ```bash
  # WRONG — returns undefined
  mise exec -- playwright-cli eval "document.documentElement.setAttribute('data-theme','dark'); document.documentElement.getAttribute('data-theme')"

  # CORRECT — two calls
  mise exec -- playwright-cli eval "document.documentElement.setAttribute('data-theme','dark')"
  mise exec -- playwright-cli eval "document.documentElement.getAttribute('data-theme')"
  ```
- **Theme switching:** Use `document.documentElement.setAttribute('data-theme', 'dark')` then verify with a separate `getAttribute` call before reading computed styles.
- **Use `localhost` not `127.0.0.1`:** Astro preview binds to IPv6 `::1`. `localhost` resolves correctly; `127.0.0.1` will get "Connection refused".

### Phase 6: Cleanup

After all QA is complete, always clean up:

```bash
# Close playwright-cli browser
mise exec -- playwright-cli close

# Kill the preview server
lsof -ti :4321 | xargs kill 2>/dev/null || true

# Verify cleanup
sleep 1
lsof -i :4321 2>/dev/null && echo "WARNING: port 4321 still in use" || echo "Cleanup complete"
```

## Phase 7: Codify as Playwright Test Spec

- **Purpose**: After manually verifying behavior with playwright-cli, the agent MUST add or extend a Playwright Test spec to make that check a permanent regression test.
- **When to add specs**: After using playwright-cli to verify any new feature, bug fix, or UI change.
- **Where specs live**: `tests/e2e/` directory, organized by domain:
  - `homepage-and-navigation.spec.ts` — homepage, header, hamburger menu, footer, responsive layout
  - `blog-post-and-series.spec.ts` — blog post pages, series badge, series nav, prev/next
  - `theme-switching.spec.ts` — dark/light mode toggle, CSS variable inheritance
  - `search.spec.ts` — Pagefind search modal, light/dark styling
  - Create new spec files for new feature domains
- **How to write specs**: Use `@playwright/test`, follow existing spec patterns:
  ```typescript
  import { test, expect } from '@playwright/test';
  
  test.describe('Feature Name', () => {
    test('specific behavior', async ({ page, isMobile }) => {
      await page.goto('/path/');
      await expect(page.locator('selector')).toBeVisible();
    });
  });
  ```
- **Running specs**: `mise exec -- pnpm test:e2e` (runs all specs against built site)
- **Key rules**:
  - Use relative URLs (baseURL is configured)
  - Use `isMobile` parameter for responsive tests (config has desktop and mobile projects)
  - Do NOT use `page.waitForTimeout()` — use auto-waiting assertions
  - Do NOT hardcode viewport sizes — the config projects handle this
  - Do NOT use `data-testid` — use semantic selectors (aria-label, IDs, element types)
- **Workflow**: manual playwright-cli verification → write/extend spec → run `mise exec -- pnpm test:e2e` → confirm spec passes

## Quick Reference (copy-paste block)

For agents that want the minimal reliable sequence:

```bash
# === SETUP ===
lsof -ti :4321 | xargs kill -9 2>/dev/null || true
sleep 1

# Build (skip if dist/ is fresh)
mise exec -- pnpm build

# Start detached server
setsid nohup mise exec -- node_modules/.bin/astro preview --port 4321 > /tmp/astro-preview.log 2>&1 &

# Wait for ready (use localhost, NOT 127.0.0.1 — Astro binds IPv6)
for i in $(seq 1 30); do curl -s -o /dev/null -w "%{http_code}" http://localhost:4321/ 2>/dev/null | grep -q "200" && echo "Ready after ${i}s" && break; [ "$i" -eq 30 ] && echo "TIMEOUT" && cat /tmp/astro-preview.log; sleep 1; done

# === QA WORK ===
mise exec -- playwright-cli open http://localhost:4321/
# ... your QA commands here ...

# === TEARDOWN ===
mise exec -- playwright-cli close
lsof -ti :4321 | xargs kill 2>/dev/null || true
```

## Failure Recovery

### "node: not found"
Verify mise is installed and `mise.toml` is present in the project root. Run `mise install` to ensure all tools are installed and available.

### "Connection refused" on curl/playwright-cli
Astro preview binds to IPv6 (`::1`). Use `http://localhost:4321/` not `http://127.0.0.1:4321/`.

### Server dies mid-session
If playwright-cli commands start failing with connection errors:
1. Check server: `lsof -i :4321` — if empty, server died
2. Check logs: `cat /tmp/astro-preview.log`
3. Restart from Phase 1 (clean environment)

### Port conflict
If `lsof -i :4321` shows a process you didn't start:
```bash
# Force kill whatever holds the port
lsof -ti :4321 | xargs kill -9
sleep 2
# Restart from Phase 3
```

### playwright-cli browser becomes unresponsive
```bash
mise exec -- playwright-cli kill-all
# Wait, then re-open
mise exec -- playwright-cli open http://localhost:4321/
```

## Rules for Agents

1. **NEVER** start `pnpm dev` or `pnpm preview` as a foreground process in a bash call you expect to return from. Always use the `setsid` with `mise exec --` pattern.
2. **NEVER** assume the server is running. Always verify with `curl` or `lsof` before navigating.
3. **NEVER** combine `setAttribute` and `getAttribute` in a single playwright-cli eval.
4. **ALWAYS** prefix `node`/`pnpm`/`npx`/`playwright-cli` commands with `mise exec --`.
5. **ALWAYS** use `--port 4321` explicitly when starting the server.
6. **ALWAYS** use `http://localhost:4321/` (not `127.0.0.1` — Astro binds IPv6).
7. **ALWAYS** clean up the server process when QA is complete.
8. **ALWAYS** check `/tmp/astro-preview.log` if the server crashes — it contains the actual error.
9. **PREFER** `astro preview` (static) over `astro dev` (HMR) for QA — it's more stable and deterministic.
10. **NEVER** run `pnpm build` concurrently with playwright-cli commands — build is resource-intensive and will starve the browser.
11. **NEVER** use raw `node`, `pnpm`, `npx`, or `playwright-cli` commands without `mise exec --` prefix.

## Debugging Checklist

If playwright-cli QA fails, work through this in order:

| # | Check | Command | Expected |
|---|-------|---------|----------|
| 1 | node on PATH? | `mise exec -- node --version` | Version output (not "not found") |
| 2 | playwright-cli installed? | `mise exec -- playwright-cli --version` | Version output |
| 3 | Server process alive? | `lsof -i :4321` | Shows `node` process |
| 4 | Server responding? | `curl -s http://localhost:4321/` | Returns HTML |
| 5 | Server log errors? | `cat /tmp/astro-preview.log` | No crash traces |
| 6 | Browser session alive? | `mise exec -- playwright-cli list` | Shows active session |
| 7 | Port free for restart? | `lsof -i :4321` after kill | Empty |
| 8 | dist/ exists and current? | `ls -la dist/index.html` | Recent timestamp |

## Environment Details (for reference)

- **Framework:** Astro 5.x (static output)
- **Tool management:** mise (mise.toml at project root)
- **Package manager:** pnpm
- **Node management:** mise (Node version 24.x)
- **Default Astro ports:** 4321 (dev), 4321 (preview)
- **Astro preview binding:** IPv6 `::1` (NOT IPv4 `127.0.0.1`)
- **playwright-cli package:** `@playwright/cli` (npm global install)
- **Build command:** `mise exec -- pnpm build` = `astro build && pagefind --site dist`
