import * as Vevet from '../../../../../src/ts/index';

new Vevet.Application();

const container = document.querySelector<HTMLElement>('#v-preloader');
if (container) {
    const progressEl = container.querySelector('span')!;

    const preloader = new Vevet.ProgressPreloader({
        container: '#v-preloader',
        loaders: {
            video: false,
            img: false,
        },
    });
    preloader.addCallback('progress', (data) => {
        progressEl.innerHTML = `${(data.progress * 100).toFixed(0)}%`;
    });
}
