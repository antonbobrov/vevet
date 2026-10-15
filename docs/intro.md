# Vevet.js

## Introduction[​](#introduction "Direct link to Introduction")

Vevet.js is a flexible client-side JavaScript library for creative web development. Build stunning interactive experiences with a comprehensive toolkit of components and utilities.

## For AI assistants[​](#for-ai-assistants "Direct link to For AI assistants")

* **Source of truth:** this documentation and working examples.
* **Examples:** demo pages linked from each component's docs (often `/docs/{Component}/demos`; Snap: `basic-demos`, `advanced-demos`, `parallax-demos`), or the [full export](https://vevetjs.com/llms-full.txt) with all demo HTML/CSS/JS.
* **Prefer per-page `.md`** from the [llms.txt](https://vevetjs.com/llms.txt) index for focused reads; use `llms-full.txt` only when you need everything at once.
* **Do not invent APIs** — use only documented props, methods, and callbacks.

Curated index: [llms.txt](https://vevetjs.com/llms.txt) · Repo guide: [AGENTS.md](https://github.com/antonbobrov/vevet/blob/master/AGENTS.md)

The library consists of:

* **[core](https://vevetjs.com/docs/core/.md)**<br /><!-- -->Handles viewport events, page load states, and provides essential info about the viewport and user agent.

* **[components](https://vevetjs.com/docs/Marquee/.md)**<br /><!-- -->A collection of abstract and functional modules such as loaders, scroll tools, split text, carousels, and more.

* **[base](https://vevetjs.com/docs/base/Callbacks/.md)**<br /><!-- -->Basic abstract classes.

* **[utils](https://vevetjs.com/docs/utils/.md)**<br /><!-- -->Lightweight internal utilities.

## Installation[​](#installation "Direct link to Installation")

### Using NPM[​](#using-npm "Direct link to Using NPM")

```
npm install vevet
```

**JavaScript:**

```
import { vevet } from 'vevet';



console.log(vevet.version); // => 5.0.0
```

### Using CDN[​](#using-cdn "Direct link to Using CDN")

On CDN the global is `Vevet` — components and utilities are `Vevet.SplitText`, `Vevet.clamp`, etc. The initialized core instance (same as `import { vevet } from 'vevet'`) is **`Vevet.app`**.

```
<script src="

https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js

"></script>



<script>

  console.log(Vevet.app.version); // => 5.0.0

  new Vevet.SplitText({ container: document.getElementById('text') });

</script>
```
