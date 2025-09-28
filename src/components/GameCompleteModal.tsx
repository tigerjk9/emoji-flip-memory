import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface GameCompleteModalProps {
  isOpen: boolean;
  onPlayAgain: () => void;
  onClose: () => void;
  score: number;
  time: number;
  moves: number;
  playerName: string;
}

const GameCompleteModal = ({ 
  isOpen, 
  onPlayAgain, 
  onClose, 
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
        {/* X 버튼 */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        
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
        
        <div className="space-y-3">
          <Button 
            onClick={onPlayAgain}
            className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
          >
            다시 플레이하기 🎮
          </Button>
          
          <Button 
            onClick={onClose}
            variant="outline"
            className="w-full border-2 border-muted-foreground/20 hover:border-muted-foreground/40 text-muted-foreground hover:text-foreground font-semibold py-3 rounded-xl transition-all duration-300"
          >
            끝내기 ❌
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameCompleteModal;