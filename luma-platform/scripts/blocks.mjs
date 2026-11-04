#!/usr/bin/env node
/**
 * One entry point for the Blocks CLI, replacing the twelve `blocks:run:*`
 * scripts and the two hand-chained `blocks:publish-*` commands.
 *
 *   npm run blocks:run -- navigator        (or luma-navigator)
 *   npm run blocks:publish -- free         (or paid; omit for every block)
 *
 * Publishing settings live in BLOCKS below. Each entry is published with
 * `--accept-terms`, which attests legal compliance and accepts the Blocks
 * paid-provider terms.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BLOCKS = [
  { dir: "luma-navigator", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-escrow-steward", billing: "paid", listing: "public", price: "0.25" },
  { dir: "luma-partner-architect", billing: "paid", listing: "public", price: "0.25" },
  { dir: "luma-expert-finance", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-expert-legal", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-expert-career", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-expert-learning", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-expert-home", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-expert-digital", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-expert-wellbeing", billing: "paid", listing: "public", price: "0.05" },
  { dir: "luma-resources", billing: "free", listing: "private" },
  { dir: "luma-community", billing: "free", listing: "private" },
];

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

/** Run the `blocks` CLI inside one block's directory. */
function blocks(blockDir, args) {
  // A shell is required because `blocks` is blocks.cmd on Windows. The command
  // is passed as one string rather than an args array, which Node deprecates
  // when combined with shell: true. Every argument here comes from BLOCKS above
  // or from the CLI's own flag list — the block name is matched, never echoed.
  const result = spawnSync(["blocks", ...args].join(" "), {
    cwd: path.join(ROOT, "blocks", blockDir),
    stdio: "inherit",
    shell: true,
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

/** Accept either the full directory name or the short alias. */
function findBlock(name) {
  const block = BLOCKS.find((b) => b.dir === name || b.dir === `luma-${name}`);
  if (!block) {
    console.error(`Unknown block: ${name}`);
    console.error(`Known blocks: ${BLOCKS.map((b) => b.dir).join(", ")}`);
    process.exit(1);
  }
  return block;
}

function usage() {
  console.log("usage: node scripts/blocks.mjs run <block>");
  console.log("       node scripts/blocks.mjs publish [free|paid]");
}

const [command, target] = process.argv.slice(2);

if (!command || command === "--help" || command === "-h") {
  usage();
  process.exit(command ? 0 : 1);
}

if (command === "run") {
  if (!target) {
    usage();
    process.exit(1);
  }
  blocks(findBlock(target).dir, ["run"]);
} else if (command === "publish") {
  const selected = target ? BLOCKS.filter((b) => b.billing === target) : BLOCKS;
  if (selected.length === 0) {
    console.error(`No blocks use billing mode: ${target}`);
    process.exit(1);
  }
  for (const block of selected) {
    console.log(`\n==> ${block.dir} (${block.billing})`);
    blocks(block.dir, [
      "publish",
      "--billing-mode",
      block.billing,
      "--listing",
      block.listing,
      ...(block.price ? ["--price", block.price] : []),
      "--accept-terms",
    ]);
  }
} else {
  console.error(`Unknown command: ${command}`);
  usage();
  process.exit(1);
}
