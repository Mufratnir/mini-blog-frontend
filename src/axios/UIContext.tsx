// src/axios/UIContext.tsx
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Alert } from 'flowbite-react';
import Spinner from '../views/spinner/Spinner'; 

type AlertType = { type: 'success' | 'error'; message: string };
type FormErrorsType = { [key: string]: string[] };

type UIContextType = {
  loader: boolean;
  setLoader: (value: boolean) => void;
  alert: AlertType | null;
  setAlert: (value: AlertType | null) => void;
  formErrors: FormErrorsType;
  setFormErrors: (value: FormErrorsType) => void;
};

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider = ({ children }: { children: ReactNode }) => {
  const [loader, setLoader] = useState(false);
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrorsType>({});

  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => setAlert(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  return (
    <UIContext.Provider value={{ loader, setLoader, alert, setAlert, formErrors, setFormErrors }}>
      {children}

      {loader && (
        <div className="fixed inset-0 flex items-center justify-center bg-white/80 z-50">
          <Spinner />
        </div>
      )}

      {alert && (
        <div className="fixed top-5 right-5 z-50 cursor-pointer" onClick={() => setAlert(null)}>
          <Alert color={alert.type === 'error' ? 'failure' : 'success'} onDismiss={() => setAlert(null)}>
            {alert.message}
          </Alert>
        </div>
      )}
    </UIContext.Provider>
  );
};

export const useUI = (): UIContextType => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within a UIProvider');
  return context;
};