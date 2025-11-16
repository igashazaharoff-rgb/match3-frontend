ts
import { useState } from 'react';

const API_BASE = 'https://your-backend-url.com';

export const useGameAPI = () => {
  const [loading, setLoading] = useState(false);const fetchProgress = async (telegramId: string) => {
    setLoading(true);
    const res = await fetch(${API_BASE}/game/progress, {
      headers: {
        'telegram-init-data': telegramId
      }
    });
    setLoading(false);
    return res.json();
  };

  const saveProgress = async (progress: any, telegramId: string) => {
    setLoading(true);
    const res = await fetch(${API_BASE}/game/progress, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'telegram-init-data': telegramId
      },
      body: JSON.stringify(progress)
    });
    setLoading(false);
    return res.json();
  };

  return { fetchProgress, saveProgress, loading };
};
