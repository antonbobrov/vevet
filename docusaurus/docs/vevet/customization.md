---
sidebar_position: 3
---

# Customization

Vevet allows external customization through application settings (`vevet.props`).

## Modifying Settings

To override default settings, assign them to the global `window` object before the library initializes.

The default settings are:

```js
window.VEVET_PROPS = {
  md: 1199, // Medium breakpoint (px)
  sm: 999, // Small breakpoint (px)
  resizeDebounce: 0, // Debounce time for resize events (ms)
  easing: [0.25, 0.1, 0.25, 1], // Default easing type
  applyClassNames: false, // Apply class names to the root element (browser, OS, etc.)
};
```

## SCSS Variables

Define breakpoints in SCSS before importing Vevet’s styles:

```scss
$vevet-md: 1199px;
$vevet-sm: 999px;

@import '~vevet/lib/styles/index';
```