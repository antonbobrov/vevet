# Snap

Snap is a flexible, low-level carousel handler focused on precise control over movement, snapping, and interaction logic.<br /><!-- -->It **does not impose layout or styling**, making it suitable for fully custom carousels and experimental UI patterns.

## Showcase[​](#showcase "Direct link to Showcase")

### Carousel values[​](#carousel-values "Direct link to Carousel values")

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

### Panorama[​](#panorama "Direct link to Panorama")

[Vevet Demo OPMzdaX](https://codepen.io/anton-bobrov/embed/OPMzdaX?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/758/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/760/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/770/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/780/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/790/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/800/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/810/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/820/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/830/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/840/400/600" alt="">

  </div>

</div>
```

CSS

```
body {

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.carousel {

  --size: max(30vw, 30vh);



  position: fixed;

  top: 50%;

  left: 0;

  transform: translateY(-50%);

  width: 100%;

  height: var(--size);



  perspective: calc(var(--size) * 5.55);

  transform-style: preserve-3d;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  width: calc(var(--size) * 1);

  height: var(--size);

  border-radius: 16px;

  overflow: hidden;

  box-shadow: 0px 0px 50px 0px rgba(0, 0, 0, 0.1);

}



.slide img {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}
```

JavaScript

```
import {

  Snap,

  vevet

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  direction: "horizontal",

  grabCursor: true,

  centered: true,

  loop: true,

  gap: 10,

  duration: 300

});





carousel.on("update", () => {

  const depth = 200;

  const rotation = 20;

  const scale = 1 / (180 / rotation);

  const halfAngle = rotation * Math.PI / 180 / 2;



  carousel.slides.forEach(({

    element,

    coord,

    progress,

    size

  }) => {

    const factor = 1 - Math.cos(progress * scale * Math.PI);



    const xOffset = progress * (size / 3) * factor;

    const zOffset = size * 0.5 / Math.sin(halfAngle) * factor - depth;

    const rotateY = progress * rotation;



    element.style.transform = `translateX(${

    coord + xOffset

    }px) translateZ(${zOffset}px) rotateY(${rotateY}deg)`;

  });

});



container.classList.add("ready");
```

### Expand Slide[​](#expand-slide "Direct link to Expand Slide")

[Vevet Demo jEqdQZg](https://codepen.io/anton-bobrov/embed/jEqdQZg?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/1040/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>



  <div class="slide">

    <img src="https://picsum.photos/id/1050/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>



  <div class="slide">

    <img src="https://picsum.photos/id/1060/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>



  <div class="slide">

    <img src="https://picsum.photos/id/1070/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>



  <div class="slide">

    <img src="https://picsum.photos/id/1080/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>



  <div class="slide">

    <img src="https://picsum.photos/id/1081/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>



  <div class="slide">

    <img src="https://picsum.photos/id/1082/1000/1500" alt="" data-snap-parallax-scale="0.2" data-snap-parallax-scale-abs data-snap-parallax-scale-scope="none">

    <p class="text">Click me</p>

  </div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;

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



  font-family: "Ubuntu", sans-serif;

  color: #fff;

}



.carousel {

  position: fixed;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: 95%;

  height: 90%;



  opacity: 0;

  transition: opacity 0.35s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  width: 45vw;

  height: 100%;

  border-radius: 16px;

  overflow: hidden;

  background: #000;

}



.slide img {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.slide .text {

  margin: 0;

  position: absolute;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  font-size: 2.5rem;

  font-weight: bold;

  white-space: nowrap;

}
```

JavaScript

```
import {

  clamp,

  lerp,

  Snap,

  Timeline,

  vevet

} from "vevet";



const container = document.getElementById("carousel");

let tmIndex = 0;



const carousel = new Snap({

    container: container,

    direction: "horizontal",

    gap: "1vw",

    wheel: true,

    wheelAxis: "y",

    freemode: "sticky",

    stickOnResize: false,

    edgeFriction: 0.95,

    grabCursor: true

  },



  {

    onResize: () => {

      container.classList.add("ready");

    },

    onUpdate: (data, {

      slides

    }) => {

      slides.forEach(({

        element,

        coord

      }) => {

        element.style.transform = `translateX(${coord}px)`;

      });

    }

  });







const toggleSlide = index => {

  if (!carousel) {

    return;

  }



  tmIndex = index;



  const slide = carousel.slides[index];

  const element = slide.element;



  element.classList.toggle("active");

  const isExpanding = element.classList.contains("active");



  const fromWidth = element.offsetWidth / vevet.width * 100;

  const startTrack = carousel.current;



  const tm = new Timeline({

    duration: 500

  }, {

    onUpdate: ({

      eased

    }) => {

      const toWidth = isExpanding ? 80 : 45;

      element.style.width = `${lerp(fromWidth, toWidth, eased)}vw`;



      slide.resize();



      if (tmIndex === index) {

        if (isExpanding) {

          carousel.set(

            lerp(

              startTrack,

              clamp(slide.staticCoord, carousel.min, carousel.max),

              eased));





        } else {

          carousel.clampTarget();

        }

      }

    }

  });







  tm.play();

};



carousel.slides.forEach(({

  element,

  index

}) => {

  element.addEventListener("click", () => toggleSlide(index));

});
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Snap/basic-demos.md).

## Advantages[​](#advantages "Direct link to Advantages")

* Tracks slide progress and position with high precision
* Rich callback system for fine-grained event handling
* Configurable slide alignment (`start`, `center`, `end`) and magnetic points
* Adjustable movement friction and inertia
* Mouse wheel, swipe, and drag interaction support
* Custom slide sizes and gaps with CSS units support
* Smooth, interpolated transitions
* Built-in parallax utilities
* Designed for highly customized layouts
* and more...

## Initialization[​](#initialization "Direct link to Initialization")

caution

`Snap` does not apply any styles automatically.<br /><!-- -->You are responsible for positioning slides and updating their transforms via CSS and callbacks.

Basic usage:

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

```
.carousel {

  position: relative;

  width: 100vw;

  height: 50vw;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 100%;

  width: 100%;

  background: #ccc;

}
```

```
import { Snap } from 'vevet';



const container = document.getElementById('carousel');



const carousel = new Snap({

  container,

  gap: 20,

});



carousel.on('update', () => {

  carousel.slides.forEach(({ element, coord, isVisible }) => {

    element.style.transform = `translate(${coord}px, 0)`;

  });

});
```
