import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(__dirname, '../docs');
const outputFile = path.join(__dirname, '../data/pens-ids.json');

const demoIdPattern = /<VevetDemo\s[^>]*\bid=["']([^"']+)["']/g;

function collectIdsFromDir(dir) {
  const ids = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      ids.push(...collectIdsFromDir(fullPath));
      continue;
    }

    if (!entry.name.endsWith('.mdx')) {
      continue;
    }

    const content = fs.readFileSync(fullPath, 'utf8');

    for (const match of content.matchAll(demoIdPattern)) {
      ids.push(match[1]);
    }
  }

  return ids;
}

const allIds = collectIdsFromDir(docsDir);
const uniqueIds = [...new Set(allIds)].sort();

const demoIds = uniqueIds.map((id) => ({ id }));

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, `${JSON.stringify(demoIds, null, 2)}\n`, 'utf8');

console.log(
  `Collected ${uniqueIds.length} unique demo ids from ${allIds.length} VevetDemo usages.`,
);
console.log(
  `Written to ${path.relative(path.join(__dirname, '..'), outputFile)}`,
);
