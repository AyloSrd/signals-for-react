import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useSignal, useSatellite, Signal } from '../src';

const Inner = ({ countSignal }: { countSignal: Signal<number> }) => {
  const count = useSatellite(countSignal);
  const [show, setShow] = React.useState(true);
  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment
      </button>
      <button onClick={() => console.log(count.snapshot)}>snapshot</button>
      {show && <p>count: {count.value}</p>}
    </>
  );
};

const App = () => {
  const count = useSignal(0);
  const [show, setShow] = React.useState(true);

  console.log('rerender');
  return (
    <>
      <button onClick={() => setShow((s) => !s)}>
        {show ? 'hide' : 'show'}
      </button>
      <button onClick={() => (count.value = count.snapshot + 1)}>
        increment
      </button>
      <button onClick={() => console.log(count.snapshot)}>snapshot</button>
      {show && <p>count: {count.value}</p>}
      Inner
      <Inner countSignal={count} />
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
