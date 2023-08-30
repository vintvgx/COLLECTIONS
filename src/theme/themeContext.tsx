import React, { createContext, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setDarkMode as setDarkModeAction,
  fetchDarkModeFromFirebase,
} from "../redux_toolkit/slices/user_data";
import { RootState } from "../redux_toolkit";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const dispatch = useDispatch();
  const darkMode = useSelector(
    (state: RootState) => state.userData.userData.settings?.darkMode ?? false
  );

  useEffect(() => {
    dispatch(fetchDarkModeFromFirebase());
  }, [dispatch]);

  const toggleDarkMode = () => {
    dispatch(setDarkModeAction(!darkMode));
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
