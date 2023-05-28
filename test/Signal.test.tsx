import {
  createSignal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
} from '../src/Signal';

describe('Signal, local', () => {
  test('returns the value when accessed through signal.value and signal.peep', () => {
    const signal = createSignal(0, () => {});
    expect(signal.value).toBe(0);
    expect(signal.peep).toBe(0);
  });

  test('updates the value when the setter is called', () => {
    const signal = createSignal(0, () => {});
    signal.set(prevValue => prevValue + 1);
    expect(signal.value).toBe(1);
    expect(signal.peep).toBe(1);
  });

  test('setter can take a non-function value', () => {
    const signal = createSignal(0, () => {});
    signal.set(1);
    expect(signal.value).toBe(1);
    expect(signal.peep).toBe(1);
  });

  test('setter passes previous value if its argument is a function', () => {
    const signal = createSignal(5, () => {});
    signal.set(prevValue => prevValue * 2);
    expect(signal.value).toBe(10);
    expect(signal.peep).toBe(10);
  });

  test('calls the onGetValue callback when value was accessed before', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignal(0, handleGetValue);
    // here we access the value getter
    expect(signal.value).toBe(0);
    // here we set a new value
    signal.set(prevValue => prevValue + 1);

    expect(signal.peep).toBe(1);
    expect(hasCalledCb).toBe(true);
  });

  test('does not trigger the onGetValue callback when Signal.clearValueRequests is called in between get and set', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignal(0, handleGetValue);

    expect(signal.value).toBe(0);

    signal.unsubscribeFromSelf();
    signal.set(prevValue => prevValue + 1);

    expect(signal.peep).toBe(1);
    expect(hasCalledCb).toBe(false);
  });
});

describe('Signal, remote subscriptions', () => {
  test('update the value in subscriber', () => {
    const signal = createSignal(0, () => {});
    const subscriber = createSignal(signal.peep, () => {});

    signal.subscribe(subscriber[handleSubscribeSymbol]);

    expect(subscriber.peep).toBe(0);

    // update the parent signal
    signal.set(prevValue => prevValue + 1);

    expect(subscriber.peep).toBe(1);
  });

  test('subscriber notifies parent of value change, and parent updates', () => {
    const signal = createSignal(0, () => {});
    const subscriber = createSignal(
      signal.peep,
      () => {},
      signal[onValueUpdateFromSubscriberSymbol]
    );

    signal.subscribe(subscriber[handleSubscribeSymbol]);

    // update the subscriber
    subscriber.set(prevValue => prevValue + 1);

    expect(signal.peep).toBe(1);
  });
});
