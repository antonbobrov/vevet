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
    default:
        break;
}
