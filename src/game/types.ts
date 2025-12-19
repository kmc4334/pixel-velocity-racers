// 게임에서 사용하는 타입 정의

export interface Vector2D {
  x: number;
  y: number;
}

export interface Car {
  position: Vector2D;      // 현재 위치
  velocity: Vector2D;      // 속도 벡터
  angle: number;           // 차량 회전 각도 (라디안)
  angularVelocity: number; // 회전 속도
  speed: number;           // 현재 속도 스칼라 값
  maxSpeed: number;        // 최대 속도
  acceleration: number;    // 가속도
  friction: number;        // 마찰 계수
  turnSpeed: number;       // 회전 속도
  width: number;           // 차량 너비
  height: number;          // 차량 높이
}

export interface Track {
  walls: Wall[];           // 벽 목록
  checkpoints: Checkpoint[]; // 체크포인트
  startPosition: Vector2D; // 시작 위치
  startAngle: number;      // 시작 각도
}

export interface Wall {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Checkpoint {
  x: number;
  y: number;
  width: number;
  height: number;
  index: number;
}

export interface GameState {
  car: Car;
  track: Track;
  currentLap: number;
  lapTimes: number[];
  bestLapTime: number | null;
  currentLapTime: number;
  lastCheckpoint: number;
  isRacing: boolean;
  gameStarted: boolean;
  countdown: number;
}

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

export type GameStatus = 'menu' | 'countdown' | 'racing' | 'finished';
