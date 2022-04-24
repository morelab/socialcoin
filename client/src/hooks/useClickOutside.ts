import React from 'react';

export default function useClickOutside(elRef: React.RefObject<HTMLDivElement>, callback: () => void) {
  const callbackRef = React.useRef<() => void>(callback);
  // callbackRef.current = callback;

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!elRef?.current?.contains(event.target as Node)) {
        if (callbackRef.current) callbackRef.current(); // TODO check if adding 'event' inside current() is necessary
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [callbackRef, elRef]);
}