# Props

<!-- -->

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `duration`[​](#props.duration "Direct link to props.duration")

* **Type:** `number`
* **Default:** `1000`
* Timeline duration in milliseconds. Only positive values are accepted.

```
const tm = new Timeline({

  duration: 1000,

});



// change value

tm.updateProps({

  duration: 500,

});
```

### `easing`[​](#props.easing "Direct link to props.easing")

* **Type:** `TEasingType`
* **Default:** `inherited from core settings` - [see settings](https://vevetjs.com/docs/core/customization.md#modifying-settings).
* Easing function for timeline progression.
  <br />
  <!-- -->
  Accepts standard easing types or an array of bezier values.
  <br />
  <!-- -->
  Use `false` for linear progress.
  <br />
  <!-- -->
  See [easing types](https://vevetjs.com/docs/utils/.md#easing-types) for more information.

```
const tm = new Timeline({

  easing: [0.25, 0.1, 0.25, 1],

});



// change value

tm.updateProps({

  easing: EaseInOutCubic,

});
```
