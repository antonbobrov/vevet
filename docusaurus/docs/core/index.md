---
sidebar_position: -900
---

# Core

**Vevet.js** provides essential utilities for detecting and responding to the user’s environment.



## Features

- **Viewport Detection** – Get detailed information about the user's viewport.
- **Browser & OS Detection** – Identify the user's browser and operating system.
- **Custom Callbacks** – Trigger actions on page load or viewport changes.



## Installation

### Using NPM

```bash
npm install vevet
```

**JavaScript:**

```ts
import { vevet } from 'vevet';

console.log(vevet.version); // => 5.0.0
```

### Using CDN

```html
<script src="
https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js
"></script>

<script>
  console.log(Vevet.app.version); // => 5.0.0
  console.log(Vevet.SplitText); // => access components
</script>
```



## Features

Learn more in the **[Features Documentation](./features)**.

## CSS Variables 

Vevet provides key CSS variables:

- `--vw` – Viewport width unit

- `--vh` – Viewport height unit

- `--svh` – Safe viewport height

- `--scrollbar-width` – Width of the browser scrollbar

Learn more in **[CSS Variables](./css-vars)**