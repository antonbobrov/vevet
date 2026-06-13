# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement | SVGElement`
* Event listener container.

```
const observer = new Swipe({

  container: document.getElementById('container'),

});
```

### `thumb`[​](#props.thumb "Direct link to props.thumb")

* **Type:** `HTMLElement | SVGElement | null`
* **Default:** `null`
* An element that triggers swipe start.
  <br />
  <!-- -->
  Movement is still calculated relative to the container — `thumb` only defines where a user can grab.
* **See [demo](https://vevetjs.com/docs/Swipe/demos.md#lever-rotation)**

```
const observer = new Swipe({

  container: document.getElementById('container'),

  thumb: document.getElementById('thumb'),

});
```

### `buttons`[​](#props.buttons "Direct link to props.buttons")

* **Type:** `number[] | ((type: TPointersType) => number[])`

* **Default:** `[0]`

* Determines which mouse buttons trigger events.

  <!-- -->

  * 0: Main button pressed, usually the left button or the un-initialized state
  * 1: Auxiliary button pressed, usually the wheel button or the middle button (if present)
  * 2: Secondary button pressed, usually the right button
  * 3: Fourth button, typically the Browser Back button
  * 4: Fifth button, typically the Browser Forward button

* See [MouseEvent.button](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/button).

* **See [demo](https://vevetjs.com/docs/Swipe/demos.md#right-click-drag)**

Same shape as [`Pointers` `buttons`](https://vevetjs.com/docs/Pointers/props.md#props.buttons).

```
const observer = new Swipe({

  container: document.getElementById('container'),

  buttons: [0], // left button click

  buttons: [2], // right button click

  buttons: [0, 2], // both buttons click

});
```

Different rules for mouse and touch:

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  buttons: (type) => (type === 'touch' ? [0] : [2]),

});
```

### `pointers`[​](#props.pointers "Direct link to props.pointers")

* **Type:** `number | ((type: TPointersType) => number)`

* **Default:** `1`

* Required pointer count to activate swiping.<br /><!-- -->Useful for touch gestures such as two-finger pan.<br /><!-- -->If fewer pointers are present, swipe will not start.

  Same shape as [`Pointers` `minPointers`](https://vevetjs.com/docs/Pointers/props.md#props.minPointers).<br /><!-- -->Swipe sets both `minPointers` and `maxPointers` on its internal [`Pointers`](https://vevetjs.com/docs/Pointers/.md) instance to this value.

  During move, Swipe tracks the **center** between active pointers (from [`Pointers.move`](https://vevetjs.com/docs/Pointers/accessors.md#move)), not the first touch only.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  pointers: 2, // swipe starts only with two fingers

});
```

One finger on mouse, two on touch:

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  pointers: (type) => (type === 'mouse' ? 1 : 2),

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `enabled`[​](#props.enabled "Direct link to props.enabled")

* **Type:** `boolean`
* **Default:** `true`
* Enables or disables swipe events.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  enabled: false,

});



// change value

observer.updateProps({

  enabled: true,

});
```

### `relative`[​](#props.relative "Direct link to props.relative")

* **Type:** `boolean`
* **Default:** `false`
* Calculates coordinates relative to the container rather than the page.
* **See [demo](https://vevetjs.com/docs/Swipe/demos.md#rotation-swipe)**

```
const observer = new Swipe({

  container: document.getElementById('container'),

  relative: true,

});



// change value

observer.updateProps({

  relative: false,

});
```

### `axis`[​](#props.axis "Direct link to props.axis")

* **Type:** `null | 'x' | 'y'`
* **Default:** `null`
* Primary swiping axis.
* **See [demo](https://vevetjs.com/docs/Swipe/demos.md#basic-demo)**

```
const observer = new Swipe({

  container: document.getElementById('container'),

  axis: 'x',

});



// change value

