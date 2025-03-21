---
sidebar_position: 1
---

# Features

Vevet offers a robust set of features for detecting device types, managing application states, responding to viewport changes, and more.

## Usage Example

```ts
import { vevet } from 'vevet';

console.log(vevet); // => ICore instance
console.log(vevet.version); // => '5.0.0'
console.log(vevet.osName); // => 'windows'
console.log(vevet.browserName); // => 'chrome'
```

---

## System

### `phone`
- **Type**: `boolean`  
Detects if the application is running on a phone device.

### `tablet`
- **Type**: `boolean`  
Detects if the application is running on a tablet device.

### `mobile`
- **Type**: `boolean`  
Detects if the application is running on a mobile device (tablet or phone).

### `osName`
- **Type**: `string`  
Returns the name of the operating system.  
Popular results:
  - windows
  - macos
  - android
  - ios


### `browserName`
- **Type**: `string`  
Returns the name of the browser.  
Popular results:
  - chrome
  - edge-chromium
  - opera
  - firefox
  - safari
  - ios (safari & in-app safari)
  - crios (chrome in ios)
  - samsung
  - yandexbrowser
  - ios-webview

---

## App

### `version`
- **Type**: `string`  
Returns the current Vevet version.

### `props`
- **Type**: `ICoreProps`  
Represents application settings. See [Customization](./customization).

### `doc`
- **Type**: `Document`  
Represents the document element.

### `html`
- **Type**: `HTMLElement`  
Represents the `<html>` element.

### `body`
- **Type**: `HTMLElement`  
Represents the `<body>` element.

---

## Page Load

### `loaded`
- **Type**: `boolean`  
Indicates whether the page is loaded.

### `onLoad`
- **Type**: `(callback: () => void) => () => void`  
Adds a callback to execute when the page loads. Returns a destructor function.

**Example**:
```ts
const destruct = vevet.onLoad(() => {
  console.log('Page loaded');
});

// Cancel the callback if it hasn't been called yet
destruct();
```

---

## Viewport

### `onViewport`
Adds a callback that triggers when the window size changes. Different targets can be specified.

**Example**:
```ts
vevet.onViewport('width', () => console.log('Width changed'));
vevet.onViewport('height', () => console.log('Height changed'));
vevet.onViewport('both', () => console.log('Both width and height changed'));
vevet.onViewport('width_', () => console.log('Only width changed'));
vevet.onViewport('height_', () => console.log('Only height changed'));
vevet.onViewport('any', () => console.log('Width or height change'));

const destruct = vevet.onViewport('trigger', () => console.log('Any change that triggers resize'));

// Cancel the callback
destruct();
```

### `width`
- **Type**: `number`  
Current viewport width.

### `height`
- **Type**: `number`  
Current viewport height.

### `sHeight`
- **Type**: `number`  
Current small viewport height. Equivalent to `100svh`. Used to prevent layout shifts in browsers like In-App Safari. 

### `scrollbarWidth`
- **Type**: `number`  
Page scrollbar current width.

### `vw`
- **Type**: `number`  
Current viewport width divided by 100 (`1vw`).

### `vh`
- **Type**: `number`  
Current viewport height divided by 100 (`1vh`).

### `svh`
- **Type**: `number`  
Current small viewport height divided by 100 (`1svh`). Used to prevent layout shifts in browsers like In-App Safari. 

### `rem`
- **Type**: `number`  
Root `font-size` in pixels (`1rem` to pixels)

### `landscape`
- **Type**: `boolean`  
Indicates whether the viewport is in landscape mode.

### `portrait`
- **Type**: `boolean`  
Indicates whether the viewport is in portrait mode.

### `dpr`
- **Type**: `number`  
Device pixel ratio.

### `lowerDpr`
- **Type**: `number`  
Lower device pixel ratio (1 for desktop, up to 2 for mobile devices).

### `sm`
- **Type**: `boolean`  
Indicates if the SM breakpoint is active. See [Customization](./customization).

### `md`
- **Type**: `boolean`  
Indicates if the MD breakpoint is active. See [Customization](./customization).

### `lg`
- **Type**: `boolean`  
Indicates if the LG breakpoint is active (greater than MD). See [Customization](./customization).
