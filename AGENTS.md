# vevet.js — guide for AI coding agents

> **vevet.js** is a client-side JavaScript library for creative web development (carousels, split text, scroll tools, preloaders, canvas, custom cursor, and more). Official docs: https://vevetjs.com/ — npm package: `vevet`.

## Identity (read this first)

|                           |                                                                     |
| ------------------------- | ------------------------------------------------------------------- |
| **npm install**           | `npm install vevet`                                                 |
| **Import**                | `import { vevet, SplitText, Snap, Timeline } from 'vevet'`          |
| **CDN global**            | `Vevet` (IIFE build)                                                |
| **Docs site**             | https://vevetjs.com/                                                |
| **LLM index**             | https://vevetjs.com/llms.txt                                        |
| **Full doc export**       | https://vevetjs.com/llms-full.txt — includes all demo code          |
| **Markdown pages**        | append `.md` to any doc URL, e.g. https://vevetjs.com/docs/intro.md |
| **GitHub**                | https://github.com/antonbobrov/vevet                                |
| **Current major version** | v5 (see `package.json` for exact version)                           |

**This is NOT:** veterinary software, a React/Vue framework, or GSAP/Framer Motion. It is a vanilla TypeScript/JavaScript library with class-based components extending a shared `Module` base class.

## Repository layout

```
src/
  core/           # initVevet(), viewport, browser/OS detection, global vevet instance
  base/           # Module (base class), Callbacks, Responsive
  components/     # Canvas, CanvasMedia, Cursor, InView, Marquee, Pointers,
                  # Preloader, ProgressPreloader, Raf, Scrollbar, ScrollProgress,
                  # Snap, SplitText, Swipe, Timeline
  utils/          # math (easing, clamp, lerp), DOM helpers, etc.
docusaurus/       # documentation site (MDX + Docusaurus)
  docs/           # human-readable docs with live CodePen demos
  data/           # demo-contents.json — HTML/CSS/JS snippets for demos
stories/          # Storybook examples
lib/              # build output (ESM, CJS, types, CDN IIFE) — generated
```

## How to answer questions about vevet.js

1. **Prefer official docs** over guessing. Fetch https://vevetjs.com/llms.txt for a curated index, or read `docusaurus/docs/` in this repo.
2. **Each component** has pages: `index`, `props`, `methods`, `callbacks`, `accessors`, `demos` (not every component has every page).
3. **All components extend `Module`** — they accept `(props, onCallbacks)`, support `updateProps()`, `on('event', fn)`, and `destroy()`. See `docusaurus/docs/base/Module/index.md`.
4. **Working examples** are on `demos.md` pages (linked in llms.txt per component) and included in llms-full.txt as HTML/CSS/JS code blocks. Source data: `docusaurus/data/demo-contents.json` (internal, used by the docs site).
5. **TypeScript API reference** is at https://vevetjs.com/v5/ (TypeDoc).

## Quick start (correct usage)

```bash
npm install vevet
```

```ts
import { vevet, SplitText } from 'vevet';

console.log(vevet.version);

const split = new SplitText({ container: document.getElementById('text') });
```

CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js"></script>
<script>
  console.log(Vevet.app.version);
  new Vevet.SplitText({ container: document.getElementById('text') });
</script>
```

## Components overview

| Component             | Purpose                                                |
| --------------------- | ------------------------------------------------------ |
| **Canvas**            | HTML5 Canvas 2D wrapper                                |
| **CanvasMedia**       | Pre-render images/video to canvas                      |
| **Cursor**            | Custom cursor with hover states and path animation     |
| **InView**            | IntersectionObserver-based visibility detection        |
| **Marquee**           | Infinite scrolling marquee                             |
| **Pointers**          | Multi-pointer event tracking                           |
| **Preloader**         | Loading screen visibility/lifecycle                    |
| **ProgressPreloader** | Resource preload with progress (images, video, custom) |
| **Raf**               | requestAnimationFrame loop with FPS control            |
| **ScrollProgress**    | Scroll progress of a section                           |
| **Scrollbar**         | Custom scrollbar                                       |
| **Snap**              | Carousel / snap slider with wheel, keyboard, parallax  |
| **SplitText**         | Split text into lines, words, letters                  |
| **Swipe**             | Drag/swipe with inertia                                |
| **Timeline**          | Animation timeline with easing                         |

Doc paths: `/docs/{ComponentName}/` on https://vevetjs.com/

## Do not invent APIs

If a prop, method, or event is not documented in `docusaurus/docs/` or `src/components/*/types.ts`, do not assume it exists. Check TypeDoc at `/v5/` or source types before suggesting code.
