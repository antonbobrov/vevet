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
<div class="fullpage-center">

  <div id="quote">

    Vevet SplitText is a flexible utility that enables seamless text splitting

    into words, letters, or lines as needed.

  </div>



  <button type="button" id="animate" class="btn">Animate</button>

</div>
```

CSS

```
#quote {

  width: 20em;

  max-width: 100%;

  line-height: 1.2;

  text-align: center;

  font-kerning: none;



  opacity: 0;

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

} from "animejs";



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

[Open live demo ↗](https://vevetjs.com/pens/gbbYKQN)

[More demosExplore all examples](https://vevetjs.com/docs/SplitText/demos.md)

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

Resizing behavior

When `lines` is enabled, SplitText reflows line wrappers on resize.

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

Manual line reflow (only needed when `lines` is `true`):

```
text.split();
```

Add animation:

```
import { SplitText } from 'vevet';

import { animate, stagger } from 'animejs';



const text = new SplitText({

  container: document.getElementById('quote'),

  letters: true,

  onSplit: () => {

    animate(text.letters, {

      duration: 800,

      opacity: { from: 0, to: 1 },

      ease: 'outBack',

      delay: stagger(12),

      y: { from: -50, to: 0 },

      rotateX: { from: 270, to: 0 },

    });

  },

});
```

Destroy the SplitText instance:

```
text.destroy();
```
