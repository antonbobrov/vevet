# Parallax

<!-- -->

Snap does not modify element styles by default, but it provides a set of optional parallax utilities for DOM elements.

Parallax effects are enabled using `data-` attributes.

caution

Do not apply parallax directly to the slide element. Use inner wrappers instead.

## Demos[​](#demos "Direct link to Demos")

### Skew Parallax[​](#skew-parallax "Direct link to Skew Parallax")

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

### Parallax Gap[​](#parallax-gap "Direct link to Parallax Gap")

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

## Parallax Effects[​](#parallax-effects "Direct link to Parallax Effects")

Each parallax attribute maps directly to a corresponding CSS transform (or opacity):

* `data-snap-parallax-x` -> `translateX()`
* `data-snap-parallax-y` -> `translateY()`
* `data-snap-parallax-z` -> `translateZ()`
* `data-snap-parallax-scale` -> `scale()` - value is added to `1`
* `data-snap-parallax-scale-x` -> `scaleX()` - value is added to `1`
* `data-snap-parallax-scale-y` -> `scaleY()` - value is added to `1`
* `data-snap-parallax-skew` -> `skew()`
* `data-snap-parallax-skew-x` -> `skewX()`
* `data-snap-parallax-skew-y` -> `skewY()`
* `data-snap-parallax-rotate` -> `rotate()`
* `data-snap-parallax-rotate-x` -> `rotateX()`
* `data-snap-parallax-rotate-y` -> `rotateY()`
* `data-snap-parallax-rotate-z` -> `rotateZ()`
* `data-snap-parallax-opacity` -> `opacity` - **should contain negative values only**, decreasing the current opacity.
  <br />
  <!-- -->
  The value is added to the current opacity and clamped to \[0, 1]

All effect attributes accept numbers or any supported CSS unit.

## Parallax Timeline (scope)[​](#parallax-timeline-scope "Direct link to Parallax Timeline (scope)")

By default, parallax values are applied while the slide transition progress is between `-1` and `1`.

You can inspect slide progress in **[this demo](https://vevetjs.com/docs/Snap/basic-demos.md#progress)**.

To change the active range, use the `data-snap-parallax-scope` attribute:

* numeric range like `data-snap-parallax-scope="-2, 2"`
* infinite range like `data-snap-parallax-scope="none"` or `data-snap-parallax-scope="-Infinity, Infinity"`
* constant range like `data-snap-parallax-scope="const"` `data-snap-parallax-scope="1,1"`; should be used with `data-snap-parallax-[effect]-impulse`

The scope applies to all parallax effects inside a slide unless overridden per effect via `data-snap-parallax-[effect]-scope`:

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-x="-200%"

    data-snap-parallax-scope="-2, 2"

  >

    Slide Info

  </div>

</div>



<!-- OR -->

<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-x="-200%"

    data-snap-parallax-scale-scope="-2, 2"

  >

    Slide Info

  </div>

</div>
```

## Parallax Strength (impulse)[​](#parallax-strength-impulse "Direct link to Parallax Strength (impulse)")

Use `data-snap-parallax-[effect]-impulse` to apply the effect only during dragging or wheeling.

The parallax value will smoothly increase or decrease based on interaction intensity, producing more "organic" motion.

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-skew="-200"

    data-snap-parallax-skew-scope="1,1"

    data-snap-parallax-skew-impulse

  >

    Slide Info

  </div>

</div>
```

## Positive Values[​](#positive-values "Direct link to Positive Values")

`data-snap-parallax-[effect]-abs` forces the effect to use absolute (non-negative) values.

This is useful for properties like `scale()` where negative values are undesirable.

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-scale="-0.5"

    data-snap-parallax-scale-abs

  >

    Slide Info

  </div>

</div>
```

## Clamping (min-max)[​](#clamping-min-max "Direct link to Clamping (min-max)")

data-snap-parallax-\[effect]-min`and`data-snap-parallax-\[effect]-max\` clamp the **final computed parallax value**, preventing it from going below or above the defined bounds:

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-scale="-0.25"

    data-snap-parallax-scale-scope="-2,2"

    data-snap-parallax-scale-abs

    data-snap-parallax-scale-min="0.5"

    data-snap-parallax-scale-max="1"

    data-snap-parallax-scale-impulse="3"

  >

    Slide Info

  </div>

</div>
```

## Value Offset[​](#value-offset "Direct link to Value Offset")

`data-snap-parallax-[effect]-offset` accepts a numeric value and forces a value offset for the active slide.

This might be useful for reverse animations.

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-scale="0.5"

    data-snap-parallax-scale-offset="-0.5"

    data-snap-parallax-scale-scope="-2,2"

    data-snap-parallax-scale-abs

  >

    Slide Info

  </div>

</div>
```

## Direction[​](#direction "Direct link to Direction")

`data-snap-parallax-[effect]-directional` adjusts the value’s sign automatically based on the scroll direction.

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-skew="-200"

    data-snap-parallax-skew-scope="1,1"

    data-snap-parallax-skew-impulse

    data-snap-parallax-skew-directional

  >

    Slide Info

  </div>

</div>
```

## Parallax example[​](#parallax-example "Direct link to Parallax example")

### Organic Gap[​](#organic-gap "Direct link to Organic Gap")

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-x="-50%"

    data-snap-parallax-x-scope="none"

    data-snap-parallax-x-impulse="3"

  >

    Slide Info

  </div>

</div>
```

### Center Scale[​](#center-scale "Direct link to Center Scale")

```
<div class="slide">

  <div

    class="wrap"

    data-snap-parallax-scale="-0.2"

    data-snap-parallax-scale-scope="-1,1"

    data-snap-parallax-scale-abs

  >

    Slide Info

  </div>

</div>
```
