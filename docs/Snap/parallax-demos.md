# Parallax Demos

<!-- -->

## Parallax Gap[​](#parallax-gap "Direct link to Parallax Gap")

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

## Skew Parallax[​](#skew-parallax "Direct link to Skew Parallax")

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

## Scale Parallax[​](#scale-parallax "Direct link to Scale Parallax")

[Vevet Demo GgZbxyj](https://codepen.io/anton-bobrov/embed/GgZbxyj?default-tab=result)

HTML

```
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



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.2" data-snap-parallax-scale-scope="-1,1" data-snap-parallax-scale-abs>8</div>

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

  width: 20vw;

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

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  centered: true,

  loop: true,

  gap: "1vw",

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

## Reverse Scale Parallax[​](#reverse-scale-parallax "Direct link to Reverse Scale Parallax")

[Vevet Demo GgZbxEZ](https://codepen.io/anton-bobrov/embed/GgZbxEZ?default-tab=result)

HTML

```
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



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="0.33" data-snap-parallax-scale-offset="-0.66" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs>8</div>

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

  width: 20vw;

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

} from "vevet";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  centered: true,

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

## Impulse Scale[​](#impulse-scale "Direct link to Impulse Scale")

[Vevet Demo NPNQqWV](https://codepen.io/anton-bobrov/embed/NPNQqWV?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>1</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>2</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>3</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>4</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>5</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>6</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>7</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-1" data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-scope="const" data-snap-parallax-scale-abs data-snap-parallax-scale-influence>8</div>

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

  width: 20vw;

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

  gap: "1vw",

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

## Scoped Impulse Scale[​](#scoped-impulse-scale "Direct link to Scoped Impulse Scale")

[Vevet Demo yyOmYZq](https://codepen.io/anton-bobrov/embed/yyOmYZq?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">1</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">2</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">3</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">4</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">5</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">6</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">7</div>

  </div>



  <div class="slide">

    <div class="wrap" data-snap-parallax-scale="-0.25" data-snap-parallax-scale-scope="-2,2" data-snap-parallax-scale-abs data-snap-parallax-scale-min="0.5" data-snap-parallax-scale-max="1" data-snap-parallax-scale-influence="3">8</div>

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

  width: 20vw;

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

} from "vevet.7.0";



const container = document.getElementById("carousel");



const carousel = new Snap({

  container,

  centered: true,

  loop: true,

  gap: "1vw",

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

## Fullsize Parallax[​](#fullsize-parallax "Direct link to Fullsize Parallax")

[Vevet Demo gbrNeZW](https://codepen.io/anton-bobrov/embed/gbrNeZW?default-tab=result)

HTML

```
<div class="carousel" id="carousel">

  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 1</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 2</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 3</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 4</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 5</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 6</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 7</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

    </div>

  </div>



  <div class="slide">

    <div class="title" data-snap-parallax-x="10rem" data-snap-parallax-x-abs>Title 8</div>



    <div class="description" data-snap-parallax-x="20rem" data-snap-parallax-x-abs>

      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

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

  box-sizing: border-box;

  padding: 40px;



  display: flex;

  flex-direction: column;

  align-items: flex-start;

  justify-content: flex-end;

  gap: 2rem;

  overflow: hidden;



  background: rgba(255, 255, 255, 0.08);

}



.title {

  font-size: 4rem;

  font-weight: bold;

  transform-origin: left center;

}



.description {

  width: 100%;

  max-width: 40rem;

  font-size: 1rem;

  color: #ccc;

}



.slide:nth-child(1) {

  background: linear-gradient(35deg, #68272d 0%, #d7888eff 100%);

}



.slide:nth-child(2) {

  background: linear-gradient(35deg,

      rgb(116 87 87) 0%,

      rgba(194, 167, 167, 1) 100%);

}



.slide:nth-child(3) {

  background: linear-gradient(35deg, #8f6848 0%, #f7c6a4 100%);

}



.slide:nth-child(4) {

  background: linear-gradient(35deg, #9c5359 0%, #e7b2b6 100%);

}



.slide:nth-child(5) {

  background: linear-gradient(35deg,

      rgb(122 114 62) 0%,

      rgba(214, 208, 156, 1) 100%);

}



.slide:nth-child(6) {

  background: linear-gradient(35deg, #543f3f 0%, #9a7f7fff 100%);

}



.slide:nth-child(7) {

  background: linear-gradient(35deg, #47582b 0%, #95ab6aff 100%);

}



.slide:nth-child(8) {

  background: linear-gradient(35deg, #68462f 0%, #cfa681ff 100%);

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
