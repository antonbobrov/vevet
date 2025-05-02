---
sidebar_position: 2
---

# Core

The **Vevet Core** provides essential utilities for detecting and responding to the user’s environment.

## Features

- **Viewport Detection** – Get detailed information about the user's viewport.
- **Browser & OS Detection** – Identify the user's browser and operating system.
- **Custom Callbacks** – Trigger actions on page load or viewport changes.

## Usage

### JavaScript Example

```ts
import { vevet } from 'vevet';

console.log(vevet); // => IVevet instance
console.log(vevet.version); // => '5.0.0'
console.log(vevet.osName); // => 'windows'
console.log(vevet.browserName); // => 'chrome'
```

Learn more in the **[Features Documentation](./features)** and **[SCSS Features](./scss)** .

## Customization

Vevet is fully customizable. You can modify breakpoints (CSS & JS), default easing functions, and resize events.

Learn more in **[Customization](./customization)**

## CSS Variables 

Vevet provides key CSS variables:

- `--vw` – Viewport width unit

- `--vh` – Viewport height unit

- `--svh` – Safe viewport height

- `--scrollbar-width` – Width of the browser scrollbar

Learn more in **[CSS Variables](./css-vars)**