# Props

<!-- -->

### Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement | SVGElement`
* The element that listens for pointer events.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

});
```

### `relative`[​](#props.relative "Direct link to props.relative")

* **Type:** `boolean`
* **Default:** `false`
* Calculate pointer coordinates relative to the container instead of the viewport.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  relative: true,

});
```

### `buttons`[​](#props.buttons "Direct link to props.buttons")

* **Type:** `number[] | ((type: TPointersType) => number[])`

* **Default:** `[0]`

* Determines which mouse buttons trigger events.

  * 0: Main button pressed, usually the left button or the un-initialized state
  * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
  * 2: Secondary button pressed, usually the right button
  * 3: Fourth button, typically the Browser Back button
  * 4: Fifth button, typically the Browser Forward button

  See [MouseEvent.button](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button).

  `type` is resolved from the first [`pointerdown`](https://vevetjs.com/docs/Pointers/callbacks.md#pointerdown) [`PointerEvent.pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType) (`'mouse'` or `'touch'`; unknown values fall back to `'mouse'`).

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  buttons: [0],

});
```

Different buttons for mouse and touch:

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  buttons: (type) => (type === 'touch' ? [0] : [0, 2]),

});
```

### `minPointers`[​](#props.minPointers "Direct link to props.minPointers")

* **Type:** `number | ((type: TPointersType) => number)`
* **Default:** `1`
* Minimum number of active pointers (fingers) required to trigger the [`start`](https://vevetjs.com/docs/Pointers/callbacks.md#start) callback.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  minPointers: 2,

});
```

One finger on mouse, two on touch:

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  minPointers: (type) => (type === 'mouse' ? 1 : 2),

});
```

### `maxPointers`[​](#props.maxPointers "Direct link to props.maxPointers")

* **Type:** `number | ((type: TPointersType) => number)`
* **Default:** `5`
* Maximum number of pointers that can be tracked simultaneously.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  maxPointers: 5,

});
```

Pinch-only (exactly two fingers on touch):

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  minPointers: 2,

  maxPointers: 2,

});
```

### Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `enabled`[​](#props.enabled "Direct link to props.enabled")

* **Type:** `boolean`
* **Default:** `true`
* Enables or disables pointer events.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  enabled: false,

});



// change value

pointers.updateProps({

  enabled: true,

});
```
