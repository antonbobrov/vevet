---
sidebar_position: 2
---

# Vevet

**vevet** is a client-side utility designed to provide comprehensive details about the user's viewport, browser, and operating system. It also offers various callbacks for page load events and viewport changes.

## Features

- **Viewport Detection**: Retrieve detailed information about the user's viewport.
- **Browser and OS Identification**: Get details about the user's browser and operating system.
- **Custom Callbacks**: Trigger specific actions on page load or viewport changes.

## Usage

### JavaScript Example

Learn more in the **[Features Documentation](./features)**.

```ts
import { vevet } from 'vevet';

console.log(vevet); // => IVevet instance
console.log(vevet.version); // => '5.0.0'
console.log(vevet.osName); // => 'windows'
console.log(vevet.browserName); // => 'chrome'
