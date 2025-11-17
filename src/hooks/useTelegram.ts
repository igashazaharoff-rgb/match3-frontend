// src/hooks/useTelegram.ts
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const useTelegram = () => {
  const [user, setUser] = useState<any>(null);
  const [webApp, setWebApp] = useState<any>(null);

  useEffect(() => {
    // Проверь, что window.Telegram существует
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();

      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setUser(tg.initDataUnsafe.user);
      }

      setWebApp(tg);
    }
  }, []);

  return { user, webApp };
};
