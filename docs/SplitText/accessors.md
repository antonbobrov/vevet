# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `letters`[​](#letters "Direct link to letters")

Type: `HTMLElement[]`

Retrieves an array of letter elements.

```
const text = new SplitText({ container });



text.letters; // returns an array of letters
```

### `lettersMeta`[​](#lettersmeta "Direct link to lettersmeta")

Type: `ISplitTextLetterMeta[]`

Retrieves an array of letters metadata.

```
const text = new SplitText({ container });



text.lettersMeta; // returns an array of letters data
```

**ISplitTextLetterMeta Structure**

```
interface ISplitTextLetterMeta {

  element: HTMLElement;

}
```

### `lines`[​](#lines "Direct link to lines")

Type: `HTMLElement[]`

Retrieves an array of line elements.

```
const text = new SplitText({ container });



text.lines; // returns an array of lines
```

### `linesMeta`[​](#linesmeta "Direct link to linesmeta")

Type: `ISplitTextLineMeta[]`

Retrieves an array of lines metadata.

```
const text = new SplitText({ container });



text.linesMeta; // returns an array of lines data
```

**ISplitTextLineMeta Structure**

```
interface ISplitTextLineMeta {

  element: HTMLElement;

  words: ISplitTextWordMeta[];

  wrapper?: HTMLElement;

}
```

### `words`[​](#words "Direct link to words")

Type: `HTMLElement[]`

Retrieves an array of word elements.

```
const text = new SplitText({ container });



text.words; // returns an array of words
```

### `wordsMeta`[​](#wordsmeta "Direct link to wordsmeta")

Type: `ISplitTextWordMeta[]`

Retrieves an array of words metadata.

```
const text = new SplitText({ container });



text.wordsMeta; // returns an array of words data
```

**ISplitTextWordMeta Structure**

```
interface ISplitTextWordMeta {

  element: HTMLElement;

  letters: ISplitTextLetterMeta[];

}
```
