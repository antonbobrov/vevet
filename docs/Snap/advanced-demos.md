# Advanced Demos

<!-- -->

## Panorama[​](#panorama "Direct link to Panorama")

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

## Circular Carousel[​](#circular-carousel "Direct link to Circular Carousel")

[Vevet Demo XJKQwyb](https://codepen.io/anton-bobrov/embed/XJKQwyb?default-tab=result)

HTML

```
<div class="container" id="container">



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/758/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/760/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/770/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/780/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/790/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/780/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/800/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/780/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/810/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/820/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/830/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-scale="-5" data-snap-parallax-scale-min="0.755" data-snap-parallax-scale-influence data-snap-parallax-scale-abs data-snap-parallax-scale-scope="1,1" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-30" data-snap-parallax-skew-max="30" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/840/400/600" alt="">

    </div>

  </div>



</div>
```

CSS

```
body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  --size: min(70vh, 70vw);



  position: fixed;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: var(--size);

  height: var(--size);

}



.slide {

  --slide-size: calc(var(--size) / 5);



  position: absolute;

  top: calc(50% - var(--slide-size) / 2);

  left: calc(50% - var(--slide-size) / 2);

  width: var(--slide-size);

  height: var(--slide-size);



  display: flex;

  justify-content: center;

  align-items: center;

}



.wrapper {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  border-radius: 8px;

  overflow: hidden;

}



.wrapper img {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const carousel = new Snap({

    container: document.getElementById("container"),

    direction: "horizontal",

    wheel: true,

    swipeAxis: "angle",

    wheelAxis: "y",

    loop: true,

    freemode: true,

    grabCursor: true

  },



  {

    onUpdate: (data, {

      containerSize,

      slides

    }) => {

      const radius = containerSize / 2;

      const p2 = Math.PI * 2;

      const offset = Math.PI * -0.5;



      slides.forEach(slide => {

        const element = slide.element;

        const progress = -slide.progress / slides.length;



        const x = Math.cos(p2 * progress + offset) * radius;

        const y = Math.sin(p2 * progress + offset) * radius;

        const rotation = p2 * progress;



        element.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotation}rad)`;

      });

    }

  });
```

## Cylinder Carousel[​](#cylinder-carousel "Direct link to Cylinder Carousel")

[Vevet Demo GgqLVWg](https://codepen.io/anton-bobrov/embed/GgqLVWg?default-tab=result)

HTML

```
<div class="container" id="container">



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/758/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/760/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/770/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/780/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/790/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/780/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/800/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/780/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/810/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/820/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/830/400/600" alt="">

    </div>

  </div>



  <div class="slide">

    <div class="wrapper" data-snap-parallax-skew="-200" data-snap-parallax-skew-min="-50" data-snap-parallax-skew-max="50" data-snap-parallax-skew-influence data-snap-parallax-skew-directional data-snap-parallax-skew-scope="1,1">

      <img src="https://picsum.photos/id/840/400/600" alt="">

    </div>

  </div>



</div>
```

CSS

```
body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  --size: min(70vh, 70vw);



  position: fixed;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: var(--size);

  height: var(--size);



  transform-style: preserve-3d;

  perspective: calc(var(--size) * 1.5);

}



.slide {

  --slide-size: calc(var(--size) / 4);



  position: absolute;

  top: calc(50% - var(--slide-size) / 2);

  left: calc(50% - var(--slide-size) / 2);

  width: var(--slide-size);

  height: var(--slide-size);



  display: flex;

  justify-content: center;

  align-items: center;

}



.wrapper {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  border-radius: 8px;

  overflow: hidden;

}



.wrapper img {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}
```

JavaScript

```
import {

  Snap

} from "vevet";



const carousel = new Snap({

    container: document.getElementById("container"),

    direction: "horizontal",

    wheel: true,

    wheelAxis: "y",

    loop: true,

    freemode: true,

    grabCursor: true

  },



  {

    onUpdate: (data, {

      containerSize,

      slides

    }) => {

      const radius = containerSize / 2;

      const p2 = Math.PI * 2;

      const offset = Math.PI * -0.5;



      slides.forEach(slide => {

        const element = slide.element;

        const progress = -slide.progress / slides.length;



        const x = Math.cos(p2 * progress + offset) * radius;

        const z = -Math.sin(p2 * progress + offset) * radius;

        const rotation = p2 * progress;



        element.style.transform = `translateX(${x}px) translateZ(${z}px) rotateY(${rotation}rad)`;

      });

    }

  });
```

## Perspective Carousel[​](#perspective-carousel "Direct link to Perspective Carousel")

[Vevet Demo azdEEXV](https://codepen.io/anton-bobrov/embed/azdEEXV?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/757/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/59/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/400/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/260/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/358/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/478/400/600" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/625/400/600" alt="">

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

  --size: min(70vw, 70vh);



  position: fixed;

  top: 50%;

  left: 0;

  transform: translateY(-50%);

  width: 100%;

  height: var(--size);



  perspective: calc(var(--size) * 1.6);

  transform-style: preserve-3d;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  width: calc(var(--size) * 0.6);

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

  wheel: true,

  wheelAxis: "y",

  centered: true,

  loop: true,

  shortSwipes: false,

  freemode: vevet.mobile ? false : "sticky"

});





carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    size,

    coord,

    progress

  }) => {

    const z = Math.abs(progress ** 2) * -(size * 0.625);

    const rZ = progress * 5;



    element.style.transform = `translateX(${coord}px) translateZ(${z}px) rotateZ(${rZ}deg)`;

  });

});



container.classList.add("ready");
```

