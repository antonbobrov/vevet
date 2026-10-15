export function unwrapAngleDelta(raw: number, prevRaw: number) {
  const halfTurn = 180;
  let delta = raw - prevRaw;

  if (delta > halfTurn) {
    delta -= halfTurn * 2;
  } else if (delta < -halfTurn) {
    delta += halfTurn * 2;
  }

  return delta;
}
