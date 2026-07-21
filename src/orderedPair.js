export function orderedPair(a, b) {
  return [a, b].toSorted((left, right) => left - right);
}
