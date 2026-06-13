# Basic Demos

<!-- -->

## Carousel values[​](#carousel-values "Direct link to Carousel values")

[Vevet Demo ByLxGNj](https://codepen.io/anton-bobrov/embed/ByLxGNj?default-tab=result)

HTML

```
<div class="info">

  <div>Current: <span data-value-current></span></div>

  <div>Target: <span data-value-target></span></div>

  <div>Min: <span data-value-min></span></div>

  <div>Max: <span data-value-max></span></div>

  <div>Loop: <span data-value-loop></span></div>

  <div>Influence: <span data-value-influence></span></div>

  <div>Interpolating: <span data-value-interpolating></span></div>

  <div>Idle: <span data-value-idle></span></div>

</div>



<div class="carousel" id="carousel">

  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 1</div>

      <div data-progress>0%</div>

    </div>

  </div>



  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 2</div>

      <div data-progress>0%</div>

    </div>

  </div>



  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 3</div>

      <div data-progress>0%</div>

    </div>

  </div>



  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 4</div>

      <div data-progress>0%</div>

    </div>

  </div>



  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 5</div>

      <div data-progress>0%</div>

    </div>

  </div>



  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 6</div>

      <div data-progress>0%</div>

    </div>

  </div>



  <div class="slide">

    <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">

      <div>Slide 7</div>

      <div data-progress>0%</div>

    </div>

  </div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 2rem;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-variant-numeric: tabular-nums;

}



.info {

  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 1rem;

  width: 80%;



  >* {

    &:nth-child(2n + 2) {

      text-align: right;

    }

  }

}



.carousel {

  --size: max(25vw, 25vh);



  position: relative;

  width: 100%;

  height: var(--size);



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: var(--size);

  height: 100%;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}



.slide-wrap {

  width: 100%;

  height: 100%;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 1rem;



  box-sizing: border-box;

  padding: 20px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 1.5rem;

  font-weight: bold;

  color: #ececec;

  text-align: center;

}



.slide [data-progress] {

  width: 100%;

  padding-top: 1rem;

  border-top: 1px solid currentColor;

}
```

JavaScript

```
import {

  Snap,

  EaseOutBack

} from "vevet.10.0";



const container = document.getElementById("carousel");



const valueCurrent = document.querySelector("[data-value-current]");

const valueTarget = document.querySelector("[data-value-target]");

const valueMin = document.querySelector("[data-value-min]");

const valueMax = document.querySelector("[data-value-max]");

const valueLoop = document.querySelector("[data-value-loop]");

const valueInfluence = document.querySelector("[data-value-influence]");

const valueInterpolating = document.querySelector("[data-value-interpolating]");

const valueIdle = document.querySelector("[data-value-idle]");



const carousel = new Snap({

  container,

  gap: "1rem",

  lerp: 0.1,

  duration: 750,

  easing: EaseOutBack,

  grabCursor: true,

  origin: "center",

  loop: true

});





container.classList.add("ready");



carousel.slides.forEach(({

  element

}) => {

  element.progressElement = element.querySelector("[data-progress]");

});



carousel.on("update", () => {

  valueCurrent.innerHTML = carousel.current.toFixed(2);

  valueTarget.innerHTML = carousel.target.toFixed(2);

  valueMin.innerHTML = carousel.min.toFixed(2);

  valueMax.innerHTML = carousel.max.toFixed(2);

  valueLoop.innerHTML = carousel.loopCount;

  valueInfluence.innerHTML = carousel.influence.toFixed(2);

  valueInterpolating.innerHTML = carousel.isInterpolating;

  valueIdle.innerHTML = carousel.isIdle;



  carousel.slides.forEach(({

    element,

    coord,

    progress,

    index

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;



    const percent = (progress * 100).toFixed(0);



    element.progressElement.innerHTML = `${percent}%`;

  });

});



carousel.on("idle", () => {

  valueIdle.innerHTML = carousel.isIdle;

});
```

## Default active index[​](#default-active-index "Direct link to Default active index")

`Vevet Snap` supports a default active index. Provide `activeIndex` (zero-based) when initializing to open the carousel at a specific slide:

[Vevet Demo myVqdQK](https://codepen.io/anton-bobrov/embed/myVqdQK?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  activeIndex: 1,

  gap: 20

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Variable Size[​](#variable-size "Direct link to Variable Size")

`Snap` supports slides of varying sizes - they don't need to be equal in width or height.

Some slides may be larger than their container. In this case, they can be smoothly scrolled:

[Vevet Demo RNNjdxK](https://codepen.io/anton-bobrov/embed/RNNjdxK?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide" style="min-width: 200px;">1</div>

  <div class="slide" style="min-width: 300px;">2</div>

  <div class="slide" style="min-width: 400px;">3</div>

  <div class="slide" style="min-width: 150vw;">4</div>

  <div class="slide" style="min-width: 150px;">5</div>

  <div class="slide" style="min-width: 200px">6</div>

  <div class="slide" style="min-width: 300px">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  width: max-content;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Vertical[​](#vertical "Direct link to Vertical")

`Snap` can operate in either horizontal or vertical orientation:

[Vevet Demo ZYYaZmp](https://codepen.io/anton-bobrov/embed/ZYYaZmp?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 100%;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  direction: "vertical"

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(0, ${coord}px)`;

  });

});
```

## Origin[​](#origin "Direct link to Origin")

`Snap` slides can align to the **start**, **center**, or **end** of the container via [`origin`](https://vevetjs.com/docs/Snap/props.md#props.origin). The demo below uses centered slides (`origin: 'center'`):

[Vevet Demo PwwOgvv](https://codepen.io/anton-bobrov/embed/PwwOgvv?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  centered: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Loop[​](#loop "Direct link to Loop")

Any `Snap` carousel can be infinite:

[Vevet Demo zxxPQNR](https://codepen.io/anton-bobrov/embed/zxxPQNR?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  centered: true,

  loop: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Gap[​](#gap "Direct link to Gap")

`Snap` supports custom gaps between slides. The gap can be set in `px`, `rem`, `vw`, `vh` or `svh`:

[Vevet Demo raxYLVE](https://codepen.io/anton-bobrov/embed/raxYLVE?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: "10vw"

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Grab cursor[​](#grab-cursor "Direct link to Grab cursor")

[Vevet Demo myVqOoR](https://codepen.io/anton-bobrov/embed/myVqOoR?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Wheel[​](#wheel "Direct link to Wheel")

`Snap` supports wheel control:

[Vevet Demo EaaEYwX](https://codepen.io/anton-bobrov/embed/EaaEYwX?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 30vw;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  wheel: true,

  wheelAxis: "y",

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Free wheel[​](#free-wheel "Direct link to Free wheel")

The `Snap` wheel behavior may differ slightly. For example, after a swipe, the carousel snaps to the nearest magnet, but after a wheel scroll ends, it won't - that part is up to you:

[Vevet Demo raxYLWB](https://codepen.io/anton-bobrov/embed/raxYLWB?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  wheel: true,

  wheelAxis: "y",

  stickOnWheelEnd: false,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Wheel No-Follow Auto-Throttle[​](#wheel-no-follow-auto-throttle "Direct link to Wheel No-Follow Auto-Throttle")

Sometimes you may want to prevent scrolling through multiple slides at once — Vevet `Snap` provides automatic wheel throttling to handle that, which works well in most cases:

[Vevet Demo jEWaryX](https://codepen.io/anton-bobrov/embed/jEWaryX?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 100%;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  direction: "vertical",

  wheel: true,

  followWheel: false,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(0, ${coord}px)`;

  });

});
```

## Wheel No-Follow Numeric Throttle[​](#wheel-no-follow-numeric-throttle "Direct link to Wheel No-Follow Numeric Throttle")

[Vevet Demo GgZzmmr](https://codepen.io/anton-bobrov/embed/GgZzmmr?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 100%;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  direction: "vertical",

  wheel: true,

  followWheel: false,

  wheelThrottle: 100,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(0, ${coord}px)`;

  });

});
```

## Hypersmooth[​](#hypersmooth "Direct link to Hypersmooth")

One of the best features is track value interpolation, which allows you to make scrolling and swiping as smooth as you want - right out of the box:

[Vevet Demo VYYrOow](https://codepen.io/anton-bobrov/embed/VYYrOow?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 30vw;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  wheel: true,

  wheelAxis: "y",

  lerp: 0.05,

  duration: 1500,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Freemode[​](#freemode "Direct link to Freemode")

`Snap` freemode allows you to ignore magnets when swiping or wheel scrolling ends:

[Vevet Demo bNNYPwo](https://codepen.io/anton-bobrov/embed/bNNYPwo?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide" style="width: 150vw">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 30vw;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  freemode: true,

  wheel: true,

  wheelAxis: "y"

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Sticky freemode[​](#sticky-freemode "Direct link to Sticky freemode")

`Snap` freemode also supports sticky mode. Users can scroll freely with inertia, but when their interaction ends, magnets take effect, snapping the carousel to the nearest slide:

[Vevet Demo WbrXoVJ](https://codepen.io/anton-bobrov/embed/WbrXoVJ?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide" style="width: 150vw">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 30vw;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  freemode: "sticky",

  wheel: true,

  wheelAxis: "y",

  shortSwipesDuration: 30

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Rewind[​](#rewind "Direct link to Rewind")

Enables wrap-around navigation: advancing from the last slide jumps to the first, and going back from the first jumps to the last:

[Vevet Demo qEZgjRm](https://codepen.io/anton-bobrov/embed/qEZgjRm?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 75%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  rewind: true,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Friction[​](#friction "Direct link to Friction")

`Snap` supports friction for both wheel and swipe interactions. Friction adds resistance to the user's scrolling, pulling slides toward their magnets:

[Vevet Demo YPwEZBg](https://codepen.io/anton-bobrov/embed/YPwEZBg?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  wheel: true,

  grabCursor: true,

  wheelAxis: "y",

  lerp: 0.2,

  friction: 0.3,

  swipeFriction: true,

  stickOnWheelEnd: false

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Edge Friction[​](#edge-friction "Direct link to Edge Friction")

`Snap` supports edge friction, making swipe interactions feel more natural and engaging. Edge friction adds resistance when swiping near the carousel's edges:

[Vevet Demo QwyOped](https://codepen.io/anton-bobrov/embed/QwyOped?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  edgeFriction: 0.25,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Interval[​](#interval "Direct link to Interval")

`Snap` supports automatic slide change with custom intervals.

[Vevet Demo zxKxodd](https://codepen.io/anton-bobrov/embed/zxKxodd?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  centered: true,

  loop: true,

  grabCursor: true,

  interval: 500

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Bounce[​](#bounce "Direct link to Bounce")

You can customize your animation - use any easing you like:

[Vevet Demo emmVqwN](https://codepen.io/anton-bobrov/embed/emmVqwN?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap,

  EaseOutBack

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  easing: EaseOutBack,

  duration: 850

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Swipe No Follow[​](#swipe-no-follow "Direct link to Swipe No Follow")

By default, `Snap` follows the user's swipe interaction. This behavior can be disabled, causing slides to change only after the interaction ends:

[Vevet Demo YPwEVzo](https://codepen.io/anton-bobrov/embed/YPwEVzo?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  followSwipe: false,

  grabCursor: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Reverse Swipe[​](#reverse-swipe "Direct link to Reverse Swipe")

Both wheel and swipe speeds can be customized:

[Vevet Demo myyxbdL](https://codepen.io/anton-bobrov/embed/myyxbdL?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap,

  EaseOutBack

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  swipeSpeed: -1

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## RTL Carousel[​](#rtl-carousel "Direct link to RTL Carousel")

[Vevet Demo xbVMdVo](https://codepen.io/anton-bobrov/embed/xbVMdVo?default-tab=result)

HTML

```
<div class="carousel" id="carousel" dir="rtl">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  right: 0;

  width: 30vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap,

  EaseOutBack

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  swipeSpeed: -1

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord

  }) => {

    element.style.transform = `translate(${-coord}px, 0)`;

  });

});
```

## Slides to Scroll[​](#slides-to-scroll "Direct link to Slides to Scroll")

[Vevet Demo MYyLmbq](https://codepen.io/anton-bobrov/embed/MYyLmbq?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: calc(50% - 10px);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  slidesToScroll: 2

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```

## Responsive Carousel[​](#responsive-carousel "Direct link to Responsive Carousel")

[Vevet Demo LENKmpN](https://codepen.io/anton-bobrov/embed/LENKmpN?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: calc(50% - 10px);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;



  @media (max-width: 768px) {

    width: 100%;

  }

}
```

JavaScript

```
import {

  Snap,

  Responsive

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  slidesToScroll: 2

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});



new Responsive(carousel, [{

  at: "@media (max-width: 768px)",

  props: {

    slidesToScroll: 1,

    followSwipe: false

  }

}]);
```

## Progress[​](#progress "Direct link to Progress")

`Snap` is a powerful solution for custom carousels. It allows you to track slide progress and animate them however you like:

[Vevet Demo ByNdgGj](https://codepen.io/anton-bobrov/embed/ByNdgGj?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">1</div>

  <div class="slide">2</div>

  <div class="slide">3</div>

  <div class="slide">4</div>

  <div class="slide">5</div>

  <div class="slide">6</div>

  <div class="slide">7</div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: 25vw;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 12px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

  font-variant-numeric: tabular-nums;

}
```

JavaScript

```
import {

  Snap,

  EaseOutBack

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  gap: 20,

  grabCursor: true,

  centered: true,

  loop: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    progress,

    index

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;



    element.innerHTML = `${index} / ${progress.toFixed(2)}`;

  });

});
```

## Virtual[​](#virtual "Direct link to Virtual")

[Vevet Demo azONLzb](https://codepen.io/anton-bobrov/embed/azONLzb?default-tab=result)

HTML

```
<div class="carousel" id="carousel"></div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 50vw;

  max-height: 50vh;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  width: max-content;

  box-sizing: border-box;

  padding: 20px;

  border-radius: 16px;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}
```

JavaScript

```
import {

  Snap,

  SnapSlide

} from "vevet";



const container = document.getElementById("carousel");



const createSlides = count => {

  const slides = new Array(count).fill(0).map((item, index) => {

    const size = "25vw";



    const element = document.createElement("div");

    element.className = "slide";

    element.innerHTML = `<span>${index}</span>`;

    element.style.width = size;



    return new SnapSlide(element, {

      size,

      virtual: true

    });



  });



  return slides;

};



const carousel = new Snap({

  container,

  slides: createSlides(500),

  gap: 20,

  grabCursor: true,

  loop: true,

  centered: true

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    isVisible

  }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```
