# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `Element | window`
* **Default:** `window`
* The container where the custom cursor is active.
  <br />
  <!-- -->
  Use `window` for full-window activation.

```
const cursor = new Cursor({

  container: document.getElementById('cursor-container'),

});
```

### `hideNative`[​](#props.hideNative "Direct link to props.hideNative")

* **Type:** `boolean`
* **Default:** `false`
* Hides the native cursor if set to `true`.

```
const cursor = new Cursor({

  hideNative: true,

});
```

### `append`[​](#props.append "Direct link to props.append")

* **Type:** `boolean`
* **Default:** `true`
* Appends the custom cursor element to the container.
  <br />
  <!-- -->
  Use `false` if you need only cursor logic and interactions without the visual DOM element.

```
const cursor = new Cursor({

  append: false,

});
```

### `behavior`[​](#props.behavior "Direct link to props.behavior")

* **Type:** `"default"` | `"path"`
* **Default:** `"default"`
* Defines how the cursor follows the native pointer
  <br />
  `default` — Cursor interpolates toward the current pointer position.
  <br />
  `path` — Cursor follows a smooth SVG path repeating the pointer trajectory.
  <br />
  <!-- -->
  Use `path` for decorative or expressive cursor effects.

```
const cursor = new Cursor({

  behavior: 'path',

});
```

### `transformModifier`[​](#props.transformmodifier "Direct link to props.transformmodifier")

* **Type:** `(coords: ICursorFullCoords) => string`
* **Default:**
  ```
  (coords) => `translate(${coords.x}px, ${coords.y}px)`;
  ```
* Modifier for the cursor transform.

```
const cursor = new Cursor({

  transformModifier: (coords) =>

    `translate(${coords.x}px, ${coords.y}px) rotate(${coords.angle}deg)`,

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be updated at runtime using `.updateProps()`.

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `enabled`[​](#props.enabled "Direct link to props.enabled")

* **Type:** `boolean`
* **Default:** `true`
* Enables or disables the custom cursor interactions.

```
const cursor = new Cursor({

  enabled: false,

});



// change value

cursor.updateProps({

  enabled: true,

});
```

### `width`[​](#props.width "Direct link to props.width")

* **Type:** `number`
* **Default:** `50`
* The initial width of the custom cursor. Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.

```
const cursor = new Cursor({

  width: 50,

});



// change value

cursor.updateProps({

  width: '3rem',

});
```

### `height`[​](#props.height "Direct link to props.height")

* **Type:** `number`
* **Default:** `50`
* The initial height of the custom cursor. Supports css units like `px`, `rem`, `vw`, `vh`, `svh`.

```
const cursor = new Cursor({

  height: 50,

});



// change value

cursor.updateProps({

  height: '3rem',

});
```

### `lerp`[​](#props.lerp "Direct link to props.lerp")

* **Type:** `number`
* **Default:** `0.2`
* Linear interpolation factor for smooth cursor movement.
  <br />
  <!-- -->
  The value must be between `0` and `1`, with higher values indicating faster movement.

```
const cursor = new Cursor({

  lerp: 0.2,

});



// change value

cursor.updateProps({

  lerp: 0.05,

});
```

### `autoStop`[​](#props.autoStop "Direct link to props.autoStop")

* **Type:** `boolean`
* **Default:** `true`
* Automatically stops the internal `requestAnimationFrame` loop when cursor position and size reach target values.
  <br />
  <!-- -->
  Set to `false` if you need continuous rendering (e.g. for shaders or custom effects).

```
const cursor = new Cursor({

  autoStop: true,

});



// change value

cursor.updateProps({

  autoStop: false,

});
```
