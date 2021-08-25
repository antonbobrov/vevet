import * as Vevet from '../../../../src/ts/index';

new Vevet.Application();

const container = document.querySelector('#ctx2d-container');

const image = new Image();
image.onload = () => {
    const ctx2d = new Vevet.Ctx2DPrerender({
        media: image,
        container: container || undefined,
        updateOnResize: true,
    });

    // get buttons that change position of the media
    const posButtons = document.querySelectorAll('.js-ctx2d-prerender-pos');
    posButtons.forEach((button) => {
        const posRule = button.getAttribute('data-pos-rule') as Vevet.NCtx2DPrerender.ChangeableProp['posRule'];
        if (posRule) {
            button.addEventListener('click', () => {
                ctx2d.changeProp({
                    posRule,
                });
            });
        }
    });

    setActivePosButton();
    ctx2d.addCallback('changeProp', () => {
        setActivePosButton();
    });

    function setActivePosButton () {
        const pos = ctx2d.prop.posRule;
        posButtons.forEach((button) => {
            const posRule = button.getAttribute('data-pos-rule') as Vevet.NCtx2DPrerender.ChangeableProp['posRule'];
            button.classList.toggle('active', posRule === pos);
        });
    }
};
image.crossOrigin = 'anonymous';
image.src = 'https://picsum.photos/150/120';
