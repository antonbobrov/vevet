# Timeline

A simple timeline class for managing animations with easing and precise progress control.

It provides methods for playing, reversing, pausing, and resetting the timeline, plus lifecycle callbacks for each action.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo jEENKjV](https://codepen.io/anton-bobrov/embed/jEENKjV?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="line">

    <div class="thumb" id="thumb"></div>

  </div>



  <div class="nav">

    <button type="button" id="play" class="btn">Play</button>

    <button type="button" id="pause" class="btn">Pause</button>

    <button type="button" id="reverse" class="btn">Reverse</button>

    <button type="button" id="reset" class="btn">Reset</button>

  </div>

</div>
```

CSS

```
.nav {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 0.5rem;

  padding: 0 1rem;

}



.line {

  position: relative;

  width: 80%;

  height: 0.5rem;

  border-radius: 50vw;

  background: rgba(255, 255, 255, 0.1);

}



.thumb {

  position: absolute;

  top: -0.5rem;

  left: -0.125rem;

  width: 0.25rem;

  height: 1.5rem;

  border-radius: 50vw;

  background: var(--gradient-sunset, #000);

}
```

JavaScript

```
import {

  Timeline,

  EaseOutBack

} from "vevet";



const thumb = document.getElementById("thumb");



const tm = new Timeline({

  duration: 2000,

  easing: EaseOutBack,

  onUpdate: ({

    progress,

    eased

  }) => {

    thumb.style.left = `${eased * 100}%`;

  }

});



document.getElementById("play").addEventListener("click", () => tm.play());



document.getElementById("pause").addEventListener("click", () => tm.pause());



document.

getElementById("reverse").

addEventListener("click", () => tm.reverse());



document.getElementById("reset").addEventListener("click", () => tm.reset());
```

[Open live demo ↗](https://vevetjs.com/pens/jEENKjV)

## Initialization[​](#initialization "Direct link to Initialization")

caution

* `Timeline` does not work with DOM elements or styles — **it performs time and easing calculations only.**
* Animation is **disabled by default.** You must explicitly call `.play()` to start it.
* `Timeline` does **not run automatically** on creation, even if callbacks are provided.
* The timeline operates in the range **0 → 1**, regardless of duration.

```
import { Timeline } from 'vevet';



const tm = new Timeline({

  duration: 350,

  easing: [0.25, 0.1, 0.25, 1],

  onUpdate: ({ eased }) => {

    // your animation here

  },

});



tm.play();



tm.pause();
```

Destroy the instance:

```
tm.destroy();
```
