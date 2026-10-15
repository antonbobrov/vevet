# Props

<!-- -->

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `fps`[​](#props.fps "Direct link to props.fps")

* **Type:** `'auto' | number`
* **Default:** `'auto'`
* Frames per second (FPS) for the animation.
* `'auto'` dynamically adapts to real device refresh rate (60Hz / 90Hz / 120Hz / 144Hz / 240Hz).
* Throttling to a manual value (e.g. `30`) reduces CPU/GPU load.
* **See [demo](https://vevetjs.com/docs/Raf/demos.md#fps-throttling)**

```
const raf = new Raf({

  fps: 'auto',

});



// change value

raf.updateProps({

  fps: 30,

});
```

### `enabled`[​](#props.enabled "Direct link to props.enabled")

* **Type:** `boolean`
* **Default:** `false`
* Enables or disables the Raf animation loop.
* **See [demo](https://vevetjs.com/docs/Raf/demos.md#info)**

```
const raf = new Raf({

  enabled: false,

});



// change value

raf.updateProps({

  enabled: true,

});
```
