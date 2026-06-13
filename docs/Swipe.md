# Swipe

Manages swipe interactions:

* Tracks pointer movement and detects direction
* Emits events on start, move, and end
* Supports RAF-based release inertia with optional bounds bounce
* Optional movement `bounds`, rubber-band `overflow`, and `snap` targets
* Optional programmatic [`scale`](https://vevetjs.com/docs/Swipe/accessors.md#scale) with zoom-to-point via [`setScale`](https://vevetjs.com/docs/Swipe/methods.md#setScale)
* Calculates rotation (`angle` in degrees)
* Does not apply transforms — only provides computed coordinates

## Coordinate spaces[​](#coordinate-spaces "Direct link to Coordinate spaces")

Swipe exposes two related spaces in [`ISwipeCoords`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords):

| Space        | Fields                                              | Use for                                                   |
| ------------ | --------------------------------------------------- | --------------------------------------------------------- |
| **Pointer**  | `start`, `prev`, `current`, `diff`, `step`, `accum` | Gesture deltas, direction detection, velocity             |
| **Movement** | `movement`, `prevMovement`, `scale`                 | Element `transform` when using `bounds` / `snap` / rubber |

`movement` and `scale` are accumulated for the instance lifetime (not reset on each swipe). Per-gesture offsets live in `diff` and `step`.

With [`pointers`](https://vevetjs.com/docs/Swipe/props.md#props.pointers) `> 1`, pointer-space coordinates follow the **center** between active pointers (via internal [`Pointers.move`](https://vevetjs.com/docs/Pointers/accessors.md#move)), not the first touch only.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo bNNbKyV](https://codepen.io/anton-bobrov/embed/bNNbKyV?default-tab=result)

HTML

```
<div id="all" class="item" style="background: linear-gradient(135deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

</div>



<div id="horizontal" class="item" style="background: linear-gradient(90deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt="">

</div>



<div id="vertical" class="item" style="background: linear-gradient(0deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/379997/drag-vertical.svg" alt="">

</div>



<div id="rotation" class="item" style="background: linear-gradient(35deg, rgb(255, 127, 135) 0%, rgb(244, 214, 157) 100%);">

  <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



// ALL



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

  onStart: (data, {

    container

  }) => {

    container.style.zIndex = "1";

  },

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});





// HORIZONTAL



new Swipe({

  container: document.getElementById("horizontal"),

  axis: "x",

  grabCursor: true,

  onStart: (data, {

    container

  }) => {

    container.style.zIndex = "1";

  },

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, 0)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});





// VERTICAL



new Swipe({

  container: document.getElementById("vertical"),

  axis: "y",

  grabCursor: true,

  onStart: (data, {

    container

  }) => {

    container.style.zIndex = "1";

  },

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(0, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});





// ROTATION



new Swipe({

  container: document.getElementById("rotation"),

  relative: true,

  grabCursor: true,

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `rotate(${diff.angle}deg)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Swipe/demos.md).

## Initialization[​](#initialization "Direct link to Initialization")

caution

* `Swipe` does not transform elements — apply `movement`, `scale` (or `diff`) yourself in callbacks.
* With `bounds` / `snap`, prefer **`movement`** and **`scale`** for transforms; `diff` is pointer space only.
* Set `transform-origin` on the transformed element (typically `top left` / `0 0`) so translate and scale compose predictably.

Simple drag (pointer space):

```
import { Swipe } from 'vevet';



const swipe = new Swipe(

  {

    container: document.getElementById('container'),

    grabCursor: true,

  },

  {

    onMove: ({ diff }) => {

      el.style.transform = `translate(${diff.x}px, ${diff.y}px)`;

    },

    onEnd: () => {

      el.style.transform = '';

    },

  },

);
```

Bounded drag with rubber and inertia (movement space):

```
import { Swipe } from 'vevet';



const wrapper = document.getElementById('wrapper');

const thumb = document.getElementById('thumb');



const swipe = new Swipe({

  container: wrapper,

  thumb,

  relative: true,

  grabCursor: true,

  inertia: true,

  overflow: () => 50,

  bounds: () => ({ x: [0, 300], y: [0, 300] }),

  onMove: ({ movement }) => {

    thumb.style.transform = `translate(${movement.x}px, ${movement.y}px)`;

  },

});



// Optional initial offset

swipe.setMovement({ x: 150, y: 150 });
```

Image viewer with pan, wheel zoom, and scale-aware bounds (movement space):

```
import { addEventListener, clamp, Swipe } from 'vevet';



const wrapper = document.getElementById('wrapper');

const thumb = document.getElementById('thumb');



const minScale = 1;

const maxScale = 3;



const swipe = new Swipe({

  container: wrapper,

  thumb,

  relative: true,

  inertia: true,

  grabCursor: true,

  bounds: ({ scale }) => ({

    x: [0, wrapper.clientWidth - thumb.clientWidth * scale],

    y: [0, wrapper.clientHeight - thumb.clientHeight * scale],

  }),

  onMove: ({ movement, scale }) => {

    thumb.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});



addEventListener(

  thumb,

  'wheel',

  (event) => {

    event.preventDefault();



    if (swipe.isSwiping) {

      return;

    }



    swipe.setScale(

      clamp(swipe.scale - event.deltaY * 0.001, minScale, maxScale),

      event,

    );

  },

  { passive: false },

);



addEventListener(thumb, 'dblclick', (event) => {

  const next =

    swipe.scale >= maxScale

      ? minScale

      : clamp(swipe.scale + 1, minScale, maxScale);



  swipe.setScale(next, event);

});
```

Two-finger pan (touch) + pinch zoom via a separate [`Pointers`](https://vevetjs.com/docs/Pointers/.md) instance:

```
import { clamp, Pointers, Swipe } from 'vevet';



const wrapper = document.getElementById('wrapper');

const thumb = document.getElementById('thumb');



const minScale = 1;

const maxScale = 10;



// Pan — one mouse pointer or two touch pointers

const swipe = new Swipe({

  container: wrapper,

  relative: true,

  inertia: true,

  pointers: (type) => (type === 'mouse' ? 1 : 2),

  bounds: ({ scale }) => ({

    x: [0, wrapper.clientWidth - thumb.clientWidth * scale],

    y: [0, wrapper.clientHeight - thumb.clientHeight * scale],

  }),

  onMove: ({ movement, scale }) => {

    thumb.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  },

});



// Pinch — zoom toward the midpoint between fingers

const pinch = new Pointers({

  container: wrapper,

  minPointers: 2,

  maxPointers: 2,

  relative: false, // client coords — matches Swipe.setScale origin decoding

  onMove: ({ center, scale, prevScale }) => {

    if (prevScale === scale) {

      return;

    }



    swipe.setScale(

      clamp(swipe.scale * (scale / prevScale), minScale, maxScale),

      center,

    );

  },

  onStart: () => swipe.updateProps({ inertia: false }),

  onEnd: () => swipe.updateProps({ inertia: true }),

});
```

Coordinate space for pinch origin

Use a separate [`Pointers`](https://vevetjs.com/docs/Pointers/.md) instance with `relative: false` and pass `move.center` to [`setScale`](https://vevetjs.com/docs/Swipe/methods.md#setscale). Coordinates are client-based; Swipe converts them to container space when [`relative`](https://vevetjs.com/docs/Swipe/props.md#props.relative) is `true`.

Detect direction:

```
swipe.on('toLeft', () => console.log('swipe to left'));
```

Add inertia:

```
const swipe = new Swipe({

  container: document.getElementById('container'),

  inertia: true,

  inertiaThreshold: 1, // px/s or deg/s minimum release speed

});
```

Destroy all events:

```
swipe.destroy();
```
