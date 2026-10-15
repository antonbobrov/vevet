# Methods

<!-- -->

note

All **[Module methods](https://vevetjs.com/docs/base/Module/.md#methods)** are available in this class.

### `split`[​](#split "Direct link to split")

Splits the text into letters, words, and optionally lines based on configuration.

The method is automatically called on initialization, though it can be manually called at any time.

```
const text = new SplitText({ container });



text.split();
```

### `destroy`[​](#destroy "Direct link to destroy")

Destroys the instance, removes listeners, unwraps lines when possible, and restores the original container DOM.

```
const text = new SplitText({ container });



text.destroy();
```
