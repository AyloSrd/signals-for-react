import * as React from 'react';

export function useRerender() {
  const [, setState] = React.useState(0);

  return React.useCallback(() => {
    setState((s) => s + 1);
  }, []);
}
