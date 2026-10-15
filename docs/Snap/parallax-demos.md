# Parallax Demos

<!-- -->

Built-in parallax via `data-snap-parallax-*` attributes on **inner wrappers** inside slides — not on the slide element itself.

See [Parallax](https://vevetjs.com/docs/Snap/parallax.md) for the full attribute reference (scope, impulse, offset, min/max, and more). Slide `progress` is explained in [Progress](https://vevetjs.com/docs/Snap/basic-demos.md#progress).

## Parallax gap[​](#parallax-gap "Direct link to Parallax gap")

Gap between slides grows with swipe or wheel intensity.

Example attributes on the inner wrapper:

* `data-snap-parallax-x="-50%"`
* `data-snap-parallax-x-scope="none"`
* `data-snap-parallax-x-impulse="3"`

[Vevet Demo gbrqRXB](https://codepen.io/anton-bobrov/embed/gbrqRXB?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">1</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">2</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">3</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">4</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">5</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">6</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-impulse="3">7</div>

    </div>



  </div>

</div>
```

CSS

```
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

}



.slide .wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 0.5rem;



  font-size: 1rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) .wrap {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) .wrap {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) .wrap {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) .wrap {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) .wrap {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) .wrap {

  background: var(--gradient-slide-7, #000);

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

  origin: "center",

  loop: true,

  gap: "1.25rem",

  lerp: 0.2,

  freemode: true,

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

[Open live demo ↗](https://vevetjs.com/pens/gbrqRXB)

## Skew parallax[​](#skew-parallax "Direct link to Skew parallax")

Slides skew in the swipe direction during interaction. Same parallax config on every slide.

Example attributes:

* `data-snap-parallax-skew="-40"`
* `data-snap-parallax-skew-min="-40"` / `data-snap-parallax-skew-max="40"`
* `data-snap-parallax-skew-scope="const"`
* `data-snap-parallax-skew-impulse="5"`
* `data-snap-parallax-skew-directional`

[Vevet Demo gbrqRjZ](https://codepen.io/anton-bobrov/embed/gbrqRjZ?default-tab=result)

HTML

```
<div class="fullpage-center">



  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>1</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>2</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>3</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>4</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>5</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>6</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-impulse="5" data-snap-parallax-skew-directional>7</div>

    </div>

  </div>

</div>
```

CSS

```
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

}



.slide .wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 0.5rem;



  font-size: 1rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) .wrap {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) .wrap {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) .wrap {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) .wrap {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) .wrap {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) .wrap {

  background: var(--gradient-slide-7, #000);

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

  origin: "center",

  loop: true,

  gap: "1.25rem",

  lerp: 0.2,

  freemode: true,

  shortSwipes: false,

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

[Open live demo ↗](https://vevetjs.com/pens/gbrqRjZ)

## Scale parallax[​](#scale-parallax "Direct link to Scale parallax")

Side slides shrink while the active slide stays at scale `1`. Uses a narrow progress scope so only neighbors are affected.

Example attributes:

* `data-snap-parallax-scale="-0.2"`
* `data-snap-parallax-scale-scope="-1,1"`
* `data-snap-parallax-scale-abs`

[Vevet Demo GgZbxyj](https://codepen.io/anton-bobrov/embed/GgZbxyj?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>1</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>2</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>3</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>4</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>5</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>6</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>7</div>

    </div>



  </div>

</div>
```

CSS

```
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

}



.slide .wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 0.5rem;



  font-size: 1rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) .wrap {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) .wrap {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) .wrap {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) .wrap {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) .wrap {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) .wrap {

  background: var(--gradient-slide-7, #000);

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

  origin: "center",

  loop: true,

  gap: "1.25rem",

  lerp: 0.2,

  freemode: "sticky",

  shortSwipes: false,

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

[Open live demo ↗](https://vevetjs.com/pens/GgZbxyj)

## Reverse scale parallax[​](#reverse-scale-parallax "Direct link to Reverse scale parallax")

Slides scale down as they approach the active position — smallest at center, larger toward the edges.

Example attributes:

* `data-snap-parallax-scale="0.33"`
* `data-snap-parallax-scale-offset="-0.66"`
* `data-snap-parallax-scale-scope="-2,2"`
* `data-snap-parallax-scale-abs`

[Vevet Demo GgZbxEZ](https://codepen.io/anton-bobrov/embed/GgZbxEZ?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>1</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>2</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>3</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>4</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>5</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>6</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>7</div>

    </div>

  </div>

</div>
```

CSS

```
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

}



.slide .wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 0.5rem;



  font-size: 1rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) .wrap {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) .wrap {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) .wrap {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) .wrap {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) .wrap {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) .wrap {

  background: var(--gradient-slide-7, #000);

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

  origin: "center",

  loop: true,

  gap: 0,

  lerp: 0.2,

  freemode: "sticky",

  shortSwipes: false,

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

[Open live demo ↗](https://vevetjs.com/pens/GgZbxEZ)

## Impulse scale[​](#impulse-scale "Direct link to Impulse scale")

Slides shrink only while the carousel is moving. Driven by interaction impulse, not slide progress.

Example attributes:

* `data-snap-parallax-scale="-1"`
* `data-snap-parallax-scale-min="0.5"`
* `data-snap-parallax-scale-scope="const"`
* `data-snap-parallax-scale-abs`
* `data-snap-parallax-scale-impulse`

[Vevet Demo NPNQqWV](https://codepen.io/anton-bobrov/embed/NPNQqWV?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>1</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>2</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>3</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>4</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>5</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>6</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-impulse>7</div>

    </div>

  </div>

</div>
```

CSS

```
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

}



.slide .wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 0.5rem;



  font-size: 1rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) .wrap {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) .wrap {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) .wrap {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) .wrap {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) .wrap {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) .wrap {

  background: var(--gradient-slide-7, #000);

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

  origin: "center",

  loop: true,

  gap: "1.25rem",

  lerp: 0.2,

  freemode: true,

  shortSwipes: false,

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

[Open live demo ↗](https://vevetjs.com/pens/NPNQqWV)

## Scoped impulse scale[​](#scoped-impulse-scale "Direct link to Scoped impulse scale")

Non-active slides scale during interaction, clamped between a min and max. Combines progress scope with impulse.

Example attributes:

* `data-snap-parallax-scale="-0.25"`
* `data-snap-parallax-scale-scope="-2,2"`
* `data-snap-parallax-scale-min="0.5"` / `data-snap-parallax-scale-max="1"`
* `data-snap-parallax-scale-abs`
* `data-snap-parallax-scale-impulse="3"`

[Vevet Demo yyOmYZq](https://codepen.io/anton-bobrov/embed/yyOmYZq?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">1</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">2</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">3</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">4</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">5</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">6</div>

    </div>



    <div class="slide">

      <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-impulse="3">7</div>

    </div>

  </div>

</div>
```

CSS

```
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

}



.slide .wrap {

  position: absolute;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;



  display: flex;

  justify-content: center;

  align-items: center;



  background: rgba(255, 255, 255, 0.08);

  border-radius: 0.5rem;



  font-size: 1rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) .wrap {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) .wrap {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) .wrap {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) .wrap {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) .wrap {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) .wrap {

  background: var(--gradient-slide-7, #000);

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

  origin: "center",

  loop: true,

  gap: "1.25rem",

  lerp: 0.2,

  freemode: true,

  shortSwipes: false,

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

[Open live demo ↗](https://vevetjs.com/pens/yyOmYZq)

## Fullsize parallax[​](#fullsize-parallax "Direct link to Fullsize parallax")

Horizontal full-width carousel. Title and description inside each slide move at different X speeds.

Example attributes on nested elements:

* `data-snap-parallax-x="10rem"` + `data-snap-parallax-x-abs` on the title
* `data-snap-parallax-x="20rem"` + `data-snap-parallax-x-abs` on the description

[Vevet Demo gbrNeZW](https://codepen.io/anton-bobrov/embed/gbrNeZW?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="carousel" id="carousel">

    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 1</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>



    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 2</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>



    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 3</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>



    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 4</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>



    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 5</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>



    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 6</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>



    <div class="slide">

      <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 7</div>



      <div class="description" data-snap-parallax-x="15rem" data-snap-parallax-x-abs>

        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

      </div>

    </div>

  </div>

</div>
```

CSS

```
.fullpage-center {

  padding: 0;

}



.carousel {

  position: relative;

  width: 100%;

  height: 100svh;



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

  box-sizing: border-box;

  padding: 1.75rem;



  display: flex;

  flex-direction: column;

  align-items: flex-start;

  justify-content: flex-end;

  gap: 1rem;

  overflow: hidden;



  background: rgba(255, 255, 255, 0.08);

}



.title {

  font-size: 1.5rem;

  font-weight: bold;

  transform-origin: left center;

}



.description {

  width: 100%;

  max-width: 40rem;

  font-size: 0.75rem;

}



.slide:nth-child(1) {

  background: var(--gradient-slide-1, #000);

}



.slide:nth-child(2) {

  background: var(--gradient-slide-2, #000);

}



.slide:nth-child(3) {

  background: var(--gradient-slide-3, #000);

}



.slide:nth-child(4) {

  background: var(--gradient-slide-4, #000);

}



.slide:nth-child(5) {

  background: var(--gradient-slide-5, #000);

}



.slide:nth-child(6) {

  background: var(--gradient-slide-6, #000);

}



.slide:nth-child(7) {

  background: var(--gradient-slide-7, #000);

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

  loop: true,

  lerp: 0.2,

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

[Open live demo ↗](https://vevetjs.com/pens/gbrNeZW)
