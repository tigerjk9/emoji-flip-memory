import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  time: number;
  moves: number;
  createdAt: string;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  isVisible: boolean;
  onToggle: () => void;
}

const Leaderboard = ({ entries, isVisible, onToggle }: LeaderboardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '🏅';
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Button
        onClick={onToggle}
        className="w-full mb-4 bg-gradient-secondary hover:bg-secondary/80 text-secondary-foreground font-semibold py-3 rounded-xl transition-all duration-300"
      >
        {isVisible ? '리더보드 숨기기 ⬆️' : '리더보드 보기 ⬇️'} 
      </Button>
      
      {isVisible && (
        <Card className="bg-gradient-card border-2 border-primary/20 p-6 animate-float">
          <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-primary bg-clip-text text-transparent">
            🏆 리더보드 TOP 10
          </h2>
          
          {entries.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p className="text-lg">아직 기록이 없습니다!</p>
              <p className="text-sm mt-2">첫 번째 기록을 남겨보세요 🎯</p>
            </div>
          ) : (
            <div className="space-y-3">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                    index < 3 
                      ? 'bg-gradient-primary/10 border-2 border-primary/30' 
                      : 'bg-muted/30 border border-border'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getRankEmoji(index + 1)}</span>
                    <div>
                      <p className="font-semibold text-foreground">{entry.playerName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.createdAt).toLocaleDateString('ko-KR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-bold text-game-score">{entry.score}점</p>
                      <p className="text-muted-foreground">점수</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-game-timer">{formatTime(entry.time)}</p>
                      <p className="text-muted-foreground">시간</p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-foreground">{entry.moves}회</p>
                      <p className="text-muted-foreground">시도</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default Leaderboard;