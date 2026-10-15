# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `elements`[​](#elements "Direct link to elements")

Type: `Element[]`

Returns a read-only array of all DOM elements currently being observed by this InView instance.

```
const observer = new InView();



observer.addElement(document.getElementById('element1'));

observer.addElement(document.getElementById('element2'));



// Get all observed elements

const observedElements = observer.elements;

console.log(observedElements.length); // 2



// Iterate over observed elements

observer.elements.forEach((element) => {

  console.log(element.id);

});
```

### `isInitialStart`[​](#isinitialstart "Direct link to isinitialstart")

Type: `boolean`

Whether the **first observation pass** is still active (zero `rootMargin`, staggered [`maxInitialDelay`](https://vevetjs.com/docs/InView/props.md#props.maxInitialDelay)).

* `true` from construction until the first enter batch is processed
* becomes `false` **before** staggered `in` callbacks fire

caution

Do not use `observer.isInitialStart` inside the [`in`](https://vevetjs.com/docs/InView/callbacks.md#in) handler to detect initial vs scroll animations — it is already `false` by the time delayed callbacks run. Track that distinction in your own state, or set `maxInitialDelay: 0` for scroll-only behavior.

```
const observer = new InView({ maxInitialDelay: 1000 });



console.log(observer.isInitialStart); // true



// After the first elements intersect (before their delayed `in` fires):

// observer.isInitialStart === false
```

### `isRtl`[​](#isrtl "Direct link to isrtl")

Type: `boolean`

Whether the document root uses `direction: rtl` (read once at construction from `body`).

Mirrors horizontal [`maxInitialDelay`](https://vevetjs.com/docs/InView/props.md#props.maxInitialDelay) stagger so elements farther along the reading direction receive longer delays. Useful when building custom RTL scroll layouts alongside [`scrollDirection: 'horizontal'`](https://vevetjs.com/docs/InView/props.md#props.scrollDirection).
