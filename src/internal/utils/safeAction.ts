export function safeAction(action: () => void) {
  try {
    action();
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error(e);
  }
}
