# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement`
* **Default:** *none*
* HTML container element where listeners are attached.

```
const snap = new Snap({

  container: document.getElementById('container'),

});
```

### `eventsEmitter`[​](#props.eventsEmitter "Direct link to props.eventsEmitter")

* **Type:** `HTMLElement | null`
* **Default:** `null`
* HTML element used for swipe and wheel events.

```
const snap = new Snap({

  eventsEmitter: document.getElementById('parent'),

});
```

### `activeIndex`[​](#props.activeIndex "Direct link to props.activeIndex")

* **Type:** `number`
* **Default:** `0`
* Default active index.

```
const snap = new Snap({

  activeIndex: 5,

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `slides`[​](#props.slides "Direct link to props.slides")

* **Type:** (`HTMLElement` | [**SnapSlide**](https://vevetjs.com/docs/Snap/slide.md))\[] | `false`;
* **Default:** `false`
* Slide instances. If `false`, all container's children will be considered as slides.

```
const snap = new Snap({

  container: document.getElementById('container'),

  slides: false, // get all container's children

});



// used to add or remove slides, for example, when DOM changes

snap.updateProps({

  slides: Array.from(document.querySelectorAll('.slide')),

});
```

### `containerSize`[​](#containersize "Direct link to containersize")

* **Type:** `'auto' | number | string`

* **Default:** `'auto'`

* Defines the container size:

  <!-- -->

  * `'auto'` — Based on the container size.
  * `number` — Size in pixels.
  * CSS units such as `px`, `rem`, `vw`, `vh`, `svh`.

```
const snap = new Snap({

  container: document.getElementById('container'),

  containerSize: 'auto',

});



snap.updateProps({

  containerSize: 500,

});
```

### `slidesToScroll`[​](#props.slidesToScroll "Direct link to props.slidesToScroll")

* **Type:** `number`;
* **Default:** `1`
* Indicates the number of slides to scroll on swipe or wheel.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#slides-to-scroll)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  slidesToScroll: 1,

});



// change value

snap.updateProps({

  slidesToScroll: 2,

});
```

### `direction`[​](#props.direction "Direct link to props.direction")

* **Type:** `'horizontal' | 'vertical'`
* **Default:** `'horizontal'`
* Sliding direction.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#vertical)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  direction: 'horizontal',

});



// change value

snap.updateProps({

  direction: 'vertical',

});
```

### `origin`[​](#props.origin "Direct link to props.origin")

* **Type:** `'start' | 'center' | 'end'`

* **Default:** `'start'`

* Aligns slide mangets and snap them along the scroll axis:

  * `'start'` — leading edge of the slide at the leading edge of the container (default).
  * `'center'` — slide centered in the container.
  * `'end'` — trailing edge of the slide at the trailing edge of the container.

  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#origin)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  origin: 'center',

});



snap.updateProps({

  origin: 'end',

});
```

### `centered`[​](#props.centered "Direct link to props.centered")

* **Type:** `boolean`
* **Default:** `false`
* **Status:** deprecated — use [`origin`](#props.origin) instead (`centered: true` is equivalent to `origin: 'center'`). If both are set, `centered` takes precedence.

```
const snap = new Snap({

  container: document.getElementById('container'),

  origin: 'center',

});
```

### `loop`[​](#props.loop "Direct link to props.loop")

* **Type:** `boolean`
* **Default:** `false`
* Determines whether to loop the slides.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#loop)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  loop: true,

});



// change value

snap.updateProps({

  loop: false,

});
```

### `gap`[​](#props.gap "Direct link to props.gap")

* **Type:** `number | string`
* **Default:** `0`
* The gap between slides. Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#gap)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  gap: 20,

});



// change value

snap.updateProps({

  gap: '2rem',

});
```

### `lerp`[​](#props.lerp "Direct link to props.lerp")

* **Type:** `number`
* **Default:** `vevet.mobile ? 1 : 0.2`
* Linear interpolation factor for smooth animation (between `0` and `1`) with higher values indicating faster movement.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#hypersmooth)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  lerp: 0.1,

});



// change value

