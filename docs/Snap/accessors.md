# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `activeIndex`[​](#activeindex "Direct link to activeindex")

Type: `number`

Returns the index of the currently active slide.

```
snap.activeIndex; // active slide index
```

### `activeSlide`[​](#activeslide "Direct link to activeslide")

Type: **[SnapSlide](https://vevetjs.com/docs/Snap/slide.md)**

Returns the currently active slide instance.

```
snap.activeSlide; // active slide instance
```

### `origin`[​](#origin "Direct link to origin")

Type: `'start' | 'center' | 'end'`

Returns the resolved slide magnets origin. Reflects [`origin`](https://vevetjs.com/docs/Snap/props.md#props.origin) and the deprecated [`centered`](https://vevetjs.com/docs/Snap/props.md#props.centered) prop (`centered: true` → `'center'`).

```
snap.origin; // 'start' | 'center' | 'end'
```

### `axis`[​](#axis "Direct link to axis")

Type: `"x" | "y"`

Returns the axis based on the current direction.

```
snap.axis; // "x" or "y"
```

### `container`[​](#container "Direct link to container")

Type: `HTMLElement`

Returns the carousel container element.

```
snap.container; // HTMLElement
```

### `containerSize`[​](#containersize "Direct link to containersize")

Type: `number`

Returns the container size depending on direction (`width` or `height`).

```
snap.containerSize; // number
```

### `eventsEmitter`[​](#eventsemitter "Direct link to eventsemitter")

Type: `HTMLElement`

Returns the element used to emit swipe and wheel events.

```
snap.eventsEmitter; // HTMLElement
```

### `firstSlideSize`[​](#firstslidesize "Direct link to firstslidesize")

Type: `number`

Returns the size of the first slide.

```
snap.firstSlideSize; // number
```

### `isEmpty`[​](#isempty "Direct link to isempty")

Type: `boolean`

Indicates whether there are no slides to animate.<br /><!-- -->Snap requires at least one slide during initialization and throws when no slides are found.

```
snap.isEmpty; // true or false
```

### `isTransitioning`[​](#istransitioning "Direct link to istransitioning")

Type: `boolean`

Indicates whether a transition animation is currently in progress.

```
snap.isTransitioning; // true or false
```

### `hasInertia`[​](#hasinertia "Direct link to hasinertia")

Type: `boolean`

Indicates whether a swipe inertia animation is currently active (the carousel is still moving after the user released input).

```
snap.hasInertia; // true or false
```

### `scrollableSlides`[​](#scrollableslides "Direct link to scrollableslides")

Type: [SnapSlide](https://vevetjs.com/docs/Snap/slide.md)\[]

Returns slides whose sizes exceed the container size.

```
snap.scrollableSlides; // array of slide instance
```

### `slides`[​](#slides "Direct link to slides")

Type: [SnapSlide](https://vevetjs.com/docs/Snap/slide.md)\[]

Returns all slide instances.

```
snap.slides; // slide instances array
```

### `canLoop`[​](#canloop "Direct link to canloop")

Type: `boolean`

Indicates whether looping is currently possible.

```
snap.canLoop; // true or false
```

### `current`[​](#current "Direct link to current")

Type: `number`

Returns the current track value.

```
snap.current; // number
```

### `target`[​](#target "Direct link to target")

Type: `number`

Returns the target track value.

```
snap.target; // number
```

### `min`[​](#min "Direct link to min")

Type: `number`

Returns the minimum track value.

```
snap.min; // number
```

### `max`[​](#max "Direct link to max")

Type: `number`

Returns the maximum track value.

```
snap.max; // number
```

### `progress`[​](#progress "Direct link to progress")

Type: `number`

Returns the track progress:

* from `0` to `1` in non-loop mode
* from `-Infinity` to `Infinity` in loop mode

```
snap.progress; // number
```

### `loopedCurrent`[​](#loopedcurrent "Direct link to loopedcurrent")

Type: `number`

Returns the looped current track value. Uses the **[.loopCoord()](https://vevetjs.com/docs/Snap/methods.md#loopcoord)** method internally.

```
snap.loopedCurrent; // number
```

### `loopCount`[​](#loopcount "Direct link to loopcount")

Type: `number`

Returns the number of completed loops.<br /><!-- -->Works only in loop mode and can contain both positive and negative values.

```
snap.loopCount; // number
```

### `isStart`[​](#isstart "Direct link to isstart")

Type: `boolean`

Indicates whether the start has been reached.<br />**Works only for non-looping carousels.**

```
snap.isStart; // true or false
```

### `isEnd`[​](#isend "Direct link to isend")

Type: `boolean`

Indicates whether the end has been reached.<br />**Works only for non-looping carousels.**

```
snap.isEnd; // true or false
```

### `impulse`[​](#impulse "Direct link to impulse")

Type: `boolean`

Returns the impulse applied from the current value to the target, caused by swipe or wheel input.<br /><!-- -->Can be positive or negative depending on scroll direction.

```
snap.impulse; // number
```

### `isInterpolating`[​](#isinterpolating "Direct link to isinterpolating")

Type: `boolean`

Indicates whether the track is currently being interpolated (the current value is still easing toward the target value).

```
snap.isInterpolating; // true or false
```

### `isWheeling`[​](#iswheeling "Direct link to iswheeling")

Type: `boolean`

Indicates whether wheel scroll interaction is currently in progress.

```
snap.isWheeling; // true or false
```

### `isIdle`[​](#isidle "Direct link to isidle")

Type: `boolean`

Indicates whether the carousel is idle — not swiping, not wheeling, not interpolating, not transitioning.

```
snap.isIdle; // true or false
```

### `isSlideScrolling`[​](#isslidescrolling "Direct link to isslidescrolling")

Type: `boolean`

Indicates whether the active slide is larger than the container and is currently being scrolled.

```
snap.isSlideScrolling; // true or false
```
