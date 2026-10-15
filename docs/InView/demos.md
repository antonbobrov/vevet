# Demos

<!-- -->

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

On first load, visible elements animate in with a staggered delay. After that, new elements animate as they enter the viewport while scrolling.

[Vevet Demo EaaYRmX](https://codepen.io/anton-bobrov/embed/EaaYRmX?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    <h1 class="animate" data-in-view-class="fadeInUp">InView</h1>



    <p class="animate" data-in-view-class="fadeInUp">

      Lorem

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      ipsum

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      dolor

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      sit

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      amet

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      consectetur

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      adipiscing

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      elit

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      sed

    </p>



    <p class="animate" data-in-view-class="fadeInUp">do</p>



    <p class="animate" data-in-view-class="fadeInUp">

      eiusmod

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      Lorem

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      ipsum

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      dolor

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      sit

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      amet

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      consectetur

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      adipiscing

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      elit

    </p>



    <p class="animate" data-in-view-class="fadeInUp">

      sed

    </p>



    <p class="animate" data-in-view-class="fadeInUp">do</p>



    <p class="animate" data-in-view-class="fadeInUp">

      eiusmod

    </p>

  </div>

</div>
```

CSS

```
.container {

  width: 100%;

  padding: 0 1rem;

}



h1 {

  margin: 0 0 1.25rem;

  font-size: 2rem;

  font-weight: 600;

}



p {

  margin: 0.5em 0;

}



.animate {

  opacity: 0;

}



.fadeInUp {

  animation: fade-in-up;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



@keyframes fade-in-up {

  from {

    transform: translateY(3rem);

    opacity: 0;

  }



  to {

    transform: translateY(0);

    opacity: 1;

  }

}
```

JavaScript

```
import {

  InView

} from "vevet";



const instance = new InView({

  hasOut: false,

  maxInitialDelay: 700

});



const elements = document.querySelectorAll("*[data-in-view-class]");

elements.forEach(element => {

  instance.addElement(element);

});
```

[Open live demo ↗](https://vevetjs.com/pens/EaaYRmX)

## In-Out Animation[​](#in-out-animation "Direct link to In-Out Animation")

Same as the basic demo, but elements also re-animate when they leave and later re-enter the viewport (`hasOut: true`).

[Vevet Demo GgZepMd](https://codepen.io/anton-bobrov/embed/GgZepMd?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    <h1 class="animate" data-in-view-class="fadeInUp|fadeInDown">InView</h1>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      Lorem

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      ipsum

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      dolor

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      amet

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      consectetur

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      adipiscing

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      elit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sed

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">do</p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      eiusmod

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      Lorem

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      ipsum

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      dolor

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      amet

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      consectetur

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      adipiscing

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      elit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sed

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">do</p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      eiusmod

    </p>

  </div>

</div>
```

CSS

```
.container {

  width: 100%;

  padding: 0 1rem;

}



h1 {

  margin: 0 0 1.25rem;

  font-size: 2rem;

  font-weight: 600;

}



p {

  margin: 0.5em 0;

}



.animate {

  opacity: 0;

}



.fadeInUp {

  animation: fade-in-up;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



.fadeInDown {

  animation: fade-in-down;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



@keyframes fade-in-up {

  from {

    transform: translateY(5rem);

    opacity: 0;

  }



  to {

    transform: translateY(0);

    opacity: 1;

  }

}



@keyframes fade-in-down {

  from {

    transform: translateY(-5rem);

    opacity: 0;

  }



  to {

    transform: translateY(0);

    opacity: 1;

  }

}
```

JavaScript

```
import {

  InView

} from "vevet";



const instance = new InView({

  hasOut: true,

  maxInitialDelay: 700

});



const elements = document.querySelectorAll("*[data-in-view-class]");

elements.forEach(element => {

  instance.addElement(element);

});
```

[Open live demo ↗](https://vevetjs.com/pens/GgZepMd)

## Control[​](#control "Direct link to Control")

Observation starts disabled. Call `instance.updateProps({ enabled: true })` to start revealing elements.

[Vevet Demo GgZwgZZ](https://codepen.io/anton-bobrov/embed/GgZwgZZ?default-tab=result)

HTML

```
<div class="fullpage-center">

  <button type="button" class="btn" id="toggle">Enable</button>



  <div class="container">

    <h1 class="animate" data-in-view-class="fadeInUp|fadeInDown">InView</h1>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      Lorem

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      ipsum

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      dolor

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      amet

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      consectetur

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      adipiscing

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      elit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sed

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">do</p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      eiusmod

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      Lorem

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      ipsum

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      dolor

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      amet

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      consectetur

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      adipiscing

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      elit

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      sed

    </p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">do</p>



    <p class="animate" data-in-view-class="fadeInUp|fadeInDown">

      eiusmod

    </p>

  </div>

</div>
```

CSS

```
.container {

  width: 100%;

  padding: 0 1rem;

}



h1 {

  margin: 0 0 1.25rem;

  font-size: 2rem;

  font-weight: 600;

}



p {

  margin: 0.5em 0;

}



.animate {

  opacity: 0;

}



.fadeInUp {

  animation: fade-in-up;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



.fadeInDown {

  animation: fade-in-down;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



@keyframes fade-in-up {

  from {

    transform: translateY(5rem);

    opacity: 0;

  }



  to {

    transform: translateY(0);

    opacity: 1;

  }

}



@keyframes fade-in-down {

  from {

    transform: translateY(-5rem);

    opacity: 0;

  }



  to {

    transform: translateY(0);

    opacity: 1;

  }

}
```

JavaScript

```
import {

  InView

} from "vevet";



const instance = new InView({

  enabled: false,

  maxInitialDelay: 700

});



const elements = document.querySelectorAll("*[data-in-view-class]");

elements.forEach(element => {

  instance.addElement(element);

});



const toggle = document.getElementById("toggle");



toggle.addEventListener("click", () => {

  instance.updateProps({

    enabled: !instance.props.enabled

  });



  toggle.innerHTML = instance.props.enabled ? "Disable" : "Enable";

});
```

[Open live demo ↗](https://vevetjs.com/pens/GgZwgZZ)

## With Anime.js[​](#with-animejs "Direct link to With Anime.js")

Example of driving Anime.js animations from InView `in` / `out` callbacks.

[Vevet Demo LENXYRr](https://codepen.io/anton-bobrov/embed/LENXYRr?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div class="container">

    <h1 class="animate">InView</h1>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>



    <p class="animate">

      Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.

    </p>

  </div>

</div>
```

CSS

```
.container {

  width: 100%;

  padding: 0 1rem;

}



h1 {

  margin: 0 0 1.25rem;

  font-size: 2rem;

  font-weight: 600;

}



p {

  margin: 0.5em 0;

}



.animate {

  opacity: 0;

}
```

JavaScript

```
import {

  InView

} from "vevet";

import {

  animate,

  stagger

} from "animejs";



const inView = new InView({

  hasOut: false,

  onIn: ({

    element

  }) => {

    animate(element, {

      duration: 800,

      opacity: {

        from: 0,

        to: 1

      },

      translateY: {

        from: "3rem",

        to: 0

      },

      ease: "outBack"

    });



  }

});



const elements = document.querySelectorAll(".animate");



elements.forEach(element => {

  inView.addElement(element);

});
```

[Open live demo ↗](https://vevetjs.com/pens/LENXYRr)

## Horizontal InView[​](#horizontal-inview "Direct link to Horizontal InView")

Reveal animations for a horizontally scrolling layout (`scrollDirection: 'horizontal'`).

[Vevet Demo GgZwRWa](https://codepen.io/anton-bobrov/embed/GgZwRWa?default-tab=result)

HTML

```
<div class="container">

  <h1 class="animate">InView</h1>



  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

</div>
```

CSS

```
.container {

  width: max-content;

  height: 100vh;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: flex-start;

  padding: 0 1rem;

}



h1 {

  margin: 1rem;

  font-size: 2rem;

  font-weight: 600;

}



.rect {

  margin: 0.5rem;

  height: 12rem;

  width: 12rem;



  border-radius: 0.75rem;

  background: rgba(255, 255, 255, 0.01);

  border: 1px solid rgba(255, 255, 255, 0.12);



  opacity: 0;

}



.visible {

  animation: fade-in-scale;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



@keyframes fade-in-scale {

  from {

    opacity: 0;

    transform: scale(0.5);

  }



  to {

    opacity: 1;

    transform: scale(1);

  }

}
```

JavaScript

```
import {

  InView

} from "vevet";

import {

  animate,

  stagger

} from "animejs";



const inView = new InView({

  scrollDirection: "horizontal"

});



const elements = document.querySelectorAll(".rect");



elements.forEach(element => {

  inView.addElement(element);

});
```

[Open live demo ↗](https://vevetjs.com/pens/GgZwRWa)

## Horizontal RTL[​](#horizontal-rtl "Direct link to Horizontal RTL")

Same as horizontal InView, but with an RTL document so stagger delay follows the reading direction.

[Vevet Demo LENXYqq](https://codepen.io/anton-bobrov/embed/LENXYqq?default-tab=result)

HTML

```
<div class="container">

  <h1 class="animate">InView</h1>



  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

  <div class="rect" data-in-view-class="visible"></div>

</div>
```

CSS

```
body {

  direction: rtl;

}



.container {

  width: max-content;

  height: 100vh;

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: flex-start;

  padding: 0 1rem;

}



h1 {

  margin: 1rem;

  font-size: 2rem;

  font-weight: 600;

}



.rect {

  margin: 0.5rem;

  height: 12rem;

  width: 12rem;



  border-radius: 0.75rem;

  background: rgba(255, 255, 255, 0.01);

  border: 1px solid rgba(255, 255, 255, 0.12);



  opacity: 0;

}



.visible {

  animation: fade-in-scale;

  animation-duration: 0.5s;

  animation-timing-function: cubic-bezier(0.61, 1, 0.88, 1);

  animation-fill-mode: both;

}



@keyframes fade-in-scale {

  from {

    opacity: 0;

    transform: scale(0.5);

  }



  to {

    opacity: 1;

    transform: scale(1);

  }

}
```

JavaScript

```
import {

  InView

} from "vevet";

import {

  animate,

  stagger

} from "animejs";



const inView = new InView({

  scrollDirection: "horizontal"

});



const elements = document.querySelectorAll(".rect");



elements.forEach(element => {

  inView.addElement(element);

});
```

[Open live demo ↗](https://vevetjs.com/pens/LENXYqq)
