import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useSignal } from '../src/useSignal';

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
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
