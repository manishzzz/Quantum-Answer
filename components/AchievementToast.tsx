import React, { useEffect, useState } from 'react';
import { Achievement } from '../types';

interface AchievementToastProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Fade in
    setVisible(true);

    // Set timers to fade out and then close
    const fadeOutTimer = setTimeout(() => {
      setVisible(false);
    }, 4000);

    const closeTimer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  const Icon = achievement.icon;

  return (
    <div
      className={`fixed bottom-8 right-8 z-50 flex items-center gap-4 p-4 rounded-xl bg-gradient-to-br from-brand-primary to-purple-600 border border-white/20 shadow-2xl shadow-brand-primary/40 transition-all duration-500 transform ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
      }`}
    >
      <div className="flex-shrink-0 text-yellow-300">
        <Icon className="h-10 w-10" />
      </div>
      <div>
        <p className="font-bold text-white text-lg">Achievement Unlocked!</p>
        <p className="text-indigo-200">{achievement.name}</p>
      </div>
    </div>
  );
};

export default AchievementToast;