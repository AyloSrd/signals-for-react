import { Signal, useSignal, useOrbit } from '../../../src';
import React, { useState, type FC } from 'react';

interface SimpleUseOrbitProps {
  onRerender: (where: 'inner' | 'outer') => void;
}

export const SimpleUseOrbitWrapper: FC<SimpleUseOrbitProps> = ({ onRerender }) => {
  const count = useSignal(0);
  const name = useSignal('');
  const [show, setShow] = useState(true);

  onRerender('outer');

  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide outer' : 'show outer'}
      </button>
      <button onClick={() => count.value += 1}>
        outer count++
      </button>
      <button onClick={() => name.value += 'a'}>
        outer name++
      </button>
      {show ? (
        <div>
          <p>outer count: {count.sub()}</p>
          <p>outer name: {name.sub()}</p>
        </div>
      ) : null}
      <Inner count={count} name={name} onRerender={onRerender} />
    </div>
  );
};

type InnerProps = {
  count: Signal<number>;
  name: Signal<string>;
} & SimpleUseOrbitProps;

const Inner: FC<InnerProps> =  props => {
  const { count, name, onRerender } = useOrbit(props);
  const [show, setShow] = useState(true);

  onRerender('inner');
  return (
    <div>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide inner' : 'show inner'}
      </button>
      <button onClick={() => count.value += 1}>
        inner count++
      </button>
      <button onClick={() => name.value += 'a'}>
        inner name++
      </button>
      {show ? (
        <div>
          <p>inner count: {count.sub()}</p>
          <p>inner name: {name.sub()}</p>
        </div>
      ) : null}
    </div>
  );
};
