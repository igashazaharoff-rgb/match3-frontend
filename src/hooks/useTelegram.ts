import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram: any;
  }
}

export const useTelegram = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const tg = window.Telegram.WebApp;
    tg.ready();
    tg.expand();

    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
      setUser(tg.initDataUnsafe.user);
    }
  }, []);

  return { user };
};

