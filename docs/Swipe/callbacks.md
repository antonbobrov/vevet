# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `start`[​](#start "Direct link to start")

Swipe start event. See [ISwipeCoords](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords).

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onStart: (coords) => console.log(coords),

});
```

or:

```
const destruct = observer.on('start', (coords) => console.log(coords));



// Cancel the callback

destruct();
```

### `move`[​](#move "Direct link to move")

Swipe move event. Payload: [ISwipeCoords](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords) (includes `movement`, `scale`, and `prevMovement` for bounded / snapped / zoomed transforms).

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onMove: ({ movement, scale }) => {

    el.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});
```

or:

```
const destruct = observer.on('move', (coords) => console.log(coords));



// Cancel the callback

destruct();
```

### `end`[​](#end "Direct link to end")

Swipe end event. See [ISwipeCoords](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords).

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onEnd: (coords) => console.log(coords),

});
```

or:

```
const destruct = observer.on('end', (coords) => console.log(coords));



// Cancel the callback

destruct();
```

### `toTop`[​](#totop "Direct link to totop")

Swipe from bottom to top.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onToTop: () => console.log('from bottom to top'),

});
```

or:

```
const destruct = observer.on('toTop', () => console.log('from bottom to top'));



// Cancel the callback

destruct();
```

### `toBottom`[​](#tobottom "Direct link to tobottom")

Swipe from top to bottom.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onToBottom: () => console.log('from top to bottom'),

});
```

or:

```
const destruct = observer.on('toBottom', () =>

  console.log('from top to bottom'),

);



// Cancel the callback

destruct();
```

### `toRight`[​](#toright "Direct link to toright")

Swipe from left to right.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onToRight: () => console.log('from left to right'),

});
```

or:

```
const destruct = observer.on('toRight', () =>

  console.log('from left to right'),

);



// Cancel the callback

destruct();
```

### `toLeft`[​](#toleft "Direct link to toleft")

Swipe from right to left.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onToLeft: () => console.log('from right to left'),

});
```

or:

```
const destruct = observer.on('toLeft', () => console.log('from right to left'));



// Cancel the callback

destruct();
```

### `touchstart`[​](#touchstart "Direct link to touchstart")

Triggered on `touchstart` listener. Triggered before any action related to this event is processed.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onTouchstart: (event) => console.log(event),

});
```

or:

```
const destruct = observer.on('touchstart', (event) => console.log(event));



// Cancel the callback

destruct();
```

### `touchmove`[​](#touchmove "Direct link to touchmove")

Triggered on `touchmove` listener. Triggered before any action related to this event is processed.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onTouchmove: (event) => console.log(event),

});
```

or:

```
const destruct = observer.on('touchmove', (event) => console.log(event));



// Cancel the callback

destruct();
```

### `mousemove`[​](#mousemove "Direct link to mousemove")

Triggered on `mousemove` listener. Triggered before any action related to this event is processed.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onMousemove: (event) => console.log(event),

});
```

or:

```
const destruct = observer.on('mousemove', (event) => console.log(event));



// Cancel the callback

destruct();
```

### `pointerdown`[​](#pointerdown "Direct link to pointerdown")

Triggered on `pointerdown` listener.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onPointerdown: ({ event, pointer }) => console.log(event, pointer),

});
```

or:

```
const destruct = observer.on('pointerdown', ({ event, pointer }) =>

  console.log(event, pointer),

);



// Cancel the callback

destruct();
```

### `pointermove`[​](#pointermove "Direct link to pointermove")

Triggered on `pointermove` listener.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onPointermove: ({ event, pointer }) => console.log(event, pointer),

});
```

or:

```
const destruct = observer.on('pointermove', ({ event, pointer }) =>

  console.log(event, pointer),

);



// Cancel the callback

destruct();
```

### `pointerup`[​](#pointerup "Direct link to pointerup")

Triggered on `pointerup` listener.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onPointerup: ({ pointer }) => console.log(pointer),

});
```

or:

```
const destruct = observer.on('pointerup', ({ pointer }) =>

  console.log(pointer),

);



// Cancel the callback

destruct();
```

### `abort`[​](#abort "Direct link to abort")

Triggered when swipe is aborted.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onAbort: () => console.log('swipe aborted'),

});
```

or:

```
const destruct = observer.on('abort', () => console.log('swipe aborted'));



// Cancel the callback

destruct();
```

### `preventEdgeSwipe`[​](#preventedgeswipe "Direct link to preventedgeswipe")

Triggered on edge swipe preventing.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onPreventEdgeSwipe: () => console.log('edge swipe prevented'),

});
```

or:

```
const destruct = observer.on('preventEdgeSwipe', () =>

  console.log('edge swipe prevented'),

);



// Cancel the callback

destruct();
```

### `inertiaStart`[​](#inertiastart "Direct link to inertiastart")

Triggered on inertia start.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onInertiaStart: () => console.log('inertia start'),

});
```

or:

```
const destruct = observer.on('inertiaStart', () =>

  console.log('inertia start'),

);



// Cancel the callback

destruct();
```

### `inertia`[​](#inertia "Direct link to inertia")

Triggered on inertia progress.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onInertia: () => console.log('inertia in progress'),

});
```

or:

```
const destruct = observer.on('inertia', () =>

  console.log('inertia in progress'),

);



// Cancel the callback

destruct();
```

### `inertiaEnd`[​](#inertiaend "Direct link to inertiaend")

Triggered on inertia end.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onInertiaEnd: () => console.log('inertia end'),

});
```

or:

```
const destruct = observer.on('inertiaEnd', () => console.log('inertia end'));



// Cancel the callback

destruct();
```

### `inertiaFail`[​](#inertiafail "Direct link to inertiafail")

Triggered when inertia fails to start because of lack of momentum.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onInertiaFail: () => console.log('inertia fail'),

});
```

or:

```
const destruct = observer.on('inertiaFail', () => console.log('inertia fail'));



// Cancel the callback

destruct();
```

### `inertiaCancel`[​](#inertiacancel "Direct link to inertiacancel")

Triggered when inertia is canceled.

```
const observer = new Swipe({

  container: document.getElementById('container'),

  onInertiaCancel: () => console.log('inertia cancel'),

});
```

or:

```
const destruct = observer.on('inertiaCancel', () =>

  console.log('inertia cancel'),

);



// Cancel the callback

destruct();
```
