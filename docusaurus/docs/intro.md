---
sidebar_position: 1
---

# Introduction

**Vevet** is a flexible, client-side JavaScript library for creative web development.

The primary goal of Vevet is to simplify the creation of interactive components from scratch — be it text animations, carousels, or other interactive elements.

## NPM Usage

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

## CDN Usage

```html
<script src="
https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js
"></script>

<script>
  console.log(Vevet.app.version); // => 5.0.0
</script>
```
