# Props

<!-- -->

note

All **[Preloader's props](https://vevetjs.com/docs/Preloader/props.md)** are available in this class.

### Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `resourceContainer`[​](#props.resourceContainer "Direct link to props.resourceContainer")

* **Type:** `HTMLElement` | `null`
* **Default:** `null`
* Container source for preloader resources.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  resourceContainer: document.getElementById('resource-container'),

});
```

### `preloadImages`[​](#props.preloadImages "Direct link to props.preloadImages")

* **Type:** `boolean`
* **Default:** `true`
* Enables automatic **tracking** of image loading.
* Ignores lazy images.
* Does not initiate network requests or load resources manually.
* Does not load resources twice.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  preloadImages: true,

});
```

### `preloadVideos`[​](#props.preloadVideos "Direct link to props.preloadVideos")

* **Type:** `boolean`
* **Default:** `false`
* Enables automatic **tracking** of video loading progress.
* Does not force video loading — only observes existing load state.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  preloadVideos: false,

});
```

### `customSelector`[​](#props.customSelector "Direct link to props.customSelector")

* **Type:** `string`
* **Default:** `'.js-preload'`
* Selector for virtual resources to preload.
* Elements should have `data-weight` and `data-loaded` attributes.
  <br />
  <!-- -->
  Preloader observes `data-loaded` changes and recalculates progress accordingly.
  <br />
  <!-- -->
  The actual loading logic must be handled externally. Example: `data-weight="10"` indicates weight; `data-loaded="10"` means fully loaded.
* **See [demo](https://vevetjs.com/docs/ProgressPreloader/demos.md#virtual-resources)**

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  customSelector: '.js-preload',

});
```

```
<div class="js-preload" data-weight="4" data-loaded="3"></div>
```

### `ignoreClassName`[​](#props.ignoreClassName "Direct link to props.ignoreClassName")

* **Type:** `string`
* **Default:** `'js-preload-ignore'`
* Class name for elements to exclude from preloading.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  ignoreClassName: 'js-preload-ignore',

});
```

```
<!-- The image will not be accepted by the preloader -->

<img src="..." class="js-preload-ignore" />
```

### `lerp`[​](#props.lerp "Direct link to props.lerp")

* **Type:** `number`
* **Default:** `0.1`
* Controls how smoothly the visible progress value ([progress](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress)) interpolates toward the real loading progress ([loadProgress](https://vevetjs.com/docs/ProgressPreloader/accessors.md#loadprogress)).
* Lower values → slower, smoother animation.
* `1` disables interpolation and makes `progress` equal to `loadProgress` every frame.
* This affects only **visual animation**, not the real loading state.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  lerp: 0.1, // smooth progress animation

  lerp: 1, // instant progress change

});
```

### `endDuration`[​](#props.endDuration "Direct link to props.endDuration")

* **Type:** `number`
* **Default:** `500`
* Duration (in ms) for a forced completion animation when all resources are loaded but the current interpolated [progress](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) is still below `1`.
  <br />
  <!-- -->
  This creates a smooth "finish animation" even if the last resources load instantly

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

  endDuration: 500,

});
```
