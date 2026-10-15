# Interfaces

<!-- -->

## ISwipeVec2[​](#iswipevec2 "Direct link to ISwipeVec2")

2D vector in swipe coordinate space.

```
interface ISwipeVec2 {

  x: number;

  y: number;

}
```

## ISwipeVec3[​](#iswipevec3 "Direct link to ISwipeVec3")

2D vector with rotation (`angle` in degrees).

```
interface ISwipeVec3 extends ISwipeVec2 {

  angle: number;

}
```

## ISwipeState[​](#iswipestate "Direct link to ISwipeState")

Pointer sample: position plus `time` (ms, `performance.now()`).

```
interface ISwipeState extends ISwipeVec3 {

  time: number;

}
```

## ISwipeAxes[​](#iswipeaxes "Direct link to ISwipeAxes")

Optional numeric values per axis (`x`, `y`, `angle`).

* **`bounds`**: each array is normalized to `[min, max]` movement limits.
* **`snap`**: each array lists snap targets in movement space.

```
interface ISwipeAxes {

  x?: number[];

  y?: number[];

  angle?: number[];

}
```

## ISwipeCoords[​](#iswipecoords "Direct link to ISwipeCoords")

Snapshot on swipe callbacks and accessors. See also [Coordinate spaces](https://vevetjs.com/docs/Swipe/.md#coordinate-spaces).

**Pointer space:** `start`, `prev`, `current`, `diff`, `step`, `accum` — gesture deltas and velocity.<br />**Movement space:** `movement`, `prevMovement`, `scale` — after rubber and snap; use for transforms with [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds).

```
interface ISwipeCoords {

  /** Last event timestamp (ms). */

  timestamp: number;

  /** Pointer position at swipe start. */

  start: ISwipeState;

  /** Previous pointer position. */

  prev: ISwipeState;

  /** Current pointer position. */

  current: ISwipeState;

  /** Offset from `start` to `current` (angle is accumulated). */

  diff: ISwipeState;

  /** Offset from `prev` to `current`. */

  step: ISwipeState;

  /** Absolute path length since swipe start (`|step|` per axis). */

  accum: ISwipeVec3;

  /** Total displacement in movement space (rubber + snap applied). */

  movement: ISwipeVec3;

  /** Movement on the previous frame (movement space, after rubber and snap). */

  prevMovement: ISwipeVec3;

  /** Current scale modifier (default `1`). */

  scale: number;

}
```

## ISwipeCanMoveArg[​](#iswipecanmovearg "Direct link to ISwipeCanMoveArg")

Arguments for [`willAbort`](https://vevetjs.com/docs/Swipe/props.md#props.willAbort).

```
interface ISwipeCanMoveArg {

  type: 'touch' | 'mouse';

  /** Current pointer sample. */

  state: ISwipeState;

  /** Pointer position when the gesture began. */

  start: ISwipeVec2;

  /** Offset from `start` to `state` (pointer space). */

  diff: ISwipeVec2;

}
```
