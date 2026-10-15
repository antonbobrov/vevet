# Scrollbar

Custom scrollbar for `window`, `HTMLElement`, and [`Snap`](https://vevetjs.com/docs/Snap/.md) containers.

Provides scroll tracking, optional thumb drag, auto-sizing, built-in styling, and native scrollbar hiding on the scroll target.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

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

[More demosExplore all examples](https://vevetjs.com/docs/Scrollbar/demos.md)

## Features[​](#features "Direct link to Features")

* Supports `window`, nested `HTMLElement`, and `Snap` scrolling
* Draggable scrollbar thumb (when `draggable` is `true`)
* Configurable size and minimum thumb size
* Supports both vertical (y) and horizontal (x) axes
* Provides base styles (minor CSS tweaks recommended for layout stability)
* RTL-compatible
* Automatically adjusts to content and container changes

info

To prevent layout shifts, native scrollbars should be hidden via CSS:

```
.your_container {

  -ms-overflow-style: none;

  scrollbar-width: none;



  &::-webkit-scrollbar {

    display: none;

    appearance: none;

    width: 0;

    height: 0;

  }

}
```

## Initialization[​](#initialization "Direct link to Initialization")

caution

`Scrollbar` controls only **one axis per instance**.

Create separate instances for horizontal and vertical scrolling.

Basic usage:

```
import { Scrollbar } from 'vevet';



const y = new Scrollbar();



const x = new Scrollbar({

  axis: 'x',

});
```

Destroying a scrollbar removes its DOM, listeners, and temporary scrollable classes:

```
y.destroy();

x.destroy();
```
