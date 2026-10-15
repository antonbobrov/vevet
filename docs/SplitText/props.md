# Props

<!-- -->

note

All `SplitText` props are static and cannot be changed in runtime.

## Static Props[​](#static-props "Direct link to Static Props")

Static properties are set during initialization and cannot be modified later.

### `container`[​](#props.container "Direct link to props.container")

* **Type:** `HTMLElement`
* The text container where the text will be split.

```
const text = new SplitText({

  container: document.getElementById('split-text'),

});
```

### `ariaLabel`[​](#props.ariaLabel "Direct link to props.ariaLabel")

* **Type:** `boolean | string`

* **Default:** `true`

* Controls whether an accessible label is added to the container.

  <!-- -->

  * When `true`, the current container text is used as the `aria-label` to keep the text readable for assistive technologies after splitting.
  * When `false`, no `aria-label` attribute is added.
  * When a `string` is provided, that value is used as the `aria-label`.

```
const text = new SplitText({

  container: document.getElementById('split-text'),

  ariaLabel: 'Animated quote',

});
```

### `letters`[​](#props.letters "Direct link to props.letters")

* **Type:** `boolean`
* **Default:** `false`
* Whether to split the text into individual letters.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#animated-letters)**

```
const text = new SplitText({

  letters: true,

});
```

### `lines`[​](#props.lines "Direct link to props.lines")

* **Type:** `boolean`
* **Default:** `false`
* Whether to split the text into lines.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#animated-lines)**

```
const text = new SplitText({

  lines: true,

});
```

### `linesWrapper`[​](#props.linesWrapper "Direct link to props.linesWrapper")

* **Type:** `boolean`
* **Default:** `false`
* Whether to wrap each line in an additional container.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#reveal-lines)**

```
const text = new SplitText({

  linesWrapper: true,

});
```

### `letterTag`[​](#props.letterTag "Direct link to props.letterTag")

* **Type:** `string`
* **Default:** `'span'`
* The HTML tag to wrap each letter.

```
const text = new SplitText({

  letterTag: 'span',

});
```

### `wordTag`[​](#props.wordTag "Direct link to props.wordTag")

* **Type:** `string`
* **Default:** `'span'`
* The HTML tag to wrap each word.

```
const text = new SplitText({

  wordTag: 'span',

});
```

### `lineTag`[​](#props.lineTag "Direct link to props.lineTag")

* **Type:** `string`
* **Default:** `'span'`
* The HTML tag to wrap each line.

```
const text = new SplitText({

  lineTag: 'span',

});
```

### `letterClass`[​](#props.letterClass "Direct link to props.letterClass")

* **Type:** `string`
* **Default:** `'v-split-text__letter'`
* CSS class name applied to each letter.

```
const text = new SplitText({

  letterClass: 'letter',

});
```

### `wordClass`[​](#props.wordClass "Direct link to props.wordClass")

* **Type:** `string`
* **Default:** `'v-split-text__word'`
* CSS class name applied to each word.

```
const text = new SplitText({

  wordClass: 'word',

});
```

### `lineClass`[​](#props.lineClass "Direct link to props.lineClass")

* **Type:** `string`
* **Default:** `'v-split-text__line'`
* CSS class name applied to each line.

```
const text = new SplitText({

  lineClass: 'line',

});
```

### `lineWrapperClass`[​](#props.lineWrapperClass "Direct link to props.lineWrapperClass")

* **Type:** `string`
* **Default:** `'v-split-text__line-wrapper'`
* CSS class name applied to the line wrapper.

```
const text = new SplitText({

  lineWrapperClass: 'line-wrapper',

});
```

### `resizeDebounce`[​](#props.resizeDebounce "Direct link to props.resizeDebounce")

* **Type:** `number`
* **Default:** `0`
* Debounce delay in milliseconds for the resize event.

```
const text = new SplitText({

  resizeDebounce: 0,

});
```

### `ignore`[​](#props.ignore "Direct link to props.ignore")

* **Type:** `string | HTMLElement[] | ((element: HTMLElement) => boolean) | null`
* **Default:** `null`
* Elements or selectors to exclude from splitting. Can be a CSS selector string, an array of HTMLElements, or a function that returns a boolean.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#ignore-selectors)**

```
const text = new SplitText({

  ignore: '.ignore-me',

});
```

### `prepareText`[​](#props.prepareText "Direct link to props.prepareText")

* **Type:** `(text: string) => string`
* **Default:** `(text) => text`
* Optional callback to preprocess text before it is split into words. This function receives the original text and should return the modified text. It is useful for languages like Chinese where standard word splitting may not work correctly.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#chinese)**

```
const segmenter = new Intl.Segmenter('zh', { granularity: 'word' });



const text = new SplitText({

  container,

  prepareText: (source) =>

    [...segmenter.segment(source)].map((s) => s.segment).join(' '),

});
```

### `wordDelimiter`[​](#props.wordDelimiter "Direct link to props.wordDelimiter")

* **Type:** `string`
* **Default:** `(whitespace)`
* Specifies a custom delimiter used to split text into words. By default, splitting occurs on regular whitespace.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#word-delimiter)**

```
const text = new SplitText({

  wordDelimiter: ' ',

});
```

### `wordDelimiterOutput`[​](#props.wordDelimiterOutput "Direct link to props.wordDelimiterOutput")

* **Type:** `string | null`
* **Default:** `null`
* Provides an alternative delimiter to use when outputting the split words. Useful when a custom input delimiter is used but the output should differ.
* **See [demo](https://vevetjs.com/docs/SplitText/demos.md#word-delimiter)**

```
const text = new SplitText({

  wordDelimiterOutput: '—',

});
```
