import * as Vevet from '../../../../../src/ts/index';

new Vevet.Application();

const outerScroll = new Vevet.SmoothScroll({
    selectors: {
        outer: '#v-smooth-scroll-outer',
    },
    enabled: true,
    render: {
        lerp: 0.1,
        lerpToFixed: 2,
    },
});
new Vevet.ScrollBar({
    container: outerScroll,
});
outerScroll.addPlugin(new Vevet.SmoothScrollKeyboardPlugin());

const innerScroll = new Vevet.SmoothScroll({
    selectors: {
        outer: '#v-smooth-scroll-inner',
    },
    enabled: true,
    render: {
        lerp: 0.2,
    },
    overscroll: false,
});
new Vevet.ScrollBar({
    container: innerScroll,
});
