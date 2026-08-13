/**
 * Weighted resource entry tracked by {@link ProgressPreloader}.
 */
export interface IProgressPreloaderResource {
  /** DOM element or virtual string id. */
  id: Element | string;

  /** Total weight for this resource (`data-weight` on custom elements). */
  weight: number;

  /** Loaded weight so far (`0` … `weight`; `data-loaded` on custom elements). */
  loaded: number;
}
