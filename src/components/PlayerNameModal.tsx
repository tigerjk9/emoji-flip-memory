import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface PlayerNameModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
}

const PlayerNameModal = ({ isOpen, onSubmit }: PlayerNameModalProps) => {
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    // Load saved name from localStorage
    const savedName = localStorage.getItem('memoryGamePlayerName');
    if (savedName) {
      setPlayerName(savedName);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      // Save name to localStorage
      localStorage.setItem('memoryGamePlayerName', playerName.trim());
      onSubmit(playerName.trim());
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md bg-gradient-card border-2 border-primary/20">
        <DialogHeader className="text-center">
          <DialogTitle className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            🧠 Memory Card Game
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            플레이어 이름을 입력해주세요!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="이름을 입력하세요"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="text-center text-lg border-2 border-primary/20 focus:border-primary"
            maxLength={20}
            autoFocus
          />
          <Button 
            type="submit" 
            className="w-full bg-gradient-primary hover:bg-primary-hover text-primary-foreground font-semibold py-3 rounded-xl transition-all duration-300 hover:shadow-lg"
            disabled={!playerName.trim()}
          >
            게임 시작! 🚀
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PlayerNameModal;