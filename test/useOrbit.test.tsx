import { fireEvent, render } from '@testing-library/react';
import { SimpleUseOrbitWrapper } from './utils/components/useOrbitWrapper';
import {
  rerenders,
  handleRerender,
  setRerendersToZero,
} from './utils/helpers/useOrbiteHelpers';
import * as React from 'react';

afterEach(setRerendersToZero);
beforeEach(setRerendersToZero);

describe('useOrbit, basic use cases', () => {
  describe('when signal updates', () => {
    test('orbit should update too', () => {
      const { getByText } = render(
        <SimpleUseOrbitWrapper onRerender={handleRerender} />
      );

      fireEvent.click(getByText('outer count++'));
      fireEvent.click(getByText('outer name++'));

      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();
      expect(getByText('inner name: a')).toBeTruthy();
      expect(getByText('outer name: a')).toBeTruthy();
    });
  });
  describe('when orbit updates', () => {
    test('signal should update too', () => {
      const { getByText } = render(
        <SimpleUseOrbitWrapper onRerender={handleRerender} />
      );

      fireEvent.click(getByText('inner count++'));
      fireEvent.click(getByText('inner name++'));

      expect(getByText('inner count: 1')).toBeTruthy();
      expect(getByText('outer count: 1')).toBeTruthy();
      expect(getByText('inner name: a')).toBeTruthy();
      expect(getByText('outer name: a')).toBeTruthy();
    });
  });
  describe('when orbit updates, and signal is subscribed', () => {
    test('signal should rerender too, regardless of wheter the orbit is subscribed or not', () => {
      const { getByText } = render(
        <SimpleUseOrbitWrapper onRerender={handleRerender} />
      );

      fireEvent.click(getByText('inner count++'));
      fireEvent.click(getByText('inner name++'));

      expect(rerenders).toEqual({ inner: 3, outer: 3 });
    });
  });
  describe('when orbit updates, and signal is not subscribed', () => {
    test('signal should not rerender too, regardless of wheter the orbit is subscribed or not', () => {
      const { getByText } = render(
        <SimpleUseOrbitWrapper onRerender={handleRerender} />
      );

      fireEvent.click(getByText('hide outer'));

      fireEvent.click(getByText('inner count++'));
      fireEvent.click(getByText('inner name++'));
      fireEvent.click(getByText('inner count++'));
      fireEvent.click(getByText('inner name++'));

      expect(rerenders).toEqual({ inner: 6, outer: 2 });
    });
  });
});
