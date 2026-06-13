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
<div class="carousel" id="carousel">

  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>1</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>2</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>3</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>4</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>5</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>6</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>7</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-skew="-40" data-snap-parallax-skew-min="-40" data-snap-parallax-skew-max="40" data-snap-parallax-skew-scope="const" data-snap-parallax-skew-influence="5" data-snap-parallax-skew-directional>8</div>

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

  width: 50vw;

  max-width: 50vh;

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

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: linear-gradient(35deg, #a33c45ff 0%, #d7888eff 100%);

}



.slide:nth-child(2) .wrap {

  background: linear-gradient(35deg,

      rgba(149, 112, 112, 1) 0%,

      rgba(194, 167, 167, 1) 100%);

}



.slide:nth-child(3) .wrap {

  background: linear-gradient(35deg, #e7a873 0%, #f7c6a4 100%);

}



.slide:nth-child(4) .wrap {

  background: linear-gradient(35deg, #ff8b94 0%, #ffc9cd 100%);

}



.slide:nth-child(5) .wrap {

  background: linear-gradient(35deg,

      rgba(172, 162, 92, 1) 0%,

      rgba(214, 208, 156, 1) 100%);

}



.slide:nth-child(6) .wrap {

  background: linear-gradient(35deg, #654b4bff 0%, #9a7f7fff 100%);

}



.slide:nth-child(7) .wrap {

  background: linear-gradient(35deg, #61783bff 0%, #95ab6aff 100%);

}



.slide:nth-child(8) .wrap {

  background: linear-gradient(35deg, #9e6a48ff 0%, #cfa681ff 100%);

}
```

JavaScript

```
import {

  Snap

} from "vevet.4.0";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  centered: true,

  loop: true,

  gap: 20,

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

### Parallax Gap[​](#parallax-gap "Direct link to Parallax Gap")

[Vevet Demo gbrqRXB](https://codepen.io/anton-bobrov/embed/gbrqRXB?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">1</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">2</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">3</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">4</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">5</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">6</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">7</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-x="-50%" data-snap-parallax-x-scope="none" data-snap-parallax-x-influence="3">8</div>

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

  width: 50vw;

  max-width: 50vh;

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

  border-radius: 16px;



  font-size: 2rem;

  font-weight: bold;

  color: #ececec;

}



.slide:nth-child(1) .wrap {

  background: linear-gradient(35deg, #a33c45ff 0%, #d7888eff 100%);

}



.slide:nth-child(2) .wrap {

  background: linear-gradient(35deg,

      rgba(149, 112, 112, 1) 0%,

      rgba(194, 167, 167, 1) 100%);

}



.slide:nth-child(3) .wrap {

  background: linear-gradient(35deg, #e7a873 0%, #f7c6a4 100%);

}



.slide:nth-child(4) .wrap {

  background: linear-gradient(35deg, #ff8b94 0%, #ffc9cd 100%);

}



.slide:nth-child(5) .wrap {

  background: linear-gradient(35deg,

      rgba(172, 162, 92, 1) 0%,

      rgba(214, 208, 156, 1) 100%);

}



.slide:nth-child(6) .wrap {

  background: linear-gradient(35deg, #654b4bff 0%, #9a7f7fff 100%);

}



.slide:nth-child(7) .wrap {

  background: linear-gradient(35deg, #61783bff 0%, #95ab6aff 100%);

}



.slide:nth-child(8) .wrap {

  background: linear-gradient(35deg, #9e6a48ff 0%, #cfa681ff 100%);

}
```

JavaScript

```
import {

  Snap

} from "vevet.4.0";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  centered: true,

  loop: true,

  gap: 20,

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
