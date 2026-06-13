# Preloader

Page preloader component that manages the visibility and lifecycle of a loading screen

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

  font-size: 40px;

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



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

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

  Preloader

} from "vevet";



new Preloader({

  container: document.getElementById("preloader"),

  hide: 700

});
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Preloader/demos.md).

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
