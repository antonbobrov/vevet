import { ICore } from '../core/global';
import { ICoreProps } from '../core/types';
declare global {
    interface Window {
        vevet5: Readonly<ICore>;
        VEVET_PROPS: Partial<ICoreProps>;
    }
}
/**
 * @group Utils
 */
export declare function initVevet(): Readonly<ICore>;
//# sourceMappingURL=initVevet.d.ts.map