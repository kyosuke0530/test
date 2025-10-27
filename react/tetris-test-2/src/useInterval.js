import { useEffect, useRef } from 'react';

function useInterval(callback, delay) {
  const savedCallback = useRef();

  // 最新のコールバックを保持
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // インターバルの実行
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      const id = setInterval(tick, delay);
      return () => clearInterval(id); // クリーンアップ
    }
  }, [delay]);
}

export default useInterval;
