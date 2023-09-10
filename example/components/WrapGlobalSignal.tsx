import { useSatellite, useOrbit } from '../../src';
import {
  appState,
  addLetter,
  numbers,
  addNumber,
  removeNumber,
} from '../signals/numbers';
import React from 'react';

export function WrapGlobalSignal() {
  return (
    <>
      <h2>1</h2>
      <WrapGlobalSignalChild />
      <br />
      <h2>2</h2>
      <WrapGlobalSignalChild />
      <br />
      <h2>3</h2>
      <WrapGlobalSignalChild />
      <h2>With orbit 1</h2>
      <WrapGlobalSignalChildOrbit />
      <h2>With orbit 2</h2>
      <WrapGlobalSignalChildOrbit />
    </>
  );
}

function WrapGlobalSignalChild() {
  const nums = useSatellite(numbers);

  return (
    <>
      <button onClick={() => addNumber(Math.round(Math.random() * 10))}>
        add number
      </button>
      <button onClick={() => removeNumber(Math.round(Math.random() * 10))}>
        remove number
      </button>
      <br />
      {nums.sub().map((n, i) => (
        <p key={`${n} - ${i}`}>{n}</p>
      ))}
    </>
  );
}

function WrapGlobalSignalChildOrbit() {
  const { letters } = useOrbit(appState);
  return (
    <>
      <button onClick={() => addLetter('a')}>
        add letter
      </button>
      <br />
      {letters.sub().map((l, i) => (
        <p key={`${l} - ${i}`}>{l}</p>
      ))}
    </>
  );
}
