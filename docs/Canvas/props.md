# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement | null`
* **Default:** `null`
* Parent element used to determine canvas size. If `null`, it uses the viewport.

```
const canvas = new Canvas({

  container: document.getElementById('container'),

});
```

### `append`[​](#props.append "Direct link to props.append")

* **Type:** `boolean`
* **Default:** `true`
* If `true`, appends the canvas to the `container`. Ignored if `container` is `null`.

```
const canvas = new Canvas({

  append: false,

});
```

### `resizeOnInit`[​](#props.resizeOnInit "Direct link to props.resizeOnInit")

* **Type:** `boolean`
* **Default:** `true`
* Automatically adjusts canvas size on initialization.

```
const canvas = new Canvas({

  resizeOnInit: true,

});
```

### `resizeOnRuntime`[​](#props.resizeOnRuntime "Direct link to props.resizeOnRuntime")

* **Type:** `boolean`
* **Default:** `false`
* Enables dynamic resizing based on viewport or container changes.
* **Disabled by default**

```
const canvas = new Canvas({

  resizeOnRuntime: true,

});
```

### `viewportTarget`[​](#props.viewportTarget "Direct link to props.viewportTarget")

* **Type:** `'width' | 'height' | 'both' | 'onlyWidth' | 'onlyHeight' | 'any' | 'trigger'`
* **Default:** `'any'`
* Defines which dimension(s) should trigger a resize. [Learn more](https://vevetjs.com/docs/core/features.md#vevetonresize)

```
const canvas = new Canvas({

  viewportTarget: 'any',

});
```

### `resizeDebounce`[​](#props.resizeDebounce "Direct link to props.resizeDebounce")

* **Type:** `number`
* **Default:** `0`
* Debounce time (ms) for resize handling.

```
const canvas = new Canvas({

  resizeDebounce: 0,

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `width`[​](#props.width "Direct link to props.width")

* **Type:** `'auto' | number`
* **Default:** `'auto'`
* Canvas width. Use `'auto'` to match the container's width.

```
const canvas = new Canvas({

  width: 'auto',

});



// change value

canvas.updateProps({

  width: 100,

});
```

### `height`[​](#props.height "Direct link to props.height")

* **Type:** `'auto' | number`
* **Default:** `'auto'`
* Canvas height. Use `'auto'` to match the container's height.

```
const canvas = new Canvas({

  height: 'auto',

});



// change value

canvas.updateProps({

  height: 100,

});
```

### `dpr`[​](#props.dpr "Direct link to props.dpr")

* **Type:** `'auto' | number`
* **Default:** `'auto'`
* Device Pixel Ratio (DPR). Use `'auto'` for automatic detection.

```
const canvas = new Canvas({

  dpr: 'auto',

});



// change value

canvas.updateProps({

  dpr: 100,

});
```
