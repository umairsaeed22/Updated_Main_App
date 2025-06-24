import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'default';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const setThemeByName = (themeName) => {
    setTheme(themeName);
  };

  return (
    <ThemeContext.Provider value={{ theme, setThemeByName }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
