import React, { createContext, useContext, useState } from 'react';

interface ToastContextType {
  showToast: (msg: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-4 py-2 rounded shadow-lg text-white text-sm font-semibold transition-all ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {toast.msg}
        </div>
      )}
    </ToastContext.Provider>
  );
};

export {}; 