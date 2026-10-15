# Props

<!-- -->

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement | null`
* **Default:** `null`
* The container for the preloader.
* Set it to `null` if you only need the preloader logic.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});
```

### `hide`[​](#props.hide "Direct link to props.hide")

* **Type:** `false | number`

* **Default:** `250`

* Defines whether to automatically hide the preloader container.

  <!-- -->

  * `false`: Disables the hiding animation, allowing manual control.
  * `number`: Specifies the animation duration in milliseconds.

* Works only if the container is an HTML element.

* **The hide animation runs only after the page is fully loaded.**
  <br />
  <!-- -->
  Calling `.hide()` before the `loaded` event will return `undefined`.

* **See [demo](https://vevetjs.com/docs/Preloader/demos.md#custom-hiding-logic)**

```
const preloader = new Preloader({

  container: document.getElementById('container'),

  hide: 500, // the preloader will be hidden within 500ms when the page is loaded

});
```

```
const preloader = new Preloader(

  {

    container: document.getElementById('container'),

    hide: false, // do not hide the preloader automatically

  },

  {

    onLoaded: () => {

      // some action



      // hide manually

      preloader.hide();

    },

  },

);
```
