---
sidebar_position: 2
---

# SCSS Features

Vevet provides SCSS variables and mixins to work with viewport breakpoints.

## Usage

```css
@import '~vevet/lib/styles/index';

@include vevet-sm {
  html {
    font-size: 14px;
  }
}
```

## var: $vevet-sm

Default: `899px`

The maximum value (in pixels) for the small viewport breakpoint.

## var: $vevet-md

Default: `1199px`

The maximum value (in pixels) for the medium viewport breakpoint.

## mixin: vevet-lg

The mixin that corresponds to the large viewport breakpoint.

```css
.element {
  background-color: #000;
}

@include vevet-lg {
  .element {
    background-color: #ccc;
  }
}
```

## mixin: vevet-md

The mixin that corresponds to the medium viewport breakpoint.

```css
.element {
  background-color: #000;
}

@include vevet-md {
  .element {
    background-color: #ccc;
  }
}
```

## mixin: vevet-sm

The mixin that corresponds to the small viewport breakpoint.

```css
.element {
  background-color: #000;
}

@include vevet-sm {
  .element {
    background-color: #ccc;
  }
}
```

## mixin: vevet-md-max

The mixin that corresponds to the medium and small viewport breakpoints.

```css
.element {
  background-color: #000;
}

@include vevet-md-max {
  .element {
    background-color: #ccc;
  }
}
```

## mixin: vevet-md-min

The mixin that corresponds to the medium and large viewport breakpoints.

```css
.element {
  background-color: #000;
}

@include vevet-md-min {
  .element {
    background-color: #ccc;
  }
}
```
