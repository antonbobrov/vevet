# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `start`[​](#start "Direct link to start")

Fired when the required number of pointers is reached.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  onStart: () => console.log('start'),

});
```

or:

```
const destruct = pointers.on('start', () => console.log('start'));



// Cancel the callback

destruct();
```

### `pointerdown`[​](#pointerdown "Direct link to pointerdown")

Fired when a pointer is added.

`event.pointerType` is `'mouse'` or `'touch'` (see [`TPointersType`](https://vevetjs.com/docs/Pointers/interfaces.md#tpointerstype)). Use it to branch logic or with type-aware props.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  onPointerdown: ({ event, pointer }) => console.log('pointerdown'),

});
```

or:

```
const destruct = pointers.on('pointerdown', ({ event, pointer }) =>

  console.log('pointerdown'),

);



// Cancel the callback

destruct();
```

### `pointermove`[​](#pointermove "Direct link to pointermove")

Fired when a pointer moves.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  onPointermove: ({ event, pointer }) => console.log('pointermove'),

});
```

or:

```
const destruct = pointers.on('pointermove', ({ event, pointer }) =>

  console.log('pointermove'),

);



// Cancel the callback

destruct();
```

### `move`[​](#move "Direct link to move")

Fired **once per microtask** when any pointer moves after [`start`](#start).<br /><!-- -->Coalesces multiple `pointermove` events in the same tick (typical on touch with two fingers).

Provides aggregated gesture state: pan (`center`), pinch (`scale`), and rotate (`angle`).<br /><!-- -->See [`IPointersMove`](https://vevetjs.com/docs/Pointers/interfaces.md#ipointersmove).

Low-level per-pointer updates remain on [`pointermove`](#pointermove).

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  minPointers: 2,

  onMove: (data) => {

    console.log(data.center, data.scale, data.angle);

  },

});
```

or:

```
const destruct = pointers.on('move', (data) => console.log(data));



// Cancel the callback

destruct();
```

### `pointerup`[​](#pointerup "Direct link to pointerup")

Fired when a pointer is removed.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  onPointerup: ({ pointer }) => console.log('pointerup'),

});
```

or:

```
const destruct = pointers.on('pointerup', ({ pointer }) =>

  console.log('pointerup'),

);



// Cancel the callback

destruct();
```

### `end`[​](#end "Direct link to end")

Fired when pointer events are canceled.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  onEnd: () => console.log('end'),

});
```

or:

```
const destruct = pointers.on('end', () => console.log('end'));



// Cancel the callback

destruct();
```