observer.updateProps({

  axis: 'y',

});
```

### `ratio`[​](#props.ratio "Direct link to props.ratio")

* **Type:** `number`
* **Default:** `1`
* Scales movement on **x**, **y**, and **angle** after swipe starts.
  <br />
  <!-- -->
  Swipe activation still uses raw pointer distance, so [`threshold`](#props.threshold) is not affected by `ratio`.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  ratio: 1,

});



// change value

observer.updateProps({

  ratio: 2,

});
```

### `grabCursor`[​](#props.grabCursor "Direct link to props.grabCursor")

* **Type:** `boolean`
* **Default:** `false`
* Shows "grab" and "grabbing" cursors on `thumb` (if set) or `container` during interaction.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  grabCursor: true,

});



// change value

observer.updateProps({

  grabCursor: false,

});
```

### `willAbort`[​](#props.willAbort "Direct link to props.willAbort")

* **Type:** `(props: ISwipeCanMoveArg) => boolean`
* **Default:** `() => false`
* Runs before swipe starts and determines whether the gesture should be blocked.
  <br />
  <!-- -->
  Allows disabling swipe in specific UI states or when gesture conditions are not met.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  willAbort: () => false,

});



// change value

observer.updateProps({

  willAbort: ({ diff }) => diff.x > 5, // will prevent too fast swipe

});
```

### `threshold`[​](#props.threshold "Direct link to props.threshold")

* **Type:** `number`
* **Default:** `5`
* Minimum swipe distance (px) to trigger swipe start.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  threshold: 5,

});



// change value

observer.updateProps({

  threshold: 3,

});
```

### `minTime`[​](#props.minTime "Direct link to props.minTime")

* **Type:** `number`
* **Default:** `0`
* Minimum duration (ms) to trigger swipe move.
* Means that user click the container, waits some time, and only then swipe is available.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  minTime: 0,

});



// change value

observer.updateProps({

  minTime: 0,

});
```

### `directionThreshold`[​](#props.directionThreshold "Direct link to props.directionThreshold")

* **Type:** `number`
* **Default:** `50`
* Minimum swipe distance (px) for directional callbacks.
* Swipe supports direction detection (toTop, toBottom, toLeft, toRight).
* To trigger a directional callback a user must swipe a certain amount of pixels - `directionThreshold`.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  directionThreshold: 50,

});



// change value

observer.updateProps({

  directionThreshold: 10,

});
```

### `preventEdgeSwipe`[​](#props.preventEdgeSwipe "Direct link to props.preventEdgeSwipe")

* **Type:** `boolean`
* **Default:** `true`
* Prevents edge swiping (iOS swipe-back gesture).

```
const observer = new Swipe({

  container: document.getElementById('container'),

  preventEdgeSwipe: true,

});



// change value

observer.updateProps({

  preventEdgeSwipe: false,

});
```

### `edgeSwipeThreshold`[​](#props.edgeSwipeThreshold "Direct link to props.edgeSwipeThreshold")

* **Type:** `number`
* **Default:** `20`
* Edge swipe threshold (px) from the left/right edge.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  edgeSwipeThreshold: 20,

});



// change value

observer.updateProps({

  edgeSwipeThreshold: 25,

});
```

### `preventTouchMove`[​](#props.preventTouchMove "Direct link to props.preventTouchMove")

* **Type:** `boolean`
* **Default:** `true`
* Prevents `touchmove` from scrolling the page while swiping.
  <br />
  <!-- -->
  Recommended to keep enabled for horizontal/vertical drags inside scrollable layouts.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  preventTouchMove: true,

});



// change value

observer.updateProps({

  preventTouchMove: false,

});
```

### `requireCtrlKey`[​](#props.requireCtrlKey "Direct link to props.requireCtrlKey")

* **Type:** `boolean`
* **Default:** `false`
* Requires Ctrl key for swipe (mouse only).

```
const observer = new Swipe({

  container: document.getElementById('container'),

  requireCtrlKey: true,

});



// change value

