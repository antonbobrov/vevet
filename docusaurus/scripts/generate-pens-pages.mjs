import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docusaurusRoot = path.join(__dirname, '..');
const outputDir = path.join(docusaurusRoot, 'static/pens');

const demoContents = JSON.parse(
  fs.readFileSync(path.join(docusaurusRoot, 'data/pens-contents.json'), 'utf8'),
);

const demoIds = JSON.parse(
  fs.readFileSync(path.join(docusaurusRoot, 'data/pens-ids.json'), 'utf8'),
).map((entry) => entry.id);

const moduleUrls = {
  vevet: `https://esm.sh/vevet@5`,
  animejs: 'https://esm.sh/animejs@4',
  gsap: 'https://esm.sh/gsap@3',
};

const demosById = new Map(demoContents.map((demo) => [demo.id, demo]));

function rewriteImports(script) {
  let next = script;

  for (const [name, url] of Object.entries(moduleUrls)) {
    next = next.replace(
      new RegExp(`from\\s+(["'])${name}\\1`, 'g'),
      `from "${url}"`,
    );
  }

  return next;
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function renderDemoPage(demo) {
  const styles = demo.styles?.trim() ?? '';
  const body = demo.body?.trim() ?? '';
  const script = demo.script ? rewriteImports(demo.script) : '';

  const scriptTag = script
    ? `\n  <script type="module">\n${script}\n  </script>`
    : '';

  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>vevet pen · ${escapeHtml(demo.id)}</title>
        <link rel="stylesheet" href="https://vevetjs.com/shared/codepen-styles.css" />
        <style>${styles}</style>
      </head>
      <body>
        ${body}
        ${scriptTag}
      </body>
    </html>
  `;
}

if (fs.existsSync(outputDir)) {
  fs.rmSync(outputDir, { recursive: true, force: true });
}

const written = [];

for (const id of demoIds) {
  const demo = demosById.get(id);

  if (!demo) {
    console.warn(`Warning: demo id "${id}" is missing from pens-contents.json`);
    continue;
  }

  const hasSnippet =
    Boolean(demo.body?.trim()) ||
    Boolean(demo.styles?.trim()) ||
    Boolean(demo.script?.trim());

  if (!hasSnippet) {
    continue;
  }

  const demoDir = path.join(outputDir, demo.id);

  fs.mkdirSync(demoDir, { recursive: true });
  fs.writeFileSync(
    path.join(demoDir, 'index.html'),
    `${renderDemoPage(demo)}\n`,
    'utf8',
  );

  written.push(demo);
}

written.sort((a, b) => a.id.localeCompare(b.id));

console.log(
  `Generated ${written.length} demo pages in ${path.relative(docusaurusRoot, outputDir)}`,
);
