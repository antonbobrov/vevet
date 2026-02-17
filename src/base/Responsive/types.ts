import { Module } from '../Module';

export type TResponsiveSource = Record<string, any> | Module;

export type TResponsivePick<T extends TResponsiveSource> =
  T['_getMutable'] extends Function
    ? Partial<ReturnType<T['_getMutable']>>
    : Partial<T>;

export type TResponsiveQuery =
  | 'tablet'
  | 'phone'
  | 'mobile'
  | 'non_mobile'
  | 'landscape'
  | 'portrait'
  | (string & {});

export type TResponsiveRule<T extends TResponsiveSource> = {
  at: TResponsiveQuery;
  props: TResponsivePick<T>;
};

export type TResponsiveProps<T extends TResponsiveSource> =
  T['_getMutable'] extends Function ? T['props'] : T;
