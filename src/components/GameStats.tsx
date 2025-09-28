import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';

interface GameStatsProps {
  score: number;
  moves: number;
  gameStartTime: number | null;
  isGameComplete: boolean;
  playerName: string;
}

const GameStats = ({ score, moves, gameStartTime, isGameComplete, playerName }: GameStatsProps) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (!gameStartTime || isGameComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStartTime, isGameComplete]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-6">
      <Card className="bg-gradient-card border-2 border-primary/20 p-4">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg">👤</span>
            <span className="font-semibold text-foreground">{playerName}</span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-lg">⏱️</span>
              <span className="font-mono text-lg font-bold text-game-timer">
                {formatTime(elapsedTime)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">🎯</span>
              <span className="font-mono text-lg font-bold text-game-score">
                {score}점
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg">🔄</span>
              <span className="font-mono text-lg font-bold text-foreground">
                {moves}회
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default GameStats;