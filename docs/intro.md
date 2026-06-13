# Vevet.js

## Introduction[​](#introduction "Direct link to Introduction")

Vevet.js is a flexible client-side JavaScript library for creative web development. Build stunning interactive experiences with a comprehensive toolkit of components and utilities.

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

```
<script src="

https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js

"></script>



<script>

  console.log(Vevet.app.version); // => 5.0.0

  console.log(Vevet.SplitText); // => access components

</script>
```
