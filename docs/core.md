# Core

**Vevet.js** provides essential utilities for detecting and responding to the user’s environment.

## Features[​](#features "Direct link to Features")

* **Viewport Detection** – Get detailed information about the user's viewport.
* **Browser & OS Detection** – Identify the user's browser and operating system.
* **Custom Callbacks** – Trigger actions on page load or viewport changes.

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

```
<script src="

https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js

"></script>



<script>

  console.log(Vevet.app.version); // => 5.0.0

  console.log(Vevet.SplitText); // => access components

</script>
```

## Features[​](#features-1 "Direct link to Features")

Learn more in the **[Features Documentation](https://vevetjs.com/docs/core/features.md)**.

## CSS Variables[​](#css-variables "Direct link to CSS Variables")

Vevet provides key CSS variables:

* `--vw` – Viewport width unit

* `--vh` – Viewport height unit

* `--svh` – Safe viewport height

* `--scrollbar-width` – Width of the browser scrollbar

Learn more in **[CSS Variables](https://vevetjs.com/docs/core/css-vars.md)**
