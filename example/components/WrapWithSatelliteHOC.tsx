import { useSignal, satellite, type Signal } from '../../src';
import { useState } from 'react';

const Inner = satellite(
  ({ count, name }: { count: Signal<number>; name: Signal<string> }) => {
    const [show, setShow] = useState(true);
    console.log('render inner');
    return (
      <>
        <p>satellite</p>
        <button onClick={() => setShow((s) => !s)}>
          {show ? 'hide' : 'show'}
        </button>
        <button onClick={() => (count.value += 1)}>increment</button>
        <input
          type="text"
          name="name"
          id="name satellite"
          onChange={(e) => (name.value = e.target.value)}
        />
        <button onClick={() => console.log(count.value)}>snapshot</button>
        {show && (
          <p>
            {' '}
            name: {name.sub()} count: {count.sub()}
          </p>
        )}
      </>
    );
  }
);

export const WrapSatelliteHOC = () => {
  const count = useSignal(0);
  const name = useSignal('');
  const [show, setShow] = useState(true);

  console.log('rerender outer');
  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => (count.value += 1)}>increment</button>
      <input
        type="text"
        name="name"
        id="name outer"
        onChange={(e) => (name.value = e.target.value)}
      />
      <button onClick={() => console.log(count.value)}>snapshot</button>
      {show && (
        <p>
          name: {name.sub()} count: {count.sub()}
        </p>
      )}
      Inner
      <Inner count={count} name={name} />
    </>
  );
};