observer.updateProps({

  requireCtrlKey: false,

});
```

### `bounceDuration`[​](#props.bounceDuration "Direct link to props.bounceDuration")

* **Type:** `number`
* **Default:** `250`
* Duration (ms) of bounce-back when movement exceeds `bounds`, release inertia does not run, and [`canBounce`](#props.canBounce) allows it.

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  bounds: () => ({ x: [0, 300] }),

  bounceDuration: 250,

});
```

### `overflow`[​](#props.overflow "Direct link to props.overflow")

* **Type:** `() => number`
* **Default:** `() => 50`
* Rubber-band distance past `bounds` (px for x/y, degrees for `angle`).

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  bounds: () => ({ y: [0, 500] }),

  overflow: () => 80,

});
```

### `bounds`[​](#props.bounds "Direct link to props.bounds")

* **Type:** `null | ((coords: ISwipeCoords) => ISwipeAxes | null)`
* **Default:** `null`
* Movement limits per axis. Unset axis is unbounded. Values are normalized to `[min, max]`.
* The callback receives the full [`ISwipeCoords`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords) snapshot — use `coords.scale`, `coords.movement`, etc. when limits depend on zoom or layout.
* Limits are re-read on every move update (including after [`setScale`](https://vevetjs.com/docs/Swipe/methods.md#setscale)).
* Use [`movement`](https://vevetjs.com/docs/Swipe/accessors.md#movement) and [`scale`](https://vevetjs.com/docs/Swipe/accessors.md#scale) in callbacks for transforms.

```
const swipe = new Swipe({

  container: document.getElementById('wrapper'),

  thumb: document.getElementById('thumb'),

  relative: true,

  bounds: ({ scale }) => ({

    x: [0, wrapper.clientWidth - thumb.clientWidth * scale],

    y: [0, wrapper.clientHeight - thumb.clientHeight * scale],

  }),

  onMove: ({ movement, scale }) => {

    thumb.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});
```

Static limits (callback may ignore `coords`):

```
const swipe = new Swipe({

  container: document.getElementById('wrapper'),

  relative: true,

  bounds: () => ({ x: [0, 300], y: [0, 300] }),

  onMove: ({ movement }) => {

    thumb.style.transform = `translate(${movement.x}px, ${movement.y}px)`;

  },

});
```

### `recalculateBoundsOnInertia`[​](#props.recalculateBoundsOnInertia "Direct link to props.recalculateBoundsOnInertia")

* **Type:** `boolean`
* **Default:** `true`
* When `true`, [`bounds`](#props.bounds) are re-read on every move update while release inertia is active.
  <br />
  <!-- -->
  Set to `false` when bounds are static during inertia (for example in [`Snap`](https://vevetjs.com/docs/Snap/.md)) to avoid extra layout work.

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  inertia: true,

  bounds: () => ({ x: [0, 300] }),

  recalculateBoundsOnInertia: false,

});
```

### `snap`[​](#props.snap "Direct link to props.snap")

* **Type:** `null | (() => ISwipeAxes | null)`
* **Default:** `null`
* Snap targets per axis in movement space.

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  relative: true,

  snap: () => ({ angle: [0, 90, 180] }),

  snapRadius: 15,

});
```

### `canBounce`[​](#props.canBounce "Direct link to props.canBounce")

* **Type:** `() => boolean`
* **Default:** `() => true`
* When it returns `false`, overflow bounce-back on release is skipped (inertia may still run).

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  bounds: () => ({ x: [0, 300] }),

  canBounce: () => false,

});



// change value

swipe.updateProps({

  canBounce: () => true,

});
```

### `snapRadius`[​](#props.snapRadius "Direct link to props.snapRadius")

* **Type:** `number | null`
* **Default:** `null`
* Max distance to a snap target (same units as the axis). Falsy = no radius limit.

```
const swipe = new Swipe({

  snap: () => ({ angle: [0, 90, 180] }),

  snapRadius: 10,

});
```

### `inertia`[​](#props.inertia "Direct link to props.inertia")

