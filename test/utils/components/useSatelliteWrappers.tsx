import { Signal, useSatellite, useSignal } from '../../../src';
import * as React from 'react';

interface InnerProps {
  countSignal: Signal<number>;
  onPeep: (snapshot: number) => void;
  onRerender: () => void;
}

interface MiddleProps extends InnerProps {
  onInnerPeep: (snapshot: number) => void;
  onInnerRerender: () => void;
}

interface OuterProps extends Omit<MiddleProps, 'countSignal'> {
  onMiddlePeep: (snapshot: number) => void;
  onMiddleRerender: () => void;
}

function Inner({ countSignal, onPeep, onRerender }: InnerProps) {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide inner' : 'show inner'}
      </button>
      <button onClick={() => (count.value += 1)}>
        increment inner
      </button>
      <button onClick={() => onPeep(count.value)}>inner snapshot</button>

      {show && <p>inner count: {count.sub()}</p>}
      <br />
    </>
  );
}

const MemoizedInner = React.memo(Inner);

function MiddlePassingSignal({
  countSignal,
  onPeep,
  onRerender,
  onInnerRerender,
  onInnerPeep,
}: MiddleProps) {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide middle' : 'show middle'}
      </button>
      <button onClick={() => (count.value += 1)}>
        increment middle
      </button>
      <button onClick={() => onPeep(count.value)}>
        middle snapshot
      </button>
      {show && <p>middle count: {count.sub()}</p>}
      <br />
      <Inner
        countSignal={count}
        onPeep={onInnerPeep}
        onRerender={onInnerRerender}
      />
    </>
  );
}

function MiddlePassingSatellite({
  countSignal,
  onPeep,
  onRerender,
  onInnerRerender,
  onInnerPeep,
}: MiddleProps) {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);

  onRerender();

  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide middle' : 'show middle'}
      </button>
      <button onClick={() => (count.value += 1)}>
        increment middle
      </button>
      <button onClick={() => onPeep(count.value)}>
        middle snapshot
      </button>
      {show && <p>middle count: {count.sub()}</p>}
      <br />
      <Inner
        countSignal={count}
        onPeep={onInnerPeep}
        onRerender={onInnerRerender}
      />
    </>
  );
}

export function OuterWithMiddlePassingSignal({
  onPeep,
  onRerender,
  onMiddlePeep,
  onMiddleRerender,
  onInnerPeep,
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
      <button onClick={() => (count.value += 1)}>
        increment outer
      </button>
      <button onClick={() => onPeep(count.value)}>outer snapshot</button>
      {show && <p>outer count: {count.sub()}</p>}

      <MiddlePassingSignal
        countSignal={count}
        onPeep={onMiddlePeep}
        onRerender={onMiddleRerender}
        onInnerRerender={onInnerRerender}
        onInnerPeep={onInnerPeep}
      />
    </>
  );
}

export function OuterWithMiddlePassingSatellite({
  onPeep,
  onRerender,
  onMiddlePeep,
  onMiddleRerender,
  onInnerPeep,
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
      <button onClick={() => (count.value += 1)}>
        increment outer
      </button>
      <button onClick={() => onPeep(count.value)}>outer snapshot</button>
      {show && <p>outer count: {count.sub()}</p>}

      <MiddlePassingSatellite
        countSignal={count}
        onPeep={onMiddlePeep}
        onRerender={onMiddleRerender}
        onInnerRerender={onInnerRerender}
        onInnerPeep={onInnerPeep}
      />
    </>
  );
}

export function OuterWithInner({
  onPeep,
  onRerender,
  onInnerPeep,
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
      <button onClick={() => (count.value += 1)}>
        increment outer
      </button>
      <button onClick={() => onPeep(count.value)}>outer snapshot</button>
      {show && <p>outer count: {count.sub()}</p>}

      <Inner
        countSignal={count}
        onPeep={onInnerPeep}
        onRerender={onInnerRerender}
      />
    </>
  );
}

export function OuterWithMemoizedInner({
  onPeep,
  onRerender,
  onInnerPeep,
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
      <button onClick={() => (count.value += 1)}>
        increment outer
      </button>
      <button onClick={() => onPeep(count.value)}>outer snapshot</button>
      {show && <p>outer count: {count.sub()}</p>}

      <MemoizedInner
        countSignal={count}
        onPeep={onInnerPeep}
        onRerender={onInnerRerender}
      />
    </>
  );
}

function SimpleInner({ countSignal }: { countSignal: Signal<number> }) {
  const count = useSatellite(countSignal);

  return (
    <>
      <button
        onClick={() => (count.value += 1)}
      >increment inner</button>
      <p>inner count: {count.sub()}</p>
    </>
  );
}

export function SimpleUseCase() {
  const count = useSignal(0);

  return (
    <>
      <button
        onClick={() => (count.value += 1)}
      >increment outer</button>
      <p>outer count: {count.sub()}</p>
      <SimpleInner countSignal={count} />
    </>
  );
}
