import React from "react";
import { useEffect } from "react";
import { useState } from "react";

export function useDebounce<T>(
  value: T,
  timeout: number,
  callback: (...args: any[]) => void
) {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const clearTimer = () => {
    if (timer) clearTimeout(timer);
  };

  useEffect(() => {
    clearTimer();

    if (value) {
      const newTimer = setTimeout(callback, timeout);
      setTimer(newTimer);
    }
  }, [value]);
}
