import { createSignal, useSatellite } from '../../../src';
import React from 'react';

const countOrbit = createSignal(0);

function ChildComponent({ name }: { name: string }) {
  const count = useSatellite(countOrbit);

  return (
    <>
      <button onClick={() => count.value++}>{`${name} count++`}</button>
      <p>{`${name} ${count.sub()}`}</p>
    </>
  );
}

export function CreateSignalWrapper() {
  return (
    <div>
      <ChildComponent name="child-1" />
      <ChildComponent name="child-2" />
    </div>
  );}
