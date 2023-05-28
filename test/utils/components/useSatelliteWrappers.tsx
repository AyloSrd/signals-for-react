import { Signal, useSatellite, useSignal } from '../../../src';
import * as React from 'react';

interface InnerProps {
  countSignal: Signal<number>;
  onSnapshot: (snapshot: number) => void;
  onRerender: () => void;
}

interface MiddleProps extends InnerProps {
  onInnerSnapshot: (snapshot: number) => void;
  onInnerRerender: () => void;
}

interface OuterProps extends Omit<MiddleProps, 'countSignal'> {
  onMiddleSnapshot: (snapshot: number) => void;
  onMiddleRerender: () => void;
}

function Inner({ countSignal, onSnapshot, onRerender }: InnerProps) {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide inner' : 'show inner'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment inner
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>inner snapshot</button>

      {show && <p>inner count: {count.value}</p>}
      <br />
    </>
  );
}

const MemoizedInner = React.memo(Inner);

function MiddlePassingSignal({
  countSignal,
  onSnapshot,
  onRerender,
  onInnerRerender,
  onInnerSnapshot,
}: MiddleProps) {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide middle' : 'show middle'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment middle
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>
        middle snapshot
      </button>
      {show && <p>middle count: {count.value}</p>}
      <br />
      <Inner
        countSignal={count}
        onSnapshot={onInnerSnapshot}
        onRerender={onInnerRerender}
      />
    </>
  );
}

function MiddlePassingSatellite({
  countSignal,
  onSnapshot,
  onRerender,
  onInnerRerender,
  onInnerSnapshot,
}: MiddleProps) {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);

  onRerender?.();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide middle' : 'show middle'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment middle
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>
        middle snapshot
      </button>
      {show && <p>middle count: {count.value}</p>}
      <br />
      <Inner
        countSignal={count}
        onSnapshot={onInnerSnapshot}
        onRerender={onInnerRerender}
      />
    </>
  );
}

export function OuterWithMiddlePassingSignal({
  onSnapshot,
  onRerender,
  onMiddleSnapshot,
  onMiddleRerender,
  onInnerSnapshot,
  onInnerRerender,
}: OuterProps) {
  const count = useSignal(0);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide outer' : 'show outer'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment outer
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>outer snapshot</button>
      {show && <p>outer count: {count.value}</p>}

      <MiddlePassingSignal
        countSignal={count}
        onSnapshot={onMiddleSnapshot}
        onRerender={onMiddleRerender}
        onInnerRerender={onInnerRerender}
        onInnerSnapshot={onInnerSnapshot}
      />
    </>
  );
}

export function OuterWithMiddlePassingSatellite({
  onSnapshot,
  onRerender,
  onMiddleSnapshot,
  onMiddleRerender,
  onInnerSnapshot,
  onInnerRerender,
}: OuterProps) {
  const count = useSignal(0);
  const [show, setShow] = React.useState(true);

  onRerender?.();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide outer' : 'show outer'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment outer
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>outer snapshot</button>
      {show && <p>outer count: {count.value}</p>}

      <MiddlePassingSatellite
        countSignal={count}
        onSnapshot={onMiddleSnapshot}
        onRerender={onMiddleRerender}
        onInnerRerender={onInnerRerender}
        onInnerSnapshot={onInnerSnapshot}
      />
    </>
  );
}

export function OuterWithInner({
  onSnapshot,
  onRerender,
  onInnerSnapshot,
  onInnerRerender,
}: OuterProps) {
  const count = useSignal(0);
  const [show, setShow] = React.useState(true);
  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide outer' : 'show outer'}
      </button>
      <button
        onClick={() => {
          console.log('clicked');
          count.value = count.snapshot + 1;
        }}
      >
        increment outer
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>outer snapshot</button>
      {show && <p>outer count: {count.value}</p>}

      <Inner
        countSignal={count}
        onSnapshot={onInnerSnapshot}
        onRerender={onInnerRerender}
      />
    </>
  );
}

export function OuterWithMemoizedInner({
  onSnapshot,
  onRerender,
  onInnerSnapshot,
  onInnerRerender,
}: OuterProps) {
  const count = useSignal(0);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide outer' : 'show outer'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment outer
      </button>
      <button onClick={() => onSnapshot(count.snapshot)}>outer snapshot</button>
      {show && <p>outer count: {count.value}</p>}

      <MemoizedInner
        countSignal={count}
        onSnapshot={onInnerSnapshot}
        onRerender={onInnerRerender}
      />
    </>
  );
}
