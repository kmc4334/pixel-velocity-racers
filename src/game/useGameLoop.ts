// 게임 루프 훅

import { useRef, useEffect, useCallback } from 'react';

type GameLoopCallback = (deltaTime: number) => void;

/**
 * 게임 루프 커스텀 훅
 * requestAnimationFrame 기반으로 deltaTime 제공
 */
export function useGameLoop(
  callback: GameLoopCallback,
  isRunning: boolean
): void {
  const requestRef = useRef<number>();
  const previousTimeRef = useRef<number>();
  const callbackRef = useRef(callback);

  // 콜백 업데이트
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  const animate = useCallback((time: number) => {
    if (previousTimeRef.current !== undefined) {
      // deltaTime 계산 (최대 100ms로 제한하여 탭 전환 시 버그 방지)
      const deltaTime = Math.min(time - previousTimeRef.current, 100);
      callbackRef.current(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (isRunning) {
      previousTimeRef.current = undefined;
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [isRunning, animate]);
}
