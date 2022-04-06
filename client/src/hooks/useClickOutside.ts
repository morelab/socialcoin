import React from 'react';

export default function useClickOutside(elRef: React.MutableRefObject<any>, callback: () => void) {
  const callbackRef = React.useRef<() => void>();
  callbackRef.current = callback;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // TODO check if '&& callback' is necessary
      // if (!elRef?.current?.contains(event.target) && callback) {
      if (!elRef?.current?.contains(event.target)) {
        if (callbackRef.current) callbackRef.current(); // TODO check if adding 'event' inside current() is necessary
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [callbackRef, elRef]);
}