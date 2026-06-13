# SplitText

`SplitText` splits text within a container into individual lines, words, and letters.

**Features:**

* Supports resizing with automatic resplitting.
* Dynamic content is fully preserved — initial DOM nodes are saved and can be restored on destroy.
* Correctly handles HTML, emojis, multibyte symbols, `<br>` tags and `&nbsp;`.

note

Apply `fontKerning: none` to prevent layout shifts.

## Basic Demo[​](#basic-demo "Direct link to Basic Demo")

[Vevet Demo gbbYKQN](https://codepen.io/anton-bobrov/embed/gbbYKQN?default-tab=result)

HTML

```
<div id="quote">

  Vevet SplitText is a flexible utility that enables seamless text splitting

  into words, letters, or lines as needed.

</div>



<button type="button" id="animate" class="button">Animate</button>
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

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



#quote {

  font-size: 30px;

  max-width: 20em;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



#quote .v-split-text__letter {

  opacity: 0;

}



.button {

  margin-top: 32px;

  height: 48px;

  padding: 0 32px;

  border: 0;

  cursor: pointer;



  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);

  background-size: 200% auto;

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.1);

  border-radius: 50vw;



  font: inherit;

  font-size: 24px;

  color: currentColor;



  transition: all 0.45s cubic-bezier(0.22, 1, 0.36, 1);

}



.button:hover {

  background-position: right center;

}
```

JavaScript

```
import {

  SplitText

} from "vevet";

import {

  animate,

  stagger

} from "https://esm.sh/animejs@4";



let tl;

const container = document.getElementById("quote");



const splitText = new SplitText({

  container,

  letters: true,

  onSplit: (data, {

    letters

  }) => {

    container.style.opacity = "1";



    tl = animate(letters, {

      duration: 800,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outBack",

      delay: stagger(12),

      y: {

        from: -50,

        to: 0

      },

      rotateX: {

        from: 270,

        to: 0

      }

    });



  }

});





document.getElementById("animate").onclick = function() {

  tl.restart();

};
```

## More demos[​](#more-demos "Direct link to More demos")

To explore more demos, click [here](https://vevetjs.com/docs/SplitText/demos.md).

## Performance[​](#performance "Direct link to Performance")

Performance

SplitText is extremely fast, but keep in mind that splitting into letters generates a large number of DOM nodes.<br /><!-- -->For best performance, apply splitting only to short text blocks (headlines, captions).

SplitText is a fast alternative to `GSAP SplitText` or `split-type`.

See performance comparison of:

* [words splitting](https://measurethat.net/Benchmarks/Show/31805/3/vevetsplittext-vs-splittype-vs-gsapsplittext-split-into#latest_results_block)
* [words+letter splitting](https://measurethat.net/Benchmarks/Show/31806/2/vevetsplittext-vs-splittype-vs-gsapsplittext-split-into#latest_results_block)
* [lines+words+letters splitting](https://measurethat.net/Benchmarks/Show/31847/2/vevetsplittext-vs-splittype-vs-gsapsplittext-split-into#latest_results_block)

## Best Practices[​](#best-practices "Direct link to Best Practices")

* Avoid applying animations directly to the container — animate the generated lines/words/letters instead.
* For perfectly stable line splitting, set `font-kerning: none` and ensure fonts are fully loaded before initialization.
* Inline formatting tags (e.g., `<strong>`, `<em>`) are supported, but heavy nested markup may affect line detection accuracy.

## Initialization[​](#initialization "Direct link to Initialization")

Resizing Behavior

SplitText automatically recalculates lines on every resize.

SplitText is easy to initialize:

```
<div id="quote">

  Vevet <b>SplitText</b> is a <u>flexible</u> utility that enables seamless text

  <button>splitting</button>

  into words, letters, or lines as needed.

</div>
```

```
import { SplitText } from 'vevet';



const text = new SplitText({

  container: document.getElementById('quote'),

  letters: true,

});
```

Manual splitting (supported for lines only):

```
text.split();
```

Add animation:

```
import { SplitText } from 'vevet';

import { animate, stagger } from 'animejs';



const text = new SplitText(

  {

    container: document.getElementById('quote'),

    letters: true,

  },

  {

    onSplit: (data, { letters }) => {

      animate(letters, {

        duration: 800,

        opacity: { from: 0, to: 1 },

        ease: 'outBack',

        delay: stagger(12),

        y: { from: -50, to: 0 },

        rotateX: { from: 270, to: 0 },

      });

    },

  },

);
```

Destroy the SplitText instance:

```
text.destroy();
```
