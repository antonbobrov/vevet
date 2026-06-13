# ScrollProgress

todo: examples

`ScrollProgress` is a component that tracks the scroll progress of a specified section element.

This component can be used for creating scroll-based animations such as parallax effects.

## Props[​](#props "Direct link to Props")

### Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

#### `section`[​](#props.section "Direct link to props.section")

* **Type:** `Element`
* The element whose scroll progress is tracked.

#### `root`[​](#props.root "Direct link to props.root")

* **Type:** `Element | null`
* **Default:** `null`
* The root element used as a reference for scroll progress calculation.
* Usually the scroll container.
* If `null`, the viewport is used as the reference.

#### `optimized`[​](#props.optimized "Direct link to props.optimized")

* **Type:** `boolean`
* **Default:** `true`
* If `true`, progress calculations occur only while the section is within the viewport or root element.
* Improves performance by avoiding unnecessary calculations.

#### `useSvh`[​](#props.useSvh "Direct link to props.useSvh")

* **Type:** `boolean`
* **Default:** `false`
* If `true`, scroll progress is calculated based on the small viewport height (`svh` CSS unit) instead of the current viewport height (`vh` CSS unit).

## Accessors[​](#accessors "Direct link to Accessors")

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `inProgress`[​](#inprogress "Direct link to inprogress")

Type: `{ x: number; y: number }`

Calculates the progress of the section entering the root element.

### `isVisible`[​](#isvisible "Direct link to isvisible")

Type: `boolean`

Indicates whether the section is currently visible within the viewport or root element.

### `moveProgress`[​](#moveprogress "Direct link to moveprogress")

Type: `{ x: number; y: number }`

Calculates the progress of the section's movement within the root element.

### `outProgress`[​](#outprogress "Direct link to outprogress")

Type: `{ x: number; y: number }`

Calculates the progress of the section leaving the root element.

### `progress`[​](#progress "Direct link to progress")

Type: `{ x: number; y: number }`

Calculates the global scroll progress of the section relative to the root element.

### `rootBounds`[​](#rootbounds "Direct link to rootbounds")

Type: `{ height: number; left: number; top: number; width: number }`

The bounds of the root element used for scroll calculations.

### `section`[​](#section "Direct link to section")

Type: `Element`

Returns the section element being tracked for scroll progress.

### `sectionBounds`[​](#sectionbounds "Direct link to sectionbounds")

Type: `{ height: number; left: number; top: number; width: number }`

The bounds of the section element relative to the root element.

## Methods[​](#methods "Direct link to Methods")

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `getProgress`[​](#getprogress "Direct link to getprogress")

Calculates the section scroll progress relative to the root element.

The function takes the top or left corner of the section as the reference point.

**Parameters**

* `topThreshold: number` Top threshold of the section position.

* `rightThreshold: number` Right threshold of the section position.

* `bottomThreshold: number` Bottom threshold of the section position.

* `leftThreshold: number` Left threshold of the section position.

```
const progress = instance.getProgress(0, vevet.width, vevet.height / 2, 0);



// `progress.y` is `0` when the top corner of the section is at the beginning of the viewport or root element

// `progress.y` is `1` when the top corner of the section is at the center of the viewport or root element
```

### `update`[​](#update "Direct link to update")

Updates the section and root bounds, and emits an update callback.

```
instance.update();
```

## Callbacks[​](#callbacks "Direct link to Callbacks")

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `update`[​](#update-1 "Direct link to update-1")

Triggered on each scroll progress update.

```
const destruct = instance.on('update', () => console.log('update'));



// Cancel the callback

destruct();
```
