import { fireEvent, render, renderHook } from '@testing-library/react';
import { useSatellite, useSignal } from '../src';
import { createSignal } from '../src/Signal';
import { SimpleUseSignalWrapper } from './utils/components/useSignalWrapper';
import {
  OuterWithMiddlePassingSignal,
  OuterWithMiddlePassingSatellite,
  OuterWithInner,
  OuterWithMemoizedInner,
  SimpleUseCase,
} from './utils/components/useSatelliteWrappers';
import {
  outerRerenders,
  outerPeep,
  middleRerenders,
  middlePeep,
  innerRerenders,
  innerPeep,
  setVariablesToZero,
  handleInnerRerender,
  handleInnerPeep,
  handleMiddleRerender,
  handleMiddlePeep,
  handleOuterRerender,
  handleOuterPeep,
} from './utils/helpers/useSatelliteHelpers';
import * as React from 'react';

afterEach(setVariablesToZero);
beforeEach(setVariablesToZero);

describe('useSatellite, basic use cases', () => {
  describe('when the satellite updates', () => {
    test('parent should update too', () => {
      const { getByText } = render(<SimpleUseCase />);
      fireEvent.click(getByText('increment inner'));

      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();
    });
  });

  describe('when a parent creates a signal and a child isolates it with useSatellite', () => {
    test('satellite should have recived the parents value', () => {
      const { getByText } = render(<SimpleUseCase />);
      fireEvent.click(getByText('increment outer'));

      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();
    });
  });

  describe('when parent is not subscribed to itself', () => {
    test('parent should not rerender, but its value should be updated', () => {
      const { getByText } = render(
        <OuterWithInner
          onInnerRerender={handleInnerRerender}
          onInnerPeep={handleInnerPeep}
          onMiddleRerender={handleMiddleRerender}
          onMiddlePeep={handleMiddlePeep}
          onRerender={handleOuterRerender}
          onPeep={handleOuterPeep}
        />
      );
      fireEvent.click(getByText('hide outer'));

      expect(getByText('show outer')).toBeTruthy();
      expect(getByText('inner count: 0')).toBeTruthy();

      fireEvent.click(getByText('increment inner'));

      expect(innerRerenders).toBe(3);
      expect(outerRerenders).toBe(2);

      fireEvent.click(getByText('increment inner'));
      fireEvent.click(getByText('increment inner'));

      expect(innerRerenders).toBe(5);
      expect(outerRerenders).toBe(2);

      fireEvent.click(getByText('outer snapshot'));
      expect(outerPeep).toBe(3);

      fireEvent.click(getByText('show outer'));
      expect(getByText('outer count: 3')).toBeTruthy();
      expect(getByText('inner count: 3')).toBeTruthy();
    });
  });

  describe('when child is memoized and utilizing useSatellite and is not subscibed to itself', () => {
    test('parent setting its onw value and rerendering should trigger child rerendering', () => {
      const { getByText } = render(
        <OuterWithMemoizedInner
          onInnerRerender={handleInnerRerender}
          onInnerPeep={handleInnerPeep}
          onMiddleRerender={handleMiddleRerender}
          onMiddlePeep={handleMiddlePeep}
          onRerender={handleOuterRerender}
          onPeep={handleOuterPeep}
        />
      );

      fireEvent.click(getByText('hide inner'));

      expect(getByText('show inner')).toBeTruthy();
      expect(innerRerenders).toBe(2);

      fireEvent.click(getByText('increment outer'));
      fireEvent.click(getByText('increment outer'));
      fireEvent.click(getByText('increment outer'));

      expect(outerRerenders).toBe(4);
      expect(innerRerenders).toBe(2);

      fireEvent.click(getByText('inner snapshot'));
      expect(innerPeep).toBe(3);

      fireEvent.click(getByText('show inner'));
      expect(getByText('outer count: 3')).toBeTruthy();
      expect(getByText('inner count: 3')).toBeTruthy();
    });
  });
});

