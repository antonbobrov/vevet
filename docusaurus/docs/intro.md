---
sidebar_position: 1
---

# Vevet

## Introduction

**Vevet** is a flexible client-side JavaScript library for creative web development.

It includes:

- [Core](/docs/vevet)  
  Handles viewport events, page load states, and provides essential info about the viewport and user agent.

- [Base](/docs/base/Callbacks)  
  Core utilities like Callbacks, Module, and Responsive. Skip this if you only need ready-to-use components.

- [Components](/docs/components/Canvas)  
  A collection of abstract and functional modules such as loaders, scroll tools, split text, carousels, and more.

- [Utils](/docs/utils)  
  Lightweight internal utilities.

## Installation

### Using NPM

```bash
npm install vevet
```

JavaScript:

```ts
import { vevet } from 'vevet';

console.log(vevet.version); // => 5.0.0
```

SCSS:

```scss
@import '~vevet/lib/styles/index';
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
