import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GameCompleteModalProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  score: number;
  time: number;
  moves: number;
  playerName: string;
}

const GameCompleteModal = ({ 
  isOpen, 
  onPlayAgain, 
  score, 
  time, 
  moves, 
  playerName 
}: GameCompleteModalProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-2 border-game-success/40">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-bold text-game-success mb-2">
            🎉 축하합니다!
          </DialogTitle>
          <DialogDescription className="text-lg text-foreground">
            {playerName}님이 게임을 완료했습니다!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="bg-gradient-secondary/20 rounded-xl p-4 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-lg">🎯 최종 점수:</span>
              <span className="text-xl font-bold text-game-score">{score}점</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg">⏱️ 플레이 시간:</span>
              <span className="text-xl font-bold text-game-timer">{formatTime(time)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg">🔄 총 시도:</span>
              <span className="text-xl font-bold text-foreground">{moves}회</span>
            </div>
          </div>
          
          <p className="text-center text-sm text-muted-foreground">
            결과가 리더보드에 저장되었습니다! 🏆
          </p>
        </div>
        
        <Button 
          onClick={onPlayAgain}
          className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
        >
          다시 플레이하기 🎮
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default GameCompleteModal;