# Accessors

<!-- -->

note

All **[Module accessors](https://vevetjs.com/docs/base/Module/.md#accessors)** are available in this class.

### `totalSize`[​](#totalsize "Direct link to totalsize")

Type: `number`

Total size of all elements in the marquee.

```
const marquee = new Marquee({ container });



marquee.totalSize; // returns scrollable size of marquee
```

### `coord`[​](#coord "Direct link to coord")

Type: `number`

Gets/Sets the current marquee coordinate.

The value is updated on every animation frame depending on the `speed` prop.

Setting coord manually overrides the current position.

During `resize()`, the coordinate may be normalized to ensure correct looping.

```
const marquee = new Marquee({ container });



marquee.coord; // returns current marquee coordinate

marquee.coord = 0; // reset to initial position
```
