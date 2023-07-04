import {
  useSignal,
  useDerived,
} from '../../../src';
import React from 'react';

export function WrapUseDerivedDotValue() {
  const count1 = useSignal(0);
  const count2 = useSignal(0);

  const derived = useDerived(() =>  `${count1.value} - ${count2.value}`, [count1, count2])

  return (
    <>
      <button onClick={() => count1.value++}>
        count1++
      </button>
      <button onClick={() => count2.value++}>
        count2++
      </button>
      <p>
        {
         derived.value
        }
      </p>
    </>
  );
}

export function WrapUseDerivedDotSub() {
  const count1 = useSignal(0);
  const count2 = useSignal(0);

  const derived = useDerived(() =>  `${count1.value} - ${count2.value}`, [count1, count2])

  return (
    <>
      <button onClick={() => count1.value++}>
        count1++
      </button>
      <button onClick={() => count2.value++}>
        count2++
      </button>
      <p>
        {
          derived.sub()
        }
      </p>
    </>
  );
}
