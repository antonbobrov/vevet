# Demos

<!-- -->

## Animated letters[​](#animated-letters "Direct link to Animated letters")

Initialize SplitText with `letters: true`, then animate the split letters with [Anime.js](https://animejs.com/).

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

## Animated lines[​](#animated-lines "Direct link to Animated lines")

Initialize SplitText with `lines: true`, then animate the split lines with [Anime.js](https://animejs.com/).

[Vevet Demo JoXePjG](https://codepen.io/anton-bobrov/embed/JoXePjG?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    Vevet SplitText is a free utility that enables seamless text splitting

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

  lines: true,

  letters: false,

  onSplit: (data, {

    lines

  }) => {

    container.style.opacity = "1";



    tl = animate(lines, {

      duration: 800,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outSine",

      delay: stagger(250),

      y: {

        from: "50%",

        to: 0

      }

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl?.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/JoXePjG)

## Reveal lines[​](#reveal-lines "Direct link to Reveal lines")

Use `lines: true` with `linesWrapper: true` to wrap each line in an extra container — useful for mask and reveal animations.

[Vevet Demo vEEBrPP](https://codepen.io/anton-bobrov/embed/vEEBrPP?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    Vevet SplitText is a free utility that enables seamless text splitting

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



  .v-split-text__line-wrapper {

    overflow: hidden;

  }

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

  lines: true,

  linesWrapper: true,

  letters: false,

  onSplit: (data, {

    lines

  }) => {

    container.style.opacity = "1";



    tl = animate(lines, {

      duration: 800,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outSine",

      delay: stagger(500),

      y: {

        from: "100%",

        to: 0

      }

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl?.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/vEEBrPP)

## Chinese[​](#chinese "Direct link to Chinese")

Split Chinese text with `prepareText` and `Intl.Segmenter('zh', { granularity: 'word' })`. Whitespace-based splitting does not work reliably for CJK text.

[Vevet Demo NPNEKPL](https://codepen.io/anton-bobrov/embed/NPNEKPL?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote"><span class="ignore">vevet.js</span> 太简洁了我爱死它了!</div>



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



.ignore {

  display: inline-block;

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

const segmenter = new Intl.Segmenter("zh", {

  granularity: "word"

});



const splitText = new SplitText({

  container: document.getElementById("quote"),

  ignore: ".ignore",

  prepareText: (source) => [...segmenter.segment(source)].map(s => s.segment).join(" "),

  onSplit: (data, {

    words

  }) => {

    container.style.opacity = "1";



    tl = animate(words, {

      duration: 350,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outSine",

      delay: stagger(250),

      y: {

        from: "-100%",

        to: 0

      }

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl?.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/NPNEKPL)

## Thai[​](#thai "Direct link to Thai")

Split Thai text with `prepareText` and `Intl.Segmenter('th', { granularity: 'word' })`.

[Vevet Demo WbwYerY](https://codepen.io/anton-bobrov/embed/WbwYerY?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote"><span class="ignore">vevet.js</span> เรียบง่ายมาก ฉันชอบมันมาก!</div>



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



.ignore {

  display: inline-block;

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

const segmenter = new Intl.Segmenter("th", {

  granularity: "word"

});



const splitText = new SplitText({

  container,

  ignore: ".ignore",

  prepareText: (source) => [...segmenter.segment(source)].map(s => s.segment).join(" "),

  onSplit: (data, {

    words

  }) => {

    container.style.opacity = "1";



    tl = animate(words, {

      duration: 350,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outSine",

      delay: stagger(250),

      y: {

        from: "-100%",

        to: 0

      }

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl?.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/WbwYerY)

## Arabic[​](#arabic "Direct link to Arabic")

Split Arabic text with `prepareText` and `Intl.Segmenter('ar', { granularity: 'word' })`. Set `direction: rtl` on the container for RTL languages.

[Vevet Demo pvyQzyB](https://codepen.io/anton-bobrov/embed/pvyQzyB?default-tab=result)

HTML

```
<div class="fullpage-center" dir="rtl">

  <div id="quote"><span class="ignore">vevet.js</span> بسيط جدًا! أحبه!</div>



  <button type="button" id="animate" class="btn">Animate</button>

</div>
```

CSS

```
.fullpage-center {

  align-items: start;

  padding: 0 1.5rem;

}



#quote {

  width: 20em;

  max-width: 100%;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



.ignore {

  display: inline-block;

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

const segmenter = new Intl.Segmenter("ar", {

  granularity: "word"

});



const splitText = new SplitText({

  container,

  ignore: ".ignore",

  prepareText: (source) => [...segmenter.segment(source)].map(s => s.segment).join(" "),

  onSplit: (data, {

    words

  }) => {

    container.style.opacity = "1";



    tl = animate(words, {

      duration: 350,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outSine",

      delay: stagger(250),

      y: {

        from: "-100%",

        to: 0

      }

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl?.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/pvyQzyB)

## Text formatting[​](#text-formatting "Direct link to Text formatting")

SplitText preserves inline HTML, `<br>` tags, `&nbsp;`, nested tags, and emojis inside the container.

[Vevet Demo ZYYzRwy](https://codepen.io/anton-bobrov/embed/ZYYzRwy?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    SplitText supports multiple <br><br>

    <b style="color: #ff8709">newlines</b>,<br><br>

    <b style="color: #00bae2">non-breaking&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spaces,</b> <b style="color: #f100cb">nested tags</b> like&nbsp;&lt;span&gt;,

    &lt;strong&gt;, and handles&nbsp;emojis&nbsp;🥰

  </div>



  <button type="button" id="animate" class="btn">Animate</button>

</div>
```

CSS

```
#quote {

  width: 20em;

  max-width: 100%;

  line-height: 1;

  text-align: center;

  font-kerning: none;



  perspective: 400px;



  opacity: 0;

}
```

JavaScript

```
import {

  SplitText

} from "vevet";

import gsap from "gsap";



const tl = gsap.timeline();

const container = document.getElementById("quote");



const splitText = new SplitText({

  container,

  letters: true,

  onSplit: (data, {

    letters

  }) => {

    container.style.opacity = "1";



    tl.from(letters, {

      duration: 0.8,

      opacity: 0,

      scale: 0,

      y: 80,

      rotationX: 180,

      transformOrigin: "0% 50% -50",

      ease: "back",

      stagger: 0.01

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/ZYYzRwy)

## Word Delimiter[​](#word-delimiter "Direct link to Word Delimiter")

Customize word splitting and output separators:

* `wordDelimiter: " "` — delimiter used to split input text into words
* `wordDelimiterOutput: "—"` — separator inserted between words in the output

[Vevet Demo OPNaLmw](https://codepen.io/anton-bobrov/embed/OPNaLmw?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">You can use custom word delimiter</div>



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



.ignore {

  display: inline-block;

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

  wordDelimiter: " ",

  wordDelimiterOutput: "—",

  onSplit: (data, {

    words

  }) => {

    container.style.opacity = "1";



    tl = animate(words, {

      duration: 350,

      opacity: {

        from: 0,

        to: 1

      },

      ease: "outSine",

      delay: stagger(250),

      y: {

        from: "-100%",

        to: 0

      }

    });



  }

});



document.getElementById("animate").onclick = function() {

  tl?.restart();

};
```

[Open live demo ↗](https://vevetjs.com/pens/OPNaLmw)

## Split into letters[​](#split-into-letters "Direct link to Split into letters")

Letter splitting with `letters: true`. Every even letter is highlighted.

[Vevet Demo azdLgPp](https://codepen.io/anton-bobrov/embed/azdLgPp?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    Vevet SplitText is a&nbsp;powerful utility that can split your&nbsp;text into letters.

  </div>

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

}



#quote .v-split-text__letter {

  &:nth-child(2n + 2) {

    background-color: rgba(0, 201, 177, 0.3);

  }

}
```

JavaScript

```
import {

  SplitText

} from "vevet";



const splitText = new SplitText({

  container: document.getElementById("quote"),

  letters: true

});
```

[Open live demo ↗](https://vevetjs.com/pens/azdLgPp)

## Split into words[​](#split-into-words "Direct link to Split into words")

Words are split by default. Every even word is highlighted.

[Vevet Demo JoGrQQy](https://codepen.io/anton-bobrov/embed/JoGrQQy?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    Vevet SplitText is a&nbsp;powerful utility that can split your text into words.

  </div>

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

}



#quote .v-split-text__word {

  &:nth-child(2n + 1) {

    background-color: rgba(0, 201, 177, 0.3);

  }

}
```

JavaScript

```
import {

  SplitText

} from "vevet";



const splitText = new SplitText({

  container: document.getElementById("quote")

});
```

[Open live demo ↗](https://vevetjs.com/pens/JoGrQQy)

## Split into lines[​](#split-into-lines "Direct link to Split into lines")

Line splitting with `lines: true`. Every even line is highlighted.

[Vevet Demo zxrEgYZ](https://codepen.io/anton-bobrov/embed/zxrEgYZ?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    Vevet SplitText is a&nbsp;powerful utility that can split your text into lines. There's no need to update the text on resize: SplitText handles resizing by default.<br> It also supports native line-breaking<br><br><br> Even multiple!<br>Resize the window to see changes.

  </div>

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

}



#quote .v-split-text__line {

  &:nth-of-type(2n + 1) {

    background-color: rgba(0, 201, 177, 0.3);

  }

}
```

JavaScript

```
import {

  SplitText

} from "vevet";



const splitText = new SplitText({

  container: document.getElementById("quote"),

  lines: true

});
```

[Open live demo ↗](https://vevetjs.com/pens/zxrEgYZ)

## Ignore selectors[​](#ignore-selectors "Direct link to Ignore selectors")

Skip specific elements during splitting with `ignore: ".ignore-me"`. Also accepts an array of elements or a filter function.

[Vevet Demo MYKENye](https://codepen.io/anton-bobrov/embed/MYKENye?default-tab=result)

HTML

```
<div class="fullpage-center">

  <div id="quote">

    In some cases, you might prefer not to split specific elements. That's perfectly fine - we support that. Just add <code>ignore</code> and <b class="ignore-me">&nbsp;this text will never be split!</b>

  </div>

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

}



#quote .v-split-text__letter {

  &:nth-child(2n + 1) {

    background-color: rgba(0, 201, 177, 0.2);

  }

}



#quote code {

  background-color: rgba(255, 255, 255, 0.2);

}



.ignore-me {

  background-color: rgba(125, 0, 50, 1);

}
```

JavaScript

```
import {

  SplitText

} from "vevet";



const splitText = new SplitText({

  container: document.getElementById("quote"),

  letters: true,

  ignore: ".ignore-me"

});
```

[Open live demo ↗](https://vevetjs.com/pens/MYKENye)
