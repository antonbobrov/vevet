import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

// for window
new Vevet.ScrollBar({
    container: window,
});

// for smooth scroll
const smoothScroll = new Vevet.SmoothScroll({
    selectors: {
        outer: '#v-smooth-scroll',
    },
});
new Vevet.ScrollBar({
    container: smoothScroll,
});

// for wrapper scroll
new Vevet.ScrollBar({
    container: '#wrapper-scroll',
});

// for textarea scroll
new Vevet.ScrollBar({
    container: '#textarea-scroll',
});
