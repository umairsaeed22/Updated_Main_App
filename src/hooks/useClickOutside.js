import { useEffect } from 'react';

const useClickOutside = (refs = [], handler) => {
  useEffect(() => {
    const handleClick = (e) => {
      const path = e.composedPath?.() || [];
      const clickedInside = refs.some(
        (ref) => ref.current && path.includes(ref.current),
      );

      if (!clickedInside) {
        handler();
      }
    };

    document.body.addEventListener('click', handleClick);
    return () => {
      document.body.removeEventListener('click', handleClick);
    };
  }, [refs, handler]);
};

export default useClickOutside;
