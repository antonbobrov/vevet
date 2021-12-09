import * as Vevet from '../../../../../src/ts/index';

const app = new Vevet.Application();

app.pageLoad.onLoaded(() => {
    // set ScrollView for Window
    new Vevet.ScrollView({
        container: window,
        elements: Array.from(document.querySelectorAll('.v-view-window')),
    });


    // set ScrollView for SmoothScroll
    const customScroll = new Vevet.SmoothScroll();
    new Vevet.ScrollBar({
        container: customScroll,
    });
    new Vevet.ScrollView({
        container: customScroll,
        elements: Array.from(document.querySelectorAll('.v-view-smooth-scroll')),
        useDelay: {
            max: 500,
            dir: 'y',
        },
    });

    // set ScrollView for wrapper scroll
    new Vevet.ScrollView({
        container: '#wrapper-scroll',
        elements: Array.from(document.querySelectorAll('.v-view-wrapper-scroll')),
        useDelay: {
            max: 1200,
            dir: 'y',
        },
    });
});
