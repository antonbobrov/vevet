# Demos

<!-- -->

## Window Scrollbar[​](#window-scrollbar "Direct link to Window Scrollbar")

[Vevet Demo XJJrYYa](https://codepen.io/anton-bobrov/embed/XJJrYYa?default-tab=result)

HTML

```
<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



html,

body {

  -ms-overflow-style: none;

  scrollbar-width: none;



  &::-webkit-scrollbar {

    display: none;

    appearance: none;

    width: 0;

    height: 0;

  }

}



body {

  margin: 0;

  padding: 30px;

  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;

}



.v-scrollbar {

  right: 5px !important;

  padding: 10px 0;



  .v-scrollbar__track {

    border-radius: 5px;

    background: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



p {

  margin: 5vw 0 0;



  &:first-child {

    margin: 0;

  }

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: false

});
```

## Horizontal Scrollbar[​](#horizontal-scrollbar "Direct link to Horizontal Scrollbar")

[Vevet Demo wBBwXEv](https://codepen.io/anton-bobrov/embed/wBBwXEv?default-tab=result)

HTML

```
<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



html {

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  background-attachment: fixed;

}



body {

  margin: 0;

  padding: 30px;

  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  color: #fff;

}



.v-scrollbar {

  .v-scrollbar__track {

    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



.v-scrollbar_y {

  right: 5px !important;

  padding: 20px 0;

}



.v-scrollbar_x {

  bottom: 5px !important;

  padding: 0 20px;

}



p {

  margin: 3vw 0 0;

  width: 130vw;



  &:first-child {

    margin: 0;

  }

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: false

});



new Scrollbar({

  axis: "x",

  autoHide: false

});
```

## Horizontal RTL Scrollbar[​](#horizontal-rtl-scrollbar "Direct link to Horizontal RTL Scrollbar")

[Vevet Demo MYyZqGQ](https://codepen.io/anton-bobrov/embed/MYyZqGQ?default-tab=result)

HTML

```
<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



html {

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  background-attachment: fixed;

  direction: rtl;

}



body {

  margin: 0;

  padding: 30px;

  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  color: #fff;

}



.v-scrollbar {

  .v-scrollbar__track {

    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



.v-scrollbar_y {

  right: 5px !important;

  padding: 20px 0;

}



.v-scrollbar_x {

  bottom: 5px !important;

  padding: 0 20px;

}



p {

  margin: 3vw 0 0;

  width: 130vw;



  &:first-child {

    margin: 0;

  }

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: false

});



new Scrollbar({

  axis: "x",

  autoHide: false

});
```

## AutoHide[​](#autohide "Direct link to AutoHide")

[Vevet Demo WbrXOWB](https://codepen.io/anton-bobrov/embed/WbrXOWB?default-tab=result)

HTML

```
<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



html,

body {

  -ms-overflow-style: none;

  scrollbar-width: none;



  &::-webkit-scrollbar {

    display: none;

    appearance: none;

    width: 0;

    height: 0;

  }

}



html {

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  background-attachment: fixed;

}



body {

  margin: 0;

  padding: 30px;

  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  color: #fff;

}



.v-scrollbar {

  .v-scrollbar__track {

    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



.v-scrollbar_y {

  right: 5px !important;

  padding: 20px 0;

}



.v-scrollbar_x {

  bottom: 5px !important;

  padding: 0 20px;

}



p {

  margin: 3vw 0 0;

  width: 130vw;



  &:first-child {

    margin: 0;

  }

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: true

});
```

## Inner Scrollbar[​](#inner-scrollbar "Direct link to Inner Scrollbar")

[Vevet Demo emmOKjW](https://codepen.io/anton-bobrov/embed/emmOKjW?default-tab=result)

HTML

```
<div class="wrapper">

  <div class="scrollable">

    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>



    <p>

      Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

      aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

      mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

      recusandae harum minus.

    </p>

  </div>

</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;

  height: 100vh;



  display: flex;

  flex-direction: row;

  align-items: center;

  justify-content: center;



  font-family: "Ubuntu", sans-serif;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;

}



.v-scrollbar {

  &.v-scrollbar_y {

    right: 0.25rem;

    top: 0.5rem;

    height: calc(100% - 1rem);

  }



  .v-scrollbar__track {

    background-color: transparent;



    .v-scrollbar__thumb {

      border-radius: 5px;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



.wrapper {

  position: relative;

  width: max-content;

  background-color: rgba(255, 255, 255, 0.05);

  border-radius: 1rem;

  backdrop-filter: blur(1rem);

}



.scrollable {

  width: 300px;

  max-width: 80vw;

  height: 200px;

  overflow: auto;

  padding: 16px 32px 16px 16px;

  box-sizing: border-box;

}



.scrollable {

  -ms-overflow-style: none;

  scrollbar-width: none;



  &::-webkit-scrollbar {

    display: none;

    appearance: none;

    width: 0;

    height: 0;

  }

}



p {

  margin: 8px 0;

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  container: document.querySelector(".scrollable"),

  parent: document.querySelector(".wrapper"),

  autoHide: false

});
```

## Min-size[​](#min-size "Direct link to Min-size")

[Vevet Demo NPxweQN](https://codepen.io/anton-bobrov/embed/NPxweQN?default-tab=result)

HTML

```
<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



html,

body {

  -ms-overflow-style: none;

  scrollbar-width: none;



  &::-webkit-scrollbar {

    display: none;

    appearance: none;

    width: 0;

    height: 0;

  }

}



body {

  margin: 0;

  padding: 30px;

  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;

}



.v-scrollbar {

  right: 5px !important;

  padding: 10px 0;



  .v-scrollbar__track {

    border-radius: 5px;

    background: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



p {

  margin: 5vw 0 0;



  &:first-child {

    margin: 0;

  }

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: false,

  minSize: "90vh"

});
```

## No Auto-size[​](#no-auto-size "Direct link to No Auto-size")

[Vevet Demo qEbVLeM](https://codepen.io/anton-bobrov/embed/qEbVLeM?default-tab=result)

HTML

```
<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>



<p>

  Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores

  aperiam adipisci earum cum perspiciatis eos, exercitationem distinctio

  mollitia omnis explicabo. Ab natus facilis vitae nemo fugiat magnam

  recusandae harum minus.

</p>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



html,

body {

  -ms-overflow-style: none;

  scrollbar-width: none;



  &::-webkit-scrollbar {

    display: none;

    appearance: none;

    width: 0;

    height: 0;

  }

}



body {

  margin: 0;

  padding: 30px;

  font-family: "Ubuntu", sans-serif;

  font-size: 30px;

  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;

}



.v-scrollbar {

  right: 5px !important;

  padding: 10px 0;



  .v-scrollbar__track {

    border-radius: 5px;

    background: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: linear-gradient(135deg,

          rgb(255, 127, 135) 0%,

          rgb(244, 214, 157) 100%);

    }

  }

}



p {

  margin: 5vw 0 0;



  &:first-child {

    margin: 0;

  }

}
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: false,

  autoSize: false

});
```
