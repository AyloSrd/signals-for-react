import { useSignal } from '../../../src';
import * as React from 'react';

interface Props {
  onPeep?: (snapshot: number) => void;
  onRerender?: () => void;
  children?: React.ReactNode;
}

export const SimpleUseSignalWrapper: React.FC<Props> = ({
  children,
  onPeep,
  onRerender,
}: Props) => {
  const count = useSignal(0);
  const [show, setShow] = React.useState(true);

  onRerender?.();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => (count.value += 1)}>
        increment
      </button>
      {onPeep && (
        <button onClick={() => onPeep(count.value)}>snapshot</button>
      )}
      {show && <p>count: {count.sub()}</p>}
      <br />
      {children}
    </>
  );
};
