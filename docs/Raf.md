# Raf

* Manages a requestAnimationFrame loop
* Supports custom FPS throttling (including dynamic `'auto'` mode)
* Provides playback control (play, pause)
* Measures real-time FPS and frame duration
* Includes tools for frame-rate–independent animations (damping)

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo EaaYREw](https://codepen.io/anton-bobrov/embed/EaaYREw?default-tab=result)

HTML

```
<div class="info">

  <p id="target"></p>

  <p id="fps"></p>

  <p id="factor"></p>

  <p id="time"></p>

  <p id="index"></p>

</div>



<div class="buttons">

  <button type="button" class="button" id="play">Play</button>



  <button type="button" class="button" id="pause">Pause</button>

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

  font-size: 30px;

}



.info {

  width: 300px;



  p {

    margin: 10px 0;

  }

}



.buttons {

  margin-top: 30px;

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

  Raf

} from "vevet";



const target = document.getElementById("target");

const fps = document.getElementById("fps");

const factor = document.getElementById("factor");

const time = document.getElementById("time");

const index = document.getElementById("index");



const raf = new Raf({

  enabled: true,

  onFrame: () => {

    target.innerHTML = `Target FPS: ${raf.props.fps}`;

    fps.innerHTML = `Current FPS: ${raf.fps}`;

    factor.innerHTML = `FPS Factor: ${raf.fpsFactor.toFixed(2)}`;

    time.innerHTML = `Time: ${raf.timestamp.toFixed(2)}`;

    index.innerHTML = `Frame Index: ${raf.index}`;

  }

});





document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Raf/demos.md).

## Initialization[​](#initialization "Direct link to Initialization")

Raf is easy to initialize:

```
import { Raf } from 'vevet';



const raf = new Raf({ enabled: true });



raf.on('frame', () => {

  console.log('your logic');

});
```

Disabled by default:

```
import { Raf } from 'vevet';



const raf = new Raf({

  enabled: false,

});
```

Predefined FPS or adaptive FPS:

```
import { Raf } from 'vevet';



const raf = new Raf({

  enabled: true,

  fps: 'auto', // or fps: [number]

});
```

Get real-time FPS:

```
import { Raf } from 'vevet';



const raf = new Raf(

  {

    enabled: true,

    fps: 30,

  },

  {

    onFrame: ({ fps }) => {

      console.log(fps);

    },

  },

);
```

Damping (used for consistent animations across 60Hz, 120Hz, and others, **see [demo](https://vevetjs.com/docs/Raf/demos.md#damping)**):

```
const ease = raf.lerpFactor(0.1);



// and use it in your lerp

lerp(from, to, ease);
```

Play:

```
raf.play();
```

Pause:

```
raf.pause();
```

Destroy the Raf instance:

```
raf.destroy();
```