## Stack Overlap[​](#stack-overlap "Direct link to Stack Overlap")

[Vevet Demo LEZvwOv](https://codepen.io/anton-bobrov/embed/LEZvwOv?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/757/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/59/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/400/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/260/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/358/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/478/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/625/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/356/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/380/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/652/600/900" alt="">

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

  left: 50%;

  transform: translate(-50%, -50%);

  width: var(--size);

  height: calc(var(--size) * 0.675);



  opacity: 0;

  transition: opacity 0.25s linear;



  transform-style: preserve-3d;

  perspective: calc(var(--size) * 2.5);

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

  clamp

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  direction: "horizontal",

  centered: true,

  loop: false,

  gap: 20,

  grabCursor: true

});





carousel.on("update", (data, {

  slides

}) => {

  slides.forEach(({

    element,

    size,

    progress,

    coord

  }) => {

    const x = progress > 0 ? 0 : coord;

    const z = progress < 0 ? 0 : size * progress * -1;

    const brightness = clamp(1 - progress * 0.5);



    element.style.transform = `translateX(${x}px) translateZ(${z}px)`;

    element.style.filter = `brightness(${brightness})`;

  });

});



container.classList.add("ready");
```

## Wavy Sine[​](#wavy-sine "Direct link to Wavy Sine")

[Vevet Demo WbxWVyO](https://codepen.io/anton-bobrov/embed/WbxWVyO?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide"><img src="https://picsum.photos/id/12/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/47/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/83/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/119/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/156/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/198/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/234/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/276/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/301/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/349/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/377/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/412/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/445/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/488/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/521/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/556/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/602/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/643/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/689/600/900" alt=""></div>

  <div class="slide"><img src="https://picsum.photos/id/732/600/900" alt=""></div>

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

  --size: max(20vw, 20vh);



  position: fixed;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: calc(var(--size) * 0.625);

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

  width: 100%;

  height: 100%;

  border-radius: 8px;

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

  clamp

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  eventsEmitter: document.documentElement,

  direction: "horizontal",

  centered: true,

  loop: true,

  gap: 30,

  grabCursor: true,

  freemode: true

});





carousel.on("update", (data, {

  slides

}) => {

  const sineFrequency = 0.25;

  const sineAmp = 0.5;

  const rotationAmp = -30;

  const scaleAmp = 0.2;



  slides.forEach(({

    element,

    size,

    progress,

    coord

  }) => {

    const x = coord;

    const y = Math.sin(progress * Math.PI * sineFrequency) * size * sineAmp;

    const rotate = Math.cos(progress * Math.PI * sineFrequency) * rotationAmp;

    const scale = clamp(1 - Math.abs(progress) * scaleAmp);



    element.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rotate}deg) scale(${scale})`;

  });

});



container.classList.add("ready");
```

## Clip-Path Carousel[​](#clip-path-carousel "Direct link to Clip-Path Carousel")

[Vevet Demo QwKwBvv](https://codepen.io/anton-bobrov/embed/QwKwBvv?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/608/1920/1080" alt="">

    <p class="title">Slide 1</p>

  </div>



  <div class="slide">

    <img class="image" src="https://picsum.photos/id/698/1920/1080" alt="">

    <p class="title">Slide 2</p>

  </div>



  <div class="slide">

    <img class="image" src="https://picsum.photos/id/988/1920/1080" alt="">

    <p class="title">Slide 3</p>

  </div>



  <div class="slide">

    <img class="image" src="https://picsum.photos/id/788/1920/1080" alt="">

    <p class="title">Slide 4</p>

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

  height: 100vh;

  overflow: hidden;



  opacity: 0;

  transition: opacity 0.25s linear;



  transform-style: preserve-3d;

  perspective: 100rem;

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



  will-change: transform, clip-path;

}



.image {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.title {

  margin: 0;



  position: relative;



  font-size: 8vw;

  font-weight: bold;

  color: #fff;

}
```

JavaScript

```
import {

  Snap,

  EaseOutExpo

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  grabCursor: true,

  loop: true,

  direction: "vertical",

  wheel: true,

  followWheel: false,

  duration: 1500,

  lerp: 0.15

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    progress,

    isVisible

  }) => {

    let translateY = 0;

    let clipY1 = 100;

    let clipY2 = 100;

    let zIndex = 0;

    let rot = 0;

    let origin = "";



    if (progress >= 0 && progress < 1) {

      clipY1 = (1 - progress) * 100;

      clipY2 = (1 - progress ** 2) * 100;

      translateY = progress * -10;

      rot = 50 * progress;

      zIndex = 2;

      origin = "top center";

    } else if (progress < 0 && progress > -1) {

      clipY1 = (1 - progress) * 100;

      translateY = progress * -10;

      rot = 50 * progress;

      zIndex = 1;

      origin = "bottom center";

    } else {

      translateY = 500;

    }



    element.style.clipPath = `polygon(0% 0%, 100% 0%, 100% ${clipY1}%, 0% ${clipY2}%)`;

    element.style.transform = `translate(0, ${translateY}%) rotateX(${rot}deg)`;

    element.style.transformOrigin = origin;

    element.style.zIndex = zIndex;

  });

});
```

## Fullsize Parallax Rotation[​](#fullsize-parallax-rotation "Direct link to Fullsize Parallax Rotation")

