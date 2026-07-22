// SessionStart hook — injects the harness's orientation documents into context.
//
// The list is NOT hardcoded here. It is read from harness.config.json
// (contextLoading.atSessionStart), so the config stays the single source of truth:
// add or rename an entry there and this picks it up with no change to this file.
//
// Entries with source "self" are skipped — ai-assist/CLAUDE.md is already loaded
// as project context, and injecting it again would just duplicate it.
//
// Fails soft by design: a missing file or a malformed config degrades to a note in
// the injected context rather than an error, because a hook that crashes takes the
// whole session start with it.

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..'); // .claude/hooks -> ai-assist
const CONFIG = path.join(ROOT, 'harness.config.json');
const MAX_CHARS_PER_FILE = 50000; // guard against a doc growing unexpectedly

function emit(context) {
  process.stdout.write(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'SessionStart',
        additionalContext: context,
      },
    }),
  );
}

let entries;
try {
  const cfg = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
  entries = (cfg.contextLoading?.atSessionStart ?? [])
    .filter((e) => e.source !== 'self')
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
} catch (err) {
  emit(
    `[harness] Could not read contextLoading from ${path.basename(CONFIG)} (${err.message}). ` +
      `Load the orientation documents manually — see ai-assist/CLAUDE.md.`,
  );
  process.exit(0);
}

if (entries.length === 0) {
  emit('[harness] No session-start documents are declared in harness.config.json.');
  process.exit(0);
}

const parts = [
  '# Solution context (auto-loaded)',
  '',
  'These are the orientation documents for the linked repositories and knowledge base,',
  'injected from `harness.config.json` → `contextLoading.atSessionStart`.',
  'The knowledge base is canonical for business language and rules; read it before the repos.',
  '',
  'Deeper documents (`docs/`, `.ua/`) are NOT loaded — pull them per question via the',
  "config's `routing` section.",
];

const loaded = [];
const failed = [];

for (const entry of entries) {
  const abs = path.resolve(ROOT, entry.file);
  try {
    let body = fs.readFileSync(abs, 'utf8');
    if (body.length > MAX_CHARS_PER_FILE) {
      body = body.slice(0, MAX_CHARS_PER_FILE) + '\n\n[truncated by the session-start hook]';
    }
    parts.push('', '---', '', `## ${entry.source} — \`${entry.file}\``, '');
    if (entry.why) parts.push(`> ${entry.why}`, '');
    parts.push(body.trim());
    loaded.push(entry.source);
  } catch (err) {
    failed.push(`${entry.source} (${entry.file}): ${err.code || err.message}`);
  }
}

if (failed.length) {
  parts.push(
    '',
    '---',
    '',
    '## ⚠ Not loaded',
    '',
    ...failed.map((f) => `- ${f}`),
    '',
    'Check the paths in `harness.config.json`. They are relative to the ai-assist directory.',
  );
}

emit(parts.join('\n'));
