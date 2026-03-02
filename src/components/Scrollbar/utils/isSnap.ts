import type { Snap } from '@/components/Snap';

export function isSnap(instance: unknown): instance is Snap {
  return (
    typeof instance === 'object' &&
    instance !== null &&
    'slides' in instance &&
    'toCoord' in instance
  );
}
