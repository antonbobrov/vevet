import * as Vevet from '../../../../../src/ts/index';

new Vevet.Application();

new Vevet.CustomCursor({
    container: '#cursor-area',
    render: {
        lerpToFixed: 2,
    },
    hideNativeCursor: true,
});
