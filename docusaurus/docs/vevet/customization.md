---
sidebar_position: 3
---

# Customization

Vevet allows external customization through application settings (`vevet.props`).

## Modifying Settings

To override default settings, assign them to the global `window` object before the library initializes:  

```js
window.VEVET_PROPS = {
  md: 1199, // Medium breakpoint (px)
  sm: 899, // Small breakpoint (px)
  resizeDebounce: 16, // Debounce time for resize events (ms)
  applyClassNames: false, // Apply class names to the root element (browser, OS, etc.)
};
```

## SCSS Variables

Define breakpoints in SCSS before importing Vevet’s styles:

```scss
$vevet-md: 1199px;
$vevet-sm: 899px;

@import '~vevet/lib/styles/index';
```