import React from 'react';

type ProviderProps = {
  children: React.ReactNode;
};

type ContextValue = {
  dark: boolean;
  setDark: (dark: boolean) => void;
};

const ThemeContext = React.createContext<ContextValue>({} as ContextValue);

const ThemeProvider = ({ children }: ProviderProps) => {
  const prefersDark = localStorage.getItem('theme') === 'dark';
  const [dark, setDark] = React.useState(prefersDark);
  const value = { dark, setDark };

  if (dark) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export { ThemeProvider, useTheme };