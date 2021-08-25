import '../styles/index.scss';

import * as Vevet from '../../src/ts/index';

window.Vevet = Vevet;
declare global {
    interface Window {
        Vevet: typeof Vevet;
    }
}



const pageNameAttr = document.documentElement.getAttribute('data-page-name');

switch (pageNameAttr) {
    case 'app-events-page-load':
        import('../pages/app/events/page-load/sample');
        break;
    case 'components-animation-frame':
        import('../pages/components/animation-frame/sample');
        break;
    case 'components-ctx2d':
        import('../pages/components/ctx2d/sample');
        break;
    default:
        break;
}
