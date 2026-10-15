# InView

Visibility detection via `IntersectionObserver`:

* Monitors elements entering and optionally leaving the viewport
* Staggered initial delays via `maxInitialDelay` and element position
* Direction detection for scroll-aware animations
* Optional CSS classes via `data-in-view-class`

## Observation lifecycle[​](#observation-lifecycle "Direct link to Observation lifecycle")

InView runs two observation phases:

1. **Initial pass** — `rootMargin` is `0%` on all sides. `isInitialStart` is `true`. Enter events use position-based stagger from [`maxInitialDelay`](https://vevetjs.com/docs/InView/props.md#props.maxInitialDelay).
2. **Ongoing** — after the first enter batch, observers reconnect with [`rootMargin`](https://vevetjs.com/docs/InView/props.md#props.rootMargin) (default `0% 0% -5% 0%`). `isInitialStart` becomes `false`.

Two observers are used internally:

| Observer  | Role                                                                                               | `rootMargin`                          |
| --------- | -------------------------------------------------------------------------------------------------- | ------------------------------------- |
| **Enter** | `in` callbacks, initial stagger                                                                    | `0%` on first pass, then `rootMargin` |
| **Leave** | `out` callbacks (when [`hasOut`](https://vevetjs.com/docs/InView/props.md#props.hasOut) is `true`) | always `0px`                          |

When `hasOut` is `false`, the element is unobserved after the first `in` — one-time triggers only.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

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

[More demosExplore all examples](https://vevetjs.com/docs/InView/demos.md)

## Initialization[​](#initialization "Direct link to Initialization")

InView is easy to initialize:

```
<h1 id="observable-element">Hello, World!</h1>
```

```
import { InView } from 'vevet';



const observer = new InView();



observer.on('in', ({ element, direction }) => {

  console.log('Element entered from:', direction);

  // direction can be: 'fromBottom', 'fromTop', 'fromLeft', or 'fromRight'

});



// addElement returns a cleanup function

const stopObserving = observer.addElement(

  document.getElementById('observable-element'),

);



// Later, you can stop observing this specific element

stopObserving();
```

### CSS Class Management[​](#css-class-management "Direct link to CSS Class Management")

InView can automatically add and remove CSS classes based on element visibility. This enables fully CSS-driven scroll animations without JavaScript transitions.

To enable this behavior, use the `data-in-view-class` attribute:

**Simple class (same animation for all directions):**

```
<h1 data-in-view-class="fadeIn">Animated Element</h1>
```

**Directional classes (different animations based on scroll direction):**

```
<!-- Vertical scrolling: fadeInUp when from bottom, fadeInDown when from top -->

<h1 data-in-view-class="fadeInUp|fadeInDown">Directional InView</h1>



<!-- Horizontal scrolling: fadeInLeft when from right, fadeInRight when from left -->

<h1 data-in-view-class="fadeInLeft|fadeInRight">Horizontal Directional</h1>
```

The syntax is `direct|reverse`, where:

* **direct** is applied when the element enters from the default direction (bottom for vertical, right for horizontal)
* **reverse** is applied when entering from the opposite direction (top for vertical, left for horizontal)

If only one class is provided (no pipe), it's used for all directions.

Class Behavior

The class from `data-in-view-class` is added when the element enters the viewport and removed once the element leaves the viewport (if `hasOut: true`).<br /><!-- -->This allows creating fully CSS-driven scroll animations without JavaScript transitions.

### Managing Elements[​](#managing-elements "Direct link to Managing Elements")

**Stop observing a specific element:**

```
observer.removeElement(yourElement);
```

**Destroy the InView instance:**

```
observer.destroy();
```

## Direction Detection[​](#direction-detection "Direct link to Direction Detection")

InView automatically detects the direction from which elements enter or leave the viewport. This information is available in callbacks and can be used to create directional animations.

The direction values are:

* **`fromBottom`** - Element enters/leaves from below (vertical scrolling)
* **`fromTop`** - Element enters/leaves from above (vertical scrolling)
* **`fromLeft`** - Element enters/leaves from the left (horizontal scrolling)
* **`fromRight`** - Element enters/leaves from the right (horizontal scrolling)

Direction is determined by comparing the element's position to the viewport center. For the initial pass, the direction defaults to the natural scroll direction (`fromBottom` for vertical, `fromRight` for horizontal).

For horizontal layouts in RTL documents, initial stagger delay is mirrored so elements farther along the reading direction receive longer delays.

`isInitialStart` timing

[`isInitialStart`](https://vevetjs.com/docs/InView/accessors.md#isinitialstart) becomes `false` as soon as the first enter batch is processed — **before** staggered `in` callbacks fire. Do not rely on `observer.isInitialStart` inside the `in` handler to distinguish initial vs scroll animations; track that state yourself or set `maxInitialDelay: 0` for scroll-only triggers.

## Best Practices[​](#best-practices "Direct link to Best Practices")

* Prefer adding a **single InView instance** and registering multiple elements instead of creating many observers.
* Avoid observing extremely large numbers of elements — group content into sections when possible.
* Use `hasOut: false` if you only need one-time triggers — this improves performance and reduces callback spam.
* Leverage `data-in-view-class` for CSS-only animations when possible — it's more performant than JavaScript-based transitions.
* Use the `direction` parameter in callbacks to create context-aware animations and interactions.
