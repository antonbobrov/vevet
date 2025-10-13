import { Module } from '../Module';
export type TResponsiveSource = Record<string, any> | Module;
export type TResponsivePick<T> = T extends Module<any, any, any> ? Partial<ReturnType<T['_getMutable']>> : Partial<T>;
export type TResponsiveQuery = 'tablet' | 'phone' | 'mobile' | 'non_mobile' | 'lg' | 'md' | 'sm' | 'landscape' | 'portrait' | (string & {});
export type TResponsiveRule<T extends TResponsiveSource> = {
    at: TResponsiveQuery;
    props: TResponsivePick<T>;
};
export type TResponsiveProps<T extends TResponsiveSource> = T extends Module ? T['props'] : T;
//# sourceMappingURL=types.d.ts.map