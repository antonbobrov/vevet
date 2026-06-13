# SnapSlide

The `SnapSlide` class allows you to create virtual slides within the `Snap` system.<br /><!-- -->When initializing a `Snap` instance, you may omit the `slides` parameter — in this case, the container's child elements will be used automatically.<br /><!-- -->For advanced or fully custom logic, you can work with `SnapSlide` directly.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

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

## Parameters[​](#parameters "Direct link to Parameters")

### `container`[​](#container "Direct link to container")

* **Type:** `HTMLElement | null`
* **Default:** *none*
* The slide's associated HTML element.
  <br />
  <!-- -->
  Use `null` to create a fully virtual slide without a DOM element.

### `props`[​](#props "Direct link to props")

#### `size`[​](#size "Direct link to size")

* **Type:** `'auto' | 'stretch' | number | string`

* **Default:** `'auto'`

* Defines the slide size:

  <!-- -->

  * `'auto'` — Based on the element size or container size.
  * `'stretch'` — Always matches the container size.
  * `number` — Size in pixels.
  * CSS units such as `px`, `rem`, `vw`, `vh`, `svh`.

#### `virtual`[​](#virtual "Direct link to virtual")

* **Type:** `boolean`
* **Default:** `true`
* If enabled, the slide is treated as virtual and will be appended to the container only when it becomes visible.

## Accessors[​](#accessors "Direct link to Accessors")

### `coord`[​](#coord "Direct link to coord")

* **Type:** `number`
* Current slide coordinate in pixels (X or Y, depending on Snap direction).

### `element`[​](#element "Direct link to element")

* **Type:** `HTMLElement | null`
* The associated DOM element, if any.

### `id`[​](#id "Direct link to id")

* **Type:** `string`
* Unique slide identifier.

### `index`[​](#index "Direct link to index")

* **Type:** `number`
* Slide index within the Snap instance.

### `isVisible`[​](#isvisible "Direct link to isvisible")

* **Type:** `boolean`
* Indicates whether the slide is currently visible.

### `magnets`[​](#magnets "Direct link to magnets")

* **Type:** `number[]`
* Magnetic snap points for the slide in track coordinates. Positions depend on the Snap [`origin`](https://vevetjs.com/docs/Snap/props.md#props.origin) mode (`'start'`, `'center'`, or `'end'`).

### `progress`[​](#progress "Direct link to progress")

* **Type:** `number`
* Normalized slide movement progress, from `-1` to `1`.

### `size`[​](#size-1 "Direct link to size-1")

* **Type:** `number`
* Slide size in pixels.

### `staticCoord`[​](#staticcoord "Direct link to staticcoord")

* **Type:** `number`
* Static slide coordinate, unaffected by movement or animation.

## Methods[​](#methods "Direct link to Methods")

### `resize()`[​](#resize "Direct link to resize")

Recalculate the slide size and trigger a Snap layout reflow.

```
slide.resize();
```
