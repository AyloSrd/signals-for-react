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

  useSignalEffect((prevCount, prevLetter) => {
    console.log(prevCount, count, prevLetter.toLowerCase(), name)
    
  }, [count, name]);

  return (
    <>
        <button onClick={() => count.set(prevCount => prevCount + 1)}>increase</button>
        <input type="text" name="text" id="text" onChange={(e) => name.set(e.target.value)} />
    </>
  )
}
