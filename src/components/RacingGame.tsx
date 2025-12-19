// 메인 레이싱 게임 컴포넌트

import { useRef, useEffect, useState, useCallback } from 'react';
import { useGameLoop } from '../game/useGameLoop';
import { useInput } from '../game/useInput';
import { updateCarPhysics, handleWallCollision, checkCheckpoint } from '../game/physics';
import { createOvalTrack, renderTrack } from '../game/track';
import { renderCar, renderSpeedometer, renderLapInfo, renderCountdown, formatTime } from '../game/renderer';
import { Car, Track, GameStatus } from '../game/types';

// 캔버스 크기
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;

// 초기 차량 상태 생성
function createInitialCar(track: Track): Car {
  return {
    position: { ...track.startPosition },
    velocity: { x: 0, y: 0 },
    angle: track.startAngle,
    angularVelocity: 0,
    speed: 0,
    maxSpeed: 400,
    acceleration: 600,
    friction: 0.98,
    turnSpeed: 3,
    width: 30,
    height: 15,
  };
}

export function RacingGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>('menu');
  const [countdown, setCountdown] = useState(3);
  
  // 게임 상태
  const [track] = useState(() => createOvalTrack(CANVAS_WIDTH, CANVAS_HEIGHT));
  const [car, setCar] = useState(() => createInitialCar(track));
  const [currentLap, setCurrentLap] = useState(1);
  const [currentLapTime, setCurrentLapTime] = useState(0);
  const [bestLapTime, setBestLapTime] = useState<number | null>(null);
  const [lastCheckpoint, setLastCheckpoint] = useState(0);
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  
  // 입력 상태
  const input = useInput();
  
  // 게임 시작
  const startGame = useCallback(() => {
    setCar(createInitialCar(track));
    setCurrentLap(1);
    setCurrentLapTime(0);
    setLastCheckpoint(0);
    setLapTimes([]);
    setCountdown(3);
    setGameStatus('countdown');
    
    // 카운트다운
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count === 0) {
        clearInterval(countdownInterval);
        setTimeout(() => {
          setGameStatus('racing');
        }, 500);
      }
    }, 1000);
  }, [track]);
  
  // 게임 루프
  const gameLoop = useCallback((deltaTime: number) => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    
    // 트랙 렌더링
    renderTrack(ctx, track, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    if (gameStatus === 'racing') {
      // 물리 업데이트
      let updatedCar = updateCarPhysics({ ...car }, input, deltaTime);
      
      // 충돌 처리
      updatedCar = handleWallCollision(updatedCar, track.walls);
      
      // 체크포인트 확인
      const nextCheckpoint = (lastCheckpoint + 1) % track.checkpoints.length;
      const checkpoint = track.checkpoints[nextCheckpoint];
      
      if (checkCheckpoint(updatedCar, checkpoint)) {
        if (nextCheckpoint === 0 && lastCheckpoint === track.checkpoints.length - 1) {
          // 랩 완료!
          const lapTime = currentLapTime;
          setLapTimes(prev => [...prev, lapTime]);
          
          if (bestLapTime === null || lapTime < bestLapTime) {
            setBestLapTime(lapTime);
          }
          
          setCurrentLap(prev => prev + 1);
          setCurrentLapTime(0);
        }
        setLastCheckpoint(nextCheckpoint);
      }
      
      // 랩 타임 업데이트
      setCurrentLapTime(prev => prev + deltaTime);
      
      setCar(updatedCar);
    }
    
    // 차량 렌더링
    renderCar(ctx, car);
    
    // UI 렌더링
    renderSpeedometer(ctx, car.speed, car.maxSpeed, 20, CANVAS_HEIGHT - 60);
    renderLapInfo(ctx, currentLap, currentLapTime, bestLapTime, 20, 30);
    
    // 카운트다운 렌더링
    if (gameStatus === 'countdown') {
      renderCountdown(ctx, countdown, CANVAS_WIDTH, CANVAS_HEIGHT);
    }
  }, [car, track, input, gameStatus, countdown, currentLap, currentLapTime, bestLapTime, lastCheckpoint]);
  
  // 게임 루프 실행
  useGameLoop(gameLoop, gameStatus !== 'menu');
  
  // 초기 렌더링
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && gameStatus === 'menu') {
      renderTrack(ctx, track, CANVAS_WIDTH, CANVAS_HEIGHT);
      renderCar(ctx, car);
    }
  }, [track, car, gameStatus]);
  
  return (
    <div className="flex flex-col items-center gap-6">
      {/* 게임 캔버스 */}
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          className="rounded-lg neon-box"
        />
        
        {/* 스캔라인 오버레이 */}
        <div className="absolute inset-0 scanlines pointer-events-none rounded-lg" />
        
        {/* 메뉴 오버레이 */}
        {gameStatus === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 rounded-lg">
            <h1 className="font-arcade text-2xl text-neon-cyan mb-4 animate-pulse-glow">
              NEON RACER
            </h1>
            <p className="font-arcade text-xs text-neon-magenta mb-8">
              TOP DOWN ARCADE RACING
            </p>
            <button
              onClick={startGame}
              className="arcade-button animate-flicker"
            >
              START RACE
            </button>
            
            <div className="mt-8 font-arcade text-[10px] text-muted-foreground text-center">
              <p className="mb-2">CONTROLS</p>
              <p>↑/W - ACCELERATE</p>
              <p>↓/S - BRAKE/REVERSE</p>
              <p>←→/A D - STEER</p>
            </div>
          </div>
        )}
      </div>
      
      {/* 랩 타임 기록 */}
      {lapTimes.length > 0 && (
        <div className="neon-box p-4 w-full max-w-xs">
          <h3 className="font-arcade text-xs text-neon-yellow mb-3">LAP TIMES</h3>
          <div className="space-y-1">
            {lapTimes.map((time, index) => (
              <div
                key={index}
                className={`flex justify-between font-arcade text-[10px] ${
                  time === bestLapTime ? 'text-neon-magenta' : 'text-foreground'
                }`}
              >
                <span>LAP {index + 1}</span>
                <span>{formatTime(time)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
