import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';

import { IS_TMA } from '@/utils/constants';
import type { TelegramContextValue, TelegramUser } from '@/types';

const TelegramContext = createContext<TelegramContextValue>({
  isTMA: false,
  colorScheme: 'dark',
  isReady: false,
  user: null,
});

export function useTelegram(): TelegramContextValue {
  return useContext(TelegramContext);
}

interface TelegramProviderProps {
  children: ReactNode;
}

export function TelegramProvider({ children }: TelegramProviderProps) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('dark');
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    if (!IS_TMA) {
      // Apply system color scheme when not running inside Telegram
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.add(prefersDark ? 'dark' : 'light');
      return;
    }

    const tg = window.Telegram.WebApp;

    tg.expand();

    // Read user info
    setUser(tg.initDataUnsafe.user ?? null);

    // Read initial color scheme
    setColorScheme(tg.colorScheme === 'light' ? 'light' : 'dark');

    // Sync Telegram theme variables to our CSS custom properties
    const applyTheme = () => {
      const params = tg.themeParams;
      const root = document.documentElement;

      // Apply light/dark class for CSS variable switching
      root.classList.remove('light', 'dark');
      root.classList.add(tg.colorScheme);

      // Override individual vars if Telegram provides them
      if (params.bg_color)            root.style.setProperty('--tg-bg',             params.bg_color);
      if (params.secondary_bg_color)  root.style.setProperty('--tg-surface',        params.secondary_bg_color);
      if (params.text_color)          root.style.setProperty('--tg-text',           params.text_color);
      if (params.hint_color)          root.style.setProperty('--tg-text-secondary', params.hint_color);
      if (params.button_color)        root.style.setProperty('--tg-accent',         params.button_color);
      if (params.button_text_color)   root.style.setProperty('--tg-accent-text',    params.button_text_color);

      setColorScheme(tg.colorScheme === 'light' ? 'light' : 'dark');
    };

    applyTheme();
    tg.onEvent('themeChanged', applyTheme);

    // Signal Telegram the app is ready
    tg.ready();
    setIsReady(true);

    return () => {
      tg.offEvent('themeChanged', applyTheme);
    };
  }, []);

  return (
    <TelegramContext.Provider value={{ isTMA: IS_TMA, colorScheme, isReady, user }}>
      {children}
    </TelegramContext.Provider>
  );
}