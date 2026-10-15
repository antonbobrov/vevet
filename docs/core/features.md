# Features

**Vevet.js** offers a robust set of features for detecting

* device types
* managing application states
* responding to viewport changes
* and more.

## NPM Usage[​](#npm-usage "Direct link to NPM Usage")

```
import { vevet } from 'vevet';



console.log(vevet); // => ICore instance

console.log(vevet.version); // => '5.0.0'

console.log(vevet.osName); // => 'windows'

console.log(vevet.browserName); // => 'chrome'
```

## CDN Usage[​](#cdn-usage "Direct link to CDN Usage")

On CDN the global is `Vevet` — components and utilities are `Vevet.SplitText`, `Vevet.clamp`, etc. The initialized core instance (same as `import { vevet } from 'vevet'`) is **`Vevet.app`**.

```
<script src="https://cdn.jsdelivr.net/npm/vevet@5/lib/cdn/vevet.iife.min.js"></script>
```

```
console.log(Vevet.app); // => core instance (ICore)

console.log(Vevet.app.version); // => '5.0.0'

console.log(Vevet.app.osName); // => 'windows'

console.log(Vevet.app.browserName); // => 'chrome'
```

***

## System[​](#system "Direct link to System")

### `vevet.phone`[​](#vevetphone "Direct link to vevetphone")

* **Type**: `boolean`
  <br />
  <!-- -->
  Detects if the application is running on a phone device.

### `vevet.tablet`[​](#vevettablet "Direct link to vevettablet")

* **Type**: `boolean`
  <br />
  <!-- -->
  Detects if the application is running on a tablet device.

### `vevet.mobile`[​](#vevetmobile "Direct link to vevetmobile")

* **Type**: `boolean`
  <br />
  <!-- -->
  Detects if the application is running on a mobile device (tablet or phone).

### `vevet.osName`[​](#vevetosname "Direct link to vevetosname")

* **Type**: `string`

  <br />

  <!-- -->

  Returns the name of the operating system.

  <br />

  <!-- -->

  Popular results:

  <!-- -->

  * windows
  * mac
  * android
  * ios

### `vevet.browserName`[​](#vevetbrowsername "Direct link to vevetbrowsername")

* **Type**: `string`

  <br />

  <!-- -->

  Returns the name of the browser.

  <br />

  <!-- -->

  Popular results:

  <!-- -->

  * chrome
  * edge-chromium
  * opera
  * firefox
  * safari
  * ios (safari & in-app safari)
  * crios (chrome in ios)
  * samsung
  * yandexbrowser
  * ios-webview

### `vevet.inAppBrowser`[​](#vevetinappbrowser "Direct link to vevetinappbrowser")

* **Type**: `string`
  <br />
  <!-- -->
  Detects In-App Browser and returns its name, otherwise - `false`.

***

## App[​](#app "Direct link to App")

### `vevet.version`[​](#vevetversion "Direct link to vevetversion")

* **Type**: `string`
  <br />
  <!-- -->
  Returns the current Vevet version.

### `vevet.props`[​](#vevetprops "Direct link to vevetprops")

* **Type**: `ICoreProps`
  <br />
  <!-- -->
  Represents application settings. See [Customization](https://vevetjs.com/docs/core/customization.md).

### `vevet.doc`[​](#vevetdoc "Direct link to vevetdoc")

* **Type**: `Document`
  <br />
  <!-- -->
  Represents the document element.

### `vevet.html`[​](#vevethtml "Direct link to vevethtml")

* **Type**: `HTMLElement`
  <br />
  <!-- -->
  Represents the `<html>` element.

### `vevet.body`[​](#vevetbody "Direct link to vevetbody")

* **Type**: `HTMLElement`
  <br />
  <!-- -->
  Represents the `<body>` element.

***

## Page Load[​](#page-load "Direct link to Page Load")

### `vevet.loaded`[​](#vevetloaded "Direct link to vevetloaded")

* **Type**: `boolean`
  <br />
  <!-- -->
  Indicates whether the page is loaded.

### `vevet.onLoad`[​](#vevetonload "Direct link to vevetonload")

* **Type**: `(callback: () => void) => () => void`
  <br />
  <!-- -->
  Adds a callback to execute when the page loads. Returns a destructor function.

**Example**:

```
const destruct = vevet.onLoad(() => {

  console.log(vevet.loaded);

});



// Cancel the callback if it hasn't been called yet

destruct();
```

***

## Viewport[​](#viewport "Direct link to Viewport")

### `vevet.onResize`[​](#vevetonresize "Direct link to vevetonresize")

Adds a callback that triggers when the window size changes. Different targets can be specified.

**Example**:

```
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

  console.log(

    'on any resize event, including width, height, or body size changes',

  );

});



// Cancel the callback

destruct();
```

### `vevet.width`[​](#vevetwidth "Direct link to vevetwidth")

* **Type**: `number`
  <br />
  <!-- -->
  Current viewport width.

### `vevet.height`[​](#vevetheight "Direct link to vevetheight")

* **Type**: `number`
  <br />
  <!-- -->
  Current viewport height.

### `vevet.sHeight`[​](#vevetsheight "Direct link to vevetsheight")

* **Type**: `number`
  <br />
  <!-- -->
  Current small viewport height. Equivalent to `100svh`. Used to prevent layout shifts in browsers like In-App Safari where native svh does not work properly.

### `vevet.scrollbarWidth`[​](#vevetscrollbarwidth "Direct link to vevetscrollbarwidth")

* **Type**: `number`
  <br />
  <!-- -->
  Page scrollbar current width.

### `vevet.vw`[​](#vevetvw "Direct link to vevetvw")

* **Type**: `number`
  <br />
  <!-- -->
  Current viewport width divided by 100 (`1vw`).

### `vevet.vh`[​](#vevetvh "Direct link to vevetvh")

* **Type**: `number`
  <br />
  <!-- -->
  Current viewport height divided by 100 (`1vh`).

### `vevet.svh`[​](#vevetsvh "Direct link to vevetsvh")

* **Type**: `number`
  <br />
  <!-- -->
  Current small viewport height divided by 100 (`1svh`). Used to prevent layout shifts in browsers like In-App Safari.

### `vevet.rem`[​](#vevetrem "Direct link to vevetrem")

* **Type**: `number`
  <br />
  <!-- -->
  Root `font-size` in pixels (`1rem` to pixels)

### `vevet.landscape`[​](#vevetlandscape "Direct link to vevetlandscape")

* **Type**: `boolean`
  <br />
  <!-- -->
  Indicates whether the viewport is in landscape mode.

### `vevet.portrait`[​](#vevetportrait "Direct link to vevetportrait")

* **Type**: `boolean`
  <br />
  <!-- -->
  Indicates whether the viewport is in portrait mode.

### `vevet.dpr`[​](#vevetdpr "Direct link to vevetdpr")

* **Type**: `number`
  <br />
  <!-- -->
  Device pixel ratio.

### `vevet.lowerDpr`[​](#vevetlowerdpr "Direct link to vevetlowerdpr")

* **Type**: `number`
  <br />
  <!-- -->
  Lower device pixel ratio (1 for desktop, up to 2 for mobile devices).