snap.updateProps({

  lerp: 1,

});
```

### `freemode`[​](#props.freemode "Direct link to props.freemode")

* **Type:** `boolean | 'sticky'`
* **Default:** `false`
* Freemode allows swiping and wheeling with or without magnet snapping.
* `false` - enables magnets
* `true` - disables magnets
* `"sticky"` - allows swipe with inertia and snapping to the nearest slide.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#freemode)**

tip

You may need to disable `shortSwipes` when using `sticky` freemode.

```
const snap = new Snap({

  container: document.getElementById('container'),

  freemode: false,

});



// change value



snap.updateProps({

  freemode: true,

});



snap.updateProps({

  freemode: 'sticky',

});
```

### `rewind`[​](#props.rewind "Direct link to props.rewind")

* **Type:** `boolean`
* **Default:** `false`
* Enables wrap-around navigation: advancing from the last slide jumps to the first, and going back from the first jumps to the last. Has no effect when `loop` mode is enabled.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#rewind)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  rewind: false,

});



// change value

snap.updateProps({

  rewind: true,

});
```

### `stickOnResize`[​](#props.stickOnResize "Direct link to props.stickOnResize")

* **Type:** `boolean`
* **Default:** `true`
* Snap to the nearest slide on carousel resize.
* **See [demo](https://vevetjs.com/docs/Snap/advanced-demos.md#expand-slide)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  stickOnResize: true,

});



// change value

snap.updateProps({

  stickOnResize: false,

});
```

### `friction`[​](#props.friction "Direct link to props.friction")

* **Type:** `number`
* **Default:** `0`
* Friction that makes the slides tend to the nearest slide magnet when wheeling or swiping.
  <br />
  <!-- -->
  The value is a number between `0` and `1` which is multiplied by the `lerp` value.
  <br />
  <!-- -->
  Higher values mean stronger friction. `0` disables friction.
* Friction is not applied for `shortSwipes`.
* Friction is disabled for swipes by default. See **[.swipeFriction](#props.swipeFriction)**.
* **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#friction)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  friction: 0,

});



// enable friction

snap.updateProps({

  friction: 0.3,

});
```

### `edgeFriction`[​](#props.edgeFriction "Direct link to props.edgeFriction")

* **Type:** `number`
* **Default:** `0.7`
* Maximum friction between the final slide and the maximum translation value. Also swipe bouncing.
  <br />
  <!-- -->
  The value must be `0 to 1`. The higher value the more resistance is applied.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#edge-friction)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  edgeFriction: 0.7,

});



// change value

snap.updateProps({

  edgeFriction: 1,

});
```

### `duration`[​](#props.duration "Direct link to props.duration")

* **Type:** `number | ((distance: number) => number)`
* **Default:** `600`
* Slide animation duration.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#hypersmooth)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  duration: 600,

});



// change value

snap.updateProps({

  duration: 1250,

});
```

### `easing`[​](#props.easing "Direct link to props.easing")

* **Type:** `TEasingType`
* **Default:** `EaseOutCubic`
* Easing type for smoother animation. Accepts standard easing types or an array of bezier values.
  <br />
  <!-- -->
  See **[easing types](https://vevetjs.com/docs/utils/.md#easing-types)** for more information.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#easing)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  easing: EaseOutCubic,

});



// change value

snap.updateProps({

  easing: EaseOutBounce,

});
```

### `slideSize`[​](#props.slideSize "Direct link to props.slideSize")

* **Type:** `'auto' | 'stretch' | number | string`

* **Default:** `'auto'`

* Default slide size. Supported values:

  <!-- -->

  * `auto` detects slide size depending on the element size.
  * `stretch` detects slide size as the container size.
  * `number` defines the slide size in pixels.
  * CSS units like `px`, `rem`, `vw`, `vh`, `svh`.

* Note that this property does not change real slide sizes. It is used for virtual slides & custom logic.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#virtual)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  slideSize: 'auto',

});



// change value



snap.updateProps({

  slideSize: '90vw',

});



snap.updateProps({

  slideSize: 'stretch',

});
```

### `swipe`[​](#props.swipe "Direct link to props.swipe")

* **Type:** `boolean`
* **Default:** `true`
* Enable or disable swipe events.

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipe: true,

});



// change value

