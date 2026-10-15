# Swipe

Manages swipe interactions:

* Tracks pointer movement and detects direction
* Emits events on start, move, and end
* Supports RAF-based release inertia with optional bounds bounce
* Optional movement `bounds`, rubber-band `overflow`, and `snap` targets
* Optional programmatic [`scale`](https://vevetjs.com/docs/Swipe/accessors.md#scale) with zoom-to-point via [`setScale`](https://vevetjs.com/docs/Swipe/methods.md#setscale)
* Calculates rotation (`angle` in degrees)
* Does not apply transforms — only provides computed coordinates

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo bNNbKyV](https://codepen.io/anton-bobrov/embed/bNNbKyV?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="wrapper">

    <div id="all" class="item">

      <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

    </div>



    <div id="horizontal" class="item">

      <img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt="">

    </div>



    <div id="vertical" class="item">

      <img src="https://www.svgrepo.com/show/379997/drag-vertical.svg" alt="">

    </div>



    <div id="rotation" class="item">

      <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">

    </div>

  </div>

</div>
```

CSS

```
.wrapper {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 0.5rem;

}



.item {

  width: 2.5rem;

  height: 2.5rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;



  border-radius: 0.5rem;



  img {

    width: 1.25rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}



#all {

  background: var(--gradient-brand-135, #000);

}



#horizontal {

  background: var(--gradient-brand-90, #000);

}



#vertical {

  background: var(--gradient-brand-0, #000);

}



#rotation {

  background: var(--gradient-brand-radial, #000);

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

[Open live demo ↗](https://vevetjs.com/pens/bNNbKyV)

[More demosExplore all examples](https://vevetjs.com/docs/Swipe/demos.md)

## Coordinate spaces[​](#coordinate-spaces "Direct link to Coordinate spaces")

Swipe exposes two related spaces in [`ISwipeCoords`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords):

| Space        | Fields                                              | Use for                                                   |
| ------------ | --------------------------------------------------- | --------------------------------------------------------- |
| **Pointer**  | `start`, `prev`, `current`, `diff`, `step`, `accum` | Gesture deltas, direction detection, velocity             |
| **Movement** | `movement`, `prevMovement`, `scale`                 | Element `transform` when using `bounds` / `snap` / rubber |

`movement` and `scale` are accumulated for the instance lifetime (not reset on each swipe). Per-gesture offsets live in `diff` and `step`.

With [`pointers`](https://vevetjs.com/docs/Swipe/props.md#props.pointers) `> 1`, pointer-space coordinates follow the **center** between active pointers (via internal [`Pointers.move`](https://vevetjs.com/docs/Pointers/accessors.md#move)), not the first touch only.

## Gesture lifecycle[​](#gesture-lifecycle "Direct link to Gesture lifecycle")

Swipe uses an internal state machine (`pending` → `swiping` → `end` / `aborted`):

1. **`Pointers.start`** — a pointer session begins; window `touchmove` / `mousemove` listeners are attached for movement sampling.
2. **Pending** — the pointer moves, but [`threshold`](https://vevetjs.com/docs/Swipe/props.md#props.threshold) or [`minTime`](https://vevetjs.com/docs/Swipe/props.md#props.minTime) is not satisfied yet. No `start` callback.
3. **Swiping** — threshold passed → [`start`](https://vevetjs.com/docs/Swipe/callbacks.md#start) fires, then [`move`](https://vevetjs.com/docs/Swipe/callbacks.md#move) on each sample.
4. **End** — all pointers released → [`end`](https://vevetjs.com/docs/Swipe/callbacks.md#end), optional direction callbacks (`toLeft` …), then [inertia](https://vevetjs.com/docs/Swipe/callbacks.md#inertia) or bounce-back inside [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds).
5. **Aborted** — wrong [`axis`](https://vevetjs.com/docs/Swipe/props.md#props.axis) or [`willAbort`](https://vevetjs.com/docs/Swipe/props.md#props.willAbort) → [`abort`](https://vevetjs.com/docs/Swipe/callbacks.md#abort). No `start` / `end`.

If the user releases before the threshold, `start` and `end` do not fire; overflow may still trigger bounce via [`releaseBounce`](https://vevetjs.com/docs/Swipe/methods.md#releasebounce).

## Input pipeline[​](#input-pipeline "Direct link to Input pipeline")

Movement is sampled from [`Pointers.move`](https://vevetjs.com/docs/Pointers/accessors.md#move) on each window `touchmove` / `mousemove`, **not** from `pointermove` directly. This allows:

* [`preventTouchMove`](https://vevetjs.com/docs/Swipe/props.md#props.preventTouchMove) on touch (passive window listener)
* [`requireCtrlKey`](https://vevetjs.com/docs/Swipe/props.md#props.requireCtrlKey) for mouse pan
* Stable coordinates when the browser coalesces or skips `pointermove` events

## Movement pipeline[​](#movement-pipeline "Direct link to Movement pipeline")

When [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds) or [`snap`](https://vevetjs.com/docs/Swipe/props.md#props.snap) are set, each `move` sample runs:

**decode** → accumulate **rawMovement** → **rubber-band** past limits → **snap** → expose as `movement`

Use `movement` (not `diff`) for transforms when bounds, rubber, or snap are active.

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

## Best practices[​](#best-practices "Direct link to Best practices")

* Apply transforms yourself — Swipe only computes coordinates.
* With `bounds` / `snap` / rubber, use **`movement`** and **`scale`**, not `diff`.
* Set `transform-origin` on the transformed element (usually `0 0`) for predictable pan/zoom.
* Use [`thumb`](https://vevetjs.com/docs/Swipe/props.md#props.thumb) when the drag handle differs from the event [`container`](https://vevetjs.com/docs/Swipe/props.md#props.container).
* Enable [`inertia`](https://vevetjs.com/docs/Swipe/props.md#props.inertia) for natural release; tune [`inertiaThreshold`](https://vevetjs.com/docs/Swipe/props.md#props.inertiaThreshold) if small flicks should not coast.
* Call [`destroy`](https://vevetjs.com/docs/Swipe/methods.md#destroy) when removing the component to free listeners and RAF/Timeline instances.
