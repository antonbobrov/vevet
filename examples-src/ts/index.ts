import '../styles/index.scss';

import * as Vevet from '../../src/ts/index';

window.Vevet = Vevet;
declare global {
    interface Window {
        Vevet: typeof Vevet;
    }
}

window.history.scrollRestoration = 'manual';



const pageNameAttr = document.documentElement.getAttribute('data-page-name');

switch (pageNameAttr) {
    case 'app-events-page-load':
        import('../pages/app/events/page-load/sample');
        break;
    case 'components-page':
        import('../pages/components/page/sample');
        break;
    case 'components-animation-frame':
        import('../pages/components/animation-frame/sample');
        break;
    case 'components-ctx2d':
        import('../pages/components/ctx2d/sample');
        break;
    case 'components-ctx2d-prerender':
        import('../pages/components/ctx2d-prerender/sample');
        break;
    case 'components-smooth-scroll':
        import('../pages/components/scroll/smooth-scroll/sample');
        break;
    case 'components-scroll-view':
        import('../pages/components/scroll/scroll-view/sample');
        break;
    case 'components-timeline':
        import('../pages/components/timeline/sample');
        break;
    case 'components-static-timeline':
        import('../pages/components/timeline/static-timeline/sample');
        break;
    case 'components-nested-timeline':
        import('../pages/components/timeline/nested-timeline/sample');
        break;
    default:
        break;
}