describe('useSatellite, advanced use cases', () => {
  describe('when a satellite of a satellite is created', () => {
    test('regardles of where the value is set, the whole tree is in sync', () => {
      const { getByText } = render(
        <OuterWithMiddlePassingSatellite
          onInnerRerender={handleInnerRerender}
          onInnerPeep={handleInnerPeep}
          onMiddleRerender={handleMiddleRerender}
          onMiddlePeep={handleMiddlePeep}
          onRerender={handleOuterRerender}
          onPeep={handleOuterPeep}
        />
      );
      fireEvent.click(getByText('increment inner'));
      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('middle count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();

      fireEvent.click(getByText('increment middle'));
      expect(getByText('inner count: 2')).toBeTruthy();
      expect(getByText('middle count: 2')).toBeTruthy();
      expect(getByText('outer count: 2')).toBeTruthy();

      fireEvent.click(getByText('increment outer'));
      expect(getByText('inner count: 3')).toBeTruthy();
      expect(getByText('middle count: 3')).toBeTruthy();
      expect(getByText('outer count: 3')).toBeTruthy();
    });
  });

  describe('when two satellites are creted from the same signal passed down the component tree', () => {
    test('the signals are in sync', () => {
      const { getByText } = render(
        <OuterWithMiddlePassingSignal
          onInnerRerender={handleInnerRerender}
          onInnerPeep={handleInnerPeep}
          onMiddleRerender={handleMiddleRerender}
          onMiddlePeep={handleMiddlePeep}
          onRerender={handleOuterRerender}
          onPeep={handleOuterPeep}
        />
      );
      fireEvent.click(getByText('increment inner'));
      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('middle count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();

      fireEvent.click(getByText('increment middle'));
      expect(getByText('inner count: 2')).toBeTruthy();
      expect(getByText('middle count: 2')).toBeTruthy();
      expect(getByText('outer count: 2')).toBeTruthy();

      fireEvent.click(getByText('increment outer'));
      expect(getByText('inner count: 3')).toBeTruthy();
      expect(getByText('middle count: 3')).toBeTruthy();
      expect(getByText('outer count: 3')).toBeTruthy();
    });
  });

  describe('when there is a signal chain and the innermost child value is changed', () => {
    test('the the parents that are not subscribed to themselves do not rerender but still be in sync', () => {
      const { getByText } = render(
        <OuterWithMiddlePassingSatellite
          onInnerRerender={handleInnerRerender}
          onInnerPeep={handleInnerPeep}
          onMiddleRerender={handleMiddleRerender}
          onMiddlePeep={handleMiddlePeep}
          onRerender={handleOuterRerender}
          onPeep={handleOuterPeep}
        />
      );
      fireEvent.click(getByText('hide outer'));
      fireEvent.click(getByText('hide middle'));

      fireEvent.click(getByText('increment inner'));
      fireEvent.click(getByText('increment inner'));
      fireEvent.click(getByText('increment inner'));

      expect(innerRerenders).toBe(6);
      expect(middleRerenders).toBe(3);
      expect(middleRerenders).toBe(3);

      fireEvent.click(getByText('outer snapshot'));
      fireEvent.click(getByText('middle snapshot'));
      expect(outerPeep).toBe(3);
      expect(middlePeep).toBe(3);

      fireEvent.click(getByText('show outer'));
      fireEvent.click(getByText('show middle'));
      expect(getByText('inner count: 3')).toBeTruthy();
      expect(getByText('middle count: 3')).toBeTruthy();
      expect(getByText('outer count: 3')).toBeTruthy();
    });
  });

  describe('when two satellites are creted from the same signal passed down the component tree', () => {
    test('the signals are in sync', () => {
      const { getByText } = render(
        <OuterWithMiddlePassingSatellite
          onInnerRerender={handleInnerRerender}
          onInnerPeep={handleInnerPeep}
          onMiddleRerender={handleMiddleRerender}
          onMiddlePeep={handleMiddlePeep}
          onRerender={handleOuterRerender}
          onPeep={handleOuterPeep}
        />
      );
      fireEvent.click(getByText('increment inner'));
      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('middle count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();

      fireEvent.click(getByText('increment middle'));
      expect(getByText('inner count: 2')).toBeTruthy();
      expect(getByText('middle count: 2')).toBeTruthy();
      expect(getByText('outer count: 2')).toBeTruthy();

      fireEvent.click(getByText('increment outer'));
      expect(getByText('inner count: 3')).toBeTruthy();
      expect(getByText('middle count: 3')).toBeTruthy();
      expect(getByText('outer count: 3')).toBeTruthy();
    });
  });
});
