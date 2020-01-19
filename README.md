# Vevet - a JavaScript library with useful stuff

The library contains classes that can allow you to create Page Routing, Sliders, Timelines and animations, etc. <br>

## Initialize

First of all, install Vevet.
```sh
# NPM
npm i vevet
```

Import Vevet.
```js
import * as Vevet from './vevet';
```
```scss
@import '~vevet/dist/scss/index';
```

The library consists of four parts, in general: Application, Core and Event.
*  Application - this class is used to initialize Vevet. It is required by modules in properties.
*  Core - just a set of functions that are frequently used in the library.
*  Events - the basis of all modules. 
*  Modules. 

Initialize an application.
```js
let app = new Vevet.Application({
    prefix: 'v-',
    page: ['home']
});
```
Now you can use all features of the library. F.e., include some modules:
```js
// initialize preloader
let preloader = new Vevet.Preloader({
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
// add hidden callback
preloader.add({
    target: 'hidden',
    do: () => {
        alert("The preloader was hidden");
    }
});
```