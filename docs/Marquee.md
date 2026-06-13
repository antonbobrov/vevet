# Marquee

A custom marquee component that smoothly scrolls its child elements.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo zxxOadw](https://codepen.io/anton-bobrov/embed/zxxOadw?default-tab=result)

HTML

```
<div id="marquee">Breaking News🔥</div>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 0;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

  font-size: 40px;

}
```

JavaScript

```
import {

  Marquee

} from "vevet";



new Marquee({

  container: document.getElementById("marquee")

});
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/Marquee/demos.md).

## Advantages[​](#advantages "Direct link to Advantages")

* **Automatic Cloning of Child Nodes**<br /><!-- -->Seamlessly duplicates content to ensure a continuous marquee without visual gaps.

* **Horizontal and Vertical Modes**<br /><!-- -->Works in both directions with the same API — no extra configuration needed.

* **Flexible Speed Control**<br /><!-- -->Supports dynamic speed updates and smooth runtime adjustments.

* **Custom Speed & Gap With CSS Units**<br /><!-- -->Both speed and gap accept any CSS length unit (px, rem, vw, etc.), with gap supporting only zero or positive values.

* **Playback Control API**<br /><!-- -->Programmatically play, pause, and restart the marquee.

* **Pause on Hover**<br /><!-- -->Optional hover-based pausing built in.

* **Default Styling Included**<br /><!-- -->Ships with minimal required CSS (or inline styles), so the marquee works out-of-the-box without custom styling.

## Best Practices[​](#best-practices "Direct link to Best Practices")

To ensure smooth and predictable marquee behavior:

* Use either plain text or a group of elements as children — the component is optimized for both.
* Child elements should preferably use inline-block or block display values for correct width calculation.
* The gap property should always be 0 or a positive value. Negative values are not supported.
* When using complex layouts inside the marquee, avoid margin collapsing and ensure elements have measurable width/height.
* For vertical marquee, define an explicit container height.
* Avoid using inline styles inside marquee children.

## Initialization[​](#initialization "Direct link to Initialization")

Marquee is easy to initialize:

```
<div id="marquee">Breaking News🔥</div>
```

```
import { Marquee } from 'vevet';



const marquee = new Marquee({

  container: document.getElementById('marquee'),

});
```

Stop marquee:

```
marquee.updateProps({

  enabled: false,

});
```

Play marquee:

```
marquee.updateProps({

  enabled: true,

});
```

Manual rendering:

```
marquee.render(2); // moves marquee two pixels forward
```

Destroy the marquee

```
marquee.destroy();
```
