import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useSignal, useSatellite, Signal } from '../src';
import { WrapUseSatellite } from './components/WrapUseSatellite';
import { WrapUseSignal } from './components/WrapUseSignal';
import { WrapUseSignalEffect } from './components/WrapUseSignalEffect';
import { WrapUseDerived } from './components/WrapUseDerived';
import { WrapGlobalSignal } from './components/WrapGlobalSignal';

type Page =
  | 'useSignal'
  | 'useSatellite'
  | 'useSignalEffect'
  | 'useDerived'
  | 'createSignal';

const App = () => {
  const page = useSignal<Page>('useSignal');

  return (
    <>
      <button onClick={() => (page.value = 'useSignal')}>useSignal</button>
      <button onClick={() => (page.value = 'useSatellite')}>
        useSatellite
      </button>
      <button onClick={() => (page.value = 'useSignalEffect')}>
        useSignalEffect
      </button>
      <button onClick={() => (page.value = 'useDerived')}>useDerived</button>
      <button onClick={() => (page.value = 'createSignal')}>
        createSignal
      </button>
      <br />
      <h1>{page.sub()}</h1>
      {page.sub() === 'useSignal' && <WrapUseSignal />}
      {page.sub() === 'useSatellite' && <WrapUseSatellite />}
      {page.sub() === 'useSignalEffect' && <WrapUseSignalEffect />}
      {page.sub() === 'useDerived' && <WrapUseDerived />}
      {page.sub() === 'createSignal' && <WrapGlobalSignal />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
