import { Module } from '../Module';

/**
 * Source whose props **Responsive** reads and updates.
 *
 * - **Module** — only mutable props are tracked and written back via `updateProps()`.
 * - **Plain object** — used as initial state; the object itself is not mutated.
 */
export type TResponsiveSource = Record<string, any> | Module;

/**
 * Partial props allowed in a responsive rule for the given source.
 *
 * For **Module**, resolves to partial mutable props.
 * For a plain object, resolves to `Partial<T>`.
 */
export type TResponsivePick<T extends TResponsiveSource> =
  T['_getMutable'] extends Function
    ? Partial<ReturnType<T['_getMutable']>>
    : Partial<T>;

/**
 * Breakpoint query for a responsive rule.
 *
 * Built-in values use flags from `vevet` (`phone`, `tablet`, `mobile`, etc.)
 * or viewport orientation. Any string starting with `@media` is passed to
 * `window.matchMedia()` (without the `@media` prefix).
 */
export type TResponsiveQuery =
  | 'tablet'
  | 'phone'
  | 'mobile'
  | 'non_mobile'
  | 'landscape'
  | 'portrait'
  | (string & {});

/**
 * A single responsive override: when `at` matches, `props` are merged.
 */
export type TResponsiveRule<T extends TResponsiveSource> = {
  /**
   * Breakpoint condition. Multiple rules can match at the same time;
   * their `props` are merged in array order.
   */
  at: TResponsiveQuery;

  /**
   * Props merged when this rule is active.
   */
  props: TResponsivePick<T>;
};

/**
 * Current merged props exposed by {@link Responsive.props}.
 *
 * For **Module**, matches `source.props`. For a plain object, matches the
 * object shape.
 */
export type TResponsiveProps<T extends TResponsiveSource> =
  T['_getMutable'] extends Function ? T['props'] : T;
