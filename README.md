# Vevet

## JavaScript library with useful stuff that is often used on websites.
[![npm](https://img.shields.io/npm/v/vevet?style=flat-square)](https://www.npmjs.com/package/vevet)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

What the library can do:
* AJAX requests
* Custom Cursor
* Drag/Swipe
*Animation (Animation Frame, Timelines, easings)
* Canvas Slider
* AJAX Forms
* Menu element
* AJAX Page routing
* Custom Scrolling
* Text animation
* etc <br>

## Initialize

First of all, install Vevet.
```sh
# NPM
npm i vevet
```

Import Vevet.
```js
import * as Vevet from 'vevet';
```
```scss
@import '~vevet/dist/scss/index';
```

The library consists of four parts, in general: **Application**, **Event**, **Module** and **Plugin**.
* Application - this class is used to initialize Vevet. It is required by other parts.
* Event - custom abstract events.
* Module - the basis for modules.
* Plugin - addons for modules.

Initialize the application.
```js
let app = new Vevet.Application({
    prefix: 'v-',
    page: ['home']
});
```
Now you can use all the features of the library. F.e., include some modules:
```scss
@import '~vevet/dist/scss/modules/preloader';
@import '~vevet/dist/scss/modules/_preloader.scss';
```
```js
// initialize preloader
let preloader = new Vevet.PreloaderModule({
    selector: '.my-preloader',
    progress: {
        on: true,
        animate: true
    }
});
// add progress callbacks
preloader.add({
    target: 'progressAnimate',
    do: (data) => {
        console.log(`Progress: ${data.progress}`);
        console.log(`Resources loaded: ${data.loaded}`);
        console.log(`Resources total: ${data.total}`);
    }
});
// launch callback when the preloader is hidden
preloader.add({
    target: 'hidden',
    do: () => {
        alert("The preloader was hidden");
    }
});
```