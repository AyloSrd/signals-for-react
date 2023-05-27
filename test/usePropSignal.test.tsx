import { Signal, usePropSignal } from '../src';
import { SimpleUseSignalWrapper } from './utils/components/useSignalWrapper';
import * as React from 'react';

interface Props {
  countSignal: Signal<number>;
  onSnapshot?: (snapshot: number) => void;
  onRerender?: () => void;
  children?: React.ReactNode;
}

export const SimpleUsePropSignalWrapper = ({
  onSnapshot,
  onRerender,
  countSignal,
  children,
}: Props) => {
  const count = usePropSignal(countSignal);
  const [show, setShow] = React.useState(true);

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment
      </button>
      {onSnapshot && (
        <button onClick={() => onSnapshot(count.snapshot)}>snapshot</button>
      )}
      {show && <p>count: {count.value}</p>}
      <br />
      {children}
    </>
  );
};

export const MemoizedSimpleUsePropSignalWrapper = React.memo(
  SimpleUsePropSignalWrapper
);