snap.updateProps({

  swipe: false,

});
```

### `grabCursor`[​](#props.grabCursor "Direct link to props.grabCursor")

* **Type:** `boolean`
* **Default:** `false`
* Users will see the "grab" cursor when hovering and "grabbing" when swiping.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#grab-cursor)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  grabCursor: false,

});



// change value

snap.updateProps({

  grabCursor: true,

});
```

### `swipeSpeed`[​](#props.swipeSpeed "Direct link to props.swipeSpeed")

* **Type:** `number`
* **Default:** `1`
* Speed factor for swipe movements. **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#reverse-swipe)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipeSpeed: 1,

});



// change value

snap.updateProps({

  swipeSpeed: 2.5,

});
```

### `swipeAxis`[​](#props.swipeAxis "Direct link to props.swipeAxis")

* **Type:** `'x' | 'y' | 'angle' | 'auto'`
* **Default:** `'auto'`
* Swipe axis. If `auto`, the axis will be automatically detected depending on `direction`.

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipeAxis: 'y',

});



// change value

snap.updateProps({

  swipeAxis: 'x',

});



snap.updateProps({

  swipeAxis: 'angle',

});
```

### `followSwipe`[​](#props.followSwipe "Direct link to props.followSwipe")

* **Type:** `boolean`
* **Default:** `false`
* If `false`, the carousel will be animated only when you release your finger; it will not move while you hold your finger on it.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#swipe-no-follow)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  followSwipe: true,

});



// change value

snap.updateProps({

  followSwipe: false,

});
```

### `shortSwipes`[​](#props.shortSwipes "Direct link to props.shortSwipes")

* **Type:** `boolean`
* **Default:** `true`
* When `true`, swipes shorter than `shortSwipeDuration` can trigger slide change.
  <br />
  <!-- -->
  Short swipes work only when `followSwipe` is `true`.

```
const snap = new Snap({

  container: document.getElementById('container'),

  shortSwipes: true,

});



// change value

snap.updateProps({

  shortSwipes: false,

});
```

### `shortSwipesDuration`[​](#props.shortSwipesDuration "Direct link to props.shortSwipesDuration")

* **Type:** `number`
* **Default:** `300`
* Short swipe maximum duration.

```
const snap = new Snap({

  container: document.getElementById('container'),

  shortSwipesDuration: 300,

});



// change value

snap.updateProps({

  shortSwipesDuration: 1500,

});
```

### `shortSwipesThreshold`[​](#props.shortSwipesThreshold "Direct link to props.shortSwipesThreshold")

* **Type:** `number`
* **Default:** `30`
* Minimum distance in pixels to trigger slide change for short swipes.

```
const snap = new Snap({

  container: document.getElementById('container'),

  shortSwipesThreshold: 30,

});



// change value

snap.updateProps({

  shortSwipesThreshold: 10,

});
```

### `swipeFriction`[​](#props.swipeFriction "Direct link to props.swipeFriction")

* **Type:** `boolean`
* **Default:** `false`
* Defines if `friction` is allowed when swiping. Doesn't work with short swipes or when `followSwipe` is `false`.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#friction)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipeFriction: false,

});



// change value

snap.updateProps({

  swipeFriction: true,

});
```

### `swipeThreshold`[​](#props.swipeThreshold "Direct link to props.swipeThreshold")

* **Type:** `number`
* **Default:** `5`
* Length in pixels that must be swiped to trigger swipe start.

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipeThreshold: 5,

});



// change value

snap.updateProps({

  swipeThreshold: 3,

});
```

### `swipeMinTime`[​](#props.swipeMinTime "Direct link to props.swipeMinTime")

* **Type:** `number`
* **Default:** `0`
* The minimum time from the start of a real swipe that identifies when the carousel swipe begins.

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipeMinTime: 0,

});



// change value

snap.updateProps({

  swipeMinTime: 1000,

});
```

### `swipeInertiaDuration`[​](#props.swipeInertiaDuration "Direct link to props.swipeInertiaDuration")

* **Type:** `(distance: number) => number`
* **Default:** `null`
* **Status:** deprecated — release inertia is now RAF-based and this prop is no longer applied.

