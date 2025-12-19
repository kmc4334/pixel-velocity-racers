import { RacingGame } from '../components/RacingGame';

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* 헤더 */}
      <header className="mb-6 text-center">
        <h1 className="font-arcade text-3xl text-neon-cyan animate-pulse-glow mb-2">
          NEON RACER
        </h1>
        <p className="font-orbitron text-sm text-muted-foreground">
          2D Arcade Racing Game
        </p>
      </header>

      {/* 게임 영역 */}
      <main>
        <RacingGame />
      </main>

      {/* 푸터 */}
      <footer className="mt-8 font-orbitron text-xs text-muted-foreground text-center">
        <p>Use Arrow Keys or WASD to control</p>
        <p className="mt-1 text-neon-magenta/50">
          Complete laps to record your best time!
        </p>
      </footer>
    </div>
  );
};

export default Index;
