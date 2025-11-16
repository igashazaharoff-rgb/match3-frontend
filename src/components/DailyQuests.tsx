tsx
import React, { useState, useEffect } from 'react';

type Quest = {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: number;
  completed: boolean;
};

const initialQuests: Quest[] = [
  { id: 'score', title: 'Набери 500 очков', description: 'Набери 500 очков за день', progress: 0, target: 500, reward: 100, completed: false },
  { id: 'levels', title: 'Пройди 3 уровня', description: 'Пройди 3 уровня', progress: 0, target: 3, reward: 150, completed: false },
  { id: 'moves', title: 'Сделай 50 ходов', description: 'Сделай 50 ходов', progress: 0, target: 50, reward: 200, completed: false },
];

const DailyQuests = () => {
  const [quests, setQuests] = useState<Quest[]>(() => {
    const saved = localStorage.getItem('daily-quests');
    if (saved) {
      const parsed = JSON.parse(saved);
      const lastUpdate = new Date(parsed.lastUpdate);
      const today = new Date();
      if (lastUpdate.toDateString() === today.toDateString()) {
        return parsed.quests;
      }
    }
    return initialQuests;
  });

  useEffect(() => {
    const today = new Date().toDateString();
    localStorage.setItem('daily-quests', JSON.stringify({ quests, lastUpdate: today }));
  }, [quests]);

  return (
    <div className="daily-quests">
      <h3>Ежедневные задания</h3>
      {quests.map(quest => (
        <div key={quest.id} className={quest ${quest.completed ? 'completed' : ''}}>
          <div className="quest-title">{quest.title}</div>
          <div className="quest-desc">{quest.description}</div>
          <div className="quest-progress">
            {quest.progress} / {quest.target}
          </div>
          <div className="quest-reward">Награда: {quest.reward} монет</div>
        </div>
      ))}
    </div>
  );
};

export default DailyQuests;
