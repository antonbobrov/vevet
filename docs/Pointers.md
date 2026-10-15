# Pointers

Manages pointer events, including tracking multiple pointers, and emitting callbacks for pointer interactions.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo OPNdJzd](https://codepen.io/anton-bobrov/embed/OPNdJzd?default-tab=result)

HTML

```
<div class="container" id="container">

  Place Your Fingers Here



  <div class="thumb"></div>

  <div class="thumb"></div>

  <div class="thumb"></div>

  <div class="thumb"></div>

  <div class="thumb"></div>

</div>
```

CSS

```
.container {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  touch-action: none;

}



.thumb {

  position: absolute;

  top: -25px;

  left: -25px;

  width: 50px;

  height: 50px;

  border-radius: 50%;



  opacity: 0;

}



.thumb:nth-child(1) {

  background: var(--gradient-sunset, #000);

}



.thumb:nth-child(2) {

  background: var(--gradient-violet, #000);

}



.thumb:nth-child(3) {

  background: var(--gradient-green, #000);

}



.thumb:nth-child(4) {

  background: var(--gradient-amber, #000);

}



.thumb:nth-child(5) {

  background: var(--gradient-sky, #000);

}
```

JavaScript

```
import {

  Pointers

} from "vevet";



const container = document.getElementById("container");



const thumbs = document.querySelectorAll(".thumb");



new Pointers({

  container,

  relative: true,

  minPointers: 2,

  maxPointers: 5,

  onPointermove: ({

    pointer

  }) => {

    const finger = thumbs[pointer.index];



    finger.style.opacity = "1";

    finger.style.transform = `translate(${pointer.current.x}px, ${pointer.current.y}px)`;

  },

  onPointerup: ({

    pointer

  }) => {

    const finger = thumbs[pointer.index];



    finger.style.opacity = "0";

  },

  onStart: () => {

    container.style.backgroundColor = "rgb(10, 23, 62)";

  },

  onEnd: () => {

    container.style.backgroundColor = "";

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/OPNdJzd)

## Callbacks[​](#callbacks "Direct link to Callbacks")

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

## Initialization[​](#initialization "Direct link to Initialization")

caution

For proper functionality, ensure the container has an appropriate [touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action) property.

If `touch-action` is missing, the browser may block pointer events such as `pointermove` during scrolling or gestures, causing inconsistent behavior.

```
<div class="container" id="container"></div>
```

```
.container {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  touch-action: none;

}
```

```
import { Pointers } from 'vevet';



const container = document.getElementById('container');



const pointers = new Pointers({

  container,

  relative: true,

  onPointermove: ({ pointer }) => {

    console.log(pointer.current.x, pointer.current.y);

  },

});
```

Destroy the pointers instance:

```
pointers.destroy();
```

## Best Practices[​](#best-practices "Direct link to Best Practices")

* Always set an appropriate `touch-action` on the container to ensure consistent pointermove behavior on mobile.
* Use `relative: true` when working with draggable, scrollable, or transformed containers for stable coordinates.
* For pan, pinch, and rotate, prefer the high-level [`move`](https://vevetjs.com/docs/Pointers/callbacks.md#move) callback instead of manual distance math on `pointersMap`.
* Use [`pointerdown`](https://vevetjs.com/docs/Pointers/callbacks.md#pointerdown) `event.pointerType` (`'mouse'` | `'touch'`) or type-aware props when mouse and touch need different rules.
* Destroy the instance when it's no longer needed to avoid memory leaks and stale event listeners.

## Pinch & rotate[​](#pinch--rotate "Direct link to Pinch & rotate")

Use `minPointers: 2` and the [`move`](https://vevetjs.com/docs/Pointers/callbacks.md#move) callback. It fires **once per microtask** after any pointer moves, with deduplicated pan / pinch / rotate metrics:

```
import { clamp, Pointers } from 'vevet';



const pointers = new Pointers({

  container: document.getElementById('thumb'),

  minPointers: 2,

  maxPointers: 2,

  relative: false,

  onMove: ({ center, prevCenter, scale, prevScale, angle, prevAngle }) => {

    // Pan — delta since previous move

    x += center.x - prevCenter.x;

    y += center.y - prevCenter.y;



    // Pinch — multiplicative scale since previous move

    currentScale = clamp(currentScale * (scale / prevScale), 0.5, 3);



    // Rotate — delta since previous move (deg)

    currentAngle += angle - prevAngle;



    content.style.transform = `scale(${currentScale}) rotate(${currentAngle}deg)`;

    thumb.style.transform = `translate(${x}px, ${y}px)`;

  },

});
```

See [`IPointersMove`](https://vevetjs.com/docs/Pointers/interfaces.md#ipointersmove) for the full payload.
