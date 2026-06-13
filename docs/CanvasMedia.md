# CanvasMedia

`CanvasMedia` is designed for **pre-rendering** media into a canvas layer. It does not replace video or image playback, but prepares rasterized content for performant reuse in animations, effects, and transitions.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo vEEBroM](https://codepen.io/anton-bobrov/embed/vEEBroM?default-tab=result)

HTML

```
<h1>Original</h1>



<img id="source" class="source" src="https://picsum.photos/2000/2000">



<h1>Prerendered</h1>



<div class="container" id="container"></div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0 30px;

  min-height: 100vh;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  color: #fff;

}



h1 {

  margin: 30px 0;

  font-weight: 500;

  font-size: 30px;

}



.container {

  position: relative;

  width: 200px;

  height: 300px;

  background: linear-gradient(35deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

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