[Vevet Demo bNwKERM](https://codepen.io/anton-bobrov/embed/bNwKERM?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img class="image" data-snap-parallax-y="30%" data-snap-parallax-scale="0.1" data-snap-parallax-scale-abs src="https://picsum.photos/id/608/1920/1080" alt="">

    <div class="content" data-snap-parallax-opacity="-1" data-snap-parallax-rotate="-10deg" data-snap-parallax-y="20%" data-snap-parallax-scale="0.05">

      <p class="title">Slide 1</p>

      <p class="description">Lorem ipsum dolor sit amet</p>

    </div>

  </div>



  <div class="slide">

    <img class="image" data-snap-parallax-y="30%" data-snap-parallax-scale="0.1" data-snap-parallax-scale-abs src="https://picsum.photos/id/698/1920/1080" alt="">

    <div class="content" data-snap-parallax-opacity="-1" data-snap-parallax-rotate="-10deg" data-snap-parallax-y="20%" data-snap-parallax-scale="0.05">

      <p class="title">Slide 2</p>

      <p class="description">Lorem ipsum dolor sit amet</p>

    </div>

  </div>



  <div class="slide">

    <img class="image" data-snap-parallax-y="30%" data-snap-parallax-scale="0.1" data-snap-parallax-scale-abs src="https://picsum.photos/id/988/1920/1080" alt="">

    <div class="content" data-snap-parallax-opacity="-1" data-snap-parallax-rotate="-10deg" data-snap-parallax-y="20%" data-snap-parallax-scale="0.05">

      <p class="title">Slide 3</p>

      <p class="description">Lorem ipsum dolor sit amet</p>

    </div>

  </div>



  <div class="slide">

    <img class="image" data-snap-parallax-y="30%" data-snap-parallax-scale="0.1" data-snap-parallax-scale-abs src="https://picsum.photos/id/788/1920/1080" alt="">

    <div class="content" data-snap-parallax-opacity="-1" data-snap-parallax-rotate="-10deg" data-snap-parallax-y="20%" data-snap-parallax-scale="0.05">

      <p class="title">Slide 1</p>

      <p class="description">Lorem ipsum dolor sit amet</p>

    </div>

  </div>

  <div class="slide">

    <img class="image" data-snap-parallax-y="30%" data-snap-parallax-scale="0.1" src="https://picsum.photos/id/608/1920/1080" alt="">

    <div class="content" data-snap-parallax-opacity="-1" data-snap-parallax-rotate="-10deg" data-snap-parallax-y="20%" data-snap-parallax-scale="0.05">

      <p class="title">Slide 4</p>

      <p class="description">Lorem ipsum dolor sit amet</p>

    </div>

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

  height: 100vh;

  overflow: hidden;



  opacity: 0;

  transition: opacity 0.25s linear;



  transform-style: preserve-3d;

  perspective: 100rem;

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

  padding: 0 10vw;

  overflow: hidden;



  will-change: transform, clip-path;

}



.image {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.content {

  position: relative;

  width: 100%;

  height: 100%;

  transform-origin: center left;



  display: flex;

  flex-direction: column;

  align-items: flex-start;

  justify-content: center;

  gap: 1vw;

}



.title {

  margin: 0;



  font-size: 8vw;

  font-weight: bold;

  color: #fff;

}



.description {

  margin: 0;



  font-size: 3vw;

  font-weight: bold;

  color: #fff;

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

  grabCursor: true,

  loop: true,

  direction: "vertical",

  wheel: true,

  followWheel: false,

  duration: 1500

});





container.classList.add("ready");



carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord

  }) => {

    element.style.transform = `translateY(${coord}px)`;

  });

});
```

## Arc Carousel[​](#arc-carousel "Direct link to Arc Carousel")

[Vevet Demo qEayRzw](https://codepen.io/anton-bobrov/embed/qEayRzw?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/608/1920/1080" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/609/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/610/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/620/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/621/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/622/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/623/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/634/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/625/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/626/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/627/700/700" alt="">

  </div>

  <div class="slide">

    <img class="image" src="https://picsum.photos/id/628/700/700" alt="">

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



.carousel {

  --slide-size: calc(min(100vh, 100vw) / 5);



  position: relative;

  width: 100vw;

  height: var(--slide-size);



  opacity: 0;

  transition: opacity 0.25s linear;



  transform-style: preserve-3d;

  perspective: calc(var(--slide-size) * 2);

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  width: var(--slide-size);

  height: var(--slide-size);



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: calc(var(--slide-size) * 0.1);

  overflow: hidden;

}



.image {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}
```

JavaScript

```
import {

  Snap,

  scoped

} from "vevet.9.0";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  grabCursor: true,

  loop: true,

  gap: "1rem",

  centered: true,

  freemode: true

});





container.classList.add("ready");



carousel.on("update", () => {

  const {

    domSize

  } = carousel;



  carousel.slides.forEach(({

    element,

    coord,

    size

  }) => {

    const amp = size;

    const t = (coord + size / 2) / domSize;

    const centerT = scoped(t, 0.5, 1);



    const y = Math.sin(Math.PI * t) * -amp + size / 2;



    const slope = amp * Math.PI * Math.cos(Math.PI * t) / carousel.domSize;



    const rotation = -Math.atan(slope);

    const z = (1 - Math.abs(centerT)) * size;



    element.style.transform = `

      translate3d(${coord}px, ${y}px, ${z}px)

      rotate(${rotation}rad)

    `;

  });

});
```

