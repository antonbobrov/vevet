import * as Vevet from '../../../../src/ts/index';

const app = new Vevet.Application();

// set onLoad callback
app.pageLoad.onLoaded(() => {
    setTimeout(() => {
        const indicatorEl = document.querySelector('#page-load-indicator');
        if (indicatorEl) {
            const badge = document.createElement('span');
            badge.classList.add('badge');
            badge.classList.add('bg-success');
            badge.innerHTML = 'loaded';
            indicatorEl.appendChild(badge);
        }
    }, 1500);
});
