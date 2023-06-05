import { useSignal, useSatellite, type Signal } from '../../src';
import { useState } from 'react';

export const WrapUseSatellite = () => {
  const count = useSignal(0);
  const [show, setShow] = useState(true);

  console.log('rerender');
  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => count.set((prevCount) => prevCount + 1)}>
        increment
      </button>
      <button onClick={() => console.log(count.current)}>snapshot</button>
      {show && <p>count: {count.get()}</p>}
      Inner
      <Inner countSignal={count} />
    </>
  );
};

function Inner({ countSignal }: { countSignal: Signal<number> }) {
  const count = useSatellite(countSignal);
  const [show, setShow] = useState(true);
  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => count.set((prevCount) => prevCount + 1)}>
        increment
      </button>
      <button onClick={() => console.log(count.current)}>snapshot</button>
      {show && <p>count: {count.get()}</p>}
    </>
  );
}