## Expo Slider[​](#expo-slider "Direct link to Expo Slider")

[Vevet Demo MYyLroo](https://codepen.io/anton-bobrov/embed/MYyLroo?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="0.25" data-snap-parallax-scale-abs data-snap-parallax-x="-12.5%" data-snap-parallax-x-scope="-2,2" data-snap-parallax-rotate-y="10deg">

      <img class="image" src="https://picsum.photos/id/758/1920/1080" data-snap-parallax-x="20%" data-snap-parallax-opacity="-0.2" alt="">



      <p class="title" data-snap-parallax-x="20vw" data-snap-parallax-opacity="-2" data-snap-parallax-opacity-scope="-0.5,0.5">Title 1</p>

    </div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="0.25" data-snap-parallax-scale-abs data-snap-parallax-x="-12.5%" data-snap-parallax-x-scope="-2,2" data-snap-parallax-rotate-y="10deg">

      <img class="image" src="https://picsum.photos/id/760/1920/1080" data-snap-parallax-x="20%" data-snap-parallax-opacity="-0.2" alt="">



      <p class="title" data-snap-parallax-x="20vw" data-snap-parallax-opacity="-2" data-snap-parallax-opacity-scope="-0.5,0.5">Title 2</p>

    </div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="0.25" data-snap-parallax-scale-abs data-snap-parallax-x="-12.5%" data-snap-parallax-x-scope="-2,2" data-snap-parallax-rotate-y="10deg">

      <img class="image" src="https://picsum.photos/id/768/1920/1080" data-snap-parallax-x="20%" data-snap-parallax-opacity="-0.2" alt="">



      <p class="title" data-snap-parallax-x="20vw" data-snap-parallax-opacity="-2" data-snap-parallax-opacity-scope="-0.5,0.5">Title 3</p>

    </div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="0.25" data-snap-parallax-scale-abs data-snap-parallax-x="-12.5%" data-snap-parallax-x-scope="-2,2" data-snap-parallax-rotate-y="10deg">

      <img class="image" src="https://picsum.photos/id/832/1920/1080" data-snap-parallax-x="20%" data-snap-parallax-opacity="-0.2" alt="">



      <p class="title" data-snap-parallax-x="20vw" data-snap-parallax-opacity="-2" data-snap-parallax-opacity-scope="-0.5,0.5">Title 4</p>

    </div>

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

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: relative;

  width: 100%;

  height: 75%;



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

  width: 65vw;



  transform-style: preserve-3d;

  perspective: 100vw;

}



.wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: #000;

  border-radius: 16px;

  overflow: hidden;

}



.image {

  position: absolute;

  top: 0;

  left: -20%;

  width: 140%;

  height: 100%;

  object-fit: cover;

}



