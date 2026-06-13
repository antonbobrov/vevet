# Scrollbar

A customizable scrollbar component for both window and HTMLElement containers.

Provides scroll tracking, drag support, auto-sizing, and built-in styling.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

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

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Scrollbar/demos.md).

## Features[​](#features "Direct link to Features")

* Supports both window-level and nested scrolling
* Draggable scrollbar thumb
* Configurable size and minimum thumb size
* Supports both vertical (y) and horizontal (x) axes
* Provides base styles (minor CSS tweaks recommended for layout stability)
* RTL-compatible
* Automatically adjusts to content and container changes

warning

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

Destroying a scrollbar:

```
y.destroy();

x.destroy();
```
