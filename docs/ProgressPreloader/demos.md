# Demos

<!-- -->

## Simple Preloader[​](#simple-preloader "Direct link to Simple Preloader")

Tracks page resource loading and displays smooth [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) as a percentage.

Key props: [`hide: 700`](https://vevetjs.com/docs/Preloader/props.md#props.hide), [`onProgress`](https://vevetjs.com/docs/ProgressPreloader/callbacks.md#progress). Images in the grid are observed automatically via [`preloadImages`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.preloadImages).

[Vevet Demo vEGbxeq](https://codepen.io/anton-bobrov/embed/vEGbxeq?default-tab=result)

HTML

```
<div id="preloader">

  <div id="progress">00%</div>

</div>



<div class="grid">

  <img src="https://picsum.photos/id/870/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/871/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/872/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/873/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/874/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/875/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/876/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/877/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/878/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/879/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/880/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/881/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/882/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/883/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/884/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/885/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/886/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/887/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/888/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/889/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/890/1000/1000" width="1000" height="1000" alt="" loading="lazy">

</div>
```

CSS

```
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

  gap: 1rem;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-size: 1.5rem;

}



.grid {

  width: 100%;

  padding: 1rem;



  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 1rem;



  img {

    display: block;

    width: 100%;

    height: auto;

    border-radius: 1rem;

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



const preloader = new ProgressPreloader({

  container: document.getElementById("preloader"),

  hide: 700,

  onProgress: () => {

    const {

      progress

    } = preloader;

    const percent = clamp(progress * 100, 0, 99);

    const html = `${percent.toFixed(0).padStart(2, "0")}%`;



    progressElement.innerHTML = html;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/vEGbxeq)

## Custom Hiding Logic[​](#custom-hiding-logic "Direct link to Custom Hiding Logic")

Progress updates in real time, but the overlay stays until the user dismisses it.

Key props: [`hide: false`](https://vevetjs.com/docs/Preloader/props.md#props.hide), [`onLoaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded). A button appears after load completes and calls [`hide()`](https://vevetjs.com/docs/Preloader/methods.md#hide).

[Vevet Demo EaKrWoR](https://codepen.io/anton-bobrov/embed/EaKrWoR?default-tab=result)

HTML

```
<div id="preloader">

  <div id="progress">00%</div>



  <button id="hide-preloader" type="button" class="btn">

    Hide Preloader

  </button>

</div>



<div class="grid">

  <img src="https://picsum.photos/id/870/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/871/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/872/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/873/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/874/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/875/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/876/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/877/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/878/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/879/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/880/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/881/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/882/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/883/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/884/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/885/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/886/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/887/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/888/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/889/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/890/1000/1000" width="1000" height="1000" alt="" loading="lazy">

</div>
```

CSS

```
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

  gap: 1rem;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-size: 1.5rem;

}



.grid {

  width: 100%;

  padding: 1rem;



  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 1rem;



  img {

    display: block;

    width: 100%;

    height: auto;

    border-radius: 1rem;

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

const hideButton = document.getElementById("hide-preloader");



const preloader = new ProgressPreloader({

  container: document.getElementById("preloader"),

  hide: false,

  onLoaded: () => {

    hideButton.classList.add("show");



    hideButton.addEventListener("click", () => {

      preloader.hide();

    });

  },

  onProgress: () => {

    const {

      progress

    } = preloader;

    const percent = clamp(progress * 100, 0, 99);

    const html = `${percent.toFixed(0).padStart(2, "0")}%`;



    progressElement.innerHTML = html;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/EaKrWoR)

## Resource Count[​](#resource-count "Direct link to Resource Count")

Shows raw resource weights instead of a percentage.

Reads [`loadedWeight`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#loadedweight) and [`totalWeight`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#totalweight) in `onProgress` — useful for debugging or technical UIs.

[Vevet Demo QwNYpmp](https://codepen.io/anton-bobrov/embed/QwNYpmp?default-tab=result)

HTML

```
<div id="preloader">

  <div id="progress">0 of 0</div>

</div>



<div class="grid">

  <img src="https://picsum.photos/id/870/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/871/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/872/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/873/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/874/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/875/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/876/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/877/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/878/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/879/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/880/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/881/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/882/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/883/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/884/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/885/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/886/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/887/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/888/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/889/1000/1000" width="1000" height="1000" alt="" loading="lazy">

  <img src="https://picsum.photos/id/890/1000/1000" width="1000" height="1000" alt="" loading="lazy">

</div>
```

CSS

```
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

  gap: 1rem;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-size: 1.5rem;

}



.grid {

  width: 100%;

  padding: 1rem;



  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 1rem;



  img {

    display: block;

    width: 100%;

    height: auto;

    border-radius: 1rem;

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



const preloader = new ProgressPreloader({

  container: document.getElementById("preloader"),

  hide: 700,

  onProgress: () => {

    const {

      totalWeight,

      loadedWeight

    } = preloader;

    const html = `${loadedWeight} of ${totalWeight}`;



    progressElement.innerHTML = html;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/QwNYpmp)

## Virtual Resources[​](#virtual-resources "Direct link to Virtual Resources")

Track custom payloads that are not images or videos.

The button uses the default [`customSelector`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.customSelector) (`.js-preload`) with `data-weight="4"`. Each click calls [`resolveResource()`](https://vevetjs.com/docs/ProgressPreloader/methods.md#resolveresource) to increment loaded weight until the resource is complete.

[Vevet Demo VYYZdQG](https://codepen.io/anton-bobrov/embed/VYYZdQG?default-tab=result)

HTML

```
<div id="preloader">

  <div id="progress">00%</div>



  <button id="custom-loader" type="button" class="js-preload btn" data-weight="4">

    click twice

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

  gap: 1rem;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-size: 1.5rem;

}



.grid {

  width: 100%;

  padding: 1rem;



  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 1rem;



  img {

    display: block;

    width: 100%;

    height: auto;

    border-radius: 1rem;

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

  hide: 700,

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

[Open live demo ↗](https://vevetjs.com/pens/VYYZdQG)

## Line Preloader[​](#line-preloader "Direct link to Line Preloader")

Minimal progress bar driven by [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress).

`onProgress` maps progress to `transform: scale(x, 1)` on a line element — a common full-width loading indicator pattern.

[Vevet Demo ogxROvY](https://codepen.io/anton-bobrov/embed/ogxROvY?default-tab=result)

HTML

```
<div id="preloader">

  <div id="progress"></div>

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

  gap: 1rem;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);



  font-size: 1.5rem;

}



#progress {

  width: 100%;

  height: 3px;

  background: #fff;

  transform: scale(0, 1);

}



.grid {

  width: 100%;

  padding: 1rem;



  display: grid;

  grid-template-columns: repeat(3, 1fr);

  gap: 1rem;



  img {

    display: block;

    width: 100%;

    height: auto;

    border-radius: 1rem;

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



const preloader = new ProgressPreloader({

  container: document.getElementById("preloader"),

  hide: 700,

  onProgress: () => {

    const {

      progress

    } = preloader;



    progressElement.style.transform = `scale(${progress}, 1)`;

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/ogxROvY)
