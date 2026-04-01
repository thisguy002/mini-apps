#!/usr/bin/env -S npx tsx
// =============================================================================
// ton-cli — entry point
// Delegates all logic to src/cli.ts
// =============================================================================

import { run } from '../src/cli.js';

process.on('SIGINT', () => {
  console.log('\n\nInterrupted.');
  process.exit(0);
});

run().catch(err => {
  // cli.ts handles its own errors; this catches anything that escapes
  console.error(`\n❌  ${err instanceof Error ? err.message : String(err)}\n`);
  process.exit(1);
});