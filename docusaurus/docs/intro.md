---
sidebar_position: -1000
---

# Vevet.js

## Introduction

Vevet.js is a flexible client-side JavaScript library for creative web development. Build stunning interactive experiences with&nbsp;a&nbsp;comprehensive toolkit of components and utilities.

The library consists of:

- **[core](/docs/core)**  
  Handles viewport events, page load states, and provides essential info about the viewport and user agent.

- **[components](/docs/Marquee)**  
  A collection of abstract and functional modules such as loaders, scroll tools, split text, carousels, and more.
- **[base](/docs/base/Callbacks)**  
  Basic abstract classes.
- **[utils](/docs/utils)**  
  Lightweight internal utilities.

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
