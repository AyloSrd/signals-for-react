import { useSignal } from '../../src';
import { useState } from 'react';

export const WrapUseSignal = () => {
  const count = useSignal(0);
  const [show, setShow] = useState(true);

  console.log('rerender');
  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => count.value += 1}>
        increment
      </button>
      <button onClick={() => console.log(count.value)}>snapshot</button>
      {show && <p>count: {count.sub()}</p>}
    </>
  );
};
