import {
  createSignalInternal,
  onValueUpdateFromSubscriberSymbol,
  handleSubscribeSymbol,
  subscribeSymbol,
  unsubscribeFromSelfSymbol,
} from '../src/Signal';

describe('Signal, local', () => {
  test('returns the value when accessed through signal.sub() and signal.value', () => {
    const signal = createSignalInternal(0, () => {});
    expect(signal.sub()).toBe(0);
    expect(signal.value).toBe(0);
  });

  test('updates the value when the setter is called', () => {
    const signal = createSignalInternal(0, () => {});
    signal.value += 1;
    expect(signal.sub()).toBe(1);
    expect(signal.value).toBe(1);
  });

  test('setter can take a non-function value', () => {
    const signal = createSignalInternal(0, () => {});
    signal.value = 1;
    expect(signal.sub()).toBe(1);
    expect(signal.value).toBe(1);
  });

  test('setter passes previous value if its argument is a function', () => {
    const signal = createSignalInternal(5, () => {});
    signal.value *= 2;
    expect(signal.sub()).toBe(10);
    expect(signal.value).toBe(10);
  });

  test('calls the onGetValue callback when value was accessed before', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignalInternal(0, handleGetValue);
    // here we access the value getter
    expect(signal.sub()).toBe(0);
    // here we set a new value
    signal.value += 1;

    expect(signal.value).toBe(1);
    expect(hasCalledCb).toBe(true);
  });

  test('does not trigger the onGetValue callback when Signal.clearValueRequests is called in between get and set', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignalInternal(0, handleGetValue);

    expect(signal.sub()).toBe(0);

    signal[unsubscribeFromSelfSymbol]();
    signal.value += 1;

    expect(signal.value).toBe(1);
    expect(hasCalledCb).toBe(false);
  });

  test('does not trigger the onGetValue callback when set to the same value', () => {
    let hasCalledCb = false;

    function handleGetValue() {
      hasCalledCb = true;
    }
    const signal = createSignalInternal(0, handleGetValue);

    expect(signal.sub()).toBe(0);
 
    signal.value = 0;

    expect(signal.value).toBe(0);
    expect(hasCalledCb).toBe(false);
  });
});

describe('Signal, remote subscriptions', () => {
  test('update the value in subscriber', () => {
    const signal = createSignalInternal(0, () => {});
    const subscriber = createSignalInternal(signal.value, () => {});

    signal[subscribeSymbol](subscriber[handleSubscribeSymbol]);

    expect(subscriber.value).toBe(0);

    // update the parent signal
    signal.value += 1;

    expect(subscriber.value).toBe(1);
  });

  test('subscriber notifies parent of value change, and parent updates', () => {
    const signal = createSignalInternal(0, () => {});
    const subscriber = createSignalInternal(
      signal.value,
      () => {},
      signal[onValueUpdateFromSubscriberSymbol]
    );

    signal[subscribeSymbol](subscriber[handleSubscribeSymbol]);

    // update the subscriber
    subscriber.value += 1;

    expect(signal.value).toBe(1);
  });
});
