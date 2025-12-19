// 게임 렌더링 - 차량, UI 등

import { Car } from './types';

/**
 * 차량 렌더링
 */
export function renderCar(ctx: CanvasRenderingContext2D, car: Car): void {
  ctx.save();
  
  // 차량 위치로 이동 및 회전
  ctx.translate(car.position.x, car.position.y);
  ctx.rotate(car.angle);
  
  // 속도에 따른 글로우 효과
  const glowIntensity = Math.min(20, (car.speed / car.maxSpeed) * 20);
  ctx.shadowColor = '#ff00ff';
  ctx.shadowBlur = glowIntensity;
  
  // 차량 본체
  const hw = car.width / 2;
  const hh = car.height / 2;
  
  // 차량 몸체 (그라데이션)
  const gradient = ctx.createLinearGradient(-hw, 0, hw, 0);
  gradient.addColorStop(0, '#ff00ff');
  gradient.addColorStop(0.5, '#ff44ff');
  gradient.addColorStop(1, '#ff00ff');
  
  ctx.fillStyle = gradient;
  ctx.beginPath();
  // 차량 모양 (뾰족한 앞부분)
  ctx.moveTo(hw, 0); // 앞 끝
  ctx.lineTo(hw * 0.3, -hh);
  ctx.lineTo(-hw, -hh * 0.8);
  ctx.lineTo(-hw, hh * 0.8);
  ctx.lineTo(hw * 0.3, hh);
  ctx.closePath();
  ctx.fill();
  
  // 차량 테두리
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // 앞 헤드라이트
  ctx.shadowColor = '#ffff00';
  ctx.shadowBlur = 10;
  ctx.fillStyle = '#ffff00';
  ctx.beginPath();
  ctx.arc(hw * 0.6, -hh * 0.4, 3, 0, Math.PI * 2);
  ctx.arc(hw * 0.6, hh * 0.4, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // 후미등 (속도에 따라 밝기 변화)
  const tailLightBrightness = car.speed < 0 ? 1 : 0.3; // 후진 시 밝게
  ctx.shadowColor = '#ff0000';
  ctx.shadowBlur = 8 * tailLightBrightness;
  ctx.fillStyle = `rgba(255, 0, 0, ${tailLightBrightness})`;
  ctx.fillRect(-hw, -hh * 0.6, 4, hh * 0.3);
  ctx.fillRect(-hw, hh * 0.3, 4, hh * 0.3);
  
  ctx.restore();
  
  // 속도가 빠를 때 모션 블러 효과
  if (car.speed > car.maxSpeed * 0.7) {
    renderSpeedLines(ctx, car);
  }
}

/**
 * 속도 라인 효과
 */
function renderSpeedLines(ctx: CanvasRenderingContext2D, car: Car): void {
  const lineCount = 5;
  const intensity = (car.speed / car.maxSpeed);
  
  ctx.save();
  ctx.translate(car.position.x, car.position.y);
  ctx.rotate(car.angle);
  
  for (let i = 0; i < lineCount; i++) {
    const offset = (Math.random() - 0.5) * car.height;
    const length = 20 + Math.random() * 30 * intensity;
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.3 * intensity})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-car.width / 2 - 5, offset);
    ctx.lineTo(-car.width / 2 - 5 - length, offset);
    ctx.stroke();
  }
  
  ctx.restore();
}

/**
 * 스피도미터 렌더링
 */
export function renderSpeedometer(
  ctx: CanvasRenderingContext2D,
  speed: number,
  maxSpeed: number,
  x: number,
  y: number
): void {
  const width = 150;
  const height = 20;
  const speedRatio = Math.abs(speed) / maxSpeed;
  
  // 배경
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(x, y, width, height);
  
  // 테두리
  ctx.strokeStyle = '#00ffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, width, height);
  
  // 속도 바 (그라데이션)
  const gradient = ctx.createLinearGradient(x, y, x + width, y);
  gradient.addColorStop(0, '#00ff00');
  gradient.addColorStop(0.5, '#ffff00');
  gradient.addColorStop(0.8, '#ff8800');
  gradient.addColorStop(1, '#ff0000');
  
  ctx.fillStyle = gradient;
  ctx.fillRect(x + 2, y + 2, (width - 4) * speedRatio, height - 4);
  
  // 속도 텍스트
  ctx.fillStyle = '#ffffff';
  ctx.font = '12px "Press Start 2P"';
  ctx.textAlign = 'right';
  ctx.fillText(`${Math.floor(Math.abs(speed))} KM/H`, x + width - 5, y + height + 20);
}

/**
 * 랩 타임 표시
 */
export function renderLapInfo(
  ctx: CanvasRenderingContext2D,
  currentLap: number,
  currentTime: number,
  bestTime: number | null,
  x: number,
  y: number
): void {
  ctx.fillStyle = '#00ffff';
  ctx.font = '14px "Press Start 2P"';
  ctx.textAlign = 'left';
  ctx.shadowColor = '#00ffff';
  ctx.shadowBlur = 10;
  
  ctx.fillText(`LAP: ${currentLap}`, x, y);
  ctx.fillText(`TIME: ${formatTime(currentTime)}`, x, y + 25);
  
  if (bestTime !== null) {
    ctx.fillStyle = '#ff00ff';
    ctx.shadowColor = '#ff00ff';
    ctx.fillText(`BEST: ${formatTime(bestTime)}`, x, y + 50);
  }
  
  ctx.shadowBlur = 0;
}

/**
 * 시간 포맷팅 (mm:ss.ms)
 */
export function formatTime(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  const milliseconds = Math.floor((ms % 1000) / 10);
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`;
}

/**
 * 카운트다운 렌더링
 */
export function renderCountdown(
  ctx: CanvasRenderingContext2D,
  count: number,
  canvasWidth: number,
  canvasHeight: number
): void {
  ctx.save();
  
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  
  ctx.fillStyle = count === 0 ? '#00ff00' : '#ffff00';
  ctx.font = '80px "Press Start 2P"';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = ctx.fillStyle;
  ctx.shadowBlur = 30;
  
  const text = count === 0 ? 'GO!' : count.toString();
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
  
  ctx.restore();
}
