import { IViewport, TViewportCallbacks } from './types';
import { ICoreProps } from '../../../core/types';
interface IProps {
    prefix: string;
    props: ICoreProps;
    isMobile: boolean;
}
export declare function createViewport({ prefix, props, isMobile }: IProps): {
    data: IViewport;
    callbacks: TViewportCallbacks;
};
export {};
//# sourceMappingURL=index.d.ts.map