# vevet.js — guide for AI coding agents

> **vevet.js** is a client-side JavaScript library for creative web development (carousels, split text, scroll tools, preloaders, canvas, custom cursor, and more). Official docs: https://vevetjs.com/ — npm package: `vevet`.

**This is NOT:** veterinary software, a React/Vue framework, or GSAP/Framer Motion. It is a vanilla TypeScript/JavaScript library with class-based components extending a shared `Module` base class.

## Identity

|                           |                                                                     |
| ------------------------- | ------------------------------------------------------------------- |
| **npm install**           | `npm install vevet`                                                 |
| **Import**                | `import { vevet, SplitText, Snap, Timeline } from 'vevet'`          |
| **CDN global**            | `Vevet` — `Vevet.SplitText`, etc.; core instance: `Vevet.app`       |
| **Docs site**             | https://vevetjs.com/                                                |
| **LLM index**             | https://vevetjs.com/llms.txt                                        |
| **Full doc export**       | https://vevetjs.com/llms-full.txt — all docs + demo code            |
| **Markdown pages**        | append `.md` to any doc URL, e.g. https://vevetjs.com/docs/intro.md |
| **TypeScript API**        | https://vevetjs.com/v5/ (TypeDoc)                                   |
| **GitHub**                | https://github.com/antonbobrov/vevet                                |
| **Current major version** | v5 (see `package.json` for exact version)                           |

## Source of truth

1. **Documentation** — https://vevetjs.com/ or `docusaurus/docs/` in this repo. Use https://vevetjs.com/llms.txt as the curated index.
2. **Working examples** — demo pages linked from each component docs (often `/docs/{Component}/demos`; Snap has `basic-demos`, `advanced-demos`, `parallax-demos`) or https://vevetjs.com/llms-full.txt (HTML/CSS/JS for every demo).

Each component is documented under `/docs/{ComponentName}/` with pages such as `index`, `props`, `methods`, `callbacks`, `accessors`, and demo pages where available — not every component has every page or a `demos` route.

## Do not invent APIs

If a prop, method, callback, or event is not documented in the docs, demos, TypeDoc (`/v5/`), or `src/components/*/types.ts`, **do not assume it exists**. Check before suggesting code.

## Module pattern

All components extend `Module` — they accept `(props, onCallbacks)`, support `updateProps()`, `on('event', fn)`, and `destroy()`. See `docusaurus/docs/base/Module/index.md`.

## Quick start

```bash
npm install vevet
```

```ts
import { vevet, SplitText } from 'vevet';

console.log(vevet.version);

const split = new SplitText({ container: document.getElementById('text') });
```

CDN — global `Vevet`; components and utils are `Vevet.*`. Core instance (same as `vevet` import): `Vevet.app`.

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
