import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const BookCallContext = createContext(null);

export function BookCallProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openBookCall = useCallback(() => setOpen(true), []);
  const closeBookCall = useCallback(() => setOpen(false), []);

  const value = useMemo(
    () => ({ open, openBookCall, closeBookCall }),
    [open, openBookCall, closeBookCall],
  );

  return <BookCallContext.Provider value={value}>{children}</BookCallContext.Provider>;
}

export function useBookCall() {
  const ctx = useContext(BookCallContext);
  if (!ctx) {
    throw new Error('useBookCall must be used within BookCallProvider');
  }
  return ctx;
}
