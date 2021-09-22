import * as Vevet from '../../../src/ts/index';

export default new Vevet.Application({
    tablet: 1199,
    phone: 899,
    prefix: 'v-',
    viewportResizeTimeout: 100,
    easing: [0.25, 0.1, 0.25, 1],
});

