# Raf

`requestAnimationFrame` loop with FPS throttling and frame-rate–independent easing:

* Schedules a rAF chain while [`enabled`](https://vevetjs.com/docs/Raf/props.md#props.enabled) is true
* Throttles logical frames via [`fps`](https://vevetjs.com/docs/Raf/props.md#props.fps) (fixed cap or `'auto'`)
* Measures real-time [`fps`](https://vevetjs.com/docs/Raf/accessors.md#fps), [`duration`](https://vevetjs.com/docs/Raf/accessors.md#duration), and frame [`index`](https://vevetjs.com/docs/Raf/accessors.md#index)
* Provides [`lerpFactor`](https://vevetjs.com/docs/Raf/methods.md#lerpfactor) and [`damp`](https://vevetjs.com/docs/Raf/methods.md#damp) for refresh-rate–independent motion

## Animation loop[​](#animation-loop "Direct link to Animation loop")

1. **`play`** / `enabled: true` — starts the rAF chain; emits [`play`](https://vevetjs.com/docs/Raf/callbacks.md#play) and [`toggle`](https://vevetjs.com/docs/Raf/callbacks.md#toggle).
2. **`frame`** — fired on each **processed** frame (after FPS throttling), with `fps`, `fpsFactor`, `duration`, and `lerpFactor`.
3. **`pause`** / `enabled: false` — `cancelAnimationFrame`; emits [`pause`](https://vevetjs.com/docs/Raf/callbacks.md#pause) and [`toggle`](https://vevetjs.com/docs/Raf/callbacks.md#toggle).

Changing [`fps`](https://vevetjs.com/docs/Raf/props.md#props.fps) or [`enabled`](https://vevetjs.com/docs/Raf/props.md#props.enabled) resets frame timing.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo EaaYREw](https://codepen.io/anton-bobrov/embed/EaaYREw?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="wrapper">

    <div class="info">

      <p id="target"></p>

      <p id="fps"></p>

      <p id="factor"></p>

      <p id="time"></p>

      <p id="index"></p>

    </div>



    <div class="buttons">

      <button type="button" class="btn" id="play">Play</button>



      <button type="button" class="btn" id="pause">Pause</button>

    </div>

  </div>

</div>
```

CSS

```
.wrapper {

  width: 16rem;

  max-width: 100%;

  padding: 1rem;

}



.info {

  width: 100%;

  font-size: 0.75rem;



  p {

    margin: 0.25rem 0;

  }

}



.buttons {

  margin-top: 1rem;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 0.5rem;

  width: 100%;

}



.btn {

  width: 100%;

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

[Open live demo ↗](https://vevetjs.com/pens/EaaYREw)

[More demosExplore all examples](https://vevetjs.com/docs/Raf/demos.md)

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



const raf = new Raf({

  enabled: true,

  fps: 30,

  onFrame: ({ fps }) => {

    console.log(fps);

  },

});
```

Damping — use [`damp`](https://vevetjs.com/docs/Raf/methods.md#damp) or [`lerpFactor`](https://vevetjs.com/docs/Raf/methods.md#lerpfactor) for consistent motion across 60 Hz, 120 Hz, and 144 Hz displays (**see [demo](https://vevetjs.com/docs/Raf/demos.md#damping)**):

```
raf.on('frame', () => {

  value = raf.damp(value, target, 0.1);

});
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
