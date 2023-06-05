import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { useSignal, useSatellite, Signal } from '../src';
import { WrapUseSatellite } from './components/WrapUseSatellite';
import { WrapUseSignal } from './components/WrapUseSignal';
import { WrapUseSignalEffect } from './components/WrapUseSignalEffect';



type Page = 'useSignal' | 'useSatellite' | 'useSignalEffect';

const App = () => {
  const page = useSignal<Page>('useSignal');

  return (
    <>
      <button onClick={() => page.set('useSignal')}>useSignal</button>
      <button onClick={() => page.set('useSatellite')}>useSatellite</button>
      <button onClick={() => page.set('useSignalEffect')}>useSignalEffect</button>
      {page.get() === 'useSignal' && <WrapUseSignal />}
      {page.get() === 'useSatellite' && <WrapUseSatellite />}
      {page.get() === 'useSignalEffect' && <WrapUseSignalEffect />}
    </>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<App />);
