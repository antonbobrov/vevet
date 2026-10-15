# Demos

<!-- -->

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

Overview of the main drag modes in one place: free movement, horizontal, vertical, and rotation.

Each instance uses pointer-space [`diff`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords) and resets the transform on release — no [`movement`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords) persistence.

Key props: `grabCursor: true`, `axis: "x"` / `axis: "y"`, `relative: true` (rotation).

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

## Multidirectional Swipe[​](#multidirectional-swipe "Direct link to Multidirectional Swipe")

Free drag on both axes without an axis lock.

Applies `diff.x` and `diff.y` in `onMove`; the element snaps back on `onEnd`.

[Vevet Demo xbVmaaB](https://codepen.io/anton-bobrov/embed/xbVmaaB?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="all" class="item">

    <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

  </div>

</div>
```

CSS

```
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
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

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
```

[Open live demo ↗](https://vevetjs.com/pens/xbVmaaB)

## Two-fingers Pan[​](#two-fingers-pan "Direct link to Two-fingers Pan")

Two-finger pan on touch devices. Movement follows the center between both pointers.

Key prop: [`pointers: 2`](https://vevetjs.com/docs/Swipe/props.md#props.pointers). Uses `diff` and resets on release — same pattern as Multidirectional Swipe.

[Vevet Demo PwWGrRb](https://codepen.io/anton-bobrov/embed/PwWGrRb?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="all" class="item">

    <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

  </div>

</div>
```

CSS

```
.item {

  width: 4rem;

  height: 4rem;



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
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

  pointers: 2,

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
```

[Open live demo ↗](https://vevetjs.com/pens/PwWGrRb)

## Right-Click Drag[​](#right-click-drag "Direct link to Right-Click Drag")

Drag starts only with the right mouse button.

Key prop: [`buttons: [2]`](https://vevetjs.com/docs/Swipe/props.md#props.buttons).

[Vevet Demo MYyLWLb](https://codepen.io/anton-bobrov/embed/MYyLWLb?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="all" class="item">

    <img src="https://www.svgrepo.com/show/119214/right-click-of-the-mouse.svg" alt="">

  </div>

</div>
```

CSS

```
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

  background: var(--gradient-brand-radial, #000);

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

  buttons: [2],

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
```

[Open live demo ↗](https://vevetjs.com/pens/MYyLWLb)

## Horizontal Swipe[​](#horizontal-swipe "Direct link to Horizontal Swipe")

Horizontal drag locked to the x-axis.

Key prop: [`axis: "x"`](https://vevetjs.com/docs/Swipe/props.md#props.axis). Uses `diff.x` and resets on release.

[Vevet Demo ZYWVMqR](https://codepen.io/anton-bobrov/embed/ZYWVMqR?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="horizontal" class="item">

    <img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt="">

  </div>

</div>
```

CSS

```
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



#horizontal {

  background: var(--gradient-brand-90, #000);

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("horizontal"),

  axis: "x",

  grabCursor: true,

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
```

[Open live demo ↗](https://vevetjs.com/pens/ZYWVMqR)

## Vertical Swipe[​](#vertical-swipe "Direct link to Vertical Swipe")

Vertical drag locked to the y-axis.

Key prop: [`axis: "y"`](https://vevetjs.com/docs/Swipe/props.md#props.axis). Uses `diff.y` and resets on release.

[Vevet Demo vEGvzvO](https://codepen.io/anton-bobrov/embed/vEGvzvO?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="vertical" class="item">

    <img src="https://www.svgrepo.com/show/379997/drag-vertical.svg" alt="">

  </div>

</div>
```

CSS

```
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



#vertical {

  background: var(--gradient-brand-0, #000);

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("vertical"),

  axis: "y",

  grabCursor: true,

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
```

[Open live demo ↗](https://vevetjs.com/pens/vEGvzvO)

## Rotation Swipe[​](#rotation-swipe "Direct link to Rotation Swipe")

Angular drag around the element center.

Key props: [`relative: true`](https://vevetjs.com/docs/Swipe/props.md#props.relative), `diff.angle`. Rotation resets on release.

[Vevet Demo qEZLMLz](https://codepen.io/anton-bobrov/embed/qEZLMLz?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="rotation" class="item">

    <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">

  </div>

</div>
```

CSS

```
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



#rotation {

  background: var(--gradient-brand-radial, #000);

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



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

[Open live demo ↗](https://vevetjs.com/pens/qEZLMLz)

## Slide Right[​](#slide-right "Direct link to Slide Right")

Horizontal slider thumb inside a track. Position persists across gestures via [`movement`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords).

Key props: [`thumb`](https://vevetjs.com/docs/Swipe/props.md#props.thumb), [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds), [`inertia: true`](https://vevetjs.com/docs/Swipe/props.md#props.inertia), `grabCursor: true`.

Bounds are recalculated on resize with [`calculateBounds()`](https://vevetjs.com/docs/Swipe/methods.md#calculatebounds) and [`releaseBounce()`](https://vevetjs.com/docs/Swipe/methods.md#releasebounce).

[Vevet Demo NPdRrLy](https://codepen.io/anton-bobrov/embed/NPdRrLy?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="container" class="container">

    <div id="thumb" class="thumb"><img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt=""></div>

  </div>

</div>
```

CSS

```
.container {

  width: 80%;

  height: 3rem;



  border-radius: 0.5rem;

  background: rgba(255, 255, 255, 0.1);

}



.thumb {

  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: inherit;

  background: var(--gradient-brand-90);



  img {

    width: 1.5rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  onResize

} from "vevet";



const container = document.getElementById("container");

const thumb = document.getElementById("thumb");



const swipe = new Swipe({

  container,

  thumb,

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    x: [0, container.clientWidth - thumb.clientWidth]

  }),



  onMove: ({

    movement

  }, {

    container

  }) => {

    thumb.style.transform = `translate(${movement.x}px, 0)`;

  }

});



onResize({

  element: [container],

  callback: () => {

    swipe.calculateBounds();

    swipe.releaseBounce(0);

  },

  resizeDebounce: 100

});
```

[Open live demo ↗](https://vevetjs.com/pens/NPdRrLy)

## Slide Down[​](#slide-down "Direct link to Slide Down")

Vertical slider variant — same pattern as Slide Right, but with y-axis [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds).

[Vevet Demo MYJjRwL](https://codepen.io/anton-bobrov/embed/MYJjRwL?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="container" class="container">

    <div id="thumb" class="thumb"><img src="https://www.svgrepo.com/show/379997/drag-vertical.svg" alt=""></div>

  </div>

</div>
```

CSS

```
.container {

  height: 300px;

  width: 3rem;



  border-radius: 0.5rem;

  background: rgba(255, 255, 255, 0.1);

}



.thumb {

  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: inherit;

  background: var(--gradient-brand-0);



  img {

    width: 1.5rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



const container = document.getElementById("container");

const thumb = document.getElementById("thumb");



const swipe = new Swipe({

  container,

  thumb,

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    y: [0, container.clientHeight - thumb.clientHeight]

  }),



  onMove: ({

    movement

  }, {

    container

  }) => {

    thumb.style.transform = `translate(0, ${movement.y}px)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/MYJjRwL)

## Lever rotation[​](#lever-rotation "Direct link to Lever rotation")

Radial lever control: drag the handle (`thumb`) to rotate the dial. Angle is measured relative to the container center.

Key props: [`thumb`](https://vevetjs.com/docs/Swipe/props.md#props.thumb), [`relative: true`](https://vevetjs.com/docs/Swipe/props.md#props.relative), [`inertia: true`](https://vevetjs.com/docs/Swipe/props.md#props.inertia). Rotation accumulates via `step.angle`.

[Vevet Demo bNpOmGo](https://codepen.io/anton-bobrov/embed/bNpOmGo?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="rotation" class="item">

    <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">



    <div id="thumb" class="thumb"></div>

  </div>

</div>
```

CSS

```
.item {

  position: relative;

  width: 6rem;

  height: 6rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 50%;

  background: var(--gradient-sunset, #000);



  img {

    width: 2rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}



.thumb {

  position: absolute;

  top: -0.6rem;

  left: calc(50% - 0.6rem);

  width: 1.2rem;

  height: 1.2rem;

  background: var(--gradient-brand-0, #000);

  border-radius: 50%;

  cursor: grab;

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



let angle = 0;



new Swipe({

  container: document.getElementById("rotation"),

  thumb: document.getElementById("thumb"),

  inertia: true,

  relative: true,

  onMove: ({

    step

  }, {

    container

  }) => {

    angle += step.angle;



    container.style.transform = `rotate(${angle}deg)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/bNpOmGo)

## Detect Swipe Direction[​](#detect-swipe-direction "Direct link to Detect Swipe Direction")

Directional callbacks fire after the gesture ends once [`directionThreshold`](https://vevetjs.com/docs/Swipe/props.md#props.directionThreshold) is met.

Callbacks: `onStart`, `onToLeft`, `onToRight`, `onToTop`, `onToBottom`.

[Vevet Demo ZYWVMwj](https://codepen.io/anton-bobrov/embed/ZYWVMwj?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="container" class="container">

    Swipe Me

  </div>

</div>
```

CSS

```
.container {

  width: 7rem;

  height: 7rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: var(--gradient-brand-135, #000);



  font-size: 0.75rem;

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("container"),

  onStart: (data, {

    container

  }) => {

    container.innerHTML = "start";

  },

  onToLeft: (data, {

    container

  }) => {

    container.innerHTML = "to left";

  },

  onToRight: (data, {

    container

  }) => {

    container.innerHTML = "to right";

  },

  onToTop: (data, {

    container

  }) => {

    container.innerHTML = "to top";

  },

  onToBottom: (data, {

    container

  }) => {

    container.innerHTML = "to bottom";

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/ZYWVMwj)

## Drag Inertia[​](#drag-inertia "Direct link to Drag Inertia")

Release inertia without built-in bounds — limits are applied manually in `onMove`.

Key props: [`inertia: true`](https://vevetjs.com/docs/Swipe/props.md#props.inertia), `grabCursor: true`. Position is accumulated from `step` and clamped with `clamp()`.

[Vevet Demo azNPaxx](https://codepen.io/anton-bobrov/embed/azNPaxx?default-tab=result)

HTML

```
<div class="fullpage-center" id="page">

  <div id="container" class="container">

    <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

  </div>

</div>
```

CSS

```
.fullpage-center {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  overflow: hidden;

}



.container {

  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  background: var(--gradient-brand-135, #000);

  border-radius: 0.5rem;



  img {

    width: 1.25rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  clamp

} from "vevet";



const page = document.getElementById("page");



let x = 0;

let y = 0;



new Swipe({

  container: document.getElementById("container"),

  inertia: true,

  grabCursor: true,

  onMove: ({

    step

  }, {

    container

  }) => {

    const pageWidth = page.clientWidth;

    const pageHeight = page.clientHeight;



    x = clamp(x + step.x, -pageWidth / 2, pageWidth / 2);

    y = clamp(y + step.y, -pageHeight / 2, pageHeight / 2);



    container.style.transform = `translate(${x}px, ${y}px)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/azNPaxx)

## Drag Inertia Bounce[​](#drag-inertia-bounce "Direct link to Drag Inertia Bounce")

Movement-space drag inside a wrapper with automatic bounds and rubber-band overflow.

Key props: [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds), [`overflow`](https://vevetjs.com/docs/Swipe/props.md#props.overflow), [`inertia: true`](https://vevetjs.com/docs/Swipe/props.md#props.inertia), `movement` for transforms.

[Vevet Demo zxqbwVg](https://codepen.io/anton-bobrov/embed/zxqbwVg?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="wrapper" class="wrapper">

    <div id="container" class="container">

      <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

    </div>

  </div>

</div>
```

CSS

```
.wrapper {

  position: relative;

  width: 10rem;

  height: 10rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  background: rgba(255, 255, 255, 0.1);

  border-radius: 0.25rem;

}



.container {

  width: 2rem;

  height: 2rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  background: var(--gradient-brand-135, #000);

  border-radius: 0.25rem;



  img {

    width: 1rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  vevet,

  clamp,

  EaseOutBack

} from "vevet";



const wrapper = document.getElementById("wrapper");

const container = document.getElementById("container");



new Swipe({

  container: document.getElementById("container"),

  grabCursor: true,

  inertia: true,

  overflow: () => 20,

  bounds: () => ({

    x: [

      (wrapper.clientWidth - container.clientWidth) * -0.5,

      (wrapper.clientWidth - container.clientWidth) * 0.5

    ],



    y: [

      (wrapper.clientHeight - container.clientHeight) * -0.5,

      (wrapper.clientHeight - container.clientHeight) * 0.5

    ]

  }),



  onMove: ({

    movement

  }, {

    container

  }) => {

    container.style.transform = `translate(${movement.x}px, ${movement.y}px)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/zxqbwVg)

## Bouncing Ball[​](#bouncing-ball "Direct link to Bouncing Ball")

Custom physics on top of release inertia: the ball reverses direction when it hits the viewport edges.

Uses `hasInertia` in `onMove` to flip direction only during the inertia phase.

[Vevet Demo pvyqOMV](https://codepen.io/anton-bobrov/embed/pvyqOMV?default-tab=result)

HTML

```
<div class="fullpage-center" id="page">

  <div id="ball" class="ball"></div>

</div>
```

CSS

```
.fullpage-center {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  overflow: hidden;

}



.ball {

  width: 3rem;

  height: 3rem;



  border-radius: 50%;

  background: var(--gradient-sunset, #000);

}
```

JavaScript

```
import {

  Swipe,

  clamp

} from "vevet";



const page = document.getElementById("page");



let x = 0;

let y = 0;

let xDir = 1;

let yDir = 1;



new Swipe({

  container: document.getElementById("ball"),

  inertia: true,

  grabCursor: true,

  onStart: () => {

    xDir = 1;

    yDir = 1;

  },

  onMove: ({

    step

  }, {

    hasInertia,

    container

  }) => {

    const pageWidth = page.clientWidth;

    const pageHeight = page.clientHeight;



    if (hasInertia) {

      if (x >= pageWidth / 2 || x <= -pageWidth / 2) {

        xDir *= -1;

      }



      if (y >= pageHeight / 2 || y <= -pageHeight / 2) {

        yDir *= -1;

      }

    }



    x = clamp(x + step.x * xDir, -pageWidth / 2, pageWidth / 2);

    y = clamp(y + step.y * yDir, -pageHeight / 2, pageHeight / 2);



    container.style.transform = `translate(${x}px, ${y}px)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/pvyqOMV)

## Vertical Scrolling[​](#vertical-scrolling "Direct link to Vertical Scrolling")

Simulated vertical scroll with CSS `translateY` instead of native overflow.

Key props: [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds) on the y-axis, [`inertia: true`](https://vevetjs.com/docs/Swipe/props.md#props.inertia), `movement.y`, `grabCursor: true`.

[Vevet Demo KwagYqE](https://codepen.io/anton-bobrov/embed/KwagYqE?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="container" class="container">

    <div id="grid" class="grid">

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

      <p>Lorem ipsum dolor sit amet consectetur adipiscing elit</p>

    </div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



.container {

  width: 100%;

  height: calc(100svh - 2rem);



  border-radius: 0.5rem;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.1);

}



.grid {

  display: grid;

  gap: 1rem;

  padding: 1rem;

}



p {

  margin: 0;

  padding: 1rem;



  border-radius: 0.5rem;

  background: rgba(255, 255, 255, 0.1);



  font-size: 0.75rem;

}



.thumb {

  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: inherit;

  background: var(--gradient-brand-0);



  img {

    width: 1.5rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  vevet,

  clamp,

  onResize

} from "vevet";



const container = document.getElementById("container");

const grid = document.getElementById("grid");



const instance = new Swipe({

  container,

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    y: [0, -(grid.clientHeight - container.clientHeight)]

  }),

  onMove: ({

    movement

  }) => {

    grid.style.transform = `translateY(${movement.y}px)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/KwagYqE)

## Fullpage Bounds[​](#fullpage-bounds "Direct link to Fullpage Bounds")

Drag an element anywhere on the page, constrained to the viewport center.

Key props: [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds) relative to the page size, [`inertia: true`](https://vevetjs.com/docs/Swipe/props.md#props.inertia), `movement`. Recalculates bounds on resize.

[Vevet Demo OPWRGBo](https://codepen.io/anton-bobrov/embed/OPWRGBo?default-tab=result)

HTML

```
<div class="fullpage-center" id="page">

  <div id="container" class="container">

    <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

  </div>

</div>
```

CSS

```
.fullpage-center {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  overflow: hidden;

}



.container {

  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  background: var(--gradient-brand-135, #000);

  border-radius: 0.5rem;



  img {

    width: 1.25rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  onResize

} from "vevet";



const page = document.getElementById("page");



const swipe = new Swipe({

  container: document.getElementById("container"),

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    x: [

      (page.clientWidth - container.clientWidth) / -2,

      (page.clientWidth - container.clientWidth) / 2

    ],



    y: [

      (page.clientHeight - container.clientHeight) / -2,

      (page.clientHeight - container.clientHeight) / 2

    ]

  }),



  onMove: ({

    movement

  }, {

    container

  }) => {

    container.style.transform = `translate(${movement.x}px, ${movement.y}px)`;

  }

});



onResize({

  elements: [page],

  callback: () => {

    swipe.calculateBounds();

    swipe.releaseBounce(0);

  },

  resizeDebounce: 100

});
```

[Open live demo ↗](https://vevetjs.com/pens/OPWRGBo)

## Inertia Distance Modifier[​](#inertia-distance-modifier "Direct link to Inertia Distance Modifier")

Caps how far release inertia can travel.

Key prop: [`inertiaDistanceModifier`](https://vevetjs.com/docs/Swipe/props.md#props.inertiaDistanceModifier) — clamps x/y distance to ±100 px.

[Vevet Demo zxNKXQK](https://codepen.io/anton-bobrov/embed/zxNKXQK?default-tab=result)

HTML

```
<div class="fullpage-center" id="page">

  <div id="container" class="container">

    <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

  </div>

</div>
```

CSS

```
.fullpage-center {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  overflow: hidden;

}



.container {

  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  background: var(--gradient-brand-135, #000);

  border-radius: 0.5rem;



  img {

    width: 1.25rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  onResize,

  clamp

} from "vevet";



const page = document.getElementById("page");



const swipe = new Swipe({

  container: document.getElementById("container"),

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    x: [

      (page.clientWidth - container.clientWidth) / -2,

      (page.clientWidth - container.clientWidth) / 2

    ],



    y: [

      (page.clientHeight - container.clientHeight) / -2,

      (page.clientHeight - container.clientHeight) / 2

    ]

  }),



  inertiaDistanceModifier: distance => {

    const limit = 100;



    return {

      x: clamp(distance.x, -limit, limit),

      y: clamp(distance.y, -limit, limit),

      angle: 0

    };



  },

  onMove: ({

    movement

  }, {

    container

  }) => {

    container.style.transform = `translate(${movement.x}px, ${movement.y}px)`;

  }

});



onResize({

  elements: [page],

  callback: () => {

    swipe.calculateBounds();

    swipe.releaseBounce(0);

  },

  resizeDebounce: 100

});
```

[Open live demo ↗](https://vevetjs.com/pens/zxNKXQK)

## Inertia Settings[​](#inertia-settings "Direct link to Inertia Settings")

Live controls for tuning release inertia feel.

Adjust [`inertiaRatio`](https://vevetjs.com/docs/Swipe/props.md#props.inertiaRatio), [`inertiaDecay`](https://vevetjs.com/docs/Swipe/props.md#props.inertiaDecay), and [`inertiaBounceEase`](https://vevetjs.com/docs/Swipe/props.md#props.inertiaBounceEase) via `updateProps()`.

[Vevet Demo pvREmov](https://codepen.io/anton-bobrov/embed/pvREmov?default-tab=result)

HTML

```
<div class="fullpage-center" id="page">

  <div class="settings">

    <div>

      ratio <input id="ratio" type="range" min="0" max="1" step="0.001" value="1">

    </div>



    <div>

      decay <input id="decay" type="range" min="0.001" max="1" step="0.001" value="0.05">

    </div>



    <div>

      bounceEase <input id="bounceEase" type="range" min="0.001" max="1" step="0.001" value="0.3">

    </div>

  </div>



  <div id="container" class="container">

    <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

  </div>

</div>
```

CSS

```
.fullpage-center {

  position: relative;

  padding: 1rem;

}



.settings {

  align-self: start;

}



.container {

  position: absolute;

  top: calc(50% - 1.5rem);

  left: calc(50% - 1.5rem);



  width: 3rem;

  height: 3rem;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  background: var(--gradient-brand-135, #000);

  border-radius: 0.5rem;



  img {

    width: 1.25rem;

    height: auto;

    filter: invert(100%);

    background: transparent;

  }

}
```

JavaScript

```
import {

  Swipe,

  onResize,

  clamp

} from "vevet";



const page = document.getElementById("page");



const swipe = new Swipe({

  container: document.getElementById("container"),

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    x: [

      (page.clientWidth - container.clientWidth) / -2,

      (page.clientWidth - container.clientWidth) / 2

    ],



    y: [

      (page.clientHeight - container.clientHeight) / -2,

      (page.clientHeight - container.clientHeight) / 2

    ]

  }),



  onMove: ({

    movement

  }, {

    container

  }) => {

    container.style.transform = `translate(${movement.x}px, ${movement.y}px)`;

  }

});



onResize({

  element: [page],

  callback: () => {

    swipe.calculateBounds();

    swipe.releaseBounce(0);

  },

  resizeDebounce: 100

});



document.getElementById('ratio').addEventListener('input', evt => {

  swipe.updateProps({

    inertiaRatio: parseFloat(evt.currentTarget.value)

  });



});



document.getElementById('decay').addEventListener('input', evt => {

  swipe.updateProps({

    inertiaDecay: parseFloat(evt.currentTarget.value)

  });



});



document.getElementById('bounceEase').addEventListener('input', evt => {

  swipe.updateProps({

    inertiaBounceEase: parseFloat(evt.currentTarget.value)

  });



});
```

[Open live demo ↗](https://vevetjs.com/pens/pvREmov)

## Image Viewer[​](#image-viewer "Direct link to Image Viewer")

Image viewer with pan, zoom, and pinch support. Combines Swipe with [`Pointers`](https://vevetjs.com/docs/Pointers/.md).

* Pan: [`movement`](https://vevetjs.com/docs/Swipe/interfaces.md#iswipecoords) + [`bounds`](https://vevetjs.com/docs/Swipe/props.md#props.bounds) that depend on [`scale`](https://vevetjs.com/docs/Swipe/accessors.md#scale)
* Zoom: mouse wheel, double-click, and two-finger pinch via [`setScale()`](https://vevetjs.com/docs/Swipe/methods.md#setscale)
* [`relative: true`](https://vevetjs.com/docs/Swipe/props.md#props.relative) for zoom-to-point

[Vevet Demo rajMgoY](https://codepen.io/anton-bobrov/embed/rajMgoY?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container" id="container">

    <img class="image" id="image" src="https://fastly.picsum.photos/id/314/1920/1080.jpg?hmac=QAv7htpuXdwRq9YJDaEo_1mEiiAkEJeJFoBlSp-l7VY" alt="">

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



.container {

  position: relative;

  z-index: 1;

  width: 100%;

  height: min(70svh, 400px);

  overflow: hidden;

  background: rgba(255, 255, 255, 0.1);

}



.image {

  display: block;

  max-width: 100%;

  max-height: 100%;

  width: auto;

  height: auto;



  transform-origin: top left;

}
```

JavaScript

```
import {

  addEventListener,

  clamp,

  onResize,

  Pointers,

  Swipe

} from "vevet";



const maxScale = 5;

const minScale = 1;

const stepScale = 1;



const container = document.getElementById("container");

const image = document.getElementById("image");



function getImageSize() {

  return {

    width: image.clientWidth,

    height: image.clientHeight

  };

}



function getContainerSize() {

  return {

    width: container.clientWidth,

    height: container.clientHeight

  };

}



const swipe = new Swipe({

  container,

  pointers: 1,

  relative: true,

  inertia: true,

  grabCursor: true,

  buttons: [0],

  inertiaRatio: 1,

  bounds: ({

    scale

  }) => {

    const containerSize = getContainerSize();

    const imageSize = getImageSize();



    return {

      x: [0, containerSize.width - imageSize.width * scale],

      y: [0, containerSize.height - imageSize.height * scale]

    };



  },

  onMove: ({

    movement,

    scale

  }) => {

    image.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  }

});



addEventListener(

  image,

  "wheel",

  evt => {

    evt.preventDefault();



    if (swipe.isSwiping) {

      return;

    }



    swipe.cancelInertia();



    swipe.setScale(

      clamp(swipe.scale - evt.deltaY * 0.001, minScale, maxScale),

      evt);



  }, {

    passive: false

  });



addEventListener(image, "dblclick", evt => {

  if (swipe.scale >= maxScale) {

    swipe.setScale(minScale, evt);

  } else {

    swipe.setScale(clamp(swipe.scale + stepScale, minScale, maxScale), evt);

  }

});



onResize({

  element: [container, image],



  callback: () => {

    if (swipe.scale === minScale) {

      const containerSize = getContainerSize();

      const imageSize = getImageSize();



      swipe.setMovement({

        x: (containerSize.width - imageSize.width) / 2,

        y: (containerSize.height - imageSize.height) / 2

      });



    }



    swipe.calculateBounds();

    swipe.releaseBounce(0);

  }

});



new Pointers({

  container,

  minPointers: 2,

  maxPointers: 2,

  relative: false,

  onMove: ({

    prevScale,

    scale,

    startCenter

  }) => {

    if (prevScale === scale) {

      return;

    }



    swipe.setScale(

      clamp(swipe.scale * (scale / prevScale), minScale, maxScale),

      startCenter);



  },

  onStart: () => {

    swipe.updateProps({

      enabled: false,

      inertia: false

    });

  },

  onEnd: () => {

    setTimeout(() => {

      swipe.updateProps({

        enabled: true,

        inertia: true

      });

    });

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/rajMgoY)

## Image Viewer Right Click[​](#image-viewer-right-click "Direct link to Image Viewer Right Click")

Same image viewer, but pan is triggered differently per input type:

* Mouse: right button (`buttons: [2]`)
* Touch: two fingers (`pointers: 2`)

[Vevet Demo OPWReJy](https://codepen.io/anton-bobrov/embed/OPWReJy?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container" id="container">

    <img class="image" id="image" src="https://fastly.picsum.photos/id/314/1920/1080.jpg?hmac=QAv7htpuXdwRq9YJDaEo_1mEiiAkEJeJFoBlSp-l7VY" alt="">

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



.container {

  position: relative;

  z-index: 1;

  width: 100%;

  height: min(70svh, 400px);

  overflow: hidden;

  background: rgba(255, 255, 255, 0.1);

}



.image {

  display: block;

  max-width: 100%;

  max-height: 100%;

  width: auto;

  height: auto;



  transform-origin: top left;

}
```

JavaScript

```
import {

  addEventListener,

  clamp,

  onResize,

  Pointers,

  Swipe

} from "vevet";



const maxScale = 5;

const minScale = 1;

const stepScale = 1;



const container = document.getElementById("container");

const image = document.getElementById("image");



function getImageSize() {

  return {

    width: image.clientWidth,

    height: image.clientHeight

  };

}



function getContainerSize() {

  return {

    width: container.clientWidth,

    height: container.clientHeight

  };

}



const swipe = new Swipe({

  container,

  pointers: type => type === "mouse" ? 1 : 2,

  relative: true,

  inertia: true,

  grabCursor: true,

  buttons: type => type === "touch" ? [0] : [2],

  inertiaRatio: 0.1,

  bounds: ({

    scale

  }) => {

    const containerSize = getContainerSize();

    const imageSize = getImageSize();



    return {

      x: [0, containerSize.width - imageSize.width * scale],

      y: [0, containerSize.height - imageSize.height * scale]

    };



  },

  onMove: ({

    movement,

    scale

  }) => {

    image.style.transform = `translate(${movement.x}px, ${movement.y}px) scale(${scale})`;

  }

});



addEventListener(

  image,

  "wheel",

  evt => {

    evt.preventDefault();



    if (swipe.isSwiping) {

      return;

    }



    swipe.cancelInertia();



    swipe.setScale(

      clamp(swipe.scale - evt.deltaY * 0.001, minScale, maxScale),

      evt);



  }, {

    passive: false

  });



addEventListener(image, "dblclick", evt => {

  if (swipe.scale >= maxScale) {

    swipe.setScale(minScale, evt);

  } else {

    swipe.setScale(clamp(swipe.scale + stepScale, minScale, maxScale), evt);

  }

});



onResize({

  element: [container, image],



  callback: () => {

    if (swipe.scale === minScale) {

      const containerSize = getContainerSize();

      const imageSize = getImageSize();



      swipe.setMovement({

        x: (containerSize.width - imageSize.width) / 2,

        y: (containerSize.height - imageSize.height) / 2

      });



    }



    swipe.calculateBounds();

    swipe.releaseBounce(0);

  }

});



new Pointers({

  container,

  minPointers: 2,

  maxPointers: 2,

  relative: false,

  onMove: ({

    prevScale,

    scale,

    startCenter

  }) => {

    if (prevScale === scale) {

      return;

    }



    swipe.setScale(

      clamp(swipe.scale * (scale / prevScale), minScale, maxScale),

      startCenter);



  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/OPWReJy)
