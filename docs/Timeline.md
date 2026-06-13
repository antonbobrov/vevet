# Timeline

A simple timeline class for managing animations with easing and precise progress control.

It provides methods for playing, reversing, pausing, and resetting the timeline.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo jEENKjV](https://codepen.io/anton-bobrov/embed/jEENKjV?default-tab=result)

HTML

```
<div class="line">

  <div class="thumb" id="thumb"></div>

</div>



<div class="nav">

  <button type="button" id="play" class="button">Play</button>

  <button type="button" id="pause" class="button">Pause</button>

  <button type="button" id="reverse" class="button">Reverse</button>

  <button type="button" id="reset" class="button">Reset</button>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0 30px;



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

  font-size: 3vw;

}



.nav {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;

}



.line {

  position: relative;

  width: 80%;

  height: 10px;

  border-radius: 5px;

  background: rgba(255, 255, 255, 0.1);

}



.thumb {

  position: absolute;

  top: -10px;

  left: 0;

  width: 10px;

  height: 30px;

  border-radius: 5px;

  background: linear-gradient(135deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

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

  Timeline,

  EaseOutBack

} from "vevet";



const thumb = document.getElementById("thumb");



const tm = new Timeline({

    duration: 2000,

    easing: EaseOutBack

  },



  {

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

## Initialization[​](#initialization "Direct link to Initialization")

caution

* `Timeline` does not work with DOM elements or styles — **it performs time and easing calculations only.**
* Animation is **disabled by default.** You must explicitly call `.play()` to start it.
* `Timeline` does **not run automatically** on creation, even if callbacks are provided.
* The timeline operates in the range **0 → 1**, regardless of duration.

```
import { Timeline } from 'vevet';



const tm = new Timeline(

  { duration: 350, easing: [0.25, 0.1, 0.25, 1] },

  {

    onUpdate: ({ eased }) => {

      // your animation here

    },

  },

);



tm.play();



tm.pause();
```

Destroy the instance:

```
tm.destroy();
```
