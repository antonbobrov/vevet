# Preloader

Page preloader — loading screen visibility and lifecycle:

* Waits for page load (`loaded`)
* Optional auto-hide when [`hide`](https://vevetjs.com/docs/Preloader/props.md#props.hide) is a duration
* Fades [`container`](https://vevetjs.com/docs/Preloader/props.md#props.container) opacity via `Timeline`

Does not provide styling for the container.

## Lifecycle[​](#lifecycle "Direct link to Lifecycle")

1. **`loaded`** — page is ready (`initVevet().onLoad`; overridable in [`ProgressPreloader`](https://vevetjs.com/docs/ProgressPreloader/.md)).
2. **`requestHide`** — hide is requested; use for custom hide timing when [`hide: false`](https://vevetjs.com/docs/Preloader/props.md#props.hide).
3. **`hide`** — fade starts (automatic when `hide` is a number, or via [`hide()`](https://vevetjs.com/docs/Preloader/methods.md#hide)).
4. **`hidden`** — fade completed; [`isHidden`](https://vevetjs.com/docs/Preloader/accessors.md#ishidden) is `true`.

When `hide: false`, call `hide(duration)` manually — typically from [`requestHide`](https://vevetjs.com/docs/Preloader/callbacks.md#requesthide).<br /><!-- -->When `container: null`, only callbacks fire — no DOM animation.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo VYYZdyB](https://codepen.io/anton-bobrov/embed/VYYZdyB?default-tab=result)

HTML

```
<div id="preloader">Loading...</div>



<div class="grid">

  <img src="https://picsum.photos/id/870/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/871/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/872/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/873/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/874/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/875/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/876/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/877/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/878/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/879/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/880/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/881/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/882/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/883/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/884/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/885/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/886/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/887/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/888/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/889/1000/1000" width="1000" height="1000" alt="">

  <img src="https://picsum.photos/id/890/1000/1000" width="1000" height="1000" alt="">

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

  Preloader

} from "vevet";



new Preloader({

  container: document.getElementById("preloader"),

  hide: 700

});
```

[Open live demo ↗](https://vevetjs.com/pens/VYYZdyB)

[More demosExplore all examples](https://vevetjs.com/docs/Preloader/demos.md)

## Initialization[​](#initialization "Direct link to Initialization")

caution

The module does not provide styling for the container.

```
<div id="preloader">Loading...</div>
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
import { Preloader } from 'vevet';



const preloader = new Preloader({

  container: document.getElementById('preloader'),

  hide: 700,

});
```

Destroy the preloader:

```
preloader.destroy();
```