.title {

  margin: 0;



  position: absolute;

  bottom: 5vw;

  left: 5vw;



  font-size: 8vw;

  font-weight: bold;

  color: #fff;

}
```

JavaScript

```
import {

  Snap,

  EaseOutExpo

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  centered: true,

  loop: true,

  grabCursor: true,

  gap: "2,5vw",

  lerp: 0.2,

  easing: EaseOutExpo,

  duration: 1500

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

## Cards[​](#cards "Direct link to Cards")

[Vevet Demo QwNYJGo](https://codepen.io/anton-bobrov/embed/QwNYJGo?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide" style="background: linear-gradient(35deg, #a33c45ff 0%, #d7888eff 100%)">1</div>

  <div class="slide" " style=" background: linear-gradient(35deg, rgba(149,112,112,1) 0%, rgba(194,167,167,1) 100%)">2</div>

  <div class="slide" style="background: linear-gradient(35deg, #e7a873 0%, #f7c6a4 100%)">3</div>

  <div class="slide" style="background: linear-gradient(35deg, #FF8B94 0%, #ffc9cd 100%)">4</div>

  <div class="slide" style="background: linear-gradient(35deg, rgba(172,162,92,1) 0%, rgba(214,208,156,1) 100%)">5</div>

  <div class="slide" style="background: linear-gradient(35deg, #654b4bff 0%, #9a7f7fff 100%)">6</div>

  <div class="slide" style="background: linear-gradient(35deg, #61783bff 0%, #95ab6aff 100%)">7</div>

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

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



.carousel {

  position: fixed;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: 240px;

  height: 320px;



  transform-style: preserve-3d;

  perspective: 1000px;



  opacity: 0;

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

  flex-direction: column;

  justify-content: center;

  align-items: center;



  border-radius: 20px;



  font-weight: bold;

  font-size: 20px;

  color: #fff;

}
```

JavaScript

```
import {

  Snap,

  inRange,

  clamp

} from "vevet";



const container = document.getElementById("carousel");

let startIndex = 0;



new Snap({

    container: container,

    direction: "horizontal",

    grabCursor: true

  },



  {

    onResize: () => {

      container.classList.add("ready");

    },

    onSwipeStart: (data, {

      activeIndex

    }) => {

      startIndex = activeIndex;

    },

    onUpdate: (data, {

      slides

    }) => {

      const baseRotation = 6;

      const baseX = 12;

      const baseZ = -100;

      const maxVisible = 6;



      slides.forEach(({

        element,

        index,

        progress

      }) => {

        let x = -baseX * progress;

        let rotate = progress * -baseRotation;

        const z = Math.abs(progress) * baseZ;



        if (inRange(progress, -1, 1)) {

          if (startIndex === index) {

            x += Math.sin(Math.PI * progress) * -60;

          } else {

            x += Math.sin(Math.PI * progress) * -20;

          }

        }



        x = clamp(x, -baseX * maxVisible, baseX * maxVisible);



        rotate = clamp(

          rotate,

          -baseRotation * maxVisible,

          baseRotation * maxVisible);





        element.style.transform = `translateX(${x}%) translateZ(${z}px) rotate(${rotate}deg)`;

      });

    }

  });
```

## Expand Slide[​](#expand-slide "Direct link to Expand Slide")

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

## Slick Gap[​](#slick-gap "Direct link to Slick Gap")

[Vevet Demo myVpvoe](https://codepen.io/anton-bobrov/embed/myVpvoe?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/757/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/59/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/400/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/260/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/358/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/478/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/625/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/356/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/380/600/900" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/652/600/900" alt="">

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



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  width: calc(var(--size) * 0.6);

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

  freemode: "sticky",

  shortSwipes: false

});





carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    coord,

    progress

  }) => {

    const absGap = Math.abs(progress) * -20;

    const gap = progress * absGap;



    element.style.transform = `translateX(${coord + gap}px)`;

  });

});



container.classList.add("ready");
```

## Android UI[​](#android-ui "Direct link to Android UI")

[Vevet Demo OPMvbZL](https://codepen.io/anton-bobrov/embed/OPMvbZL?default-tab=result)

CSS

```
body {

  height: 100vh;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.phone {

  --size: 85vh;



  position: fixed;

  top: 50%;

  left: 50%;

  transform: translate(-50%, -50%);

  width: calc(0.4617 * var(--size));

  height: var(--size);

  border: calc(0.012 * var(--size)) solid #000;

  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);



  border-radius: calc(0.04 * var(--size));

  overflow: hidden;

}



.main {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

}



.pages-nav {

  position: absolute;

  bottom: 15.8%;

  left: 50%;

  transform: translateX(-50%);



  display: flex;

  gap: calc(0.01328125 * var(--size));



  margin: 0;

  padding: 0;

  list-style-type: none;

}



.pages-nav__button {

  display: block;

  padding: 0;

  border: 0;

  width: calc(0.0078125 * var(--size));

  height: calc(0.0078125 * var(--size));

  border-radius: 50%;

  opacity: 0.5;

  transition: opacity 0.125s linear;



  background: #fff;



  &.active {

    opacity: 1;

  }

}



.pages {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

}



.grid {

  position: absolute;

  top: 0;

  left: 0;

  box-sizing: border-box;

  width: 100%;



  display: grid;

  grid-template-columns: repeat(5, 1fr);

  gap: calc(0.03 * var(--size)) calc(0.023 * var(--size));

  padding: calc(0.096 * var(--size)) calc(0.03 * var(--size));



  img {

    width: 100%;

    height: auto;

  }



  div {

    aspect-ratio: 1;

  }

}



.wallpaper {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.active-apps {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background: rgb(0 0 0 / 50%);



  transform-style: preserve-3d;

  perspective: var(--size);



  opacity: 0;

  pointer-events: none;



  &.active {

    pointer-events: all;

  }

}



.active-apps__slide {

  position: absolute;

  top: calc(0.144 * var(--size));

  left: 0;

  width: calc(0.2912 * var(--size));

  height: calc(0.5965 * var(--size));



  display: flex;

  flex-direction: column;

  justify-content: center;

  align-items: center;

}



.active-apps__preview {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  background-position: cover;

  border-radius: calc(0.022 * var(--size));

}



.active-apps__icon {

  position: absolute;

  z-index: 1;

  top: 0;

  left: 50%;

  width: 20%;

  height: auto;

  transform: translate(-50%, -50%);

}



.navbar {

  position: absolute;

  bottom: calc(-0.023437 * var(--size));

  bottom: 0;

  left: 50%;

  width: calc(0.16 * var(--size));

  height: calc(0.0359375 * var(--size));

  transform: translateX(-50%);

  cursor: grab;



  &::before {

    content: "";

    position: absolute;

    top: 50%;

    left: 0;

    width: 100%;

    height: calc(0.0046875 * var(--size));

    margin-top: calc(0.0046875 * var(--size));

    border-radius: 3px;

    opacity: 0.5;

    background: #fff;



    animation: navbar-pulse;

    animation-duration: 2s;

    animation-iteration-count: infinite;

  }

}



@keyframes navbar-pulse {

  from {

    transform: scale(1) translateY(0%);

  }



  50% {

    transform: scale(1.1) translateY(-100%);

  }



  to {

    transform: scale(1) translateY(0%);

  }

}
```

JavaScript

```
import {

  Snap,

  lerp,

  clamp,

  scoped,

  EaseInOutSine,

  Swipe,

  addEventListener,

  easing,

  Timeline,

  clampScope,

  EaseOutSine

} from "vevet";



const activeAppsContainer = document.querySelector(".active-apps");

const navbarContainer = document.querySelector(".navbar");

const pagesContainer = document.querySelector(".pages");



const pages = new Snap({

  container: pagesContainer,

  direction: "horizontal"

});





pages.on("update", () => {

  pages.slides.forEach(({

    element,

    coord

  }) => {

    element.style.transform = `translateX(${coord}px)`;

  });

});



const pagesDots = document.querySelectorAll(".pages-nav__button");

pagesDots[0].classList.add("active");



pages.on("activeSlide", () => {

  pagesDots.forEach((dot, index) => {

    dot.classList.toggle("active", index === pages.activeIndex);

  });

});



///



const activeApps = new Snap({

  container: activeAppsContainer,

  direction: "horizontal",

  gap: "2.8vh",

  centered: true,

  freemode: "sticky",

  shortSwipes: false,

  swipeInertiaRatio: 0.1,

  activeIndex: activeAppsContainer.children.length - 1

});





const activeAppsIcons = activeApps.slides.map((slide) =>

  slide.element.querySelector(".active-apps__icon"));





activeApps.on("update", () => renderActiveApps(1));



function renderActiveApps(progress, parallax = 0) {

  const activeSlideCoords = getActiveAppsCoords(activeApps.activeSlide);



  activeApps.slides.forEach(slide => {

    const targetCoords = getActiveAppsCoords(slide);

    const x = lerp(activeSlideCoords.x, targetCoords.x, progress) + parallax;



    const z = lerp(activeSlideCoords.z, targetCoords.z, progress);



    const scale = lerp(activeSlideCoords.scale, targetCoords.scale, progress);



    const rotate = lerp(

      activeSlideCoords.rotate,

      targetCoords.rotate,

      progress);





    const iconOpacity = 1 - clamp(Math.abs(slide.progress));

    const iconScale = lerp(0.75, 1.01, iconOpacity);

    const iconY = lerp(40, 0, iconOpacity);



    const icon = activeAppsIcons[slide.index];



    slide.element.style.transform = `translate3d(${x}px, 0, ${z}px) scale(${scale}) rotateY(${rotate}deg)`;

    icon.style.transform = `scale(${iconScale}) translate(-50%, ${

    -50 - iconY

    }%)`;

    icon.style.opacity = `${iconOpacity}`;

  });

}



function getActiveAppsCoords({

  coord,

  progress,

  size

}) {

  let scale = 1;

  let x = coord;

  let z = 0;

  let rotate = 0;



  if (progress < 0) {

    const scaleProgress = clamp(Math.abs(progress), 0, 1);

    const targetScale = 1.0497;

    scale = 1 + (targetScale - 1) * scaleProgress;

  } else {

    x += size * progress * 0.725;

    z += size * progress * -0.35;

    rotate = progress * 10;

  }



  return {

    scale,

    x,

    z,

    rotate

  };

}



///



let showActiveAppsTm;

let hideActiveAppsTm;



let isAactiveAppsVisible = false;



function showActiveApps() {

  if (showActiveAppsTm || isAactiveAppsVisible || hideActiveAppsTm) {

    return;

  }



  activeAppsContainer.classList.add("active");



  isAactiveAppsVisible = true;



  showActiveAppsTm = new Timeline({

    duration: 650

  });



  showActiveAppsTm.on("update", ({

    progress

  }) => {

    const showProgress = clampScope(progress, [0, 0.5]);

    const appsProgress = clampScope(progress, [0.3, 1]);



    pagesContainer.style.transform = `scale(${1 - 0.05 * progress})`;

    pagesContainer.style.opacity = `${1 - progress}`;



    activeAppsContainer.style.backdropFilter = `blur(${showProgress * 10}px)`;

    activeAppsContainer.style.opacity = `${showProgress}`;



    const appsParallax = lerp(-20, 0, easing(appsProgress, EaseOutSine));

    renderActiveApps(easing(appsProgress, EaseOutSine), appsParallax);

  });



  showActiveAppsTm.on("end", () => {

    showActiveAppsTm = undefined;

  });



  showActiveAppsTm.play();

}



function hideActiveApps() {

  if (!isAactiveAppsVisible || showActiveAppsTm) {

    return;

  }



  activeAppsContainer.classList.remove("active");



  isAactiveAppsVisible = false;



  hideActiveAppsTm = new Timeline({

    duration: 200

  });



  hideActiveAppsTm.on("update", ({

    progress

  }) => {

    const showProgress = 1 - progress;



    pagesContainer.style.transform = `scale(${0.95 + 0.05 * progress})`;

    pagesContainer.style.opacity = `${progress}`;



    activeAppsContainer.style.backdropFilter = `blur(${showProgress * 10}px)`;

    activeAppsContainer.style.opacity = `${showProgress}`;

  });



  hideActiveAppsTm.on("end", () => {

    hideActiveAppsTm = undefined;

    activeApps.toSlide(activeApps.slides.length - 1, {

      duration: 0

    });

  });



  hideActiveAppsTm.play();

}



///



const activeAppsOutsideClick = addEventListener(

  activeAppsContainer,

  "click",

  evt => {

    const {

      target

    } = evt;

    const isSlide = activeApps.slides.some(({

        element

      }) =>

      element?.contains(target));





    if (!isSlide) {

      hideActiveApps();

    }

  });





///



const navbarSwipe = new Swipe({

  container: navbarContainer,

  axis: "y"

});





navbarSwipe.on("move", ({

  diff

}) => {

  const max = -50;

  const swipeProgress = easing(clamp(diff.y / max, 0, 1), EaseInOutSine);



  const y = swipeProgress * max;

  const scale = 1 + swipeProgress * 0.1;



  navbarContainer.style.transition = "none";

  navbarContainer.style.transform = `translate(-50%, ${y}%) scale(${scale})`;

});



navbarSwipe.on("end", ({

  diff

}) => {

  navbarContainer.style.transition = "transform 0.35s ease-out";

  navbarContainer.style.transform = "translate(-50%, 0)";



  if (diff.y < -20) {

    if (isAactiveAppsVisible) {

      hideActiveApps();

    } else {

      showActiveApps();

    }

  }

});
```

## 3D Stack[​](#3d-stack "Direct link to 3D Stack")

[Vevet Demo dPGddQL](https://codepen.io/anton-bobrov/embed/dPGddQL?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/170/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/190/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/230/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/260/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/270/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/280/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/330/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/340/1920/1080" alt="">

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

  --size: min(80vw, 80vh);



  position: fixed;

  top: 50%;

  left: 50%;

  width: var(--size);

  height: calc(var(--size) * 0.7);

  transform: translate(-50%, -50%);



  transform-style: preserve-3d;

  perspective: 1000px;



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  width: 100%;

  height: 100%;

  border-radius: 16px;

  overflow: hidden;

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

  inRange,

  lerp

} from "vevet";



const container = document.getElementById("carousel");



const ampX = 0.2;

const ampY = 0.6;

const ampZ = 0.5;

const rotateYAmp = -35;



const carousel = new Snap({

  container,

  direction: "vertical",

  grabCursor: true,

  wheel: true,

  loop: true

});





carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    progress,

    size

  }) => {

    let opacity = 0;

    let y = 0;

    let x = 0;

    let z = 0;

    let rotateX = 0;

    let rotateZ = 0;

    let brightness = 1;

    let skew = 0;



    if (inRange(progress, 0, 1)) {

      const sine = Math.sin(Math.PI * progress);

      y = sine * size * ampY * -1;

      x = sine * size * ampX * -1;

      z = progress * size * ampZ * -1;

      rotateX = progress * 180;

      rotateZ = sine * rotateYAmp;

      opacity = 1;

      brightness = lerp(1, 0.25, progress);

      skew = lerp(0, 10, sine);

    } else if (inRange(progress, -1, 0)) {

      z = progress * size * ampZ;

      opacity = 1;

    }



    element.style.opacity = `${opacity}`;

    element.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) skew(${skew}deg)`;

    element.style.filter = `brightness(${brightness})`;

  });

});



container.classList.add("ready");
```

## 3D Stack 2[​](#3d-stack-2 "Direct link to 3D Stack 2")

[Vevet Demo PwNXrEV](https://codepen.io/anton-bobrov/embed/PwNXrEV?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/170/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/190/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/230/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/260/1920/1080" alt="">

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

  --size: min(80vw, 80vh);



  position: fixed;

  top: 50%;

  left: 50%;

  width: var(--size);

  height: calc(var(--size) * 0.7);

  transform: translate(-50%, -50%);



  transform-style: preserve-3d;

  perspective: calc(var(--size) * 1.5);



  opacity: 0;

  transition: opacity 0.25s linear;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  width: 100%;

  height: 100%;

  border-radius: 16px;

  overflow: hidden;

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

  inRange,

  lerp,

  clamp

} from "vevet";



const container = document.getElementById("carousel");



const ampY = 0.5;

const ampZ = 0.6;



const carousel = new Snap({

  container,

  direction: "vertical",

  grabCursor: true,

  wheel: true

});





carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    progress,

    size

  }) => {

    let opacity = 0;

    let y = 0;

    let z = 0;

    let rotateX = 0;

    let brightness = 1;



    if (inRange(progress, 0, 1)) {

      const sine = Math.sin(Math.PI * progress);

      y = sine * size * ampY * -1;

      z = progress * size * ampZ * -1;

      rotateX = progress * 180;

      opacity = 1;

      brightness = lerp(1, 0.25, progress);

    } else if (inRange(progress, -Infinity, 0)) {

      y = progress * size * -0.2;

      z = progress * size * ampZ;

      opacity = 1;

      brightness = clamp(1 - Math.abs(progress) * 0.25);

      rotateX = progress * 5;

    }



    element.style.opacity = `${opacity}`;

    element.style.transform = `translate3d(0, ${y}px, ${z}px) rotateX(${rotateX}deg)`;

    element.style.filter = `brightness(${brightness})`;

  });

});