### `swipeInertiaRatio`[​](#props.swipeInertiaRatio "Direct link to props.swipeInertiaRatio")

* **Type:** `number`
* **Default:** `1`
* Inertia strength.

```
const snap = new Snap({

  container: document.getElementById('container'),

  swipeInertiaRatio: 1,

});



// change value

snap.updateProps({

  swipeInertiaRatio: 0.5,

});
```

### `wheel`[​](#props.wheel "Direct link to props.wheel")

* **Type:** `boolean`
* **Default:** `false`
* Enable or disable mouse wheel control.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#wheel)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  wheel: true,

});



// change value

snap.updateProps({

  wheel: false,

});
```

### `wheelSpeed`[​](#props.wheelSpeed "Direct link to props.wheelSpeed")

* **Type:** `number`
* **Default:** `1`
* Speed factor for mouse wheel control.

```
const snap = new Snap({

  container: document.getElementById('container'),

  wheelSpeed: 1,

});



// change value

snap.updateProps({

  wheelSpeed: 2,

});
```

### `wheelAxis`[​](#props.wheelAxis "Direct link to props.wheelAxis")

* **Type:** `'x' | 'y' | 'auto'`
* **Default:** `'auto'`
* Wheel axis. If `auto`, the axis will be automatically detected depending on **[direction](#props.direction)**.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#wheel)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  wheelAxis: 'auto',

});



// change value

snap.updateProps({

  wheelAxis: 'y',

});
```

### `followWheel`[​](#props.followWheel "Direct link to props.followWheel")

* **Type:** `boolean`
* **Default:** `true`
* If `false`, disables smooth, continuous scrolling behavior from the mouse wheel and instead updates the snap position in discrete steps (like pagination).
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#throttled-wheel)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  followWheel: true,

});



// change value

snap.updateProps({

  followWheel: false,

});
```

### `wheelThrottle`[​](#props.wheelThrottle "Direct link to props.wheelThrottle")

* **Type:** `number` | `'auto'`
* **Default:** `auto`
* Throttle wheel events, value in milliseconds. Works only if **[followWheel](#props.followWheel)** is disabled.

```
const snap = new Snap({

  container: document.getElementById('container'),

  wheelThrottle: 'auto',

});



// throttled by 1000ms

snap.updateProps({

  wheelThrottle: 1000,

});
```

### `stickOnWheelEnd`[​](#props.stickOnWheelEnd "Direct link to props.stickOnWheelEnd")

* **Type:** `boolean`
* **Default:** `true`
* Enable snapping when wheel stop. Works with **[followWheel](#props.followWheel)** enabled.
  <br />
  **See [demo](https://vevetjs.com/docs/Snap/basic-demos.md#free-wheel)**

```
const snap = new Snap({

  container: document.getElementById('container'),

  stickOnWheelEnd: true,

});



// change value

snap.updateProps({

  stickOnWheelEnd: false,

});
```

### `stickOnWheelEndThreshold`[​](#props.stickOnWheelEndThreshold "Direct link to props.stickOnWheelEndThreshold")

* **Type:** `number`
* **Default:** `30`
* Snapping threshold for **[stickOnWheelEnd](#props.stickOnWheelEnd)**.

```
const snap = new Snap({

  container: document.getElementById('container'),

  stickOnWheelEndThreshold: 30,

});



// change value

snap.updateProps({

  stickOnWheelEndThreshold: 100,

});
```

### `interval`[​](#props.interval "Direct link to props.interval")

* **Type:** `number | null`
* **Default:** `null`
* Interval between automatic slide changes in milliseconds. If `null`, the interval is disabled.

```
const snap = new Snap({

  container: document.getElementById('container'),

  interval: 3000, // change slide every 3 seconds

});



// change value

snap.updateProps({

  interval: 5000,

});
```

### `intervalDirection`[​](#props.intervalDirection "Direct link to props.intervalDirection")

* **Type:** `'next' | 'prev'`
* **Default:** `'next'`
* Direction of automatic slide changes when `interval` is enabled.

```
const snap = new Snap({

  container: document.getElementById('container'),

  interval: 3000,

  intervalDirection: 'next',

});



// change value

snap.updateProps({

  intervalDirection: 'prev',

});
```
