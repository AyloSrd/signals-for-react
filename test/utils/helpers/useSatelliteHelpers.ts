export let outerRerenders = 0;
export let outerSnapshot = 0;
export let middleRerenders = 0;
export let middleSnapshot = 0;
export let innerRerenders = 0;
export let innerSnapshot = 0;

export function setVariablesToZero() {
  outerRerenders = 0;
  outerSnapshot = 0;
  middleRerenders = 0;
  middleSnapshot = 0;
  innerRerenders = 0;
  innerSnapshot = 0;
}

export function handleOuterRerender() {
  outerRerenders++;
}

export function handleOuterSnapshot(snap: number) {
  outerSnapshot = snap;
}

export function handleMiddleRerender() {
  middleRerenders++;
}

export function handleMiddleSnapshot(snap: number) {
  middleSnapshot = snap;
}

export function handleInnerRerender() {
  innerRerenders++;
}

export function handleInnerSnapshot(snap: number) {
  innerSnapshot = snap;
}