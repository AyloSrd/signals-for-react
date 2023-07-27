export const rerenders = { inner: 0, outer: 0 };
export function handleRerender(where: 'inner' | 'outer') {
  rerenders[where] += 1;
}

export function setRerendersToZero() {
  rerenders.inner = 0;
  rerenders.outer = 0;
}
