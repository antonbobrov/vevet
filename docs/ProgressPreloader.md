# ProgressPreloader

Page preloader for **tracking and displaying** the loading progress of resources (images, videos, custom elements).

* Takes images and videos into account
* Supports virtual resources
* Calculates smooth loading progress for better animations.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo VYYZdQG](https://codepen.io/anton-bobrov/embed/VYYZdQG?default-tab=result)

HTML

```
<div id="preloader">

  <div id="progress">00%</div>



  <button id="custom-loader" type="button" class="js-preload button" data-weight="4">

    Load Custom Resource (click twice)

  </button>

</div>



<div class="grid">

  <img src="https://picsum.photos/id/870/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/871/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/872/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/873/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/874/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/875/1000/1000" width="1000" height="1000" alt="" loading="lazy">

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0 30px;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  background-attachment: fixed;

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

}



#preloader {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  z-index: 1;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

  gap: 3vw;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-size: 50px;

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

  font-size: 16px;

  color: currentColor;



  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);



  &.hide {

    opacity: 0;

    pointer-events: none;

  }

}



.button:hover {

  background-position: right center;

}



.grid {

  width: 100%;

  min-height: 100vh;

  padding: 3vw;

  box-sizing: border-box;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 2vw;



  img {

    display: block;

    width: 30%;

    height: auto;

    border-radius: 10px;

  }

}
```

JavaScript

```
import {

  ProgressPreloader,

  clamp

} from "vevet";



const progressElement = document.getElementById("progress");

const customLoader = document.getElementById("custom-loader");



const preloader = new ProgressPreloader({

    container: document.getElementById("preloader"),

    hide: 700

  },



  {

    onProgress: () => {

      const {

        progress

      } = preloader;

      const percent = clamp(progress * 100, 0, 99);

      const html = `${percent.toFixed(0).padStart(2, "0")}%`;



      progressElement.innerHTML = html;

    }

  });







customLoader.addEventListener("click", () => {

  const resource = preloader.resources.find(({

    id

  }) => id === customLoader);

  preloader.resolveResource(customLoader, resource.loaded + 2);



  if (resource.loaded === resource.weight) {

    customLoader.classList.add("hide");

  }

});
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/ProgressPreloader/demos.md).

## Features[​](#features "Direct link to Features")

* Smooth progress calculation based on observed loading state.
* Custom resource weight.
* Virtual resources for manual or async progress control.

## Initialization[​](#initialization "Direct link to Initialization")

caution

The module does not provide styling for the container.

```
<div id="preloader">

  <div id="progress">00%</div>

</div>
```

```
#preloader {

  position: fixed;

  top: 0;

  left: 0;

  width: 100%;

  height: 100%;

  z-index: 9;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;

}
```

```
import { ProgressPreloader } from 'vevet';



const preloader = new ProgressPreloader(

  {

    container: document.getElementById('preloader'),

    hide: 700,

  },

  {

    onProgress: () => {

      const { progress } = preloader;

      const percent = clamp(progress * 100, 0, 99);

      const html = `${percent.toFixed(0)}%`;



      progressElement.innerHTML = html;

    },

  },

);
```

Add a custom resource:

```
<div class="js-preload" data-weight="10"></div>



<!-- Update its 'loaded' attribute -->

<div class="js-preload" data-weight="10" data-loaded="7"></div>
```

Add a virtual resource:

```
preloader.addResource('my-resource', 20);

preloader.resolveResource('my-resource', 15);
```

Destroy the preloader:

```
preloader.destroy();
```

## Best Practices[​](#best-practices "Direct link to Best Practices")

* The preloader does **not** perform resource loading — it only tracks loading progress.
* Preloading lazy images is not supported — they are ignored automatically.
* Avoid assigning extremely high resource weight values; balanced weights create smoother progress.
* Virtual resources are ideal for async operations (API, WebGL, timers).
* Use `lerp < 1` for cinematic UI preloaders; use `lerp: 1` for strict "technical" progress indicators.
* Avoid triggering `destroy()` before the preloader reaches `loadProgress = 1`, unless you intend to cancel preloading completely.
