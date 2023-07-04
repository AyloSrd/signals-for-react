import {
  useSignal,
  useSatellite,
  useSignalEffect,
  useDerived,
  type Signal,
} from '../../src';
import React from 'react';

export function WrapUseDerived() {
  const count = useSignal(0);
  const name = useSignal('a');

  const derived = useDerived(() =>  `${count.value} - ${name.value}`, [count, name])

  console.log('Render WrapUseDerived');

  return (
    <>
      <button onClick={() => count.value += 1}>
        increase
      </button>
      <input
        defaultValue="a"
        type="text"
        name="text"
        id="text"
        onChange={(e) => name.value = e.target.value}
      />
      <p>
        {derived.sub()}
      </p>
    </>
  );
}
