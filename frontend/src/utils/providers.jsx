// utils/providers.js
"use client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useState, useEffect } from "react";
import { store , persistor } from "../store/store";

export function Providers({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Provider store={store}>
      {/* 
         We only wrap in PersistGate after mounting to avoid 
         server/client HTML mismatches 
      */}
      {mounted ? (
        <PersistGate loading={null} persistor={persistor}>
          {children}
        </PersistGate>
      ) : (
        /* During SSR/First render, show children so hooks don't crash */
        children 
      )}
    </Provider>
  );
}