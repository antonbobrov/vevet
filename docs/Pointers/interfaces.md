# Interfaces

<!-- -->

## TPointersType[​](#tpointerstype "Direct link to TPointersType")

```
type TPointersType = 'mouse' | 'touch';
```

Used by type-aware props ([`buttons`](https://vevetjs.com/docs/Pointers/props.md#props.buttons), [`minPointers`](https://vevetjs.com/docs/Pointers/props.md#props.minPointers), [`maxPointers`](https://vevetjs.com/docs/Pointers/props.md#props.maxPointers)).<br /><!-- -->Resolved from [`PointerEvent.pointerType`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent/pointerType) on the first pointer of a gesture; unknown values fall back to `'mouse'`.

## IPointersMove[​](#ipointersmove "Direct link to IPointersMove")

Aggregated gesture state passed to the [`move`](https://vevetjs.com/docs/Pointers/callbacks.md#move) callback and exposed via the [`move`](https://vevetjs.com/docs/Pointers/accessors.md#move) accessor.

```
interface IPointersMove {

  center: IPointersVec2; // Average of current pointer positions (pan origin).

  prevCenter: IPointersVec2; // Previous move center.

  startCenter: IPointersVec2; // Center on the first move after start.

  distance: number; // Average span between pointers (px).

  prevDistance: number; // Span on the previous move.

  startDistance: number; // Span on the first move after start.

  scale: number; // distance / startDistance — pinch multiplier since start.

  prevScale: number; // Previous scale value.

  angle: number; // Cumulative rotation since start (deg, unwrapped).

  prevAngle: number; // Previous angle value.

}
```

**Pan delta:** `center.x - prevCenter.x`, `center.y - prevCenter.y`<br />**Pinch step:** `scale / prevScale` (multiplicative)<br />**Rotate delta:** `angle - prevAngle`

`scale` and `angle` update only when at least two pointers are active.

## IPointersItem[​](#ipointersitem "Direct link to IPointersItem")

```
interface IPointersItem {

  id: number; // Native pointerId from the browser.

  index: number; // Index assigned to the pointer.

  start: IPointersVec2; // Coordinates recorded on pointerdown.

  prev: IPointersVec2; // Coordinates from the previous update cycle.

  current: IPointersVec2; // Latest coordinates of the pointer.

  diff: IPointersVec2; // Difference between current and start positions.

  step: IPointersVec2; // Movement delta between current and prev.

  accum: IPointersVec2; // Total accumulated movement across all updates.

}
```

## IPointersVec2[​](#ipointersvec2 "Direct link to IPointersVec2")

```
interface IPointersVec2 {

  x: number; // X-coordinate relative to the container.

  y: number; // Y-coordinate relative to the container.

}
```
