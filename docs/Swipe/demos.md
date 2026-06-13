# Demos

<!-- -->

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo bNNbKyV](https://codepen.io/anton-bobrov/embed/bNNbKyV?default-tab=result)

HTML

```
<div id="all" class="item" style="background: linear-gradient(135deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

</div>



<div id="horizontal" class="item" style="background: linear-gradient(90deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt="">

</div>



<div id="vertical" class="item" style="background: linear-gradient(0deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/379997/drag-vertical.svg" alt="">

</div>



<div id="rotation" class="item" style="background: linear-gradient(35deg, rgb(255, 127, 135) 0%, rgb(244, 214, 157) 100%);">

  <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



// ALL



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

  onStart: (data, {

    container

  }) => {

    container.style.zIndex = "1";

  },

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});





// HORIZONTAL



new Swipe({

  container: document.getElementById("horizontal"),

  axis: "x",

  grabCursor: true,

  onStart: (data, {

    container

  }) => {

    container.style.zIndex = "1";

  },

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, 0)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});





// VERTICAL



new Swipe({

  container: document.getElementById("vertical"),

  axis: "y",

  grabCursor: true,

  onStart: (data, {

    container

  }) => {

    container.style.zIndex = "1";

  },

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(0, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});





// ROTATION



new Swipe({

  container: document.getElementById("rotation"),

  relative: true,

  grabCursor: true,

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `rotate(${diff.angle}deg)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## Multidirectional Swipe[​](#multidirectional-swipe "Direct link to Multidirectional Swipe")

[Vevet Demo xbVmaaB](https://codepen.io/anton-bobrov/embed/xbVmaaB?default-tab=result)

HTML

```
<div id="all" class="item" style="background: linear-gradient(135deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/521614/drag.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## Right-Click Drag[​](#right-click-drag "Direct link to Right-Click Drag")

[Vevet Demo MYyLWLb](https://codepen.io/anton-bobrov/embed/MYyLWLb?default-tab=result)

HTML

```
<div id="all" class="item" style="background: radial-gradient( rgb(13, 110, 253), rgb(140, 122, 230));">

  <img src="https://www.svgrepo.com/show/119214/right-click-of-the-mouse.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("all"),

  grabCursor: true,

  buttons: [2],

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## Horizontal Swipe[​](#horizontal-swipe "Direct link to Horizontal Swipe")

[Vevet Demo ZYWVMqR](https://codepen.io/anton-bobrov/embed/ZYWVMqR?default-tab=result)

HTML

```
<div id="horizontal" class="item" style="background: linear-gradient(90deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("horizontal"),

  axis: "x",

  grabCursor: true,

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(${diff.x}px, 0)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## Vertical Swipe[​](#vertical-swipe "Direct link to Vertical Swipe")

[Vevet Demo vEGvzvO](https://codepen.io/anton-bobrov/embed/vEGvzvO?default-tab=result)

HTML

```
<div id="vertical" class="item" style="background: linear-gradient(0deg, rgb(13, 110, 253) 0%, rgb(140, 122, 230) 50%, rgb(0, 201, 177) 100%);">

  <img src="https://www.svgrepo.com/show/379997/drag-vertical.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("vertical"),

  axis: "y",

  grabCursor: true,

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `translate(0, ${diff.y}px)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.zIndex = "";

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## Rotation Swipe[​](#rotation-swipe "Direct link to Rotation Swipe")

[Vevet Demo qEZLMLz](https://codepen.io/anton-bobrov/embed/qEZLMLz?default-tab=result)

HTML

```
<div id="rotation" class="item" style="background: linear-gradient(35deg, rgb(255, 127, 135) 0%, rgb(244, 214, 157) 100%);">

  <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background-color: #000;



  font-size: 12px;



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("rotation"),

  relative: true,

  grabCursor: true,

  onMove: ({

    diff

  }, {

    container

  }) => {

    container.style.transition = "";

    container.style.transform = `rotate(${diff.angle}deg)`;

  },

  onEnd: (data, {

    container

  }) => {

    container.style.transition = "transform 0.25s";

    container.style.transform = "none";

  }

});
```

## Slide Right[​](#slide-right "Direct link to Slide Right")

[Vevet Demo NPdRrLy](https://codepen.io/anton-bobrov/embed/NPdRrLy?default-tab=result)

HTML

```
<div id="container" class="container">

  <div id="thumb" class="thumb"><img src="https://www.svgrepo.com/show/379996/drag-horizontal.svg" alt=""></div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  width: 80%;

  height: 120px;



  border-radius: 10px;

  background: rgba(255, 255, 255, 0.1);

}



.thumb {

  width: 120px;

  height: 120px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: inherit;

  background: linear-gradient(90deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);



  img {

    width: 40px;

    height: auto;

    filter: invert(100%);

  }

}
```

JavaScript

```
import {

  Swipe,

  vevet,

  clamp,

  onResize

} from "vevet";



const container = document.getElementById("container");

const thumb = document.getElementById("thumb");



const swipe = new Swipe({

  container,

  thumb,

  inertia: true,

  grabCursor: true,

  bounds: () => ({

    x: [0, container.clientWidth - thumb.clientWidth]

  }),



  onMove: ({

    movement

  }, {

    container

  }) => {

    thumb.style.transform = `translate(${movement.x}px, 0)`;

  }

});





onResize({

  element: [container],

  callback: () => {

    swipe.releaseBounce(0);

  }

});
```

## Lever rotation[​](#lever-rotation "Direct link to Lever rotation")

[Vevet Demo bNpOmGo](https://codepen.io/anton-bobrov/embed/bNpOmGo?default-tab=result)

HTML

```
<div id="rotation" class="item" style="background: linear-gradient(35deg, rgb(255, 127, 135) 0%, rgb(244, 214, 157) 100%);">

  <img src="https://www.svgrepo.com/show/533709/rotate.svg" alt="">



  <div id="thumb" class="thumb"></div>

