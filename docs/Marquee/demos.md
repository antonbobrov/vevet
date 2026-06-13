# Demos

<!-- -->

## Simple Marquee[​](#simple-marquee "Direct link to Simple Marquee")

A simple Marquee with default settings:

[Vevet Demo zxxOadw](https://codepen.io/anton-bobrov/embed/zxxOadw?default-tab=result)

HTML

```
<div id="marquee">Breaking News🔥</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
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

## Vertical Marquee[​](#vertical-marquee "Direct link to Vertical Marquee")

Vevet Marquee supports vertical mode:

[Vevet Demo JoGLENV](https://codepen.io/anton-bobrov/embed/JoGLENV?default-tab=result)

HTML

```
<div id="marquee">

  <span>Vertical Marquee</span>



  <span>Is so easy</span>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}



#marquee {

  white-space: nowrap;

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

## Pause on Hover[​](#pause-on-hover "Direct link to Pause on Hover")

A simple Marquee that pauses when it is being hovered:

[Vevet Demo pvgWjRM](https://codepen.io/anton-bobrov/embed/pvgWjRM?default-tab=result)

HTML

```
<div id="marquee">Pause on Hover&nbsp;</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
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

## Reverse Marquee[​](#reverse-marquee "Direct link to Reverse Marquee")

A simple Marquee with reversed motion:

[Vevet Demo EaaLbOp](https://codepen.io/anton-bobrov/embed/EaaLbOp?default-tab=result)

HTML

```
<div id="marquee">This is a reverse marquee🔥</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
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

## Controllable Marquee[​](#controllable-marquee "Direct link to Controllable Marquee")

A marquee with controls:

[Vevet Demo QwyqjzW](https://codepen.io/anton-bobrov/embed/QwyqjzW?default-tab=result)

HTML

```
<div id="marquee">You can control me&nbsp;😃&nbsp;</div>

<div class="buttons">

  <button type="button" class="button" id="play">Play</button>



  <button type="button" class="button" id="pause">Pause</button>

</div>



<div class="buttons">

  <button type="button" class="button" id="faster">Faster</button>



  <button type="button" class="button" id="slower">Slower</button>

</div>



<div class="buttons">

  <button type="button" class="button" id="render">Render</button>



  <button type="button" class="button" id="render10">Render 10</button>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 2vw;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}



.buttons {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1vw;

  width: 400px;

}



.button {

  height: 48px;

  padding: 0 32px;

  border: 0;

  cursor: pointer;



  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);

  background-size: 200% auto;

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.1);

  border-radius: 50vw;



  font: inherit;

  font-size: 24px;

  color: currentColor;



  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);

}



.button:hover {

  background-position: right center;

}
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

## With CSS units[​](#with-css-units "Direct link to With CSS units")

Marquee `gap` and `speed` may accept a string with CSS units like `px`, `rem`, `vw`, `vh`, `svh`:

[Vevet Demo jEWGWqq](https://codepen.io/anton-bobrov/embed/jEWGWqq?default-tab=result)

HTML

```
<div id="marquee">The gap & speed are set with css units</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
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

## With speed adjustment[​](#with-speed-adjustment "Direct link to With speed adjustment")

Marquee can adjust speed depending on the user's FPS rate. This feature is enabled by default. It helps make the marquee move the same way across displays with different update frequencies.

[Vevet Demo KwVXVNg](https://codepen.io/anton-bobrov/embed/KwVXVNg?default-tab=result)

HTML

```
<div id="marquee">The speed is adjustable depending on users's fps.&nbsp;</div>



<div class="buttons">

  <button type="button" class="button" id="enable">Enable</button>



  <button type="button" class="button" id="disable">Disable</button>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 30px;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}



.buttons {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1vw;

  width: 300px;

}



.button {

  height: 48px;

  padding: 0 32px;

  border: 0;

  cursor: pointer;



  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);

  background-size: 200% auto;

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.1);

  border-radius: 50vw;



  font: inherit;

  font-size: 24px;

  color: currentColor;



  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);

}



.button:hover {

  background-position: right center;

}
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

## Responsive Marquee[​](#responsive-marquee "Direct link to Responsive Marquee")

Marquee, like any other component in Vevet, may be customized depending on the user's viewport sizes or their device type.

In this demo, marquee speed and gap are dynamic - they change depending on responsive breakpoints:

[Vevet Demo bNEopqo](https://codepen.io/anton-bobrov/embed/bNEopqo?default-tab=result)

HTML

```
<div id="marquee">Resize the window to see changes</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
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

    at: "@media (min-width: 768px)",

    props: {

      speed: 4

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

## Draggable Marquee[​](#draggable-marquee "Direct link to Draggable Marquee")

By default, Marquee does not support swiping. But this can be solved with [Swipe](https://vevetjs.com/docs/Swipe/.md):

[Vevet Demo XJJrYeR](https://codepen.io/anton-bobrov/embed/XJJrYeR?default-tab=result)

HTML

```
<div id="marquee">

  <img src="https://picsum.photos/id/199/300/200" width="300" height="200" alt="">

  <img src="https://picsum.photos/id/201/300/200" width="300" height="200" alt="">

  <img src="https://picsum.photos/id/203/300/200" width="300" height="200" alt="">

  <img src="https://picsum.photos/id/206/300/200" width="300" height="200" alt="">

</div>
```

CSS

```
body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



#marquee {

  img {

    width: 300px !important;

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

## Scrollable Marquee[​](#scrollable-marquee "Direct link to Scrollable Marquee")

This is a combination of [Marquee](https://vevetjs.com/docs/Marquee/.md) and [ScrollProgress](https://vevetjs.com/docs/ScrollProgress/.md). With ScrollProgress, you can handle scrolling logic for your marquee element:

[Vevet Demo raaBKYy](https://codepen.io/anton-bobrov/embed/raaBKYy?default-tab=result)

HTML

```
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
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}



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

  padding: 25vh 0;

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

    marquee.render(step * marquee.totalWidth);



    prevProgress = progress.y;

  }

});
```

## No clones[​](#no-clones "Direct link to No clones")

By default, Marquee clones its nodes. This may be disabled if needed:

[Vevet Demo wBMpPve](https://codepen.io/anton-bobrov/embed/wBMpPve?default-tab=result)

HTML

```
<div id="marquee">This text will not be cloned&nbsp;</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
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
