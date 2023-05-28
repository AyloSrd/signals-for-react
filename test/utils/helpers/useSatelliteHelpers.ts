export let outerRerenders = 0;
export let outerPeep = 0;
export let middleRerenders = 0;
export let middlePeep = 0;
export let innerRerenders = 0;
export let innerPeep = 0;

export function setVariablesToZero() {
  outerRerenders = 0;
  outerPeep = 0;
  middleRerenders = 0;
  middlePeep = 0;
  innerRerenders = 0;
  innerPeep = 0;
}

export function handleOuterRerender() {
  outerRerenders++;
}

export function handleOuterPeep(snap: number) {
  outerPeep = snap;
}

export function handleMiddleRerender() {
  middleRerenders++;
}

export function handleMiddlePeep(snap: number) {
  middlePeep = snap;
}

export function handleInnerRerender() {
  innerRerenders++;
}

export function handleInnerPeep(snap: number) {
  innerPeep = snap;
}