container.classList.add("ready");
```

## TimeSelect[​](#timeselect "Direct link to TimeSelect")

[Vevet Demo KwMgpvV](https://codepen.io/anton-bobrov/embed/KwMgpvV?default-tab=result)

HTML

```
<div class="carousel" id="hours"></div>



:



<div class="carousel" id="minutes"></div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 20px;

  box-sizing: border-box;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  gap: 1rem;



  height: 100vh;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 2rem;

  line-height: 2rem;

  font-weight: bold;

  color: #ececec;

}



.carousel {

  position: relative;

  width: 4rem;

  height: 100%;



  opacity: 0;

  transition: opacity 0.25s linear;



  transform-style: preserve-3d;

  perspective: 6rem;

}



.carousel.ready {

  opacity: 1;

}



.slide {

  position: absolute;

  top: 0;

  left: 0;

  height: 3rem;

  width: 100%;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  box-sizing: border-box;

}
```

JavaScript

```
import {

  Snap,

  clamp,

  scoped

} from "vevet";



function createSelect(container, max) {

  for (let i = 0; i < max; i += 1) {

    if (window.CP.shouldStopExecution(0)) break;

    const slide = document.createElement("div");

    slide.classList.add("slide");

    container.append(slide);



    slide.innerHTML = `${i}`.padStart(2, "0");

  }

  window.CP.exitedLoop(0);



  const carousel = new Snap({

    container,

    gap: 0,

    direction: "vertical",

    loop: true,

    centered: true,

    freemode: "sticky",

    wheel: true,

    grabCursor: true,

    swipeInertiaRatio: 0.6,

    shortSwipes: false

  });





  container.classList.add("ready");



  carousel.on("update", () => {

    carousel.slides.forEach(({

      element,

      coord,

      isVisible,

      progress

    }) => {

      const rotateX = progress * 20;

      const z = Math.abs(progress) * -0.5;

      const opacity = 1 - clamp(Math.abs(scoped(progress, 0, 2.5)));



      element.style.transform = `translate(0, ${coord}px) rotateX(${rotateX}deg) translateZ(${z}rem)`;

      element.style.opacity = opacity;

    });

  });

}



