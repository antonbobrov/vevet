# Demos

<!-- -->

## Simple Marquee[​](#simple-marquee "Direct link to Simple Marquee")

A basic example with scrollable text in a custom marquee element.

[Vevet Demo zxxOadw](https://codepen.io/anton-bobrov/embed/zxxOadw?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">Breaking News🔥</div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee")

});
```

[Open live demo ↗](https://vevetjs.com/pens/zxxOadw)

## Vertical Marquee[​](#vertical-marquee "Direct link to Vertical Marquee")

Vertical scrolling with `direction: 'vertical'`.

[Vevet Demo JoGLENV](https://codepen.io/anton-bobrov/embed/JoGLENV?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">

    <span>Vertical Marquee</span>



    <span>Is so easy</span>

  </div>

</div>
```

CSS

```
#marquee {

  white-space: nowrap;

  min-height: 100svh;

}
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee"),

  direction: "vertical",

  gap: "5svh"

});
```

[Open live demo ↗](https://vevetjs.com/pens/JoGLENV)

## Pause on Hover[​](#pause-on-hover "Direct link to Pause on Hover")

Use `pauseOnHover: true` to pause the animation while the element is hovered.

[Vevet Demo pvgWjRM](https://codepen.io/anton-bobrov/embed/pvgWjRM?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">Pause on Hover&nbsp;</div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee"),

  pauseOnHover: true

});
```

[Open live demo ↗](https://vevetjs.com/pens/pvgWjRM)

## Reverse Marquee[​](#reverse-marquee "Direct link to Reverse Marquee")

The `speed` prop accepts negative values for reverse motion. Example: `speed: -1`.

[Vevet Demo EaaLbOp](https://codepen.io/anton-bobrov/embed/EaaLbOp?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">This is a reverse marquee🔥</div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee"),

  speed: -1

});
```

