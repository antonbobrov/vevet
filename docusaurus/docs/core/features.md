---
sidebar_position: 1
---

# Features

**Vevet.js** offers a robust set of features for detecting 
- device types
- managing application states
- responding to viewport changes
- and more.

## NPM Usage Example

```ts
import { vevet } from 'vevet';

console.log(vevet); // => ICore instance
console.log(vevet.version); // => '5.0.0'
console.log(vevet.osName); // => 'windows'
console.log(vevet.browserName); // => 'chrome'
```

## CDN Usage Example

```js
console.log(Vevet.app); // => ICore instance
console.log(Vevet.app.version); // => '5.0.0'
console.log(Vevet.app.osName); // => 'windows'
console.log(Vevet.app.browserName); // => 'chrome'
```

---

## System

### `vevet.phone`
- **Type**: `boolean`  
Detects if the application is running on a phone device.

### `vevet.tablet`
- **Type**: `boolean`  
Detects if the application is running on a tablet device.

### `vevet.mobile`
- **Type**: `boolean`  
Detects if the application is running on a mobile device (tablet or phone).

### `vevet.osName`
- **Type**: `string`  
Returns the name of the operating system.  
Popular results:
  - windows
  - macos
  - linux
  - android
  - ios


### `vevet.browserName`
- **Type**: `string`  
Returns the name of the browser.  
Popular results:
  - chrome
  - microsoft_edge
  - opera
  - firefox
  - safari
  - opera
  - samsung_internet_for_ndroid
  - yandex_browser

---

## App

### `vevet.version`
- **Type**: `string`  
Returns the current Vevet version.

### `vevet.props`
- **Type**: `ICoreProps`  
Represents application settings. See [Customization](./customization).

### `vevet.doc`
- **Type**: `Document`  
Represents the document element.

### `vevet.html`
- **Type**: `HTMLElement`  
Represents the `<html>` element.

### `vevet.body`
- **Type**: `HTMLElement`  
Represents the `<body>` element.

---

## Page Load

### `vevet.loaded`
- **Type**: `boolean`  
Indicates whether the page is loaded.

### `vevet.onLoad`
- **Type**: `(callback: () => void) => () => void`  
Adds a callback to execute when the page loads. Returns a destructor function.

**Example**:
```ts
const destruct = vevet.onLoad(() => {
  console.log(vevet.loaded);
});

// Cancel the callback if it hasn't been called yet
destruct();
```

---

## Viewport

### `vevet.onResize`
Adds a callback that triggers when the window size changes. Different targets can be specified.

**Example**:
```ts
vevet.onResize('width', () => {
  console.log('when the viewport width changes (ignores height)');
});

vevet.onResize('height', () => {
  console.log('when the viewport height changes (ignores width)');
});

vevet.onResize('both', () => {
  console.log('when both width and height change');
});

vevet.onResize('onlyWidth', () => {
  console.log('only when the width changes (height remains the same)');
});

vevet.onResize('onlyHeight', () => {
  console.log('only when the height changes (width remains the same)');
});

vevet.onResize('any', () => {
  console.log('when either width or height changes');
});

const destruct = vevet.onResize('trigger', () => {
  console.log('on any resize event, including width, height, or body size changes');
});

// Cancel the callback
destruct();
```

### `vevet.width`
- **Type**: `number`  
Current viewport width.

### `vevet.height`
- **Type**: `number`  
Current viewport height.

### `vevet.sHeight`
- **Type**: `number`  
Current small viewport height. Equivalent to `100svh`. Used to prevent layout shifts in browsers like In-App Safari while native svh works not properly. 

### `vevet.scrollbarWidth`
- **Type**: `number`  
Page scrollbar current width.

### `vevet.vw`
- **Type**: `number`  
Current viewport width divided by 100 (`1vw`).

### `vevet.vh`
- **Type**: `number`  
Current viewport height divided by 100 (`1vh`).

### `vevet.svh`
- **Type**: `number`  
Current small viewport height divided by 100 (`1svh`). Used to prevent layout shifts in browsers like In-App Safari. 

### `vevet.rem`
- **Type**: `number`  
Root `font-size` in pixels (`1rem` to pixels)

### `vevet.landscape`
- **Type**: `boolean`  
Indicates whether the viewport is in landscape mode.

### `vevet.portrait`
- **Type**: `boolean`  
Indicates whether the viewport is in portrait mode.

### `vevet.dpr`
- **Type**: `number`  
Device pixel ratio.

### `vevet.lowerDpr`
- **Type**: `number`  
Lower device pixel ratio (1 for desktop, up to 2 for mobile devices).

### `vevet.sm`
- **Type**: `boolean`  
Indicates if the SM breakpoint is active. See [Customization](./customization).

### `vevet.md`
- **Type**: `boolean`  
Indicates if the MD breakpoint is active. See [Customization](./customization).

### `vevet.lg`
- **Type**: `boolean`  
Indicates if the LG breakpoint is active (greater than MD). See [Customization](./customization).
