# Demos

<!-- -->

## Info[​](#info "Direct link to Info")

Live dashboard of the Raf loop — target FPS, real-time metrics, and playback controls.

Reads [`fps`](https://vevetjs.com/docs/Raf/accessors.md#fps), [`fpsFactor`](https://vevetjs.com/docs/Raf/accessors.md#fpsfactor), [`timestamp`](https://vevetjs.com/docs/Raf/accessors.md#timestamp), and [`index`](https://vevetjs.com/docs/Raf/accessors.md#index) on every [`onFrame`](https://vevetjs.com/docs/Raf/callbacks.md#frame). Use **Play** / **Pause** to call [`play()`](https://vevetjs.com/docs/Raf/methods.md#play) and [`pause()`](https://vevetjs.com/docs/Raf/methods.md#pause).

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

## Damping[​](#damping "Direct link to Damping")

Compare standard `lerp()` with frame-rate–independent easing via [`lerpFactor()`](https://vevetjs.com/docs/Raf/methods.md#lerpfactor).

Both squares chase the same target, but only the bottom one uses `raf.lerpFactor(ease)` — motion stays consistent on 60 Hz, 120 Hz, and higher refresh rates.

[Vevet Demo RNaEXOW](https://codepen.io/anton-bobrov/embed/RNaEXOW?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    Standard lerp:



    <div class="sample" id="lerp"></div>



    Damping:

    <div class="sample" id="damp"></div>



    <div class="buttons">

      <button type="button" class="btn" id="play">Play</button>



      <button type="button" class="btn" id="pause">Pause</button>

    </div>

  </div>

</div>
```

CSS

```
.container {

  display: grid;

  gap: 1rem;

  width: 15rem;

  max-width: 100%;

  padding: 1rem;

}



.sample {

  width: 1.5rem;

  height: 1.5rem;

  border-radius: 0.5rem;

  background: var(--gradient-sunset, #000);

}



.buttons {

  margin-top: 0.5rem;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 0.5rem;

  width: 100%;

}
```

JavaScript

```
import {

  Raf,

  lerp

} from "vevet";



const lerpElement = document.getElementById("lerp");

const dampElement = document.getElementById("damp");



const lerpValue = {

  current: 0,

  target: 0

};

const dampValue = {

  current: 0,

  target: 0

};



const raf = new Raf({

  enabled: false,

  onFrame: () => {

    const ease = 0.01;



    lerpValue.current = lerp(lerpValue.current, lerpValue.target, ease);



    dampValue.current = lerp(

      dampValue.current,

      dampValue.target,

      raf.lerpFactor(ease));



    lerpElement.style.transform = `translateX(${lerpValue.current}px)`;

    dampElement.style.transform = `translateX(${dampValue.current}px)`;

  }

});



document.getElementById("play").addEventListener("click", () => {

  lerpValue.target = lerpValue.target > 0 ? 0 : 270;

  dampValue.target = dampValue.target > 0 ? 0 : 270;



  raf.play();

});



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

[Open live demo ↗](https://vevetjs.com/pens/RNaEXOW)

## Real-time FPS[​](#real-time-fps "Direct link to Real-time FPS")

Block moves using [`fpsFactor`](https://vevetjs.com/docs/Raf/accessors.md#fpsfactor) while displaying the current [`fps`](https://vevetjs.com/docs/Raf/accessors.md#fps) value.

Position advances by `raf.fpsFactor` each frame — the same pattern used for refresh-rate–independent physics.

[Vevet Demo azNXojO](https://codepen.io/anton-bobrov/embed/azNXojO?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    <div class="sample" id="factor"></div>



    <div class="buttons">

      <button type="button" class="btn" id="play">Play</button>



      <button type="button" class="btn" id="pause">Pause</button>

    </div>

  </div>

</div>
```

CSS

```
.container {

  display: grid;

  gap: 1rem;

  width: 250px;

  max-width: 100%;

  padding: 1rem;

  box-sizing: content-box;

}



.sample {

  width: 50px;

  height: 50px;

  border-radius: 8px;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  background: var(--gradient-sunset, #000);



  font-size: 16px;

}



.buttons {

  margin-top: 0.5rem;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 0.5rem;

  width: 100%;

}
```

JavaScript

```
import {

  Raf,

  lerp

} from "vevet";



const factor = document.getElementById("factor");



let x = 0;



const raf = new Raf({

  enabled: true,

  onFrame: () => {

    x = (x + raf.fpsFactor) % 200;



    factor.style.transform = `translateX(${x}px)`;

    factor.innerHTML = raf.fps;

  }

});



document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

[Open live demo ↗](https://vevetjs.com/pens/azNXojO)

## FPS Factor[​](#fps-factor "Direct link to FPS Factor")

Same movement pattern, but the label shows [`fpsFactor`](https://vevetjs.com/docs/Raf/accessors.md#fpsfactor) instead of FPS.

On a 120 Hz display the factor is \~`0.50`; on 60 Hz it stays near `1.00` — useful when you need the raw multiplier in UI or debug output.

[Vevet Demo MYyLgvZ](https://codepen.io/anton-bobrov/embed/MYyLgvZ?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    <div class="sample" id="factor"></div>



    <div class="buttons">

      <button type="button" class="btn" id="play">Play</button>



      <button type="button" class="btn" id="pause">Pause</button>

    </div>

  </div>

</div>
```

CSS

```
.container {

  display: grid;

  gap: 1rem;

  width: 250px;

  max-width: 100%;

  padding: 1rem;

  box-sizing: content-box;

}



.sample {

  width: 50px;

  height: 50px;

  border-radius: 8px;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  background: var(--gradient-sunset, #000);



  font-size: 16px;

}



.buttons {

  margin-top: 0.5rem;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 0.5rem;

  width: 100%;

}
```

JavaScript

```
import {

  Raf,

  lerp

} from "vevet";



const factor = document.getElementById("factor");



let x = 0;



const raf = new Raf({

  enabled: true,

  onFrame: () => {

    x = (x + raf.fpsFactor) % 200;



    factor.style.transform = `translateX(${x}px)`;

    factor.innerHTML = raf.fpsFactor.toFixed(2);

  }

});



document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

[Open live demo ↗](https://vevetjs.com/pens/MYyLgvZ)

## FPS Throttling[​](#fps-throttling "Direct link to FPS Throttling")

Cap the loop to a fixed frame rate with [`fps: 10`](https://vevetjs.com/docs/Raf/props.md#props.fps).

[Vevet Demo YPqBKJV](https://codepen.io/anton-bobrov/embed/YPqBKJV?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    <div class="sample" id="factor"></div>



    <div class="buttons">

      <button type="button" class="btn" id="play">Play</button>



      <button type="button" class="btn" id="pause">Pause</button>

    </div>

  </div>

</div>
```

CSS

```
.container {

  display: grid;

  gap: 1rem;

  width: 250px;

  max-width: 100%;

  padding: 1rem;

  box-sizing: content-box;

}



.sample {

  width: 50px;

  height: 50px;

  border-radius: 8px;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  background: var(--gradient-sunset, #000);



  font-size: 16px;

}



.buttons {

  margin-top: 0.5rem;

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 0.5rem;

  width: 100%;

}
```

JavaScript

```
import {

  Raf,

  lerp

} from "vevet";



const factor = document.getElementById("factor");



let x = 0;



const raf = new Raf({

  enabled: true,

  fps: 10,

  onFrame: () => {

    x = (x + raf.fpsFactor) % 200;



    factor.style.transform = `translateX(${x}px)`;

  }

});



document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

[Open live demo ↗](https://vevetjs.com/pens/YPqBKJV)
