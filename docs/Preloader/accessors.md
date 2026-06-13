# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `isHidden`[​](#ishidden "Direct link to ishidden")

Type: `boolean`

Returns whether the preloader is currently hidden.<br /><!-- -->This becomes `true` only after:

* the page is fully loaded, and
* the hiding animation (automatic or manual) is completed.

```
const preloader = new Preloader({

  container: document.getElementById('container'),

});



preloader.isHidden; // detect final hidden state
```
