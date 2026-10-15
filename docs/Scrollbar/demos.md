# Demos

<!-- -->

## Window Scrollbar[​](#window-scrollbar "Direct link to Window Scrollbar")

Default setup: vertical scrollbar on [`window`](https://vevetjs.com/docs/Scrollbar/props.md#props.container).

[Vevet Demo XJJrYYa](https://codepen.io/anton-bobrov/embed/XJJrYYa?default-tab=result)

HTML

```
<div class="fullpage-center">

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
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



p {

  margin: 0;

}



.v-scrollbar {

  right: 5px !important;

  padding: 10px 0;



  .v-scrollbar__track {

    border-radius: 5px;

    background: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: var(--gradient-sunset, #000);

    }

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

[Open live demo ↗](https://vevetjs.com/pens/XJJrYYa)

## Horizontal Scrollbar[​](#horizontal-scrollbar "Direct link to Horizontal Scrollbar")

Vertical and horizontal scrollbars on the same page.

Creates two instances — default `axis: "y"` on the window plus [`axis: "x"`](https://vevetjs.com/docs/Scrollbar/props.md#props.axis) for wide content.

[Vevet Demo wBBwXEv](https://codepen.io/anton-bobrov/embed/wBBwXEv?default-tab=result)

HTML

```
<div class="fullpage-center">

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
```

CSS

```
.fullpage-center {

  padding: 1rem;

  width: max-content;

}



p {

  margin: 0;

}



.v-scrollbar {

  .v-scrollbar__track {

    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: var(--gradient-sunset, #000);

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

[Open live demo ↗](https://vevetjs.com/pens/wBBwXEv)

## Horizontal RTL Scrollbar[​](#horizontal-rtl-scrollbar "Direct link to Horizontal RTL Scrollbar")

Same dual-axis layout with `direction: rtl` on `html`.

Scrollbar positions and scroll direction follow RTL layout — no extra Scrollbar props required.

[Vevet Demo MYyZqGQ](https://codepen.io/anton-bobrov/embed/MYyZqGQ?default-tab=result)

HTML

```
<div class="fullpage-center">

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
```

CSS

```
html {

  direction: rtl;

}



.fullpage-center {

  padding: 1rem;

  width: max-content;

}



p {

  margin: 0;

}



.v-scrollbar {

  .v-scrollbar__track {

    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: var(--gradient-sunset, #000);

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

[Open live demo ↗](https://vevetjs.com/pens/MYyZqGQ)

## AutoHide[​](#autohide "Direct link to AutoHide")

Scrollbars fade out when idle and reappear on scroll or drag.

Key prop: [`autoHide: true`](https://vevetjs.com/docs/Scrollbar/props.md#props.autoHide) on both vertical and horizontal instances.

[Vevet Demo WbrXOWB](https://codepen.io/anton-bobrov/embed/WbrXOWB?default-tab=result)

HTML

```
<div class="fullpage-center">

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
```

CSS

```
.fullpage-center {

  padding: 1rem;

  width: max-content;

}



p {

  margin: 0;

}



.v-scrollbar {

  .v-scrollbar__track {

    border-radius: 5px;

    background-color: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: var(--gradient-sunset, #000);

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
```

JavaScript

```
import {

  Scrollbar

} from "vevet";



new Scrollbar({

  autoHide: true

});



new Scrollbar({

  axis: "x",

  autoHide: true

});
```

[Open live demo ↗](https://vevetjs.com/pens/WbrXOWB)

## Inner Scrollbar[​](#inner-scrollbar "Direct link to Inner Scrollbar")

Custom scrollbar on a nested overflow container instead of the window.

[Vevet Demo emmOKjW](https://codepen.io/anton-bobrov/embed/emmOKjW?default-tab=result)

HTML

```
<div class="fullpage-center">

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

</div>
```

CSS

```
.wrapper {

  position: relative;

  width: max-content;

  background-color: rgba(255, 255, 255, 0.05);

  border-radius: 1rem;

  font-size: 0.75rem;

}



.scrollable {

  width: 20rem;

  max-width: 80vw;

  height: 15rem;

  overflow: auto;

  padding: 1rem 2rem 1rem 1rem;

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

  margin: 0.5rem 0;

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

      background: var(--gradient-sunset, #000);

    }

  }

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

[Open live demo ↗](https://vevetjs.com/pens/emmOKjW)

## Min-size[​](#min-size "Direct link to Min-size")

Enforce a minimum thumb height even when content is very long.

Key prop: [`minSize: "90vh"`](https://vevetjs.com/docs/Scrollbar/props.md#props.minSize) — accepts CSS units (`px`, `rem`, `vh`, `svh`, etc.).

[Vevet Demo NPxweQN](https://codepen.io/anton-bobrov/embed/NPxweQN?default-tab=result)

HTML

```
<div class="fullpage-center">

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
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



p {

  margin: 0;

}



.v-scrollbar {

  right: 5px !important;

  padding: 10px 0;



  .v-scrollbar__track {

    border-radius: 5px;

    background: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: var(--gradient-sunset, #000);

    }

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

[Open live demo ↗](https://vevetjs.com/pens/NPxweQN)

## No Auto-size[​](#no-auto-size "Direct link to No Auto-size")

Disable proportional thumb sizing.

Key prop: [`autoSize: false`](https://vevetjs.com/docs/Scrollbar/props.md#props.autoSize) — thumb keeps a fixed size regardless of content length.

[Vevet Demo qEbVLeM](https://codepen.io/anton-bobrov/embed/qEbVLeM?default-tab=result)

HTML

```
<div class="fullpage-center">

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
```

CSS

```
.fullpage-center {

  padding: 1rem;

}



p {

  margin: 0;

}



.v-scrollbar {

  right: 5px !important;

  padding: 10px 0;



  .v-scrollbar__track {

    border-radius: 5px;

    background: rgba(255, 255, 255, 0.1);



    .v-scrollbar__thumb {

      border-radius: inherit;

      background: var(--gradient-sunset, #000);

    }

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

[Open live demo ↗](https://vevetjs.com/pens/qEbVLeM)
