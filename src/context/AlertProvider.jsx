import { useState, useCallback, useEffect } from "react";
import { AlertContext } from "./AlertContext";
import Alert from "../components/Alert";

function AlertProvider({ children }) {
  const [alert, setAlert] = useState(undefined);
  const [fading, setFading] = useState(false);

  const removeAlert = useCallback(() => {
    setAlert(undefined);
    setFading(false);
  }, []);

  const showAlert = useCallback((message, type = "info") => {
    setAlert({ message, type });
    setFading(false);
  }, []);

  useEffect(() => {
    if (alert) {
      const fadeTimer = setTimeout(() => {
        setFading(true);
      }, 5000);

      const removeTimer = setTimeout(() => {
        removeAlert();
      }, 5500);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [alert, removeAlert]);

  return (
    <AlertContext.Provider value={{ alert, showAlert, removeAlert }}>
      {children}
      <Alert
        message={alert?.message}
        type={alert?.type}
        onDismiss={removeAlert}
        fading={fading}
      />
    </AlertContext.Provider>
  );
}

export default AlertProvider;
