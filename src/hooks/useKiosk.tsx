import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";

const STORAGE_KEY = "pvw_kiosk";

interface KioskContextType {
  isKiosk: boolean;
  clearKiosk: () => void;
}

const KioskContext = createContext<KioskContextType>({
  isKiosk: false,
  clearKiosk: () => {},
});

export const KioskProvider = ({ children }: { children: ReactNode }) => {
  const { pathname } = useLocation();
  const [isKiosk, setIsKiosk] = useState(() => sessionStorage.getItem(STORAGE_KEY) === "true");

  // Activate kiosk mode when /kiosk is visited
  useEffect(() => {
    if (pathname === "/kiosk") {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setIsKiosk(true);
    }
  }, [pathname]);

  const clearKiosk = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setIsKiosk(false);
  };

  return (
    <KioskContext.Provider value={{ isKiosk, clearKiosk }}>
      {children}
    </KioskContext.Provider>
  );
};

export const useKiosk = () => useContext(KioskContext);
