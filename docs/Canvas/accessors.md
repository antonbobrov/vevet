# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `canRender`[​](#canrender "Direct link to canrender")

Type: `boolean`

Checks if the canvas is ready to render. Returns `false` if the canvas `width` or `height` is `0`.

```
const canvas = new Canvas();



canvas.canRender; // true or false
```

### `canvas`[​](#canvas "Direct link to canvas")

Type: `HTMLCanvasElement`

The canvas element instance.

```
const canvas = new Canvas();



canvas.canvas; // HTMLCanvasElement
```

### `ctx`[​](#ctx "Direct link to ctx")

Type: `CanvasRenderingContext2D`

The 2D rendering context.

```
const canvas = new Canvas();



canvas.ctx; // CanvasRenderingContext2D
```

### `dpr`[​](#dpr "Direct link to dpr")

Type: `number`

Current device pixel ratio.

```
const canvas = new Canvas();



canvas.dpr; // returns device pixel ratio
```

### `height`[​](#height "Direct link to height")

Type: `number`

Canvas height (DPR applied).

```
const canvas = new Canvas();



canvas.height; // returns canvas height
```

### `offsetHeight`[​](#offsetheight "Direct link to offsetheight")

Type: `number`

Height without DPR scaling.

```
const canvas = new Canvas();



canvas.offsetHeight; // returns canvas height without DPR applied
```

### `offsetWidth`[​](#offsetwidth "Direct link to offsetwidth")

Type: `number`

Width without DPR scaling.

```
const canvas = new Canvas();



canvas.offsetWidth; // returns canvas width without DPR applied
```

### `width`[​](#width "Direct link to width")

Type: `number`

Canvas width (DPR applied).

```
const canvas = new Canvas();



canvas.width; // returns canvas width
```
