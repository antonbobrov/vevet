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

// get app
if (pageNameAttr?.includes('app/')) {
    const componentName = pageNameAttr.split('app/')[1];

    switch (componentName) {
        case 'index':
            import('../pages/app/sample');
            break;

        case 'page-load':
            import('../pages/app/page-load/sample');
            break;

        case 'viewport':
            import('../pages/app/viewport/sample');
            break;

        default:
            break;
    }
}

// get components
if (pageNameAttr?.includes('components/')) {
    const componentName = pageNameAttr.split('components/')[1];

    switch (componentName) {
        case 'animation-frame':
            import('../pages/components/animation-frame/sample');
            break;

        case 'ctx2d':
            import('../pages/components/ctx2d/sample');
            break;
        case 'ctx2d-prerender':
            import('../pages/components/ctx2d-prerender/sample');
            break;

        case 'custom-cursor':
            import('../pages/components/custom-cursor/sample');
            break;

        case 'dragger-direction':
            import('../pages/components/dragger-direction/sample');
            break;
        case 'dragger-move':
            import('../pages/components/dragger-move/sample');
            break;

        case 'preloader':
            import('../pages/components/preloader/sample');
            break;
        case 'preloader-progress':
            import('../pages/components/progress-preloader/sample');
            break;

        case 'page':
            import('../pages/components/page/sample');
            break;

        case 'scroll-view':
            import('../pages/components/scroll-view/sample');
            break;
        case 'scrollbar':
            import('../pages/components/scrollbar/sample');
            break;
        case 'smooth-scroll':
            import('../pages/components/smooth-scroll/sample');
            break;

        case 'split-text':
            import('../pages/components/split-text/sample');
            break;

        case 'timeline':
            import('../pages/components/timeline/sample');
            break;
        case 'timeline-static':
            import('../pages/components/timeline-static/sample');
            break;
        case 'timeline-nested':
            import('../pages/components/timeline-nested/sample');
            break;

        default:
            break;
    }
}

// get handlers
if (pageNameAttr?.includes('handlers/')) {
    const componentName = pageNameAttr.split('handlers/')[1];

    switch (componentName) {
        case 'wheel':
            import('../pages/handlers/wheel/sample');
            break;

        default:
            break;
    }
}
