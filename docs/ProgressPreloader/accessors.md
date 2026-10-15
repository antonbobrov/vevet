# Accessors

<!-- -->

note

All **[Preloader accessors](https://vevetjs.com/docs/Preloader/accessors.md)** (`isLoaded`, `isHiding`, `isHidden`, …) are available in this class.

### `resourceContainer`[​](#resourcecontainer "Direct link to resourcecontainer")

Type: `HTMLElement | null`

Not a getter on the instance — set via [`resourceContainer`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.resourceContainer) prop. DOM root used to scan images, videos, and [`customSelector`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.customSelector) matches. Defaults to `document` when `null`.

### `loadedWeight`[​](#loadedweight "Direct link to loadedweight")

Type: `number`

Total loaded resources weight.<br /><!-- -->Custom resources may have a `data-loaded` attribute which represents their loaded weight.<br />**See [demo](https://vevetjs.com/docs/ProgressPreloader/demos.md#resource-count)**

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

});



preloader.loadedWeight; // loaded weight
```

### `loadProgress`[​](#loadprogress "Direct link to loadprogress")

Type: `number`

Actual weighted progress in the `0–1` range. **Not interpolated** — updates immediately when a resource resolves.

```
preloader.loadProgress; // rigid progress
```

### `progress`[​](#progress "Direct link to progress")

Type: `number`

Smoothed progress (`0–1`) for UI. Damped toward `loadProgress` each frame via [`lerp`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.lerp).

[`loaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded) fires when **`progress >= 1`**, not when `loadProgress` hits `1` first.

```
preloader.on('progress', () => {

  console.log(preloader.progress); // smooth value for display

});
```

### `resources`[​](#resources "Direct link to resources")

Type: `IProgressPreloaderResource[]`

The list of all tracked custom resources.<br />**See [demo](https://vevetjs.com/docs/ProgressPreloader/demos.md#virtual-resources)**

**IProgressPreloaderResource structure**

```
interface IProgressPreloaderResource {

  id: string | Element; // Unique resource identifier or DOM element

  loaded: number; // Currently loaded weight

  weight: number; // Total resource weight

}
```

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

});



preloader.resources; // list of resources
```

### `totalWeight`[​](#totalweight "Direct link to totalweight")

Type: `number`

Returns the total weight of all resources to preload.<br />**See [demo](https://vevetjs.com/docs/ProgressPreloader/demos.md#resource-count)**

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

});



preloader.totalWeight; // total resources weight
```
