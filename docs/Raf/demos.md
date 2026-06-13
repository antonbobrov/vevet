# Demos

<!-- -->

## Info[​](#info "Direct link to Info")

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

## Damping[​](#damping "Direct link to Damping")

Raf ensures consistent animation speed on devices with refresh rates above 60 FPS.

[Vevet Demo RNaEXOW](https://codepen.io/anton-bobrov/embed/RNaEXOW?default-tab=result)

HTML

```
<div class="container">

  Standard lerp:



  <div class="sample" id="lerp"></div>



  Damping:

  <div class="sample" id="damp"></div>



  <div class="buttons">

    <button type="button" class="button" id="play">Play</button>



    <button type="button" class="button" id="pause">Pause</button>

  </div>

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



.container {

  display: grid;

  gap: 30px;

  width: 300px;

}



.sample {

  width: 30px;

  height: 30px;

  border-radius: 8px;

  background: linear-gradient(35deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

}



.buttons {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1vw;

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

## Real-time FPS[​](#real-time-fps "Direct link to Real-time FPS")

[Vevet Demo azNXojO](https://codepen.io/anton-bobrov/embed/azNXojO?default-tab=result)

HTML

```
<div class="container">

  <div class="sample" id="factor"></div>



  <div class="buttons">

    <button type="button" class="button" id="play">Play</button>



    <button type="button" class="button" id="pause">Pause</button>

  </div>

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



.container {

  display: grid;

  gap: 30px;

  width: 300px;

}



.sample {

  width: 50px;

  height: 50px;

  border-radius: 8px;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  background: linear-gradient(35deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

  font-size: 16px;

}



.buttons {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1vw;

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

  Raf,

  lerp

} from "vevet";



const factor = document.getElementById("factor");



let x = 0;



const raf = new Raf({

  enabled: true,

  onFrame: () => {

    x = (x + raf.fpsFactor) % 250;



    factor.style.transform = `translateX(${x}px)`;

    factor.innerHTML = raf.fps;

  }

});





document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

## FPS factor[​](#fps-factor "Direct link to FPS factor")

[Vevet Demo MYyLgvZ](https://codepen.io/anton-bobrov/embed/MYyLgvZ?default-tab=result)

HTML

```
<div class="container">

  <div class="sample" id="factor"></div>



  <div class="buttons">

    <button type="button" class="button" id="play">Play</button>



    <button type="button" class="button" id="pause">Pause</button>

  </div>

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



.container {

  display: grid;

  gap: 30px;

  width: 300px;

}



.sample {

  width: 50px;

  height: 50px;

  border-radius: 8px;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  background: linear-gradient(35deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

  font-size: 16px;

}



.buttons {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1vw;

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

  Raf,

  lerp

} from "vevet";



const factor = document.getElementById("factor");



let x = 0;



const raf = new Raf({

  enabled: true,

  onFrame: () => {

    x = (x + raf.fpsFactor) % 250;



    factor.style.transform = `translateX(${x}px)`;

    factor.innerHTML = raf.fpsFactor.toFixed(2);

  }

});





document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```

## FPS Throttling[​](#fps-throttling "Direct link to FPS Throttling")

[Vevet Demo YPqBKJV](https://codepen.io/anton-bobrov/embed/YPqBKJV?default-tab=result)

HTML

```
<div class="container">

  <div class="sample" id="factor"></div>



  <div class="buttons">

    <button type="button" class="button" id="play">Play</button>



    <button type="button" class="button" id="pause">Pause</button>

  </div>

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



.container {

  display: grid;

  gap: 30px;

  width: 300px;

}



.sample {

  width: 50px;

  height: 50px;

  border-radius: 8px;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  background: linear-gradient(35deg,

      rgb(255, 127, 135) 0%,

      rgb(244, 214, 157) 100%);

  font-size: 16px;

}



.buttons {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1vw;

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

  Raf,

  lerp

} from "vevet";



const factor = document.getElementById("factor");



let x = 0;



const raf = new Raf({

  enabled: true,

  fps: 10,

  onFrame: () => {

    x = (x + raf.fpsFactor) % 250;



    factor.style.transform = `translateX(${x}px)`;

  }

});





document.getElementById("play").addEventListener("click", () => raf.play());



document.getElementById("pause").addEventListener("click", () => raf.pause());
```
