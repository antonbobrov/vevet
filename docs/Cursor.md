# Cursor

A customizable smooth cursor component with hover interactions.

The cursor is rendered independently from the native pointer and smoothly interpolates its position, size, and appearance based on user input and hovered elements.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo vEEBNWN](https://codepen.io/anton-bobrov/embed/vEEBNWN?default-tab=result)

HTML

```
<div class="container">

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
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0 10px;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

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

  background: linear-gradient(35deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

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



h1 {

  margin: 30px 0;

  font-size: 40px;

  font-weight: 600;

  text-align: center;

}



.container {

  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  min-height: 100vh;



  .grid {

    width: 600px;

    max-width: 100%;

  }

}



.grid {

  display: grid;

  gap: 10px;

  grid-template-columns: repeat(3, minmax(0, 1fr));

}



.item {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  padding: 30px;

  border-radius: 10px;

  font-size: 20px;

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

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Cursor/demos.md).

## Advantages[​](#advantages "Direct link to Advantages")

* Smooth interpolated movement
* Dynamic size
* Multiple cursor types
* Hover-based interactions
* Click recognition
* Optional native cursor hiding

## Initialization[​](#initialization "Direct link to Initialization")

Initialize the cursor:

note

* The cursor starts rendering automatically when `enabled: true`.
* The native cursor is **not hidden by default** — use `hideNative: true` if needed.
* Cursor visuals are created internally; styling should be applied via `.inner` or `.outer`.

```
import { Cursor } from 'vevet';



const cursor = new Cursor({

  container: window,

  width: 60,

  height: 60,

  lerp: 0.1,

  behavior: 'default',

});
```

Add hoverable elements:

```
cursor.attachHover({

  element: document.getElementById('hover-element'),

  width: 200,

  height: 100,

});
```

Without size change:

```
cursor.attachHover({

  element: document.getElementById('hover-element'),

  width: null,

  height: null,

});
```

Snap cursor:

```
cursor.attachHover({

  element: document.getElementById('hover-element'),

  snap: true,

});
```

Custom cursor type:

```
cursor.attachCursor({

  element: document.getElementById('cursor-type'),

  type: 'some_type', // unique type identifier

});



// and apply it to an element when hovered

cursor.attachHover({

  element: document.getElementById('hover-element'),

  type: 'some_type', // unique type identifier

});
```

Destroy the cursor:

```
cursor.destroy();
```

## Best Practices[​](#best-practices "Direct link to Best Practices")

* Use `Cursor` as a **visual layer**, not as a logic controller.
* Prefer styling via `.inner` and `.outer` instead of replacing DOM nodes.
* Keep `lerp` values low (0.05–0.2) for smooth motion.
* Use `attachHover()` only for interactive elements to avoid unnecessary listeners.
* Disable `autoStop` only when continuous rendering is required.
* **Do not use `Cursor` on mobile devices** — custom cursors negatively impact usability and performance on touch screens.
