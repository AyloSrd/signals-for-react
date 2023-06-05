import {
  useSignal,
  useSatellite,
  useSignalEffect,
  type Signal,
} from '../../src';
import { useState } from 'react';

export function WrapUseSignalEffect() {
  const count = useSignal(0);
  const name = useSignal('a');

  console.log('Render WrapUseSignalEffect');

  useSignalEffect(
    (prevCount, prevLetter) => {
      console.log('Parent', prevCount, count, prevLetter.toLowerCase(), name);
    },
    [count, name]
  );

  return (
    <>
      <button onClick={() => count.set((prevCount) => prevCount + 1)}>
        increase
      </button>
      <input
        type="text"
        name="text"
        id="text"
        onChange={(e) => name.set(e.target.get())}
      />
      <ChildWithDirectSignal count={count} name={name} />
      <ChildWithSatellite countSatellite={count} nameSatellite={name} />
    </>
  );
}

function ChildWithSatellite({
  countSatellite,
  nameSatellite,
}: {
  countSatellite: Signal<number>;
  nameSatellite: Signal<string>;
}) {
  const count = useSatellite(countSatellite);
  const name = useSatellite(nameSatellite);

  console.log('Render ChildWithSatellite');

  useSignalEffect(
    (prevCount, prevLetter) => {
      console.log('ChildWithSatellite', prevCount, count, prevLetter.toLowerCase(), name);
    },
    [count, name]
  );

  return (
    <>
      <button onClick={() => count.set((prevCount) => prevCount + 1)}>
        increase
      </button>
    </>
  );
}

function ChildWithDirectSignal({
  count,
  name,
}: {
  count: Signal<number>;
  name: Signal<string>;
}) {

  console.log('Render ChildWithDirectSignal');

  useSignalEffect(
    (prevCount, prevLetter) => {
      console.log('ChildWithDirectSignal', prevCount, count, prevLetter.toLowerCase(), name);
    },
    [count, name]
  );

  return (
    <>
      <button onClick={() => count.set((prevCount) => prevCount + 1)}>
        increase
      </button>
    </>
  );
}
