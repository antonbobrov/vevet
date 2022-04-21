import * as Vevet from '../../../../src/ts/index';

const app = new Vevet.Application();

function renderInfo () {
    let output = '';
    function renderItem (name: keyof Vevet.Viewport) {
        output += `<li><b>${name}</b>: ${app.viewport[name]}</li>`;
    }

    renderItem('width');
    renderItem('height');
    renderItem('dpr');
    renderItem('lowerDesktopDPR');
    renderItem('isDesktop');
    renderItem('isTablet');
    renderItem('isPhone');
    renderItem('isLandscape');
    renderItem('isPortrait');

    document.getElementById('viewport-info')!.innerHTML = `<ul>${output}</ul>`;
}

renderInfo();
app.viewport.add('', renderInfo);
