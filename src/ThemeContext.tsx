import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { palettes, Colors, ThemeMode } from './theme';

const THEME_KEY = '@nana_theme';

type ThemeContextValue = {
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  colors: Colors;
};

const ThemeContext = createContext<ThemeContextValue>({
  mode: 'original',
  setMode: () => {},
  colors: palettes.original,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>('original');

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then(saved => {
      if (saved && saved in palettes) setModeState(saved as ThemeMode);
    });
  }, []);

  async function setMode(m: ThemeMode) {
    setModeState(m);
    await AsyncStorage.setItem(THEME_KEY, m);
  }

  return (
    <ThemeContext.Provider value={{ mode, setMode, colors: palettes[mode] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
