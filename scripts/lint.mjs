import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const srcDir = path.join(root, "src");
const violations = [];

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath);
      continue;
    }

    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".mjs")) {
      continue;
    }

    const content = await readFile(fullPath, "utf8");
    if (content.includes("\t")) {
      violations.push(`${path.relative(root, fullPath)}: tabs are not allowed`);
    }
    if (content.includes("console.log(")) {
      violations.push(`${path.relative(root, fullPath)}: use process.stdout.write instead of console.log`);
    }
  }
}

await walk(srcDir);

if (violations.length > 0) {
  process.stderr.write("Lint failed:\n");
  for (const violation of violations) {
    process.stderr.write(`- ${violation}\n`);
  }
  process.exit(1);
}

process.stdout.write("Lint passed\n");
