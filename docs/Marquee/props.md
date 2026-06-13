# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement`
* The container element that holds the marquee content.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#simple-demo)**

```
const marquee = new Marquee({

  container: document.getElementById('marquee'),

});
```

### `resizeDebounce`[​](#props.resizeDebounce "Direct link to props.resizeDebounce")

* **Type:** `number`
* **Default:** `0`
* The debounce delay for the resize event in milliseconds.

```
const marquee = new Marquee({

  resizeDebounce: 100,

});
```

### `hasWillChange`[​](#props.hasWillChange "Direct link to props.hasWillChange")

* **Type:** `boolean`
* **Default:** `true`
* Determines whether to apply the `will-change` CSS property to the marquee elements to optimize rendering. Setting this to `true` may improve performance.

```
const marquee = new Marquee({

  hasWillChange: true,

});
```

### `cloneNodes`[​](#props.cloneNodes "Direct link to props.cloneNodes")

* **Type:** `boolean`
* **Default:** `true`
* Indicates whether to clone the marquee nodes.
* Cloned nodes are recreated dynamically on every resize() call, if the content is not long enough to form a seamless loop.
* In most cases clones are created during the initial setup, but on resize they may be recalculated and replaced.
* All cloned nodes are fully removed when the instance is destroyed using `.destroy()`
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#no-clones)**

```
const marquee = new Marquee({

  cloneNodes: true,

});
```

### `direction`[​](#props.direction "Direct link to props.direction")

* **Type:** `'horizontal' | 'vertical'`
* **Default:** `'horizontal'`
* Indicates the direction of the marquee animation.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#vertical-marquee)**

```
const marquee = new Marquee({

  direction: 'horizontal',

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `speed`[​](#props.speed "Direct link to props.speed")

* **Type:** `number | string`
* **Default:** `1`
* The speed of the marquee animation. Supports CSS units like `px`, `rem`, `vw`, `vh`, `svh`. Negative speed reverses marquee animation.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#reverse-marquee)**

```
const marquee = new Marquee({

  speed: 2,

});



// change value

marquee.updateProps({

  speed: '-1vw',

});
```

### `gap`[​](#props.gap "Direct link to props.gap")

* **Type:** `number | string`
* **Default:** `0`
* The gap between the marquee elements. Supports CSS units like `px`, `rem`, `vw`, `vh`, `svh`.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#with-css-units)**

```
const marquee = new Marquee({

  gap: '1vw',

});



// change value

marquee.updateProps({

  gap: 10,

});
```

### `enabled`[​](#props.enabled "Direct link to props.enabled")

* **Type:** `boolean`
* **Default:** `true`
* Enables or disables the marquee animation.
* When `enabled: false`, the internal requestAnimationFrame loop is paused, so the marquee stops updating.
* While disabled, the marquee keeps its current coord value — animation resumes from the same position.
* Hover-based control (`pauseOnHover`) is ignored when the marquee is disabled manually.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#controllable-marquee)**

```
const marquee = new Marquee({

  enabled: false,

});



// change value

marquee.updateProps({

  enabled: true,

});
```

### `pauseOnHover`[​](#props.pauseOnHover "Direct link to props.pauseOnHover")

* **Type:** `boolean`
* **Default:** `false`
* Pauses the marquee when the mouse hovers over it.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#pause-on-hover)**

```
const marquee = new Marquee({

  pauseOnHover: true,

});



// change value

marquee.updateProps({

  pauseOnHover: false,

});
```

### `centered`[​](#props.centered "Direct link to props.centered")

* **Type:** `boolean`
* **Default:** `false`
* Centers the marquee content within the container.

```
const marquee = new Marquee({

  centered: true,

});



// change value

marquee.updateProps({

  centered: true,

});
```

### `adjustSpeed`[​](#props.adjustSpeed "Direct link to props.adjustSpeed")

* **Type:** `boolean`
* **Default:** `true`
* When needed, uses a dynamic FPS factor to adjust the speed of the marquee for consistent animation across different screens with unique frame rates.
* **See [demo](https://vevetjs.com/docs/Marquee/demos.md#with-speed-adjustment)**

```
const marquee = new Marquee({

  adjustSpeed: true,

});



// change value

marquee.updateProps({

  adjustSpeed: false,

});
```

### `pauseOnOut`[​](#props.pauseOnOut "Direct link to props.pauseOnOut")

* **Type:** `boolean`
* **Default:** `true`
* Pauses the marquee when the mouse leaves the viewport.

```
const marquee = new Marquee({

  pauseOnOut: false,

});



// change value

marquee.updateProps({

  pauseOnOut: true,

});
```
