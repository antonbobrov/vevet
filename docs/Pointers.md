# Pointers

Manages pointer events, including tracking multiple pointers, and emitting callbacks for pointer interactions.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo OPNdJzd](https://codepen.io/anton-bobrov/embed/OPNdJzd?default-tab=result)

HTML

```
<div class="container" id="container">

  Place Your Fingers Here



  <div class="thumb" style="background: linear-gradient(

  165deg,

  rgb(255, 140, 80) 0%,

  rgb(255, 95, 88) 40%,

  rgb(255, 60, 140) 100%

)"></div>



  <div class="thumb" style=" background: linear-gradient(

  165deg,

  rgb(70, 30, 120) 0%,

  rgb(120, 45, 180) 40%,

  rgb(200, 60, 255) 100%

)"></div>



  <div class="thumb" style=" background: linear-gradient(

  165deg,

  rgb(110, 200, 40) 0%,

  rgb(40, 160, 80) 40%,

  rgb(0, 100, 60) 100%

)"></div>



  <div class="thumb" style=" background: linear-gradient(

  165deg,

  rgb(255, 200, 60) 0%,

  rgb(255, 150, 40) 40%,

  rgb(220, 60, 40) 100%

)"></div>



  <div class="thumb" style="background: linear-gradient(

  165deg,

  rgb(150, 220, 255) 0%,

  rgb(80, 200, 255) 40%,

  rgb(0, 170, 200) 100%

)"></div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  height: 100vh;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  color: #fff;

}



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

    maxPointers: 5

  },



  {

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

      container.style.backgroundColor = "#ccc";

    },

    onEnd: () => {

      container.style.backgroundColor = "";

    }

  });
```

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



const pointers = new Pointers(

  {

    container,

    relative: true,

  },

  {

    onPointermove: ({ pointer }) => {

      console.log(pointer.current.x, pointer.current.y);

    },

  },

);
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
