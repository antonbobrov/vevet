# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `container`[​](#container "Direct link to container")

Type: `Element | Window`

The cursor container.

```
const cursor = new Cursor();



cursor.container; // returns cursor container
```

### `coords`[​](#coords "Direct link to coords")

Type: `{ height: number; width: number; x: number; y: number; }`

The **current interpolated cursor state**.<br /><!-- -->These values are smoothed over time using interpolation and are intended for **rendering and animation logic**.

```
const cursor = new Cursor();



cursor.coords.x;

cursor.coords.y;

cursor.coords.width;

cursor.coords.height;

cursor.coords.angle;

cursor.coords.velocity;
```

### `domContainer`[​](#domcontainer "Direct link to domcontainer")

Type: `HTMLElement`

Returns the DOM parent for the cursor element.

```
const cursor = new Cursor();



cursor.domContainer; // cursor DOM parent
```

### `hoveredElement`[​](#hoveredelement "Direct link to hoveredelement")

Type: `undefined` | **[CursorHoverElement](https://vevetjs.com/docs/Cursor/interfaces.md#cursorhoverelement)**

Contains information about the currently hovered **attached** element.

* Available only while hovering an element registered via `.attachHover()`
* Automatically resets to `undefined` when no interactive element is hovered

**Works for attached elements only. See [.attachHover()](https://vevetjs.com/docs/Cursor/methods.md#attachhover).**

```
const cursor = new Cursor();



cursor.hoveredElement.element;

cursor.hoveredElement.type;

cursor.hoveredElement.snap;

cursor.hoveredElement.width;

cursor.hoveredElement.height;

cursor.hoveredElement.padding;

cursor.hoveredElement.sticky;

cursor.hoveredElement.stickyX;

cursor.hoveredElement.stickyY;
```

### `inner`[​](#inner "Direct link to inner")

Type: `HTMLElement`

The inner element of the custom cursor. Should be used for setting additional styling.

```
const cursor = new Cursor();



cursor.inner; // HTMLElement
```

### `outer`[​](#outer "Direct link to outer")

Type: `HTMLElement`

The outer element representing the visual cursor.

```
const cursor = new Cursor();



cursor.outer; // HTMLElement
```

### `targetCoords`[​](#targetcoords "Direct link to targetcoords")

Type: `{ height: number; width: number; x: number; y: number }`

The **raw, non-interpolated cursor state**.<br /><!-- -->Represents the immediate result of pointer movement or hover state changes.

```
const cursor = new Cursor();



cursor.targetCoords.x;

cursor.targetCoords.y;

cursor.targetCoords.width;

cursor.targetCoords.height;

cursor.targetCoords.angle;

cursor.targetCoords.velocity;
```

### `path`[​](#path "Direct link to path")

Type: `SVGPathElement`

An SVG `<path>` element that stores a smoothed curve of the user’s pointer movement. Available only when `behavior: "path"` is enabled.

**[Read more](https://vevetjs.com/docs/Cursor/props.md#props.behavior)** / **[Demo](https://vevetjs.com/docs/Cursor/demos.md#tail-path-cursor)**

```
const cursor = new Cursor();



cursor.path; // SVGPathElement
```
