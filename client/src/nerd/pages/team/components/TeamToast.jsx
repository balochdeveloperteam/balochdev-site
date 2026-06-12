import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext(/** @type {{ showToast: (msg: string, type?: string) => void } | null} */ (null));

export function TeamToastProvider({ children }) {
  const [toast, setToast] = useState(/** @type {{ message: string, type: 'success' | 'error' } | null} */ (null));

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    window.setTimeout(() => setToast(null), 4200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast ? (
        <div
          className={`ndx-team-toast ndx-team-toast--${toast.type}`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}
    </ToastContext.Provider>
  );
}

export function useTeamToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useTeamToast must be used within TeamToastProvider');
  return ctx;
}
