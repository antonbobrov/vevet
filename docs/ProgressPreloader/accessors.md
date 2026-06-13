# Accessors

<!-- -->

note

All **[Preloader's accessors](https://vevetjs.com/docs/Preloader/accessors.md)** are available in this class.

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

Represents the actual loading progress in the `0–1` range.<br /><!-- -->This value is **never interpolated** and updates immediately whenever a resource loads.

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

});



preloader.loadProgress; // rigid progress
```

### `progress`[​](#progress "Direct link to progress")

Type: `number`

Gets the current interpolated progress value (0 to 1).<br /><!-- -->The smoothness of the progress update depends on `lerp` props.<br />**See [demo](https://vevetjs.com/docs/ProgressPreloader/demos.md#simple-preloader)**

```
const preloader = new ProgressPreloader({

  container: document.getElementById('container'),

});



preloader.progress; // smooth progress
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
