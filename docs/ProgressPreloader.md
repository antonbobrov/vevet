# ProgressPreloader

Resource-aware page preloader with smooth progress display:

* Tracks weighted resources (images, videos, DOM custom elements, virtual ids)
* Exposes raw `loadProgress` and smoothed `progress` for UI
* Inherits [Preloader](https://vevetjs.com/docs/Preloader/.md) hide lifecycle after `loaded`

Does not perform fetching for custom or virtual resources — only observes progress.

## Progress pipeline[​](#progress-pipeline "Direct link to Progress pipeline")

1. **Resources resolve** — images, videos, `data-loaded` elements, virtual ids, and page `onLoad` update weighted totals → [`resource`](https://vevetjs.com/docs/ProgressPreloader/callbacks.md#resource) / [`loadProgress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#loadprogress).
2. **Smoothing** — each frame, [`progress`](https://vevetjs.com/docs/ProgressPreloader/accessors.md#progress) dampens toward `loadProgress` using [`lerp`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.lerp).
3. **Finish** — when `loadProgress >= 1`, [`endDuration`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.endDuration) may animate `progress` to `1` → [`timelineStart`](https://vevetjs.com/docs/ProgressPreloader/callbacks.md#timelinestart) / [`timelineUpdate`](https://vevetjs.com/docs/ProgressPreloader/callbacks.md#timelineupdate) / [`timelineEnd`](https://vevetjs.com/docs/ProgressPreloader/callbacks.md#timelineend).
4. **Preloader lifecycle** — when `progress >= 1`, [`loaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded) fires → [`requestHide`](https://vevetjs.com/docs/Preloader/callbacks.md#requesthide) → optional hide → [`hidden`](https://vevetjs.com/docs/Preloader/callbacks.md#hidden).

`loadProgress` vs `progress`

Use **`loadProgress`** for strict technical indicators. Use **`progress`** for UI.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

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

[More demosExplore all examples](https://vevetjs.com/docs/ProgressPreloader/demos.md)

## Initialization[​](#initialization "Direct link to Initialization")

caution

The module does not provide styling for the container. See [Preloader](https://vevetjs.com/docs/Preloader/.md#initialization) for container CSS.

```
<div id="preloader">

  <div id="progress">00%</div>

</div>
```

```
import { clamp, ProgressPreloader } from 'vevet';



const progressElement = document.getElementById('progress');



const preloader = new ProgressPreloader({

  container: document.getElementById('preloader'),

  hide: 700,

  onProgress: (_data, { progress }) => {

    const percent = clamp(progress * 100, 0, 99);

    progressElement.textContent = `${percent.toFixed(0)}%`;

  },

});
```

### Custom DOM resources[​](#custom-dom-resources "Direct link to Custom DOM resources")

Elements matched by [`customSelector`](https://vevetjs.com/docs/ProgressPreloader/props.md#props.customSelector) (default `.js-preload`):

```
<div class="js-preload" data-weight="10"></div>



<!-- Update loaded weight as work completes -->

<div class="js-preload" data-weight="10" data-loaded="7"></div>
```

### Virtual resources[​](#virtual-resources "Direct link to Virtual resources")

For async work (API, WebGL, timers):

```
preloader.addResource('my-resource', 20);

preloader.resolveResource('my-resource', 15);

preloader.resolveResource('my-resource', 20);
```

Destroy the preloader:

```
preloader.destroy();
```

## Best Practices[​](#best-practices "Direct link to Best Practices")

* The preloader does **not** load custom or virtual resources — it only **tracks** progress you report.
* Lazy images (`loading="lazy"`) are ignored automatically.
* Use balanced `data-weight` values — extreme weights make progress jumpy.
* Use `lerp < 1` for cinematic UI; `lerp: 1` for strict technical progress.
* Avoid `destroy()` before `loadProgress` reaches `1` unless you intend to cancel preloading.
