# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `container`[​](#container "Direct link to container")

Type: `HTMLElement | SVGElement`

Returns the container element handling events.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

});



pointers.container; // container element
```

### `isStarted`[​](#isstarted "Direct link to isstarted")

Type: `boolean`

Indicates whether the `start` event has been triggered.

```
const pointers = new Pointers({

  container: document.getElementById('container'),

});



pointers.isStarted; // true or false
```

### `move`[​](#move "Direct link to move")

Type: [`IPointersMove`](https://vevetjs.com/docs/Pointers/interfaces.md#ipointersmove) | `null`

Latest aggregated gesture snapshot from the most recent [`move`](https://vevetjs.com/docs/Pointers/callbacks.md#move) update, or `null` before the first move after [`start`](https://vevetjs.com/docs/Pointers/callbacks.md#start) / after [`end`](https://vevetjs.com/docs/Pointers/callbacks.md#end).

```
const pointers = new Pointers({

  container: document.getElementById('container'),

  minPointers: 2,

});



pointers.move?.center; // midpoint between pointers

pointers.move?.scale; // pinch multiplier since gesture start
```

### `pointersMap`[​](#pointersmap "Direct link to pointersmap")

Type: `Map<number,` [IPointersItem](https://vevetjs.com/docs/Pointers/interfaces.md#ipointersitem)`>`

Contains all currently active pointers.<br /><!-- -->Keys correspond to native `pointerId` values from Pointer Events API.<br /><!-- -->Entries are updated on each `pointermove` and preserved until the pointer is released (`pointerup` / `pointercancel`).

```
const pointers = new Pointers({

  container: document.getElementById('container'),

});



pointers.pointersMap; // map of active pointers
```
