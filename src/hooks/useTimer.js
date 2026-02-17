// src/hooks/useTimer.js
import { useState, useEffect } from 'react';

export const useTimer = (initialSeconds = 147) => {
  const [timer, setTimer] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval;
    if (isActive && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsActive(false); // 시간이 다 되면 정지
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timer]);

  // 🚀 타이머 시작, 리셋, 시간 설정 함수들을 반환
  const startTimer = () => setIsActive(true);
  const resetTimer = () => {
    setIsActive(false);
    setTimer(initialSeconds);
  };

  return { timer, isActive, startTimer, resetTimer };
};