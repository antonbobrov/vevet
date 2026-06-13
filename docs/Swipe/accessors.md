# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `coords`[​](#coords "Direct link to coords")

Type: **[ISwipeCoords](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords)**

Full snapshot: pointer fields plus movement-space fields (`movement`, `prevMovement`, `scale`).

```
const instance = new Swipe();



instance.coords.movement.x;

instance.coords.scale;

instance.coords.diff.x;
```

### `container`[​](#container "Direct link to container")

Type: `HTMLElement | SVGElement`

Coordinate reference element (`props.container`).

```
const instance = new Swipe();



instance.container;
```

### `movement`[​](#movement "Direct link to movement")

Type: **[ISwipeVec3](https://vevetjs.com/docs/Swipe/interfaces.md#iswipevec3)**

Total displacement in **movement space** (rubber + snap). Use for transforms when `bounds` / `snap` are enabled.

```
const instance = new Swipe({

  bounds: () => ({ x: [0, 200] }),

  onMove: ({ movement, scale }) => {

    el.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});



instance.movement.x;
```

### `scale`[​](#scale "Direct link to scale")

Type: `number`

Current scale modifier in movement space. Default is `1`. Updated by [`setScale`](https://vevetjs.com/docs/Swipe/methods.md#setscale). Included in [`ISwipeCoords`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords) on callbacks.

```
const instance = new Swipe({

  onMove: ({ movement, scale }) => {

    el.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});



instance.scale;
```

### `start`[​](#start "Direct link to start")

Type: **[ISwipeState](https://vevetjs.com/docs/Swipe/interfaces.md#iswipestate)**

Pointer position at swipe start.

```
instance.start.x;

instance.start.time;
```

### `prev`[​](#prev "Direct link to prev")

Type: **[ISwipeState](https://vevetjs.com/docs/Swipe/interfaces.md#iswipestate)**

Previous pointer position.

```
instance.prev.x;
```

### `current`[​](#current "Direct link to current")

Type: **[ISwipeState](https://vevetjs.com/docs/Swipe/interfaces.md#iswipestate)**

Current pointer position.

```
instance.current.x;

instance.current.angle;
```

### `diff`[​](#diff "Direct link to diff")

Type: **[ISwipeState](https://vevetjs.com/docs/Swipe/interfaces.md#iswipestate)**

Offset from swipe start to current pointer position (pointer space).

```
instance.diff.x;

instance.diff.angle;
```

### `step`[​](#step "Direct link to step")

Type: **[ISwipeState](https://vevetjs.com/docs/Swipe/interfaces.md#iswipestate)**

Offset from previous to current pointer position.

```
instance.step.x;
```

### `accum`[​](#accum "Direct link to accum")

Type: **[ISwipeVec3](https://vevetjs.com/docs/Swipe/interfaces.md#iswipevec3)**

Absolute path length since swipe start (`|step|` per axis).

```
instance.accum.x;

instance.accum.angle;
```

### `hasInertia`[​](#hasinertia "Direct link to hasinertia")

Type: `boolean`

Whether release inertia (RAF) is running.

```
instance.hasInertia;
```

### `hasBounce`[​](#hasbounce "Direct link to hasbounce")

Type: `boolean`

Whether overflow bounce-back timeline is running.

```
instance.hasBounce;
```

### `isSwiping`[​](#isswiping "Direct link to isswiping")

Type: `boolean`

Whether a swipe gesture is in progress.

```
instance.isSwiping;
```
