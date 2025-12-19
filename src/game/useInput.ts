// 키보드 입력 처리 훅

import { useState, useEffect, useCallback } from 'react';
import { InputState } from './types';

/**
 * 키보드 입력 상태 관리 훅
 * 방향키 및 WASD 지원
 */
export function useInput(): InputState {
  const [input, setInput] = useState<InputState>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // 기본 스크롤 동작 방지
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)) {
      e.preventDefault();
    }

    setInput(prev => {
      const newInput = { ...prev };
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          newInput.up = true;
          break;
        case 'arrowdown':
        case 's':
          newInput.down = true;
          break;
        case 'arrowleft':
        case 'a':
          newInput.left = true;
          break;
        case 'arrowright':
        case 'd':
          newInput.right = true;
          break;
      }
      
      return newInput;
    });
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    setInput(prev => {
      const newInput = { ...prev };
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          newInput.up = false;
          break;
        case 'arrowdown':
        case 's':
          newInput.down = false;
          break;
        case 'arrowleft':
        case 'a':
          newInput.left = false;
          break;
        case 'arrowright':
        case 'd':
          newInput.right = false;
          break;
      }
      
      return newInput;
    });
  }, []);

  // 윈도우 포커스를 잃었을 때 모든 키 리셋
  const handleBlur = useCallback(() => {
    setInput({
      up: false,
      down: false,
      left: false,
      right: false,
    });
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  return input;
}
