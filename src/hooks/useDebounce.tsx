import React, { useEffect, useState } from "react";

const useDebounce = (
  value: any,
  timeout: number,
  callback: (...args: any[]) => void
) => {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  useEffect(() => {
    const clearTimer = () => {
      if (timer) {
        clearTimeout(timer);
      }
    };

    clearTimer();

    if (value && callback) {
      const newTimer = setTimeout(callback, timeout);
      setTimer(newTimer);
    }
  }, [value, timeout, callback, timer]);
  return <div></div>;
};

export default useDebounce;
