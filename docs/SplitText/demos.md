# Demos

<!-- -->

## Animated letters[​](#animated-letters "Direct link to Animated letters")

Animate Vevet SplitText letters with [Anime.js](https://animejs.com/):

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

## Animated lines[​](#animated-lines "Direct link to Animated lines")

SplitText lines can be easily animated by lines:

[Vevet Demo JoXePjG](https://codepen.io/anton-bobrov/embed/JoXePjG?default-tab=result)

HTML

```
<div id="quote">

  Vevet SplitText is a free utility that enables seamless text splitting

  into words, letters, or lines as needed.

</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 30px;



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

  max-width: 20em;

  font-size: 24px;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



.button {

  margin-top: 2rem;

  height: 3rem;

  padding: 0 2rem;

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

  font-size: 1.25rem;

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

## Reveal lines[​](#reveal-lines "Direct link to Reveal lines")

SplitText provides an additional wrapper for lines, making reveal animations simpler to implement:

[Vevet Demo vEEBrPP](https://codepen.io/anton-bobrov/embed/vEEBrPP?default-tab=result)

HTML

```
<div id="quote">

  Vevet SplitText is a free utility that enables seamless text splitting

  into words, letters, or lines as needed.

</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 30px;



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

  max-width: 20em;

  font-size: 24px;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;



  .v-split-text__line-wrapper {

    overflow: hidden;

  }

}



.button {

  margin-top: 2rem;

  height: 3rem;

  padding: 0 2rem;

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

  font-size: 1.25rem;

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

## Chinese[​](#chinese "Direct link to Chinese")

[Vevet Demo NPNEKPL](https://codepen.io/anton-bobrov/embed/NPNEKPL?default-tab=result)

HTML

```
<div id="quote"><span class="ignore">vevet.js</span> 太简洁了我爱死它了!</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 30px;



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

  max-width: 20em;

  font-size: 24px;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



.ignore {

  display: inline-block;

}



.button {

  margin-top: 2rem;

  height: 3rem;

  padding: 0 2rem;

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

  font-size: 1.25rem;

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

## Thai[​](#thai "Direct link to Thai")

[Vevet Demo WbwYerY](https://codepen.io/anton-bobrov/embed/WbwYerY?default-tab=result)

HTML

```
<div id="quote"><span class="ignore">vevet.js</span> เรียบง่ายมาก ฉันชอบมันมาก!</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 30px;



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

  max-width: 20em;

  font-size: 24px;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



.ignore {

  display: inline-block;

}



.button {

  margin-top: 2rem;

  height: 3rem;

  padding: 0 2rem;

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

  font-size: 1.25rem;

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

## Arabic[​](#arabic "Direct link to Arabic")

[Vevet Demo pvyQzyB](https://codepen.io/anton-bobrov/embed/pvyQzyB?default-tab=result)

HTML

```
<div id="quote"><span class="ignore">vevet.js</span> بسيط جدًا! أحبه!</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  direction: rtl;

  margin: 0;

  padding: 30px;



  display: flex;

  flex-direction: column;

  align-items: flex-start;

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

  font-size: 28px;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



.ignore {

  display: inline-block;

}



.button {

  margin-top: 2rem;

  height: 3rem;

  padding: 0 2rem;

  border: 0;

  cursor: pointer;

  width: max-content;



  background: linear-gradient(135deg,

      rgb(13, 110, 253) 0%,

      rgb(140, 122, 230) 50%,

      rgb(0, 201, 177) 100%);

  background-size: 200% auto;

  box-shadow: 0 4px 20px rgba(13, 110, 253, 0.1);

  border-radius: 50vw;



  font: inherit;

  font-size: 1.25rem;

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

## Text formatting[​](#text-formatting "Direct link to Text formatting")

SplitText can handle HTML elements inside. They can all be animated the way you want:

[Vevet Demo ZYYzRwy](https://codepen.io/anton-bobrov/embed/ZYYzRwy?default-tab=result)

HTML

```
<div id="quote">

  SplitText supports multiple <br><br>

  <b style="color: #ff8709">newlines</b>,<br><br>

  <b style="color: #00bae2">non-breaking&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;spaces,</b> <b style="color: #f100cb">nested tags</b> like&nbsp;&lt;span&gt;,

  &lt;strong&gt;, and handles&nbsp;emojis&nbsp;🥰

</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 30px;

  box-sizing: border-box;



  display: flex;

  flex-direction: column;

  align-items: center;

  justify-content: center;



  min-height: 100vh;



  background: linear-gradient(165deg,

      rgb(17, 25, 42) 0%,

      rgb(30, 43, 82) 40%,

      rgb(0, 58, 82) 100%);

  color: #fff;



  font-family: "Ubuntu", sans-serif;

}



#quote {

  font-size: 24px;

  max-width: 20em;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  perspective: 400px;



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

import gsap from "https://esm.sh/gsap";



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

## Word Delimiter[​](#word-delimiter "Direct link to Word Delimiter")

[Vevet Demo OPNaLmw](https://codepen.io/anton-bobrov/embed/OPNaLmw?default-tab=result)

HTML

```
<div id="quote">You can use custom word delimiter</div>



<button type="button" id="animate" class="button">Animate</button>
```

CSS

```
@import url("https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;400;500;600;700&display=swap");



body {

  margin: 0;

  padding: 30px;



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

  max-width: 20em;

  font-size: 24px;

  text-align: center;

  line-height: 1.2;

  font-kerning: none;



  opacity: 0;

}



.button {

  margin-top: 2rem;

  height: 3rem;

  padding: 0 2rem;

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

  font-size: 1.25rem;

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

## Split into letters[​](#split-into-letters "Direct link to Split into letters")

Simple text division into letters:

[Vevet Demo azdLgPp](https://codepen.io/anton-bobrov/embed/azdLgPp?default-tab=result)

HTML

```
<div id="quote">

  Vevet SplitText is a&nbsp;powerful utility that can split your&nbsp;text into letters.

</div>
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

## Split into words[​](#split-into-words "Direct link to Split into words")

Simple text division into words:

[Vevet Demo JoGrQQy](https://codepen.io/anton-bobrov/embed/JoGrQQy?default-tab=result)

HTML

```
<div id="quote">

  Vevet SplitText is a&nbsp;powerful utility that can split your text into words.

</div>
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

## Split into lines[​](#split-into-lines "Direct link to Split into lines")

Simple text division into lines:

[Vevet Demo zxrEgYZ](https://codepen.io/anton-bobrov/embed/zxrEgYZ?default-tab=result)

HTML

```
<div id="quote">

  Vevet SplitText is a&nbsp;powerful utility that can split your text into lines. There's no need to update the text on resize: SplitText handles resizing by default.<br> It also supports native line-breaking<br><br><br> Even multiple!<br>Resize the window to see changes.

</div>
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

## Ignore selectors[​](#ignore-selectors "Direct link to Ignore selectors")

Sometimes you may not want to split certain elements - no problem! We can handle that:

[Vevet Demo MYKENye](https://codepen.io/anton-bobrov/embed/MYKENye?default-tab=result)

HTML

```
<div id="quote">

  In some cases, you might prefer not to split specific elements. That's perfectly fine - we support that. Just add <code>ignore</code> and <b class="ignore-me">&nbsp;this text will never be split!</b>

</div>
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
