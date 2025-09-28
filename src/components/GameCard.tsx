import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface GameCardProps {
  card: Card;
  onClick: (id: number) => void;
  disabled: boolean;
}

const GameCard = ({ card, onClick, disabled }: GameCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (card.isFlipped) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 600);
      return () => clearTimeout(timer);
    }
  }, [card.isFlipped]);

  return (
    <div
      className={cn(
        "relative w-24 h-24 cursor-pointer transition-all duration-300 perspective-1000 hover:scale-105",
        disabled && "cursor-not-allowed"
      )}
      onClick={() => !disabled && !card.isMatched && !card.isFlipped && onClick(card.id)}
    >
      <div
        className={cn(
          "absolute inset-0 w-full h-full transition-transform duration-600 transform-style-preserve-3d",
          (card.isFlipped || card.isMatched) && "rotate-y-180",
          isAnimating && "animate-flip"
        )}
      >
        {/* Card Back */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-card border-2 border-primary/30 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
          <div className="w-10 h-10 bg-gradient-primary rounded-full animate-pulse-gentle opacity-70 shadow-inner"></div>
        </div>
        
        {/* Card Front */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-white to-primary/5 border-2 border-primary/30 rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 backdrop-blur-sm",
            card.isMatched && "animate-matched bg-gradient-to-br from-game-success/20 to-game-success/10 border-game-success/50 shadow-lg shadow-game-success/30 animate-glow"
          )}
        >
          <div className="text-4xl font-bold">
            {card.emoji}
          </div>
        </div>
      </div>
    </div>
  );
};
export default GameCard;