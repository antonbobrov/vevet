export interface IProps {
  getEnabled: () => boolean;
  getAxis: () => 'x' | 'y';
  onStart: () => void;
  onMove: (evt: WheelEvent, delta: number) => void;
  onEnd: () => void;
}
