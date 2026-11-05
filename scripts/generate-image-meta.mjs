/**
 * Generates `data/image-meta.json` — real pixel dimensions + a tiny blur
 * placeholder for every Unsplash photo id referenced in `data/*.ts`.
 *
 * Run after adding or replacing images:  npm run images
 */
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dataDir = path.join(root, "data");
const outFile = path.join(dataDir, "image-meta.json");
const CDN = "https://images.unsplash.com";
const ID_PATTERN = /photo-\d{10,13}-[a-f0-9]{12}/g;

async function collectIds() {
  const files = (await readdir(dataDir)).filter((f) => f.endsWith(".ts"));
  const ids = new Set();
  for (const file of files) {
    const source = await readFile(path.join(dataDir, file), "utf8");
    for (const match of source.matchAll(ID_PATTERN)) ids.add(match[0]);
  }
  return [...ids].sort();
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(outFile, "utf8"));
  } catch {
    return {};
  }
}

async function fetchMeta(id) {
  const [info, blur] = await Promise.all([
    fetch(`${CDN}/${id}?fm=json`).then((r) => {
      if (!r.ok) throw new Error(`${id}: metadata ${r.status}`);
      return r.json();
    }),
    fetch(`${CDN}/${id}?w=8&fm=gif`).then(async (r) => {
      if (!r.ok) throw new Error(`${id}: blur ${r.status}`);
      return Buffer.from(await r.arrayBuffer()).toString("base64");
    }),
  ]);
  return { w: info.PixelWidth, h: info.PixelHeight, blur: `data:image/gif;base64,${blur}` };
}

async function main() {
  const ids = await collectIds();
  const existing = await readExisting();
  const result = {};
  const todo = ids.filter((id) => {
    if (existing[id]) result[id] = existing[id];
    return !existing[id];
  });

  const queue = [...todo];
  const workers = Array.from({ length: 8 }, async () => {
    while (queue.length) {
      const id = queue.shift();
      result[id] = await fetchMeta(id);
      process.stdout.write(".");
    }
  });
  await Promise.all(workers);

  const sorted = Object.fromEntries(Object.keys(result).sort().map((k) => [k, result[k]]));
  await writeFile(outFile, `${JSON.stringify(sorted, null, 2)}\n`);
  console.log(`\n${ids.length} images (${todo.length} fetched) → data/image-meta.json`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
