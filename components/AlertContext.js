
//components/AlertContext.js
import React, { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertsEnabled, setAlertsEnabled] = useState(false);

  return (
    <AlertContext.Provider value={{ alertsEnabled, setAlertsEnabled }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => useContext(AlertContext);
