# Canvas

The **Canvas** class simplifies working with an HTML5 Canvas element and its 2D rendering context.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo bNNbKXE](https://codepen.io/anton-bobrov/embed/bNNbKXE?default-tab=result)

HTML

```
<div class="container" id="container"></div>
```

CSS

```
body {

  margin: 0;

  padding: 30px;

  min-height: 100vh;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  position: relative;

  width: 200px;

  height: 200px;

}
```

JavaScript

```
import {

  Canvas

} from "vevet";



const instance = new Canvas({

  container: document.getElementById("container")

});





const render = ({

  ctx,

  width,

  height

}) => {

  ctx.beginPath();

  ctx.fillStyle = "#f8f9ff";

  ctx.fillRect(0, 0, width, height);

  ctx.closePath();



  ctx.beginPath();

  ctx.fillStyle = "#0D6EFD";

  ctx.fillRect(10, 10, 50, 50);

  ctx.closePath();

};



instance.render(render);

instance.on("resize", () => instance.render(render));
```

## Overview[​](#overview "Direct link to Overview")

This class provides a streamlined approach to handling a canvas by:

* Automatically creating the `<canvas>` element.
* Managing resizing based on viewport or container size.
* Offering access to useful properties like `width`, `height`, `dpr`, and `context`.
* Supporting both automatic and manual resizing.
* Implementing conditional rendering to prevent errors when the canvas is invisible or has zero size.

## Initialization[​](#initialization "Direct link to Initialization")

note

If the canvas or its container has zero width or height (e.g. `display: none`), rendering will be skipped automatically to prevent errors.

Create a Canvas instance with auto-sizing:

```
const instance = new Canvas({

  container: document.getElementById('container'),

  append: true,

  resizeOnInit: true,

  resizeOnRuntime: true,

});
```

Or predefined sizes:

```
const instance = new Canvas({

  container: document.getElementById('container'),

  width: 300,

  height: 200,

});
```

Render your content:

```
const render = ({ ctx, width, height }) => {

  ctx.beginPath();

  ctx.fillStyle = '#f8f9ff';

  ctx.fillRect(0, 0, width, height);

  ctx.closePath();



  ctx.beginPath();

  ctx.fillStyle = '#0D6EFD';

  ctx.fillRect(10, 10, 50, 50);

  ctx.closePath();

};



// instant render (will be cleared after resize)

instance.render(render);



// render on each resize

instance.on('resize', () => instance.render(render));
```

Destroy the canvas

```
instance.destroy();
```

## Best Practices[​](#best-practices "Direct link to Best Practices")

* Always check `canRender` before performing expensive draw operations.
* Prefer using the provided `render()` method instead of accessing `ctx` directly — it automatically guards against zero-size renders.
* Use `resizeOnRuntime` only when necessary, as frequent resizes can be expensive.
* When working with animations, combine `Canvas` with `Raf` utilities instead of manual `requestAnimationFrame`.
* For high-performance scenes, consider limiting `dpr` to a fixed value instead of `'auto'`.
