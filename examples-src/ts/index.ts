import '../styles/index.scss';

import * as Vevet from '../../src/ts/index';

window.Vevet = Vevet;
declare global {
    interface Window {
        Vevet: typeof Vevet;
    }
}
