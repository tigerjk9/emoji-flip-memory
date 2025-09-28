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
        "relative w-20 h-20 cursor-pointer transition-all duration-300 perspective-1000",
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
        <div className="absolute inset-0 w-full h-full backface-hidden bg-gradient-card border-2 border-card-back rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex items-center justify-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-full animate-pulse-gentle opacity-60"></div>
        </div>
        
        {/* Card Front */}
        <div 
          className={cn(
            "absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-card-front border-2 border-primary/20 rounded-xl shadow-lg flex items-center justify-center text-4xl font-bold transition-all duration-300",
            card.isMatched && "animate-matched bg-game-success/20 border-game-success/40"
          )}
        >
          {card.emoji}
        </div>
      </div>
    </div>
  );
};

export default GameCard;