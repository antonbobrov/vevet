# CanvasMedia

`CanvasMedia` is designed for **pre-rendering** media into a canvas layer. It does not replace video or image playback, but prepares rasterized content for performant reuse in animations, effects, and transitions.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo vEEBroM](https://codepen.io/anton-bobrov/embed/vEEBroM?default-tab=result)

HTML

```
<div class="fullpage-center">

  <p>Original</p>



  <img id="source" class="source" src="https://picsum.photos/2000/2000">



  <p>Prerendered</p>



  <div class="container" id="container"></div>

</div>
```

CSS

```
.container {

  position: relative;

  width: 200px;

  height: 250px;

  background: var(--gradient-sunset, #000);

}



.source {

  display: block;

  width: 100px;

  height: auto;

}
```

JavaScript

```
import {

  CanvasMedia

} from "vevet";



const sourceImage = document.getElementById("source");



const handleLoad = () => {

  const instance = new CanvasMedia({

    container: document.getElementById("container"),

    media: sourceImage,

    rule: "contain"

  });



};



if (sourceImage.complete) {

  handleLoad();

} else {

  sourceImage.onload = handleLoad;

}
```

[Open live demo ↗](https://vevetjs.com/pens/vEEBroM)

## Initialization[​](#initialization "Direct link to Initialization")

caution

* The provided `media` **must be fully loaded** before initialization.
* `CanvasMedia` does not handle media loading internally.

Create a CanvasMedia instance and prerender an image inside it:

```
const instance = new CanvasMedia({

  container: document.getElementById('container'),

  media: document.querySelector('img'),

  append: false,

});
```

Or video:

```
const instance = new CanvasMedia({

  container: document.getElementById('container'),

  media: document.querySelector('video'),

  append: true,

});
```

Handle when your resource is rendered:

```
instance.on('render', () => {

  console.log('do something with your canvas', instance.canvas);

});
```

`render` also fires after `resize()` — for example when `rule` or canvas size changes.

Destroy the canvas:

```
instance.destroy();
```

## Best Practices[​](#best-practices "Direct link to Best Practices")

* Ensure media is loaded (`img.complete`, `video.readyState >= 2`) before creating `CanvasMedia`.
* Use `CanvasMedia` for **visual reuse**, not as a replacement for `<video>` playback.
* Disable `autoRenderVideo` if you control rendering manually or need lower CPU usage.
* Prefer `rule: "cover"` for full-background visuals and `"contain"` for preserving aspect ratio.
* Combine `CanvasMedia` with `Canvas` or `Raf` utilities for animation pipelines.