</div>
```

CSS

```
body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;

  flex-wrap: wrap;

  gap: 10px;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.item {

  position: relative;

  width: 180px;

  height: 180px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 50%;

  background-color: #000;



  font-size: 12px;



  img {

    width: 80px;

    height: auto;

    filter: invert(100%);

  }

}



.thumb {

  position: absolute;

  top: -15px;

  left: calc(50% - 15px);

  width: 30px;

  height: 30px;

  background: linear-gradient(0deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);

  border-radius: 50%;

  cursor: grab;

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



let angle = 0;



new Swipe({

  container: document.getElementById("rotation"),

  thumb: document.getElementById("thumb"),

  inertia: true,

  onMove: ({

    step

  }, {

    container

  }) => {

    angle += step.angle;



    container.style.transform = `rotate(${angle}deg)`;

  }

});
```

## Detect Swipe Direction[​](#detect-swipe-direction "Direct link to Detect Swipe Direction")

[Vevet Demo ZYWVMwj](https://codepen.io/anton-bobrov/embed/ZYWVMwj?default-tab=result)

HTML

```
<div id="container" class="container">

  Swipe Me

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  width: 200px;

  height: 200px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 20px;

  color: #fff;

}
```

JavaScript

```
import {

  Swipe

} from "vevet";



new Swipe({

  container: document.getElementById("container"),

  onStart: (data, {

    container

  }) => {

    container.innerHTML = "start";

  },

  onToLeft: (data, {

    container

  }) => {

    container.innerHTML = "to left";

  },

  onToRight: (data, {

    container

  }) => {

    container.innerHTML = "to right";

  },

  onToTop: (data, {

    container

  }) => {

    container.innerHTML = "to top";

  },

  onToBottom: (data, {

    container

  }) => {

    container.innerHTML = "to bottom";

  }

});
```

## Drag Inertia[​](#drag-inertia "Direct link to Drag Inertia")

[Vevet Demo azNPaxx](https://codepen.io/anton-bobrov/embed/azNPaxx?default-tab=result)

HTML

```
<div id="container" class="container">

  Drag Me

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  width: 120px;

  height: 120px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 16px;

  color: #fff;

}
```

JavaScript

```
import {

  Swipe,

  vevet,

  clamp

} from "vevet";



let x = 0;

let y = 0;



new Swipe({

  container: document.getElementById("container"),

  inertia: true,

  grabCursor: true,

  onMove: ({

    step

  }, {

    container

  }) => {

    x = clamp(x + step.x, -vevet.width / 2, vevet.width / 2);

    y = clamp(y + step.y, -vevet.height / 2, vevet.height / 2);



    container.style.transform = `translate(${x}px, ${y}px)`;

  }

});
```

## Drag Inertia Bounce[​](#drag-inertia-bounce "Direct link to Drag Inertia Bounce")

[Vevet Demo zxqbwVg](https://codepen.io/anton-bobrov/embed/zxqbwVg?default-tab=result)

HTML

```
<div id="container" class="container">

  Drag Me

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.container {

  width: 120px;

  height: 120px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 10px;

  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 16px;

  color: #fff;

}
```

JavaScript

```
import {

  Swipe,

  vevet,

  clamp,

  EaseOutBack

} from "vevet";



let x = 0;

let y = 0;



new Swipe({

  container: document.getElementById("container"),

  inertia: true,

  inertiaEasing: EaseOutBack,

  grabCursor: true,

  inertiaRatio: 0.1,

  velocityModifier: source => ({

    ...source,

    x: clamp(source.x, -x - vevet.width / 2, vevet.width / 2 - x),

    y: clamp(source.y, -y - vevet.height / 2, vevet.height / 2 - y)

  }),



  onMove: ({

    step

  }, {

    container

  }) => {

    x = clamp(x + step.x, -vevet.width / 2, vevet.width / 2);

    y = clamp(y + step.y, -vevet.height / 2, vevet.height / 2);



    container.style.transform = `translate(${x}px, ${y}px)`;

  }

});
```

## Ball[​](#ball "Direct link to Ball")

[Vevet Demo pvyqOMV](https://codepen.io/anton-bobrov/embed/pvyqOMV?default-tab=result)

HTML

```
<div id="ball" class="ball">

  Swipe Me

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  height: 100vh;

  width: 100%;

  overflow: hidden;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

}



.ball {

  width: 80px;

  height: 80px;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  border-radius: 50%;

  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);



  font-family: "Ubuntu", sans-serif;

  font-size: 12px;

  color: #fff;

}
```

JavaScript

```
import {

  Swipe,

  vevet,

  clamp

} from "vevet";



let x = 0;

let y = 0;

let xDir = 1;

let yDir = 1;



new Swipe({

  container: document.getElementById("ball"),

  inertia: true,

  grabCursor: true,

  onStart: () => {

    xDir = 1;

    yDir = 1;

  },

  onMove: ({

    step

  }, {

    hasInertia,

    container

  }) => {

    if (hasInertia) {

      if (x >= vevet.width / 2 || x <= -vevet.width / 2) {

        xDir *= -1;

      }



      if (y >= vevet.height / 2 || y <= -vevet.height / 2) {

        yDir *= -1;

      }

    }



    x = clamp(x + step.x * xDir, -vevet.width / 2, vevet.width / 2);

    y = clamp(y + step.y * yDir, -vevet.height / 2, vevet.height / 2);



    container.style.transform = `translate(${x}px, ${y}px)`;

  }

});
```
