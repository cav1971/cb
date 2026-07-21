import { mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const srcDir = path.join(root, "src");
const distDir = path.join(root, "dist");
const packageJsonPath = path.join(root, "package.json");

const packageJson = JSON.parse(await readFile(packageJsonPath, "utf8"));
const banner = `// build: ${packageJson.name}@${packageJson.version}\n`;

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

const sourceFiles = await readdir(srcDir, { withFileTypes: true });
for (const entry of sourceFiles) {
  if (!entry.isFile() || !entry.name.endsWith(".js")) {
    continue;
  }

  const inPath = path.join(srcDir, entry.name);
  const outPath = path.join(distDir, entry.name);
  const content = await readFile(inPath, "utf8");
  await writeFile(outPath, `${banner}${content}`, "utf8");
}

await writeFile(
  path.join(distDir, "build-info.txt"),
  `built_at_utc=${new Date().toISOString()}\n`,
  "utf8"
);

process.stdout.write("Build completed\n");
