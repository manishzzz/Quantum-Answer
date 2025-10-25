
import { useState, useEffect, useCallback, useRef } from 'react';

export const useTimelapse = (totalItems: number, onIndexChange: (index: number) => void, interval = 2000) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setCurrentIndex(totalItems > 0 ? totalItems - 1 : 0);
  }, [totalItems]);

  const play = useCallback(() => {
    setIsPlaying(true);
    setCurrentIndex(0);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      onIndexChange(currentIndex);
      if (currentIndex < totalItems - 1) {
        timerRef.current = window.setTimeout(() => {
          setCurrentIndex(prev => prev + 1);
        }, interval);
      } else {
        setIsPlaying(false);
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isPlaying, currentIndex, totalItems, interval, onIndexChange]);

  return { isPlaying, play, pause, currentIndex };
};
