# Demos

<!-- -->

## Multi-Type Cursor[​](#multi-type-cursor "Direct link to Multi-Type Cursor")

Overview of several hover behaviors in one place: sticky, friction, snap, custom size, and typed cursors via `attachCursor()` / `attachHover()`.

[Vevet Demo vEEBNWN](https://codepen.io/anton-bobrov/embed/vEEBNWN?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Custom Cursor</h1>



  <div class="grid">

    <div class="item" data-cursor-type="sticky" data-cursor-sticky>Sticky</div>



    <div class="item" data-cursor-type="friction" data-cursor-friction>Friction</div>



    <div class="item" data-cursor-snap>Snap</div>



    <div class="item" data-cursor-size>Custom size</div>



    <div class="item" data-cursor-type="draggable">Draggable</div>



    <div class="item" data-cursor-type="zoom">Zoom</div>



    <div class="item" data-cursor-type="play">Watch</div>

  </div>

</div>







<div class="cursor" data-cursor="default"></div>



<div class="cursor" data-cursor="sticky"></div>



<div class="cursor" data-cursor="friction"></div>



<div class="cursor" data-cursor="draggable">

  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

    <path d="M16.1924 5.65683C16.5829 5.2663 16.5829 4.63314 16.1924 4.24261L13.364 1.41419C12.5829 0.633139 11.3166 0.633137 10.5355 1.41419L7.70711 4.24261C7.31658 4.63314 7.31658 5.2663 7.70711 5.65683C8.09763 6.04735 8.73079 6.04735 9.12132 5.65683L11 3.77812V11.0503H3.72784L5.60655 9.17157C5.99707 8.78104 5.99707 8.14788 5.60655 7.75735C5.21602 7.36683 4.58286 7.36683 4.19234 7.75735L1.36391 10.5858C0.582863 11.3668 0.582859 12.6332 1.36391 13.4142L4.19234 16.2426C4.58286 16.6332 5.21603 16.6332 5.60655 16.2426C5.99707 15.8521 5.99707 15.219 5.60655 14.8284L3.8284 13.0503H11V20.2219L9.12132 18.3432C8.73079 17.9526 8.09763 17.9526 7.7071 18.3432C7.31658 18.7337 7.31658 19.3669 7.7071 19.7574L10.5355 22.5858C11.3166 23.3669 12.5829 23.3669 13.364 22.5858L16.1924 19.7574C16.5829 19.3669 16.5829 18.7337 16.1924 18.3432C15.8019 17.9526 15.1687 17.9526 14.7782 18.3432L13 20.1213V13.0503H20.071L18.2929 14.8284C17.9024 15.219 17.9024 15.8521 18.2929 16.2426C18.6834 16.6332 19.3166 16.6332 19.7071 16.2426L22.5355 13.4142C23.3166 12.6332 23.3166 11.3668 22.5355 10.5858L19.7071 7.75735C19.3166 7.36683 18.6834 7.36683 18.2929 7.75735C17.9024 8.14788 17.9024 8.78104 18.2929 9.17157L20.1716 11.0503H13V3.87867L14.7782 5.65683C15.1687 6.04735 15.8019 6.04735 16.1924 5.65683Z" fill="currentColor"></path>

  </svg>

</div>



<div class="cursor" data-cursor="zoom">

  <svg width="800px" height="800px" version="1.1" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">

    <g transform="translate(-152 -983)" fill="currentColor">

      <path d="m176.97 989h-4.972c-0.552 0-1 0.448-1 1 0 0.553 0.448 1 1 1h2.628l-4.798 4.799 1.414 1.414 4.778-4.778-0.022 2.565c0 0.553 0.448 1 1 1s1-0.447 1-1v-5c0-0.296-0.123-0.535-0.316-0.699-0.182-0.186-0.433-0.301-0.712-0.301zm5.028 22c0 1.1-0.896 2-2 2h-24c-1.104 0-2-0.9-2-2v-24c0-1.104 0.896-2 2-2h24c1.104 0 2 0.896 2 2v24zm-2-28h-24c-2.209 0-4 1.791-4 4v24c0 2.21 1.791 4 4 4h24c2.209 0 4-1.79 4-4v-24c0-2.209-1.791-4-4-4zm-15.244 17.79-4.778 4.78 0.022-2.57c0-0.55-0.448-1-1-1s-1 0.45-1 1v5c0 0.3 0.123 0.54 0.316 0.7 0.181 0.18 0.433 0.3 0.712 0.3h4.972c0.552 0 1-0.45 1-1s-0.448-1-1-1h-2.628l4.798-4.8-1.414-1.41zm12.244 1.21c-0.552 0-1 0.45-1 1l0.022 2.57-4.778-4.78-1.414 1.41 4.798 4.8h-2.628c-0.552 0-1 0.45-1 1s0.448 1 1 1h4.972c0.279 0 0.531-0.12 0.712-0.3 0.193-0.16 0.316-0.4 0.316-0.7v-5c0-0.55-0.448-1-1-1zm-13-11c0.552 0 1-0.447 1-1 0-0.552-0.448-1-1-1h-4.972c-0.279 0-0.53 0.115-0.712 0.301-0.193 0.164-0.316 0.403-0.316 0.699v5c0 0.553 0.448 1 1 1s1-0.447 1-1l-0.022-2.565 4.778 4.778 1.414-1.414-4.798-4.799h2.628z"></path>

    </g>

  </svg>

</div>



<div class="cursor" data-cursor="play">

  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

    <path d="M20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L7.59662 21.6145C5.53435 22.736 3 21.2763 3 18.9671L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258Z" stroke="currentColor" stroke-width="1.5"></path>

  </svg>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }



  &:nth-child(1),

  &:nth-child(2) {

    grid-row: span 2;

  }

}



