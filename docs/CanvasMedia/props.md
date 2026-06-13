# Props

<!-- -->

note

All **[Canvas props](https://vevetjs.com/docs/Canvas/props.md)** are available in this class.

### Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `media`[​](#props.media "Direct link to props.media")

* **Type:**

  * `Canvas`
  * `HTMLImageElement`
  * `SVGImageElement`
  * `HTMLVideoElement`
  * `HTMLCanvasElement`

* The media element to be rendered. Accepts a Canvas instance or common media elements like images and videos.

```
const canvas = new CanvasMedia({

  media: document.querySelector('img'),

});
```

### `autoRenderVideo`[​](#props.autoRenderVideo "Direct link to props.autoRenderVideo")

* **Type:** `boolean`
* **Default:** `true`
* If enabled, video frames are continuously re-rendered to the canvas.
  <br />
  <!-- -->
  Disable this option if you render manually or need to optimize performance.

```
const canvas = new CanvasMedia({

  media: document.querySelector('video'),

  autoRenderVideo: false,

});
```

## Mutable Props[​](#mutable-props "Direct link to Mutable Props")

Mutable properties can be changed at runtime via [.updateProps](#updateprops)

Adaptive props

To apply different values by viewport or device, use **[Responsive](https://vevetjs.com/docs/base/Responsive/.md#example-with-module)** with this component as the source. Props will update automatically when breakpoints change.

### `rule`[​](#props.rule "Direct link to props.rule")

* **Type:**

  * `cover`
  * `contain`
  * `top-left`
  * `top-right`
  * `bottom-left`
  * `bottom-right`
  * `center`

* **Default:** `'cover'`

* Defines how the media element is positioned within the canvas.

```
const canvas = new CanvasMedia({

  media: document.querySelector('video'),

  rule: 'contain',

});



// change value

canvas.updateProps({

  rule: 'bottom-right',

});
```
