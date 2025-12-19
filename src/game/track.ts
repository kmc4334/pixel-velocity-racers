// 트랙 데이터 및 생성

import { Track, Wall, Checkpoint } from './types';

/**
 * 기본 오벌 트랙 생성
 */
export function createOvalTrack(canvasWidth: number, canvasHeight: number): Track {
  const margin = 60;
  const trackWidth = 100;
  
  const walls: Wall[] = [];
  
  // 외벽 - 상단
  walls.push({ x: margin, y: margin, width: canvasWidth - margin * 2, height: 20 });
  // 외벽 - 하단
  walls.push({ x: margin, y: canvasHeight - margin - 20, width: canvasWidth - margin * 2, height: 20 });
  // 외벽 - 좌측
  walls.push({ x: margin, y: margin, width: 20, height: canvasHeight - margin * 2 });
  // 외벽 - 우측
  walls.push({ x: canvasWidth - margin - 20, y: margin, width: 20, height: canvasHeight - margin * 2 });
  
  // 내벽 - 중앙 섬
  const innerMargin = margin + trackWidth;
  walls.push({ x: innerMargin, y: innerMargin, width: canvasWidth - innerMargin * 2, height: 20 });
  walls.push({ x: innerMargin, y: canvasHeight - innerMargin - 20, width: canvasWidth - innerMargin * 2, height: 20 });
  walls.push({ x: innerMargin, y: innerMargin, width: 20, height: canvasHeight - innerMargin * 2 });
  walls.push({ x: canvasWidth - innerMargin - 20, y: innerMargin, width: 20, height: canvasHeight - innerMargin * 2 });

  // 체크포인트 설정 (4개 구간)
  const checkpoints: Checkpoint[] = [
    // 시작/종료 라인 (하단 중앙)
    { x: canvasWidth / 2 - 5, y: canvasHeight - margin - trackWidth, width: 10, height: trackWidth, index: 0 },
    // 우측
    { x: canvasWidth - margin - trackWidth, y: canvasHeight / 2 - 5, width: trackWidth, height: 10, index: 1 },
    // 상단
    { x: canvasWidth / 2 - 5, y: margin, width: 10, height: trackWidth, index: 2 },
    // 좌측
    { x: margin, y: canvasHeight / 2 - 5, width: trackWidth, height: 10, index: 3 },
  ];

  return {
    walls,
    checkpoints,
    startPosition: { x: canvasWidth / 2, y: canvasHeight - margin - trackWidth / 2 },
    startAngle: -Math.PI / 2 // 위쪽을 향함
  };
}

/**
 * 트랙 렌더링
 */
export function renderTrack(
  ctx: CanvasRenderingContext2D,
  track: Track,
  canvasWidth: number,
  canvasHeight: number
): void {
  // 트랙 배경 (도로)
  ctx.fillStyle = '#1a1a2e';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  // 그리드 패턴
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.05)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  
  for (let x = 0; x < canvasWidth; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvasHeight);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvasHeight; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvasWidth, y);
    ctx.stroke();
  }

  // 트랙 표면 (도로)
  const margin = 60;
  const trackWidth = 100;
  
  ctx.fillStyle = '#2d2d44';
  // 수평 도로
  ctx.fillRect(margin, margin, canvasWidth - margin * 2, trackWidth);
  ctx.fillRect(margin, canvasHeight - margin - trackWidth, canvasWidth - margin * 2, trackWidth);
  // 수직 도로
  ctx.fillRect(margin, margin, trackWidth, canvasHeight - margin * 2);
  ctx.fillRect(canvasWidth - margin - trackWidth, margin, trackWidth, canvasHeight - margin * 2);

  // 도로 중앙선
  ctx.strokeStyle = 'rgba(255, 255, 0, 0.4)';
  ctx.lineWidth = 2;
  ctx.setLineDash([20, 15]);
  
  const centerOffset = trackWidth / 2;
  // 상단 도로 중앙선
  ctx.beginPath();
  ctx.moveTo(margin + trackWidth, margin + centerOffset);
  ctx.lineTo(canvasWidth - margin - trackWidth, margin + centerOffset);
  ctx.stroke();
  
  // 하단 도로 중앙선
  ctx.beginPath();
  ctx.moveTo(margin + trackWidth, canvasHeight - margin - centerOffset);
  ctx.lineTo(canvasWidth - margin - trackWidth, canvasHeight - margin - centerOffset);
  ctx.stroke();
  
  // 좌측 도로 중앙선
  ctx.beginPath();
  ctx.moveTo(margin + centerOffset, margin + trackWidth);
  ctx.lineTo(margin + centerOffset, canvasHeight - margin - trackWidth);
  ctx.stroke();
  
  // 우측 도로 중앙선
  ctx.beginPath();
  ctx.moveTo(canvasWidth - margin - centerOffset, margin + trackWidth);
  ctx.lineTo(canvasWidth - margin - centerOffset, canvasHeight - margin - trackWidth);
  ctx.stroke();
  
  ctx.setLineDash([]);

  // 벽 렌더링 (네온 효과)
  for (const wall of track.walls) {
    // 벽 그림자 (글로우)
    ctx.shadowColor = '#00ffff';
    ctx.shadowBlur = 15;
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
    ctx.shadowBlur = 0;
  }

  // 시작/종료 라인
  const checkpoint = track.checkpoints[0];
  ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
  ctx.fillRect(checkpoint.x - 20, checkpoint.y, 50, checkpoint.height);
  
  // 체커 패턴
  ctx.fillStyle = '#ffffff';
  const checkerSize = 10;
  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < Math.floor(checkpoint.height / checkerSize); j++) {
      if ((i + j) % 2 === 0) {
        ctx.fillRect(
          checkpoint.x - 20 + i * checkerSize,
          checkpoint.y + j * checkerSize,
          checkerSize,
          checkerSize
        );
      }
    }
  }
}