* **Type:** `boolean`
* **Default:** `false`
* Enables RAF-based release inertia after swipe end.
* **See [demo](https://vevetjs.com/docs/Swipe/demos.md#drag-inertia)**

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  inertia: true,

});
```

### `inertiaDecay`[​](#props.inertiaDecay "Direct link to props.inertiaDecay")

* **Type:** `number`
* **Default:** `0.05`
* Velocity decay per frame during inertia (higher = stops sooner).

```
const swipe = new Swipe({

  inertia: true,

  inertiaDecay: 0.05,

});
```

### `inertiaBounceEase`[​](#props.inertiaBounceEase "Direct link to props.inertiaBounceEase")

* **Type:** `number`
* **Default:** `0.3`
* Easing factor for pulling inertia back inside `bounds` (per frame, FPS-independent).

```
const swipe = new Swipe({

  inertia: true,

  bounds: () => ({ x: [0, 400] }),

  inertiaBounceEase: 0.3,

});
```

### `inertiaRatio`[​](#props.inertiaRatio "Direct link to props.inertiaRatio")

* **Type:** `number`
* **Default:** `1`
* Extra multiplier for release velocity. Effective scale is [`ratio`](#props.ratio) `× inertiaRatio`.

```
const swipe = new Swipe({

  inertia: true,

  inertiaRatio: 1.5,

});
```

### `inertiaDistanceModifier`[​](#props.inertiaDistanceModifier "Direct link to props.inertiaDistanceModifier")

* **Type:** `null | ((distance: ISwipeVec3) => ISwipeVec3 | null)`
* **Default:** `null`
* Called once before release inertia starts with predicted inertia distance (`x`/`y` in px, `angle` in degrees).
  <br />
  <!-- -->
  Return a vector to override the total inertia travel, or `null` to keep the default decay-based inertia.

```
const swipe = new Swipe({

  inertia: true,

  inertiaDistanceModifier: (distance) => ({

    x: Math.round(distance.x / 100) * 100,

    y: distance.y,

    angle: 0,

  }),

});
```

### `inertiaThreshold`[​](#props.inertiaThreshold "Direct link to props.inertiaThreshold")

* **Type:** `number`
* **Default:** `1`
* Minimum release speed to start inertia (px/s for x/y, deg/s for `angle`).
  <br />
  <!-- -->
  Triggers `inertiaFail` when both linear and angular speed are below this value.

```
const swipe = new Swipe({

  inertia: true,

  inertiaThreshold: 1,

});
```

### `maxVelocity`[​](#props.maxVelocity "Direct link to props.maxVelocity")

* **Type:** [`ISwipeVec3`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipevec3)
* **Default:** `{ x: 7, y: 7, angle: 3 }`
* Max release velocity per axis (coord/ms for x/y, deg/ms for `angle`).
  <br />
  <!-- -->
  Falsy axis value disables inertia on that axis.

```
const swipe = new Swipe({

  inertia: true,

  maxVelocity: { x: 10, y: 10, angle: 5 },

});
```

## Deprecated inertia props[​](#deprecated-inertia-props "Direct link to Deprecated inertia props")

caution

Timelined inertia (`inertiaDuration`, `inertiaEasing`) and `velocityModifier` are **no longer applied**. Use RAF inertia props above (`inertiaDecay`, `inertiaBounceEase`, `inertiaThreshold`, `maxVelocity`).

### `inertiaDuration`[​](#props.inertiaDuration "Direct link to props.inertiaDuration")

* **Type:** `(distance: number) => number`
* **Status:** deprecated — not used

### `inertiaEasing`[​](#props.inertiaEasing "Direct link to props.inertiaEasing")

* **Type:** `TEasingType`
* **Status:** deprecated — not used

### `velocityModifier`[​](#props.velocityModifier "Direct link to props.velocityModifier")

* **Type:** `false | ((velocity: ISwipeState) => ISwipeState)`
* **Status:** deprecated — not used

### `inertiaDistanceThreshold`[​](#props.inertiaDistanceThreshold "Direct link to props.inertiaDistanceThreshold")

* **Type:** `number`
* **Status:** deprecated — use [`inertiaThreshold`](#props.inertiaThreshold) instead (fallback if set)
