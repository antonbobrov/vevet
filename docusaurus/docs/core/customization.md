---
sidebar_position: 3
description: Customize Vevet.js via window.VEVET_PROPS — override default settings before library initialization.
keywords:
  - vevet customization
  - vevet props
  - settings
  - configuration
---

# Customization

**Vevet.js** allows external customization through application settings (`vevet.props`).

## Modifying Settings

To override default settings, assign them to the global `window` object before the library initializes.

The default settings are:

```js
window.VEVET_PROPS = {
  resizeDebounce: 0, // Debounce time for resize events (ms)
  easing: [0.25, 0.1, 0.25, 1], // Default easing type
  applyClassNames: false, // Apply class names to the root element (browser, OS, etc.)
};
```