[Open live demo ↗](https://vevetjs.com/pens/EaaLbOp)

## Controllable Marquee[​](#controllable-marquee "Direct link to Controllable Marquee")

Programmatic control examples:

* `marquee.updateProps({ enabled: true, speed: 1.25 })` — toggle playback and change speed
* `marquee.render(10)` — scroll contents manually by 10px

[Vevet Demo QwyqjzW](https://codepen.io/anton-bobrov/embed/QwyqjzW?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">You can control me&nbsp;😃&nbsp;</div>

  <div class="double-grid">

    <button type="button" class="btn" id="play">Play</button>



    <button type="button" class="btn" id="pause">Pause</button>

  </div>



  <div class="double-grid">

    <button type="button" class="btn" id="faster">Faster</button>



    <button type="button" class="btn" id="slower">Slower</button>

  </div>



  <div class="double-grid">

    <button type="button" class="btn" id="render">Render</button>



    <button type="button" class="btn" id="render10">Render 10</button>

  </div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



const instance = new Marquee({

  container: document.getElementById("marquee")

});



const play = document.getElementById("play");

play.addEventListener("click", () => {

  instance.updateProps({

    enabled: true

  });

});



const pause = document.getElementById("pause");

pause.addEventListener("click", () => {

  instance.updateProps({

    enabled: false

  });

});



const faster = document.getElementById("faster");

faster.addEventListener("click", () => {

  instance.updateProps({

    speed: instance.props.speed * 1.5

  });

});



const slower = document.getElementById("slower");

slower.addEventListener("click", () => {

  instance.updateProps({

    speed: instance.props.speed / 1.5

  });

});



const render = document.getElementById("render");

render.addEventListener("click", () => {

  instance.render(1);

});



const render10 = document.getElementById("render10");

render10.addEventListener("click", () => {

  instance.render(10);

});
```

[Open live demo ↗](https://vevetjs.com/pens/QwyqjzW)

## With CSS units[​](#with-css-units "Direct link to With CSS units")

Both `gap` and `speed` accept CSS length strings such as `px`, `rem`, `vw`, `vh`, and `svh`.

Examples:

* `gap: "10vw"`
* `speed: "0.1vw"`

[Vevet Demo jEWGWqq](https://codepen.io/anton-bobrov/embed/jEWGWqq?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">The gap & speed are set with css units</div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee"),

  gap: "10vw",

  speed: "0.1vw"

});
```

[Open live demo ↗](https://vevetjs.com/pens/jEWGWqq)

## With speed adjustment[​](#with-speed-adjustment "Direct link to With speed adjustment")

Linear requestAnimationFrame animations can look faster on high-refresh displays (120 Hz and above).

Marquee compensates by adjusting speed based on the user's FPS. Enabled by default: `adjustSpeed: true`.

This keeps motion consistent across 60 Hz and 120+ Hz displays.

[Vevet Demo KwVXVNg](https://codepen.io/anton-bobrov/embed/KwVXVNg?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">The speed is adjustable depending on users's fps.&nbsp;</div>



  <div class="double-grid">

    <button type="button" class="btn" id="enable">Enable</button>



    <button type="button" class="btn" id="disable">Disable</button>

  </div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



const instance = new Marquee({

  container: document.getElementById("marquee")

});



const enable = document.getElementById("enable");

enable.addEventListener("click", () => {

  instance.updateProps({

    adjustSpeed: true

  });

});



const disable = document.getElementById("disable");

disable.addEventListener("click", () => {

  instance.updateProps({

    adjustSpeed: false

  });

});
```

[Open live demo ↗](https://vevetjs.com/pens/KwVXVNg)

## Adaptive Marquee[​](#adaptive-marquee "Direct link to Adaptive Marquee")

Like any other Vevet component, Marquee supports viewport- and device-based customization via responsive props.

In this demo, `speed` and `gap` change at responsive breakpoints.

[Vevet Demo bNEopqo](https://codepen.io/anton-bobrov/embed/bNEopqo?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">Resize the window to see changes</div>

</div>
```

JavaScript

```
import {

  Marquee,

  Responsive

} from "vevet";



const instance = new Marquee({

  container: document.getElementById("marquee"),

  gap: 20

});



new Responsive(instance, [{

    at: "@media (min-width: 350px)",

    props: {

      speed: 4

    }

  },



  {

    at: "@media (min-width: 768px)",

    props: {

      speed: -4

    }

  },



  {

    at: "@media (min-width: 1000px)",

    props: {

      gap: 100

    }

  }

]);
```

[Open live demo ↗](https://vevetjs.com/pens/bNEopqo)

## Draggable Marquee[​](#draggable-marquee "Direct link to Draggable Marquee")

A combination of [Swipe](https://vevetjs.com/docs/Swipe/.md) and [Marquee](https://vevetjs.com/docs/Marquee/.md).

Shows how to control a marquee with drag/swipe gestures.

[Vevet Demo XJJrYeR](https://codepen.io/anton-bobrov/embed/XJJrYeR?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">

    <img src="https://picsum.photos/id/199/300/200" width="300" height="200" alt="">

    <img src="https://picsum.photos/id/201/300/200" width="300" height="200" alt="">

    <img src="https://picsum.photos/id/203/300/200" width="300" height="200" alt="">

    <img src="https://picsum.photos/id/206/300/200" width="300" height="200" alt="">

  </div>

</div>
```

CSS

```
#marquee {

  img {

    width: 300px !important;

    min-width: 30vw;

    height: auto;

    border-radius: 1rem;

  }

}
```

JavaScript

```
import {

  Marquee,

  Swipe

} from "vevet";



const container = document.getElementById("marquee");



const marquee = new Marquee({

  container,

  speed: "0.25vw",

  gap: "2vw"

});



const swipe = new Swipe({

  container,

  grabCursor: true,

  inertia: true,

  onMove: ({

    step

  }) => marquee.render(-step.x),

  onStart: () => marquee.updateProps({

    enabled: false

  }),

  onEnd: ({

    diff

  }) => {

    marquee.updateProps({

      enabled: true,

      speed: diff.x > 0 ? "-0.25vw" : "0.25vw"

    });



  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/XJJrYeR)

## Scrollable Marquee[​](#scrollable-marquee "Direct link to Scrollable Marquee")

Combines [Marquee](https://vevetjs.com/docs/Marquee/.md) with [ScrollProgress](https://vevetjs.com/docs/ScrollProgress/.md).

The marquee position follows the section's scroll progress.

[Vevet Demo raaBKYy](https://codepen.io/anton-bobrov/embed/raaBKYy?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="gap">Scroll The Page</div>



  <div class="container">

    <div id="marquee">

      <img src="https://picsum.photos/id/199/300/200" width="300" height="200" alt="">

      <img src="https://picsum.photos/id/201/300/200" width="300" height="200" alt="">

      <img src="https://picsum.photos/id/203/300/200" width="300" height="200" alt="">

      <img src="https://picsum.photos/id/206/300/200" width="300" height="200" alt="">

    </div>

  </div>



  <div class="gap">Scroll The Page</div>

</div>
```

CSS

```
.gap {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  width: 100%;

  height: 50vh;

  text-align: center;

}



.container {

  margin: 10rem 0;

  width: 100%;

}



#marquee {

  img {

    width: 200px !important;

    min-width: 30vw;

    height: auto;

    display: block;

    border-radius: 1rem;

  }

}
```

JavaScript

```
import {

  Marquee,

  ScrollProgress

} from "vevet";



const marquee = new Marquee({

  container: document.getElementById("marquee"),

  gap: "2vw",

  enabled: false

});



let prevProgress = 0;



const scrollable = new ScrollProgress({

  section: document.querySelector(".container"),

  onUpdate: (data, {

    progress

  }) => {

    let step = progress.y - prevProgress;

    marquee.render(step * marquee.totalSize);



    prevProgress = progress.y;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/raaBKYy)

## No clones[​](#no-clones "Direct link to No clones")

By default, Marquee clones child nodes for seamless looping. Disable with `cloneNodes: false`.

[Vevet Demo wBMpPve](https://codepen.io/anton-bobrov/embed/wBMpPve?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="marquee">This text will not be cloned&nbsp;</div>

</div>
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee"),

  cloneNodes: false,

  centered: true,

  speed: "0.5vw"

});
```

[Open live demo ↗](https://vevetjs.com/pens/wBMpPve)
