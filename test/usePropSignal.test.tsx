import { fireEvent, render } from '@testing-library/react';
import { SimpleUseSignalWrapper } from './utils/components/useSignalWrapper';
import {
  OuterWithMiddlePassingSignal,
  OuterWithMiddlePassingSatellite,
  OuterWithInner,
  OuterWithMemoizedInner,
} from './utils/components/useSatelliteWrappers';
import * as React from 'react';

let outerRerenders = 0;
let outerSnapshot = 0;
let middleRerenders = 0;
let middleSnapshot = 0;
let innerRerenders = 0;
let innerSnapshot = 0;

function setVariablesToZero() {
  outerRerenders = 0;
  outerSnapshot = 0;
  middleRerenders = 0;
  middleSnapshot = 0;
  innerRerenders = 0;
  innerSnapshot = 0;
}

function handleOuterRerender() {
  outerRerenders++;
}

function handleOuterSnapshot(snap: number) {
  outerSnapshot = snap;
}

function handleMiddleRerender() {
  middleRerenders++;
}

function handleMiddleSnapshot(snap: number) {
  middleSnapshot = snap;
}

function handleInnerRerender() {
  innerRerenders++;
}

function handleInnerSuoteSnapshot(snap: number) {
  innerSnapshot = snap;
}

function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

describe('when a parent creates a signal and a child isolates it with usePulledSIgnal', () => {
  it('satellite should have recived the parents value', () => {
    const { getByText } = render(
      <OuterWithInner
        onRerender={handleOuterRerender}
        onSnapshot={handleOuterSnapshot}
        onInnerRerender={handleInnerRerender}
        onInnerSnapshot={handleInnerSuoteSnapshot}
        onMiddleRerender={handleMiddleRerender}
        onMiddleSnapshot={handleMiddleSnapshot}
      />
    );
    expect(getByText('inner count: 0')).toBeTruthy();
    expect(getByText('outer count: 0')).toBeTruthy();

    setVariablesToZero();
  });
  5;
});
describe('when the satellite updates', () => {
  it('should have updated the parent too', () => {
    const { getByText } = render(
      <OuterWithInner
        onRerender={handleOuterRerender}
        onSnapshot={handleOuterSnapshot}
        onInnerRerender={handleInnerRerender}
        onInnerSnapshot={handleInnerSuoteSnapshot}
        onMiddleRerender={handleMiddleRerender}
        onMiddleSnapshot={handleMiddleSnapshot}
      />
    );
    fireEvent.click(getByText('increment inner'));
    fireEvent.click(getByText('increment inner'));
    fireEvent.click(getByText('inner snapshot'));

    expect(innerSnapshot).toBe(2);
    expect(getByText('outer count: 2')).toBeTruthy();
    setVariablesToZero();
  });
});

describe('when the parent updates', async () => {
  it('satellite should have updated the value', async() => {
    const { getByText } = render(
      <OuterWithInner
        onRerender={handleOuterRerender}
        onSnapshot={handleOuterSnapshot}
        onInnerRerender={handleInnerRerender}
        onInnerSnapshot={handleInnerSuoteSnapshot}
        onMiddleRerender={handleMiddleRerender}
        onMiddleSnapshot={handleMiddleSnapshot}
      />
    );
    fireEvent.click(getByText('increment outer'));
    await waitFor(1000);
    fireEvent.click(getByText('inner snapshot'));

    expect(innerSnapshot).toBe(1);
    expect(getByText('outer count: 1')).toBeTruthy();
    setVariablesToZero();
  });
});
/*
  it('the .value getter should return the signal value when accessed', () => {
    const { getByText } = render(<SimpleUseSignalWrapper />);
    expect(getByText('count: 0')).toBeTruthy();
  });

  it('it should update the value and cause a rerender when value getter is accessed and setter is used', () => {
    const { getByText } = render(<SimpleUseSignalWrapper />);
    expect(getByText('count: 0')).toBeTruthy();

    fireEvent.click(getByText(/increment/));
    expect(getByText('count: 1')).toBeTruthy();

    fireEvent.click(getByText(/increment/));
    expect(getByText('count: 2')).toBeTruthy();
  });

  it('useSignal should not trigger the rerender when value getter is not accessed and setter is used, but still update internal value', () => {
    let snapshot = 0;
    let renders = 0;

    function handleRerender() {
      renders++;
    }

    function handleSnapshot(snap: number) {
      snapshot = snap;
    }

    const { getByText } = render(
      <SimpleUseSignalWrapper
        onRerender={handleRerender}
        onSnapshot={handleSnapshot}
      />
    );
    expect(getByText('count: 0')).toBeTruthy();

    fireEvent.click(getByText(/increment/));
    expect(getByText('count: 1')).toBeTruthy();
    expect(renders).toBe(2);

    fireEvent.click(getByText(/hide/)); // this will cause one more render
    expect(renders).toBe(3);

    fireEvent.click(getByText(/increment/));
    expect(renders).toBe(3);

    fireEvent.click(getByText(/increment/));
    expect(renders).toBe(3);

    fireEvent.click(getByText(/snapshot/));
    expect(renders).toBe(3);
    expect(snapshot).toBe(3);

    fireEvent.click(getByText(/show/));
    expect(getByText('count: 3')).toBeTruthy();
  });
});
*/
