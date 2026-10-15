# Demos

<!-- -->

## Simple Preloader[​](#simple-preloader "Direct link to Simple Preloader")

Waits for the page to finish loading, then hides the overlay automatically.

Key prop: [`hide: 700`](https://vevetjs.com/docs/Preloader/props.md#props.hide) — fade-out duration in ms once [`loaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded) fires.

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

## Custom Hiding Logic[​](#custom-hiding-logic "Direct link to Custom Hiding Logic")

Disable automatic hide and call [`hide()`](https://vevetjs.com/docs/Preloader/methods.md#hide) manually when you are ready.

Key props: [`hide: false`](https://vevetjs.com/docs/Preloader/props.md#props.hide). On [`onLoaded`](https://vevetjs.com/docs/Preloader/callbacks.md#loaded), reveal a button that triggers `preloader.hide()`.

[Vevet Demo ZYWweeJ](https://codepen.io/anton-bobrov/embed/ZYWweeJ?default-tab=result)

HTML

```
<div id="preloader">Loading...



  <button id="hide-preloader" type="button" class="btn">

    Finish

  </button>

</div>



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



const hideButton = document.getElementById("hide-preloader");



const preloader = new Preloader({

  container: document.getElementById("preloader"),

  hide: false,

  onLoaded: () => {

    hideButton.classList.add("show");



    hideButton.addEventListener("click", () => {

      preloader.hide();

    });

  }

});
```

[Open live demo ↗](https://vevetjs.com/pens/ZYWweeJ)
