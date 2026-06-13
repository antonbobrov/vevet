# Callbacks

<!-- -->

note

All **[Module callbacks](https://vevetjs.com/docs/base/Module/.md#callbacks)** are available in this class.

### `beforeSplit`[​](#beforesplit "Direct link to beforesplit")

Called before the text is split.

```
const text = new SplitText({

  container,

  onBeforeSplit: () => console.log('before split'),

});
```

or:

```
const destruct = text.on('beforeSplit', () => console.log('before split'));



// Cancel the callback

destruct();
```

### `split`[​](#split "Direct link to split")

Called after the text has been split.

```
const text = new SplitText({

  container,

  onSplit: () => console.log('split'),

});
```

or:

```
const destruct = text.on('split', () => console.log('split'));



// Cancel the callback

destruct();
```
