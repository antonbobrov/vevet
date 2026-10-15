# Basic Demos

<!-- -->

## Carousel values[​](#carousel-values "Direct link to Carousel values")

Overview demo: horizontal carousel with CSS-unit gap, smooth interpolation, and per-slide progress.

Key props: `gap: "1rem"`, `lerp: 0.1`, `duration: 750`, `origin: "center"`, `loop: true`.

Also reads track accessors in the `update` callback — `current`, `target`, `min`, `max`, `impulse`, and each slide's `progress`.

[Vevet Demo ByLxGNj](https://codepen.io/anton-bobrov/embed/ByLxGNj?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="info">

    <div>Current: <span data-value-current></span></div>

    <div>Target: <span data-value-target></span></div>

    <div>Min: <span data-value-min></span></div>

    <div>Max: <span data-value-max></span></div>

    <div>Loop: <span data-value-loop></span></div>

    <div>Impulse: <span data-value-impulse></span></div>

    <div>Interpolating: <span data-value-interpolating></span></div>

    <div>Idle: <span data-value-idle></span></div>

  </div>



  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 1</div>

        <div data-progress>0%</div>

      </div>

    </div>



    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 2</div>

        <div data-progress>0%</div>

      </div>

    </div>



    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 3</div>

        <div data-progress>0%</div>

      </div>

    </div>



    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 4</div>

        <div data-progress>0%</div>

      </div>

    </div>



    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 5</div>

        <div data-progress>0%</div>

      </div>

    </div>



    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 6</div>

        <div data-progress>0%</div>

      </div>

    </div>



    <div class="slide">

      <div class="slide-wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">

        <div>Slide 7</div>

        <div data-progress>0%</div>

      </div>

    </div>

  </div>

</div>
```

CSS

```
.info {

  display: grid;

  grid-template-columns: 1fr;

  width: 80%;

  gap: 0.5rem;



  font-size: 0.875rem;



  @media (min-width: 769px) {

    grid-template-columns: 1fr 1fr;



    >* {

      &:nth-child(2n + 2) {

        text-align: right;

      }

    }

  }

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  text-align: center;



  gap: 1rem;

  padding: 1rem;

  border-radius: 1rem;



  background: rgba(255, 255, 255, 0.08);

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

} from "vevet";



const container = document.getElementById("carousel");



const valueCurrent = document.querySelector("[data-value-current]");

const valueTarget = document.querySelector("[data-value-target]");

const valueMin = document.querySelector("[data-value-min]");

const valueMax = document.querySelector("[data-value-max]");

const valueLoop = document.querySelector("[data-value-loop]");

const valueImpulse = document.querySelector("[data-value-impulse]");

const valueInterpolating = document.querySelector("[data-value-interpolating]");

const valueIdle = document.querySelector("[data-value-idle]");



const carousel = new Snap({

  container,

  gap: "1rem",

  lerp: 0.1,

  duration: 750,

  easing: EaseOutBack,

  grabCursor: true,

  freemode: "sticky",

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

  valueImpulse.innerHTML = carousel.impulse.toFixed(2);

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

[Open live demo ↗](https://vevetjs.com/pens/ByLxGNj)

## Default active index[​](#default-active-index "Direct link to Default active index")

Start on a specific slide with `activeIndex: 1` — a zero-based slide index.

[Vevet Demo myVqdQK](https://codepen.io/anton-bobrov/embed/myVqdQK?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/myVqdQK)

## Variable size[​](#variable-size "Direct link to Variable size")

Slides can have different widths or heights. Some slides may be wider than the container and scroll with inertia.

[Vevet Demo RNNjdxK](https://codepen.io/anton-bobrov/embed/RNNjdxK?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  width: var(--size);

  height: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

}



.slide:nth-child(1) {

  width: calc(1.15 * var(--size));

}



.slide:nth-child(3) {

  width: calc(3 * var(--size));

  min-width: 130vw;

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/RNNjdxK)

## Vertical[​](#vertical "Direct link to Vertical")

Vertical carousel with `direction: "vertical"`.

[Vevet Demo ZYYaZmp](https://codepen.io/anton-bobrov/embed/ZYYaZmp?default-tab=result)

HTML

```
<div class="wrapper">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.wrapper {

  display: grid;

  padding: 1rem;

  height: 100svh;

  overflow: hidden;

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



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1rem",

  direction: "vertical",

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

[Open live demo ↗](https://vevetjs.com/pens/ZYYaZmp)

## Origin[​](#origin "Direct link to Origin")

Align snap magnets with `origin: "center"`.

[Vevet Demo PwwOgvv](https://codepen.io/anton-bobrov/embed/PwwOgvv?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  origin: "center",

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

[Open live demo ↗](https://vevetjs.com/pens/PwwOgvv)

## Origin end[​](#origin-end "Direct link to Origin end")

Align snap magnets with `origin: "end"` — the trailing edge of each slide sticks to the trailing edge of the container.

[Vevet Demo jEyMGwq](https://codepen.io/anton-bobrov/embed/jEyMGwq?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  origin: "end",

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

[Open live demo ↗](https://vevetjs.com/pens/jEyMGwq)

## Loop[​](#loop "Direct link to Loop")

Infinite carousel with `loop: true`.

[Vevet Demo zxxPQNR](https://codepen.io/anton-bobrov/embed/zxxPQNR?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  origin: "center",

  loop: true,

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

[Open live demo ↗](https://vevetjs.com/pens/zxxPQNR)

## Gap[​](#gap "Direct link to Gap")

Spacing between slides via `gap`. Accepts CSS units such as `px`, `rem`, `vw`, `vh`, and `svh`.

Example: `gap: "10vw"`.

[Vevet Demo raxYLVE](https://codepen.io/anton-bobrov/embed/raxYLVE?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "10vw",

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

[Open live demo ↗](https://vevetjs.com/pens/raxYLVE)

## Grab cursor[​](#grab-cursor "Direct link to Grab cursor")

Show grab/grabbing cursor during interaction with `grabCursor: true`.

[Vevet Demo myVqOoR](https://codepen.io/anton-bobrov/embed/myVqOoR?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/myVqOoR)

## Wheel[​](#wheel "Direct link to Wheel")

Horizontal carousel controlled by the mouse wheel. Enable with `wheel: true` and `wheelAxis: "y"`. Slides snap to magnets when wheeling stops.

[Vevet Demo EaaEYwX](https://codepen.io/anton-bobrov/embed/EaaEYwX?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  wheel: true,

  preventWheel: true,

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

[Open live demo ↗](https://vevetjs.com/pens/EaaEYwX)

## Free wheel[​](#free-wheel "Direct link to Free wheel")

Magnetic snapping while swiping, but free scrolling on wheel release via `stickOnWheelEnd: false`.

[Vevet Demo raxYLWB](https://codepen.io/anton-bobrov/embed/raxYLWB?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  wheel: true,

  preventWheel: true,

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

[Open live demo ↗](https://vevetjs.com/pens/raxYLWB)

## Throttled wheel[​](#throttled-wheel "Direct link to Throttled wheel")

With `followWheel: false`, wheel input is throttled automatically so one gesture does not skip multiple slides.

[Vevet Demo jEWaryX](https://codepen.io/anton-bobrov/embed/jEWaryX?default-tab=result)

HTML

```
<div class="wrapper">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.wrapper {

  display: grid;

  padding: 1rem;

  height: 100svh;

  overflow: hidden;

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



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1rem",

  direction: "vertical",

  wheel: true,

  preventWheel: true,

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

[Open live demo ↗](https://vevetjs.com/pens/jEWaryX)

## Throttled wheel by time[​](#throttled-wheel-by-time "Direct link to Throttled wheel by time")

Time-based wheel throttling with `followWheel: false` and `wheelThrottle: 100` — wheel input is blocked for 100ms after each slide change, including during transitions.

[Vevet Demo GgZzmmr](https://codepen.io/anton-bobrov/embed/GgZzmmr?default-tab=result)

HTML

```
<div class="wrapper">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.wrapper {

  display: grid;

  padding: 1rem;

  height: 100svh;

  overflow: hidden;

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



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1rem  ",

  direction: "vertical",

  wheel: true,

  preventWheel: true,

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

[Open live demo ↗](https://vevetjs.com/pens/GgZzmmr)

## Hypersmooth[​](#hypersmooth "Direct link to Hypersmooth")

Very smooth motion with low lerp and long duration. Example: `lerp: 0.05`.

[Vevet Demo VYYrOow](https://codepen.io/anton-bobrov/embed/VYYrOow?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  wheel: true,

  preventWheel: true,

  wheelAxis: "y",

  lerp: 0.05,

  duration: 1500,

  grabCursor: true,

  freemode: true

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

[Open live demo ↗](https://vevetjs.com/pens/VYYrOow)

## Freemode[​](#freemode "Direct link to Freemode")

Free scrolling with inertia via `freemode: true`. When `loop: false`, movement bounces at the track edges.

[Vevet Demo bNNYPwo](https://codepen.io/anton-bobrov/embed/bNNYPwo?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide" style="width: 150vw">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  grabCursor: true,

  freemode: true,

  wheel: true,

  preventWheel: true,

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

[Open live demo ↗](https://vevetjs.com/pens/bNNYPwo)

## Sticky freemode[​](#sticky-freemode "Direct link to Sticky freemode")

Combines freemode inertia with magnetic snapping at the end of the gesture: `freemode: "sticky"`.

Movement stays within bounds and always settles on the nearest slide magnet when inertia ends.

[Vevet Demo WbrXoVJ](https://codepen.io/anton-bobrov/embed/WbrXoVJ?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide" style="width: 150vw">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  grabCursor: true,

  freemode: "sticky",

  wheel: true,

  preventWheel: true,

  wheelAxis: "y",

  shortSwipes: false

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

[Open live demo ↗](https://vevetjs.com/pens/WbrXoVJ)

## Rewind[​](#rewind "Direct link to Rewind")

Wrap-around navigation without looping the track: `rewind: true`. Works when `loop: false` — from the last slide, next goes to the first, and vice versa.

[Vevet Demo qEZgjRm](https://codepen.io/anton-bobrov/embed/qEZgjRm?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/qEZgjRm)

## Friction[​](#friction "Direct link to Friction")

Add resistance during wheel and swipe interactions with `friction: 0.3` and `swipeFriction: true`. Pulls movement toward slide magnets.

[Vevet Demo YPwEZBg](https://codepen.io/anton-bobrov/embed/YPwEZBg?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  wheel: true,

  preventWheel: true,

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

[Open live demo ↗](https://vevetjs.com/pens/YPwEZBg)

## Edge friction[​](#edge-friction "Direct link to Edge friction")

Extra resistance near the carousel edges. Enabled by default — override with `edgeFriction: 0.25`.

[Vevet Demo QwyOped](https://codepen.io/anton-bobrov/embed/QwyOped?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/QwyOped)

## Interval[​](#interval "Direct link to Interval")

Auto-advance slides with `interval: 500` — moves to the next slide 500ms after each transition ends.

[Vevet Demo zxKxodd](https://codepen.io/anton-bobrov/embed/zxKxodd?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: '1.25rem',

  origin: "center",

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

[Open live demo ↗](https://vevetjs.com/pens/zxKxodd)

## Easing[​](#easing "Direct link to Easing")

Custom transition easing. Example: `easing: EaseOutBack`, `duration: 850`.

[Vevet Demo emmVqwN](https://codepen.io/anton-bobrov/embed/emmVqwN?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/emmVqwN)

## Swipe no follow[​](#swipe-no-follow "Direct link to Swipe no follow")

Disable live swipe tracking so slides change only after the gesture ends: `followSwipe: false`.

[Vevet Demo YPwEVzo](https://codepen.io/anton-bobrov/embed/YPwEVzo?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/YPwEVzo)

## Reverse swipe[​](#reverse-swipe "Direct link to Reverse swipe")

Reverse swipe direction with a negative `swipeSpeed`. Example: `swipeSpeed: -1`.

[Vevet Demo myyxbdL](https://codepen.io/anton-bobrov/embed/myyxbdL?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/myyxbdL)

## RTL carousel[​](#rtl-carousel "Direct link to RTL carousel")

Manual RTL setup:

* `dir="rtl"` on the container
* `swipeSpeed: -1`
* apply transforms with the opposite sign

[Vevet Demo xbVMdVo](https://codepen.io/anton-bobrov/embed/xbVMdVo?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel" dir="rtl">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  right: 0;

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/xbVMdVo)

## Slides to scroll[​](#slides-to-scroll "Direct link to Slides to scroll")

Scroll multiple slides per interaction with `slidesToScroll: 2`.

[Vevet Demo MYyLmbq](https://codepen.io/anton-bobrov/embed/MYyLmbq?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: calc(50% - 0.625rem);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/MYyLmbq)

## Adaptive Snap[​](#adaptive-snap "Direct link to Adaptive Snap")

Use [Responsive](https://vevetjs.com/docs/base/Responsive/.md) to change Snap props at breakpoints:

```
new Responsive(carousel, [

  {

    at: '@media (max-width: 768px)',

    props: {

      slidesToScroll: 1,

      followSwipe: false,

    },

  },

]);
```

[Vevet Demo LENKmpN](https://codepen.io/anton-bobrov/embed/LENKmpN?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: calc(50% - 0.625rem);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);



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

  gap: "1.25rem",

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

[Open live demo ↗](https://vevetjs.com/pens/LENKmpN)

## Progress[​](#progress "Direct link to Progress")

Read each slide's `progress` and `index` in the `update` callback — useful for parallax, opacity, and 3D effects.

[Vevet Demo ByNdgGj](https://codepen.io/anton-bobrov/embed/ByNdgGj?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">1</div>

    <div class="slide">2</div>

    <div class="slide">3</div>

    <div class="slide">4</div>

    <div class="slide">5</div>

    <div class="slide">6</div>

    <div class="slide">7</div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

}



.carousel {

  --size: clamp(max(10rem, 25vw), 50vh, 50vw);



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

  height: 100%;

  width: var(--size);



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

  gap: "1.25rem",

  grabCursor: true,

  origin: "center",

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

[Open live demo ↗](https://vevetjs.com/pens/ByNdgGj)

## Virtual[​](#virtual "Direct link to Virtual")

Virtual slides: pass `SnapSlide` instances with `virtual: true`. DOM nodes are created on init; only visible slides stay in the document.

[Vevet Demo azONLzb](https://codepen.io/anton-bobrov/embed/azONLzb?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel"></div>

</div>
```

CSS

```
.fullpage-center {

  padding-inline: 1.25rem;

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



  border-radius: 1rem;

  background: rgba(255, 255, 255, 0.08);

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

    const size = "40vw";



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

  gap: "1.25rem",

  grabCursor: true,

  loop: true,

  origin: "center"

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

[Open live demo ↗](https://vevetjs.com/pens/azONLzb)
