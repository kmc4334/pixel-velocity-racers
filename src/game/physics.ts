// 게임 물리 엔진 - 차량 물리, 충돌 처리

import { Car, InputState, Wall, Vector2D } from './types';

/**
 * 차량 물리 업데이트
 * deltaTime 기반으로 프레임 독립적인 물리 처리
 */
export function updateCarPhysics(
  car: Car,
  input: InputState,
  deltaTime: number
): Car {
  const dt = deltaTime / 1000; // ms를 초로 변환
  
  // 가속/감속 처리
  let acceleration = 0;
  if (input.up) {
    acceleration = car.acceleration;
  } else if (input.down) {
    acceleration = -car.acceleration * 0.6; // 후진은 60% 속도
  }

  // 속도에 따른 회전 감도 조절 (속도가 빠를수록 회전이 덜 됨)
  const speedFactor = Math.max(0.3, 1 - (car.speed / car.maxSpeed) * 0.5);
  
  // 회전 처리 (움직이고 있을 때만 회전 가능)
  if (Math.abs(car.speed) > 5) {
    if (input.left) {
      car.angle -= car.turnSpeed * speedFactor * dt;
    }
    if (input.right) {
      car.angle += car.turnSpeed * speedFactor * dt;
    }
  }

  // 속도 계산
  car.speed += acceleration * dt;
  
  // 마찰력 적용
  car.speed *= Math.pow(car.friction, dt);
  
  // 속도 제한
  car.speed = Math.max(-car.maxSpeed * 0.4, Math.min(car.maxSpeed, car.speed));
  
  // 속도가 매우 낮으면 0으로
  if (Math.abs(car.speed) < 1) {
    car.speed = 0;
  }

  // 속도 벡터 계산
  car.velocity = {
    x: Math.cos(car.angle) * car.speed,
    y: Math.sin(car.angle) * car.speed
  };

  // 위치 업데이트
  car.position.x += car.velocity.x * dt;
  car.position.y += car.velocity.y * dt;

  return car;
}

/**
 * 차량-벽 충돌 검사 및 처리
 */
export function handleWallCollision(car: Car, walls: Wall[]): Car {
  const carCorners = getCarCorners(car);
  
  for (const wall of walls) {
    for (const corner of carCorners) {
      if (pointInRect(corner, wall)) {
        // 충돌! 속도 감소 및 반발
        car.speed *= 0.3; // 충돌 시 속도 70% 감소
        
        // 벽에서 밀어내기
        const pushback = calculatePushback(car.position, wall);
        car.position.x += pushback.x * 5;
        car.position.y += pushback.y * 5;
        
        return car;
      }
    }
  }
  
  return car;
}

/**
 * 차량의 네 모서리 좌표 계산
 */
function getCarCorners(car: Car): Vector2D[] {
  const cos = Math.cos(car.angle);
  const sin = Math.sin(car.angle);
  const hw = car.width / 2;
  const hh = car.height / 2;

  return [
    // 앞 왼쪽
    {
      x: car.position.x + cos * hw - sin * (-hh),
      y: car.position.y + sin * hw + cos * (-hh)
    },
    // 앞 오른쪽
    {
      x: car.position.x + cos * hw - sin * hh,
      y: car.position.y + sin * hw + cos * hh
    },
    // 뒤 왼쪽
    {
      x: car.position.x + cos * (-hw) - sin * (-hh),
      y: car.position.y + sin * (-hw) + cos * (-hh)
    },
    // 뒤 오른쪽
    {
      x: car.position.x + cos * (-hw) - sin * hh,
      y: car.position.y + sin * (-hw) + cos * hh
    }
  ];
}

/**
 * 점이 사각형 안에 있는지 확인
 */
function pointInRect(point: Vector2D, rect: Wall): boolean {
  return (
    point.x >= rect.x &&
    point.x <= rect.x + rect.width &&
    point.y >= rect.y &&
    point.y <= rect.y + rect.height
  );
}

/**
 * 밀어내기 벡터 계산
 */
function calculatePushback(carPos: Vector2D, wall: Wall): Vector2D {
  const wallCenterX = wall.x + wall.width / 2;
  const wallCenterY = wall.y + wall.height / 2;
  
  const dx = carPos.x - wallCenterX;
  const dy = carPos.y - wallCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  if (distance === 0) return { x: 1, y: 0 };
  
  return {
    x: dx / distance,
    y: dy / distance
  };
}

/**
 * 체크포인트 통과 확인
 */
export function checkCheckpoint(
  car: Car,
  checkpoint: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    car.position.x >= checkpoint.x &&
    car.position.x <= checkpoint.x + checkpoint.width &&
    car.position.y >= checkpoint.y &&
    car.position.y <= checkpoint.y + checkpoint.height
  );
}