.v-cursor__inner {

  background-color: transparent;

  border-radius: 50vw;

}



[data-cursor="default"] {

  width: var(--cursor-w);

  height: var(--cursor-h);

  border-radius: inherit;

  border: 2px solid rgba(255, 255, 255, 0.35);

  box-sizing: border-box;

}



[data-cursor="draggable"],

[data-cursor="zoom"],

[data-cursor="play"],

[data-cursor="sticky"],

[data-cursor="friction"] {

  width: var(--cursor-w);

  height: var(--cursor-h);

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  border-radius: inherit;

  background: var(--gradient-peach);

  color: #000;



  svg {

    max-width: 40%;

    width: 25px;

    height: auto;

  }

}



[data-cursor="play"] {

  svg {

    transform: translate(5%, 0);

  }

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const cursor = new Cursor({

  lerp: 0.2,

  width: 30,

  height: 30

});



cursor.attachHover({

  element: document.body,

  type: "default"

});



const cursorOuters = document.querySelectorAll("*[data-cursor]");

cursorOuters.forEach(element => {

  cursor.attachCursor({

    element,

    type: element.getAttribute("data-cursor")

  });



});



const elements = document.querySelectorAll("*[data-cursor-type]");

elements.forEach(element => {

  cursor.attachHover({

    element,

    type: element.getAttribute("data-cursor-type"),

    width: 75,

    height: 75

  });



});



const sticky = document.querySelectorAll("[data-cursor-sticky]");

sticky.forEach(element => {

  cursor.attachHover({

    element,

    snap: true,

    width: 20,

    height: 20,

    sticky: true,

    stickyAmplitude: {

      x: 0,

      y: "20px"

    }

  });



});



const friction = document.querySelectorAll("[data-cursor-friction]");

friction.forEach(element => {

  cursor.attachHover({

    element,

    width: 20,

    height: 20,

    sticky: true,

    stickyFriction: 0.8

  });



});



const customSize = document.querySelectorAll("[data-cursor-size]");

customSize.forEach(element => {

  cursor.attachHover({

    element,

    width: 100,

    height: 100

  });



});



const snap = document.querySelectorAll("[data-cursor-snap]");

snap.forEach(element => {

  cursor.attachHover({

    element,

    snap: true,

    width: "auto",

    height: "auto"

  });



});
```

[Open live demo ↗](https://vevetjs.com/pens/vEEBNWN)

## Typed Cursor[​](#typed-cursor "Direct link to Typed Cursor")

Swap the cursor appearance on hover with `attachCursor()` and a matching `type` on `attachHover()` — here a default ring and a play icon.

[Vevet Demo ByKeOYv](https://codepen.io/anton-bobrov/embed/ByKeOYv?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Custom Typed Cursor</h1>



  <div class="grid">

    <div class="item" data-cursor-type="play">Play</div>



    <div class="item">No Type</div>

  </div>

</div>







<div class="cursor" data-cursor="default"></div>



<div class="cursor" data-cursor="play">

  <svg width="800px" height="800px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">

    <path d="M20.4086 9.35258C22.5305 10.5065 22.5305 13.4935 20.4086 14.6474L7.59662 21.6145C5.53435 22.736 3 21.2763 3 18.9671L3 5.0329C3 2.72368 5.53435 1.26402 7.59661 2.38548L20.4086 9.35258Z" stroke="currentColor" stroke-width="1.5"></path>

  </svg>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(2, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }

}



.v-cursor__inner {

  background-color: transparent !important;

}



[data-cursor="default"] {

  width: var(--cursor-w);

  height: var(--cursor-h);

  border-radius: 50vw;

  border: 2px solid rgba(255, 255, 255, 0.35);

  box-sizing: border-box;

}



[data-cursor="play"] {

  width: var(--cursor-w);

  height: var(--cursor-h);

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  border-radius: 50%;

  background: var(--gradient-peach);

  color: #000;



  svg {

    width: 30%;

    transform: translate(5%, 0);

  }

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const cursor = new Cursor({

  lerp: 0.2

});



cursor.attachHover({

  element: document.body,

  type: "default"

});



const defaultCursor = document.querySelector("[data-cursor='default']");

cursor.attachCursor({

  element: defaultCursor,

  type: "default"

});



const playCursor = document.querySelector("[data-cursor='play']");

cursor.attachCursor({

  element: playCursor,

  type: "play"

});



const playHover = document.querySelector("[data-cursor-type='play']");

cursor.attachHover({

  element: playHover,

  type: "play",

  width: 100,

  height: 100

});
```

[Open live demo ↗](https://vevetjs.com/pens/ByKeOYv)

## Dynamic Size[​](#dynamic-size "Direct link to Dynamic Size")

Resize the cursor on hover: fixed `width` / `height`, or `auto` to match the target (optionally with `padding`).

[Vevet Demo qEZGMyP](https://codepen.io/anton-bobrov/embed/qEZGMyP?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Dynamic Cursor Size</h1>



  <div class="grid">

    <div class="item" data-small>Small</div>



    <div class="item" data-has-padding>With Padding</div>



    <div class="item" data-no-padding>No Padding</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }

}



.v-cursor__inner {

  background-color: transparent !important;

  border: 2px solid #fff;

  border-radius: 4px;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const cursor = new Cursor();



cursor.attachHover({

  element: document.querySelector("[data-small]"),

  width: 20,

  height: 10

});



cursor.attachHover({

  element: document.querySelector("[data-has-padding]"),

  width: "auto",

  height: "auto",

  padding: 10

});



cursor.attachHover({

  element: document.querySelector("[data-no-padding]"),

  width: "auto",

  height: "auto"

});
```

[Open live demo ↗](https://vevetjs.com/pens/qEZGMyP)

## Cursor Area[​](#cursor-area "Direct link to Cursor Area")

Cursor is scoped to a DOM `container` instead of the window. Native pointer is hidden with `hideNative: true`.

[Vevet Demo bNpyxQP](https://codepen.io/anton-bobrov/embed/bNpyxQP?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container" id="container">

    <h1>Custom Cursor Area</h1>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



.container {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  background: rgba(255, 255, 255, 0.1);

  width: 100%;

  max-width: 30rem;

  height: 15rem;

  border-radius: 1rem;

}



h1 {

  margin: 0;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.v-cursor__inner {

  background-color: transparent !important;

  border: 2px solid #fff;

  border-radius: 50%;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const cursor = new Cursor({

  container: document.getElementById("container"),

  hideNative: true

});
```

[Open live demo ↗](https://vevetjs.com/pens/bNpyxQP)

## Snap Cursor[​](#snap-cursor "Direct link to Snap Cursor")

Compare default hover sizing with `snap: true`, which locks the cursor to the element center.

[Vevet Demo MYydqRe](https://codepen.io/anton-bobrov/embed/MYydqRe?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Snapping Cursor</h1>



  <div class="grid">

    <div class="item" data-simple>Simple</div>



    <div class="item" data-snap>Snap</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(2, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }

}



.v-cursor__inner {

  background-color: transparent !important;

  border: 2px solid #fff;

  border-radius: 4px;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const cursor = new Cursor();



cursor.attachHover({

  element: document.querySelector("[data-simple]"),

  width: "auto",

  height: "auto"

});



cursor.attachHover({

  element: document.querySelector("[data-snap]"),

  width: "auto",

  height: "auto",

  snap: true

});
```

[Open live demo ↗](https://vevetjs.com/pens/MYydqRe)

## Sticky Cursor[​](#sticky-cursor "Direct link to Sticky Cursor")

Sticky parallax on hover. `stickyAmplitude` can follow both axes or only one (`x` or `y`).

[Vevet Demo emzOjqK](https://codepen.io/anton-bobrov/embed/emzOjqK?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Custom Sticky Cursor</h1>



  <div class="grid">

    <div class="item" data-sticky-x>Sticky-X</div>



    <div class="item" data-sticky-y>Sticky-Y</div>



    <div class="item" data-sticky-xy>Sticky-XY</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }

}



.bg-cursor {

  background: transparent;

  border: 2px solid rgba(255, 255, 255, 0.3);

  border-radius: 50%;

}



.dot-cursor {

  background-color: #fff;

  border-radius: 50%;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const bgCursor = new Cursor({

  lerp: 0.1,

  width: 80,

  height: 80

});



bgCursor.inner.classList.add("bg-cursor");



const dotCursor = new Cursor({

  lerp: 0.5,

  width: 10,

  height: 10,

  hideNative: true

});



dotCursor.inner.classList.add("dot-cursor");



const stickyX = document.querySelector("[data-sticky-x]");



const stickyY = document.querySelector("[data-sticky-y]");



const stickyXY = document.querySelector("[data-sticky-xy]");



bgCursor.attachHover({

  element: stickyX,

  snap: true,

  width: 30,

  height: 30,

  sticky: true,

  stickyAmplitude: {

    x: 10,

    y: 0

  },

  stickyLerp: 0.2

});



bgCursor.attachHover({

  element: stickyY,

  snap: true,

  width: 30,

  height: 30,

  sticky: true,

  stickyAmplitude: {

    x: 0,

    y: 20

  },

  stickyLerp: 0.2

});



bgCursor.attachHover({

  element: stickyXY,

  snap: true,

  width: 30,

  height: 30,

  sticky: true,

  stickyAmplitude: 10,

  stickyLerp: 0.2

});
```

[Open live demo ↗](https://vevetjs.com/pens/emzOjqK)

## Sticky Friction Cursor[​](#sticky-friction-cursor "Direct link to Sticky Friction Cursor")

Sticky hover with `stickyFriction` so the element eases back toward its origin after the pointer moves.

[Vevet Demo KwMYOjo](https://codepen.io/anton-bobrov/embed/KwMYOjo?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Sticky Friction Cursor</h1>



  <div class="grid">

    <div class="item">Hover Me</div>

    <div class="item">Hover Me</div>

    <div class="item">Hover Me</div>

    <div class="item">Hover Me</div>

    <div class="item">Hover Me</div>

    <div class="item">Hover Me</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }

}



.bg-cursor {

  box-sizing: border-box;

  background: transparent;

  border: 2px solid rgba(255, 255, 255, 0.3);

  border-radius: 50%;

}



.dot-cursor {

  background-color: #fff;

  border-radius: 50%;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const bgCursor = new Cursor({

  lerp: 0.1,

  width: 80,

  height: 80

});



bgCursor.inner.classList.add("bg-cursor");



const dotCursor = new Cursor({

  lerp: 0.5,

  width: 10,

  height: 10,

  hideNative: true

});



dotCursor.inner.classList.add("dot-cursor");



const items = document.querySelectorAll(".item");



items.forEach(item => {

  dotCursor.attachHover({

    element: item,

    width: 16,

    height: 16

  });



  bgCursor.attachHover({

    element: item,

    width: 30,

    height: 30,

    sticky: true,

    stickyLerp: 0.2,

    stickyFriction: 0.8

  });



});
```

[Open live demo ↗](https://vevetjs.com/pens/KwMYOjo)

## Sticky & Snap Behavior[​](#sticky--snap-behavior "Direct link to Sticky & Snap Behavior")

Side-by-side comparison of snap, sticky, and sticky-with-friction on the same cursor.

[Vevet Demo azZrVwJ](https://codepen.io/anton-bobrov/embed/azZrVwJ?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Cursor Behavior</h1>



  <div class="grid">

    <div class="item js-snap">Snap</div>

    <div class="item js-sticky">Sticky</div>

    <div class="item js-friction">Friction</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.grid {

  width: 100%;

  max-width: 30rem;

  display: grid;

  gap: 0.5rem;

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 1.5rem;

  border-radius: 0.5rem;

  font-size: 0.75rem;

  background: rgba(255, 255, 255, 0.1);

  color: #fff;



  transition: color 1s, background-color 1s;



  &:hover {

    background-color: rgba(255, 255, 255, 0.15);

  }

}



.dot-cursor {

  background: var(--gradient-peach);

  border-radius: 50%;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const dotCursor = new Cursor({

  lerp: 0.25,

  width: 10,

  height: 10

});



dotCursor.inner.classList.add("dot-cursor");



dotCursor.attachHover({

  element: document.querySelector(".js-snap"),

  width: 16,

  height: 16,

  snap: true

});



dotCursor.attachHover({

  element: document.querySelector(".js-sticky"),

  width: 16,

  height: 16,

  snap: true,

  sticky: true,

  stickyAmplitude: {

    x: 0,

    y: 20

  }

});



dotCursor.attachHover({

  element: document.querySelector(".js-friction"),

  width: 16,

  height: 16,

  sticky: true,

  stickyFriction: 0.5

});
```

[Open live demo ↗](https://vevetjs.com/pens/azZrVwJ)

## Sticky Ghost[​](#sticky-ghost "Direct link to Sticky Ghost")

Layered sticky targets on one emitter (`emitter`) with decreasing `stickyFriction` — a trailing “ghost” effect.

[Vevet Demo xbONPYr](https://codepen.io/anton-bobrov/embed/xbONPYr?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Sticky Ghost</h1>



  <div class="hover">

    <div class="hover-bg"></div>

    <div class="hover-bg"></div>

    <div class="hover-bg"></div>

    <div class="hover-bg"></div>

    <div class="hover-bg"></div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



h1 {

  margin: 0 0 0.5rem;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.dot-cursor {

  background: var(--gradient-peach);

  border-radius: 50%;

}



.hover {

  position: relative;

  width: 10rem;

  height: 10rem;

  border-radius: 1rem;

}



.hover-bg {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  border-radius: inherit;

  background: rgba(255, 255, 255, 0.05);

  border: 2px solid rgba(255, 255, 255, 0.1);

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const dotCursor = new Cursor({

  lerp: 0.25,

  width: 10,

  height: 10,

  lerp: 0.2

});



dotCursor.inner.classList.add("dot-cursor");



const bgs = document.querySelectorAll(".hover-bg");



bgs.forEach((bg, index) => {

  dotCursor.attachHover({

    element: bg,

    emitter: bg.parentElement,

    width: 16,

    height: 16,

    sticky: true,

    stickyFriction: 0.2 - index * 0.035

  });



});
```

[Open live demo ↗](https://vevetjs.com/pens/xbONPYr)

## Elastic Cursor[​](#elastic-cursor "Direct link to Elastic Cursor")

Shape the cursor with `transformModifier` from pointer `velocity` and `angle` — stretch along the movement direction.

[Vevet Demo yyJBxNK](https://codepen.io/anton-bobrov/embed/yyJBxNK?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Elastic Cursor</h1>

</div>
```

CSS

```
h1 {

  margin: 0;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.elastic-cursor {

  background: transparent;

  border: 2px solid rgba(255, 255, 255, 0.3);

  background-color: rgba(255, 255, 255, 0.1);

  border-radius: 50%;

}



.dot-cursor {

  background-color: #fff;

  border-radius: 50%;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const elasticCursor = new Cursor({

  lerp: 0.3,

  width: 80,

  height: 80,

  transformModifier: ({

    x,

    y,

    angle,

    velocity

  }) => {

    const scale = velocity * 0.2;

    const scaleX = 1 + scale;

    const scaleY = 1 - scale;



    return `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

  }

});



elasticCursor.inner.classList.add("elastic-cursor");



const dotCursor = new Cursor({

  lerp: 0.5,

  width: 10,

  height: 10,

  hideNative: true

});



dotCursor.inner.classList.add("dot-cursor");
```

[Open live demo ↗](https://vevetjs.com/pens/yyJBxNK)

## Airplane Cursor[​](#airplane-cursor "Direct link to Airplane Cursor")

Custom SVG cursor via `attachCursor()`, rotated and stretched with `transformModifier` as you move.

[Vevet Demo emzOLZP](https://codepen.io/anton-bobrov/embed/emzOLZP?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Airplane Cursor</h1>

</div>



<div class="airplane-cursor" id="airplane-cursor">

  <svg version="1.1" id="svg2" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" sodipodi:docname="plane.svg" inkscape:version="0.48.4 r9939" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="0 0 1200 1200" enable-background="new 0 0 1200 1200" xml:space="preserve">

    <path id="path16765" inkscape:connector-curvature="0" d="M321,1164h120l269.28-480.06H1020c0,0,180,0,180-83.94c0-84-180-84-180-84

	H710.28L441,36H321l149.28,480H255.06L120,395.94H0l96.06,204L0,804h120l135.06-120.06h215.22L321,1164z"></path>

  </svg>

</div>
```

CSS

```
h1 {

  margin: 0;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.v-cursor__inner {

  background: transparent;



  .airplane-cursor {

    display: block;

  }

}



.airplane-cursor {

  width: 100%;

  height: 100%;

  display: none;



  svg {

    position: absolute;

    top: 0;

    left: 0;

    width: 100%;

    height: 100%;

    fill: transparent;

    stroke: #fff;

    stroke-width: 10px;

  }

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const cursor = new Cursor({

  lerp: 0.25,

  width: 80,

  height: 80,

  transformModifier: ({

    x,

    y,

    angle,

    velocity

  }) => {

    const scale = velocity * 0.2;

    const scaleX = 1 + scale;

    const scaleY = 1 - scale;



    return `translate(${x}px, ${y}px) rotate(${angle}deg) scale(${scaleX}, ${scaleY})`;

  }

});



cursor.attachCursor({

  element: document.getElementById("airplane-cursor"),

  type: "airplane"

});



cursor.attachHover({

  element: document.body,

  type: "airplane"

});
```

[Open live demo ↗](https://vevetjs.com/pens/emzOLZP)

## Trailing Cursor[​](#trailing-cursor "Direct link to Trailing Cursor")

Several Cursor instances with different `lerp` values and `behavior: 'path'` for a trailing path effect.

[Vevet Demo RNazaLO](https://codepen.io/anton-bobrov/embed/RNazaLO?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Move Your Cursor</h1>

</div>
```

CSS

```
h1 {

  margin: 0;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.v-cursor__inner {

  background-color: transparent !important;

  border: 2px solid #fff;

  border-radius: 50%;

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const count = 15;



for (let index = 0; index < count; index += 1) {

  const lerp = 0.1;



  new Cursor({

    lerp: lerp - lerp * 0.7 / count * index,

    behavior: "path" // comment this line to see difference

  });

}
```

[Open live demo ↗](https://vevetjs.com/pens/RNazaLO)

## Cursor Path Visualization[​](#cursor-path-visualization "Direct link to Cursor Path Visualization")

`behavior: 'path'` exposes an SVG [`path`](https://vevetjs.com/docs/Cursor/accessors.md#path) you can append to the DOM to visualize smoothed pointer motion.

[Vevet Demo ByKgKrN](https://codepen.io/anton-bobrov/embed/ByKgKrN?default-tab=result)

HTML

```
<div class="fullpage-center">

  <h1>Move Your Cursor</h1>



  <svg></svg>

</div>
```

CSS

```
h1 {

  margin: 0;

  font-size: 1.5rem;

  font-weight: 600;

  text-align: center;

}



.v-cursor__inner {

  background-color: transparent !important;

  border: 2px solid #fff;

  border-radius: 50%;

}



.v-cursor__inner.fill {

  background-color: #fff !important;

}



svg {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  pointer-events: none;

}



svg path {

  fill: transparent;

  stroke-width: 4px;

  stroke: rgba(255, 255, 255, 0.5);

}
```

JavaScript

```
import {

  Cursor

} from "vevet";



const pathCursor = new Cursor({

  lerp: 0.05,

  behavior: "path" // comment this line to see difference

});



const svg = document.querySelector("svg");

svg.append(pathCursor.path);



const instantCursor = new Cursor({

  lerp: 1,

  width: 20,

  height: 20

});



instantCursor.inner.classList.add("fill");
```

[Open live demo ↗](https://vevetjs.com/pens/ByKgKrN)
