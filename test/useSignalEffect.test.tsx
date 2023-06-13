import { renderHook } from '@testing-library/react';
import { useSatellite, useSignalEffect } from '../src';
import { createSignal } from '../src/Signal';
import * as React from 'react';

describe('useSignalEffect, basic use cases', () => {
  describe('when you pass a signal to useSignalEffect, and the signal updates', () => {
    test('it should call the callback function', () => {
      const signal = createSignal(0, () => {});
      let count = 0;
      renderHook(() => {
        useSignalEffect(() => {
          count = signal.current;
        }, [signal]);
      });

      signal.set(10);

      expect(count).toBe(10);
    });
  });
  describe('when you pass several signals to useSignalEffect, and one signal updates', () => {
    test('it should call the callback function', () => {
      const digitSignal = createSignal(0, () => {});
      const stringSignal = createSignal('a', () => {});
      let digit;
      let string;

      renderHook(() => {
        useSignalEffect(() => {
          digit = digitSignal.current;
          string = stringSignal.current;
        }, [digitSignal, stringSignal]);
      });

      digitSignal.set(10);
      expect(digit).toBe(10);
      expect(string).toBe('a');

      stringSignal.set('ab');
      expect(digit).toBe(10);
      expect(string).toBe('ab');
    });
  });
  describe('when useSignalEffect is first called', () => {
    test('it initially calls the callback function', () => {
      const signal = createSignal(1, () => {});
      let count = 0;
      renderHook(() => {
        useSignalEffect(() => {
          count = signal.current;
        }, [signal]);
      });

      expect(count).toBe(1);
    });
    test('it initially calls the callback function once, even if watching multiple signals', () => {
      const digitSignal = createSignal(1, () => {});
      const stringSignal = createSignal('b', () => {});

      let digit = 0;
      let string = 'a';
      renderHook(() => {
        useSignalEffect(() => {
          digit = digitSignal.current;
          string = stringSignal.current;
        }, [digitSignal, stringSignal]);
      });

      expect(digit).toBe(1);
      expect(string).toBe('b');
    });
  });
  describe('when useSignalEffect is watching a setellite signal', () => {
    test('it updates whenever the satellite value changes', () => {
      const signal = createSignal(1, () => {});
      let count = 0;
      renderHook(() => {
        const satellite = useSatellite(signal);
        useSignalEffect(() => {
          count = satellite.current;
        }, [satellite]);
      });

      signal.set(2);
      expect(count).toBe(2);
    });
  });
  describe('when useSignalValue is calling the function callback', () => {
    test('it passes the previous values as parameters to the callback function', () => {
      const digitSignal = createSignal(1, () => {});
      const stringSignal = createSignal('b', () => {});

      let digit = 0;
      let string = 'a';
      renderHook(() => {
        useSignalEffect((prevDigit, prevString) => {
          digit = prevDigit;
          string = prevString;
        }, [digitSignal, stringSignal]);
      });

      digitSignal.set(5)
      stringSignal.set('c')

      digitSignal.set(10)
      expect(digit).toBe(5);
      expect(string).toBe('c');
      
      stringSignal.set('d')
      expect(digit).toBe(10);
      expect(string).toBe('c');

    });
  });
});