createSelect(document.getElementById("hours"), 24);

createSelect(document.getElementById("minutes"), 60);
```

## Parallax Glide[​](#parallax-glide "Direct link to Parallax Glide")

[Vevet Demo dPGJaZr](https://codepen.io/anton-bobrov/embed/dPGJaZr?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/940/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/950/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/960/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/970/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/980/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/990/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/1000/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/1020/1920/1080" alt="">

  </div>

</div>



<ul class="dots">

  <li>

    <button type="button" class="dot" title="Slide 1"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 2"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 3"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 4"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 5"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 6"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 7"></button>

  </li>

  <li>

    <button type="button" class="dot" title="Slide 8"></button>

  </li>

</ul>
```

CSS

```
body {

  background: #000;

}



.carousel {

  position: fixed;

  top: 0;

  left: 0;

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

  width: 100%;

  height: 100%;

}



.slide img {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.dots {

  position: fixed;

  z-index: 1;

  bottom: 30px;

  left: 50%;

  transform: translateX(-50%);



  padding: 0;

  margin: 0;

  list-style-type: none;



  display: flex;

  gap: 10px;

}



.dot {

  padding: 0;

  cursor: pointer;



  width: 16px;

  height: 16px;

  border-radius: 50%;

  background-color: #fff;

  border: 2px solid #000;



  transition: border-color 0.35s linear, background-color 0.35s linear;

}



.dot.active {

  background-color: #000;

  border-color: #fff;

}
```

