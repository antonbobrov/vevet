# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `calculateBounds`[​](#calculatebounds "Direct link to calculatebounds")

Re-reads [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds) and caches normalized `[min, max]` per axis. Called automatically on every move update; call manually when layout changes outside a gesture (for example after resize).

```
const swipe = new Swipe({

  container: document.getElementById('wrapper'),

  bounds: ({ scale }) => ({

    x: [0, getMaxX(scale)],

  }),

});



swipe.calculateBounds();
```

### `setScale`[​](#setscale "Direct link to setscale")

Sets programmatic scale in movement space. Optionally zooms toward an **origin** point, re-reads bounds, emits `move`, and clamps overflow via [`releaseBounce(0)`](#releasebounce) when inertia is not running.

* **`value`:** next scale.
* **`origin`:** `MouseEvent`, `TouchEvent`, or `{ x, y }` in **client (viewport) coordinates** — decoded with the same rules as [`relative`](https://vevetjs.com/docs/Swipe/props.md#props.relative). Pass a wheel or click event for zoom-to-cursor behavior.

```
import { clamp } from 'vevet';



const swipe = new Swipe({

  container: document.getElementById('wrapper'),

  thumb: document.getElementById('thumb'),

  relative: true,

  bounds: ({ scale }) => ({

    x: [0, wrapper.clientWidth - thumb.clientWidth * scale],

  }),

  onMove: ({ movement, scale }) => {

    thumb.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});



wrapper.addEventListener(

  'wheel',

  (event) => {

    event.preventDefault();

    swipe.setScale(clamp(swipe.scale - event.deltaY * 0.001, 1, 3), event);

  },

  { passive: false },

);
```

### `setMovement`[​](#setmovement "Direct link to setmovement")

Sets programmatic displacement in movement space. Reapplies rubber and snap, emits `move`, and clamps overflow via [`releaseBounce(0)`](#releasebounce).

```
const swipe = new Swipe({

  container: document.getElementById('wrapper'),

  bounds: () => ({ x: [0, 300], y: [0, 300] }),

});



swipe.setMovement({ x: 100, y: 50 });

swipe.setMovement({ angle: 45 });
```

### `cancelInertia`[​](#cancelinertia "Direct link to cancelinertia")

Stops release inertia animation.

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  inertia: true,

});



swipe.cancelInertia();
```

### `cancelBounce`[​](#cancelbounce "Direct link to cancelbounce")

Stops overflow bounce-back timeline.

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  bounds: () => ({ x: [0, 200] }),

});



swipe.cancelBounce();
```

### `releaseBounce`[​](#releasebounce "Direct link to releasebounce")

Starts overflow bounce-back when movement exceeds [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds) and [`canBounce`](https://vevetjs.com/docs/Swipe/props.md#props.canBounce) allows it. Called automatically on swipe release when inertia does not run.

Pass `0` as `targetDuration` for an instant clamp (used internally by [`setScale`](#setscale) and [`setMovement`](#setmovement)).

```
const swipe = new Swipe({

  container: document.getElementById('wrapper'),

  bounds: ({ scale }) => ({

    x: [0, wrapper.clientWidth - thumb.clientWidth * scale],

  }),

});



// After layout or scale change outside a gesture

swipe.calculateBounds();

swipe.releaseBounce(0);
```

Animated bounce on release (default [`bounceDuration`](https://vevetjs.com/docs/Swipe/props.md#props.bounceduration)):

```
swipe.releaseBounce();
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance and cleans up resources.

```
const swipe = new Swipe({

  container: document.getElementById('container'),

});



swipe.destroy();
```
