import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GameCard, { Card } from '@/components/GameCard';
import PlayerNameModal from '@/components/PlayerNameModal';
import GameStats from '@/components/GameStats';
import Leaderboard, { LeaderboardEntry } from '@/components/Leaderboard';
import GameCompleteModal from '@/components/GameCompleteModal';
import ParticleBackground from '@/components/ParticleBackground';

// Game emojis for the memory game - cute animals
const GAME_EMOJIS = ['🐶', '🐱', '🐰', '🐸', '🦊', '🐷', '🐯', '🐻'];

const Index = () => {
  const { toast } = useToast();
  
  // Game state
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [isGameComplete, setIsGameComplete] = useState(false);
  
  // Modal states
  const [showNameModal, setShowNameModal] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState('');
  
  // Leaderboard data (will be connected to Supabase later)
  const [leaderboardEntries, setLeaderboardEntries] = useState<LeaderboardEntry[]>([]);

  // Initialize game cards
  const initializeGame = useCallback(() => {
    const gameCards: Card[] = [];
    let idCounter = 0;
    
    // Create pairs of cards
    GAME_EMOJIS.forEach((emoji) => {
      gameCards.push(
        { id: idCounter++, emoji, isFlipped: false, isMatched: false },
        { id: idCounter++, emoji, isFlipped: false, isMatched: false }
      );
    });
    
    // Shuffle cards
    const shuffledCards = gameCards.sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setScore(0);
    setGameStartTime(Date.now());
    setIsGameComplete(false);
    setShowCompleteModal(false);
  }, []);

  // Handle card click
  const handleCardClick = useCallback((cardId: number) => {
    if (flippedCards.length >= 2) return;
    
    setCards(prev => prev.map(card => 
      card.id === cardId ? { ...card, isFlipped: true } : card
    ));
    
    setFlippedCards(prev => [...prev, cardId]);
  }, [flippedCards]);

  // Process flipped cards
  useEffect(() => {
    if (flippedCards.length === 2) {
      setMoves(prev => prev + 1);
      
      const [firstCardId, secondCardId] = flippedCards;
      const firstCard = cards.find(card => card.id === firstCardId);
      const secondCard = cards.find(card => card.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found!
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstCardId || card.id === secondCardId 
              ? { ...card, isMatched: true }
              : card
          ));
          setMatchedPairs(prev => prev + 1);
          setScore(prev => prev + 100);
          setFlippedCards([]);
          
          toast({
            title: "매칭 성공! ✨",
            description: "+100점 • Perfect Match!",
          });
        }, 1000);
      } else {
        // No match - flip back
        setTimeout(() => {
          setCards(prev => prev.map(card => 
            card.id === firstCardId || card.id === secondCardId 
              ? { ...card, isFlipped: false }
              : card
          ));
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards, toast]);

  // Check for game completion
  useEffect(() => {
    if (matchedPairs === GAME_EMOJIS.length && gameStartTime && !isGameComplete && playerName.trim()) {
      const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
      const timeBonus = Math.max(0, 300 - gameTime); // Bonus for completing faster
      const finalScore = score + timeBonus;
      
      setScore(finalScore);
      setIsGameComplete(true);
      setShowCompleteModal(true);
      
      // Save to leaderboard (localStorage for now, Supabase integration pending)
      const newEntry: LeaderboardEntry = {
        id: Date.now().toString(),
        playerName: playerName.trim(),
        score: finalScore,
        time: gameTime,
        moves,
        createdAt: new Date().toISOString(),
      };
      
      // Load existing entries and add new entry
      const savedEntries = JSON.parse(localStorage.getItem('memoryGameLeaderboard') || '[]');
      const updatedEntries = [...savedEntries, newEntry]
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      // Save updated entries
      localStorage.setItem('memoryGameLeaderboard', JSON.stringify(updatedEntries));
      setLeaderboardEntries(updatedEntries);
      
      console.log('리더보드 저장됨:', newEntry);
      console.log('전체 리더보드:', updatedEntries);
      
      toast({
        title: "게임 완료! 🏆",
        description: `최종 점수: ${finalScore}점 • Congratulations!`,
      });
    }
  }, [matchedPairs, gameStartTime, score, moves, playerName, toast, isGameComplete]);

  // Load leaderboard on component mount
  useEffect(() => {
    const savedEntries = JSON.parse(localStorage.getItem('memoryGameLeaderboard') || '[]');
    console.log('컴포넌트 마운트 시 로드된 리더보드:', savedEntries);
    setLeaderboardEntries(savedEntries);
    
    // 개발자 도구에서 사용할 수 있는 디버깅 함수들을 전역으로 등록
    (window as any).debugLeaderboard = {
      get: () => {
        const entries = JSON.parse(localStorage.getItem('memoryGameLeaderboard') || '[]');
        console.log('현재 localStorage의 리더보드:', entries);
        return entries;
      },
      clear: () => {
        localStorage.removeItem('memoryGameLeaderboard');
        setLeaderboardEntries([]);
        console.log('리더보드가 초기화되었습니다.');
      },
      add: (name: string, score: number) => {
        const newEntry = {
          id: Date.now().toString(),
          playerName: name,
          score: score,
          time: 60,
          moves: 10,
          createdAt: new Date().toISOString(),
        };
        const savedEntries = JSON.parse(localStorage.getItem('memoryGameLeaderboard') || '[]');
        const updatedEntries = [...savedEntries, newEntry]
          .sort((a, b) => b.score - a.score)
          .slice(0, 10);
        localStorage.setItem('memoryGameLeaderboard', JSON.stringify(updatedEntries));
        setLeaderboardEntries(updatedEntries);
        console.log('테스트 엔트리가 추가되었습니다:', newEntry);
      }
    };
  }, []);

  // Handle player name submission
  const handlePlayerNameSubmit = (name: string) => {
    setPlayerName(name.trim());
    setShowNameModal(false);
    initializeGame();
    
    // Reload leaderboard when starting a new game
    const savedEntries = JSON.parse(localStorage.getItem('memoryGameLeaderboard') || '[]');
    setLeaderboardEntries(savedEntries);
  };

  // Handle play again
  const handlePlayAgain = () => {
    setShowCompleteModal(false);
    initializeGame();
  };

  return (
    <div className="min-h-screen bg-gradient-game-bg py-8 px-4 relative overflow-hidden">
      <ParticleBackground />
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6 animate-float tracking-tight">
            🧠 Animal Memory Game
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            카드를 뒤집어서 같은 동물 쌍을 찾아보세요
          </p>
        </div>

        {/* Game Stats */}
        {!showNameModal && (
          <GameStats 
            score={score}
            moves={moves}
            gameStartTime={gameStartTime}
            isGameComplete={isGameComplete}
            playerName={playerName}
          />
        )}

        {/* Game Board */}
        {!showNameModal && (
          <div className="flex justify-center mb-8">
            <div className="grid grid-cols-4 gap-6 p-8 bg-gradient-card rounded-3xl border border-primary/30 shadow-2xl backdrop-blur-sm">
              {cards.map((card) => (
                <GameCard
                  key={card.id}
                  card={card}
                  onClick={handleCardClick}
                  disabled={flippedCards.length >= 2 || isGameComplete}
                />
              ))}
            </div>
          </div>
        )}

        {/* Restart Button */}
        {!showNameModal && !isGameComplete && (
          <div className="flex justify-center mb-8">
            <Button
              onClick={() => setShowNameModal(true)}
              className="bg-gradient-secondary hover:scale-105 text-secondary-foreground font-semibold px-10 py-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl border border-primary/20"
            >
              ↻ 게임 재시작
            </Button>
          </div>
        )}

        {/* Leaderboard */}
        {!showNameModal && (
          <Leaderboard 
            entries={leaderboardEntries}
            isVisible={showLeaderboard}
            onToggle={() => setShowLeaderboard(!showLeaderboard)}
          />
        )}

        {/* Supabase Integration Notice */}
        {!showNameModal && (
          <div className="mt-8 text-center">
            <div className="bg-gradient-secondary/10 border border-primary/20 rounded-2xl p-6 max-w-2xl mx-auto backdrop-blur-sm">
              <p className="text-sm text-muted-foreground leading-relaxed">
                ◆ 리더보드를 온라인으로 공유하려면 Supabase 연결이 필요합니다. 
                화면 우상단의 초록색 Supabase 버튼을 클릭해주세요!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <PlayerNameModal 
        isOpen={showNameModal}
        onSubmit={handlePlayerNameSubmit}
        onClose={() => setShowNameModal(false)}
      />
      
      <GameCompleteModal
        isOpen={showCompleteModal}
        onPlayAgain={handlePlayAgain}
        score={score}
        time={gameStartTime ? Math.floor((Date.now() - gameStartTime) / 1000) : 0}
        moves={moves}
        playerName={playerName}
      />
    </div>
  );
};

export default Index;