JavaScript

```
import {

  Snap,

  vevet,

  clamp

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  direction: "horizontal",

  grabCursor: true,

  wheel: true,

  wheelAxis: "y"

});





carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    size,

    coord,

    progress

  }) => {

    const parallax = clamp(progress, 0, 1);

    const x = coord + parallax * (size / 2);



    element.style.transform = `translateX(${x}px)`;

  });

});



container.classList.add("ready");



const dots = document.querySelectorAll(".dot");



dots.forEach((dot, index) => {

  dot.addEventListener("click", () => {

    carousel.toSlide(index);

  });

});



function updateDots() {

  dots.forEach((dot, index) => {

    dot.classList.toggle("active", index === carousel.activeIndex);

  });

}



carousel.on("activeSlide", updateDots);

updateDots();
```

## Simple Fade[​](#simple-fade "Direct link to Simple Fade")

[Vevet Demo qEbpgrJ](https://codepen.io/anton-bobrov/embed/qEbpgrJ?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <img src="https://picsum.photos/id/1070/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/1080/1920/1080" alt="">

  </div>

  <div class="slide">

    <img src="https://picsum.photos/id/1082/1920/1080" alt="">

  </div>

</div>



<ul class="dots">

  <li>

    <button type="button" class="dot" title="Slide 1"></button>

  </li>



  <li>

    <button type="button" class="dot" title="Slide 2"></button>

  </li>



  <li>

    <button type="button" class="dot" title="Slide 3"></button>

  </li>

</ul>
```

CSS

```
body {

  background: #000;

}



.carousel {

  position: fixed;

  top: 0;

  left: 0;

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

  width: 100%;

  height: 100%;

}



.slide img {

  display: block;

  width: 100%;

  height: 100%;

  object-fit: cover;

}



.dots {

  position: fixed;

  z-index: 1;

  bottom: 30px;

  left: 50%;

  transform: translateX(-50%);



  padding: 0;

  margin: 0;

  list-style-type: none;



  display: flex;

  gap: 10px;

}



.dot {

  padding: 0;

  cursor: pointer;



  width: 16px;

  height: 16px;

  border-radius: 50%;

  background-color: #fff;

  border: 2px solid #000;



  transition: border-color 0.35s linear, background-color 0.35s linear;

}



.dot.active {

  background-color: #000;

  border-color: #fff;

}
```

JavaScript

```
import {

  Snap,

  vevet,

  clamp

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  direction: "horizontal",

  followSwipe: false,

  loop: true

});





carousel.on("update", () => {

  carousel.slides.forEach(({

    element,

    size,

    coord,

    progress

  }) => {

    const opacity = clamp(1 - Math.abs(progress));



    element.style.opacity = `${opacity}`;

  });

});



container.classList.add("ready");



const dots = document.querySelectorAll(".dot");



dots.forEach((dot, index) => {

  dot.addEventListener("click", () => {

    carousel.toSlide(index);

  });

});



function updateDots() {

  dots.forEach((dot, index) => {

    dot.classList.toggle("active", index === carousel.activeIndex);

  });

}



carousel.on("activeSlide", updateDots);

updateDots();
```
