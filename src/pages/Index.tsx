import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import GameCard, { Card } from '@/components/GameCard';
import PlayerNameModal from '@/components/PlayerNameModal';
import GameStats from '@/components/GameStats';
import Leaderboard from '@/components/Leaderboard';
import GameCompleteModal from '@/components/GameCompleteModal';
import ParticleBackground from '@/components/ParticleBackground';
import { 
  addLeaderboardEntry, 
  getTopLeaderboardEntries, 
  subscribeToLeaderboard, 
  migrateLocalStorageToSupabase,
  type LeaderboardEntry 
} from '@/services/leaderboardService';

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
    const handleGameCompletion = async () => {
      if (matchedPairs === GAME_EMOJIS.length && gameStartTime && !isGameComplete && playerName.trim()) {
        const gameTime = Math.floor((Date.now() - gameStartTime) / 1000);
        const timeBonus = Math.max(0, 300 - gameTime); // Bonus for completing faster
        const finalScore = score + timeBonus;
        
        setScore(finalScore);
        setIsGameComplete(true);
        setShowCompleteModal(true);
        
        // Save to Supabase leaderboard
        const supabaseEntry = await addLeaderboardEntry({
          player_name: playerName.trim(),
          score: finalScore,
          time_seconds: gameTime,
          moves
        });
        
        if (supabaseEntry) {
          console.log('Supabase 리더보드에 저장됨:', supabaseEntry);
          // 실시간 구독으로 자동 업데이트되므로 수동 업데이트 불필요
        } else {
          console.error('리더보드 저장 실패');
        }
        
        toast({
          title: "게임 완료! 🏆",
          description: `최종 점수: ${finalScore}점 • Congratulations!`,
        });
      }
    };

    handleGameCompletion();
  }, [matchedPairs, gameStartTime, score, moves, playerName, toast, isGameComplete]);

  // Load leaderboard and setup real-time subscription
  useEffect(() => {
    const initializeLeaderboard = async () => {
      // 기존 localStorage 데이터를 Supabase로 마이그레이션
      await migrateLocalStorageToSupabase();
      
      // 초기 리더보드 데이터 로드
      const entries = await getTopLeaderboardEntries();
      setLeaderboardEntries(entries);
      console.log('Supabase에서 로드된 리더보드:', entries);
    };

    initializeLeaderboard();

    // 실시간 리더보드 구독
    const subscription = subscribeToLeaderboard((entries) => {
      setLeaderboardEntries(entries);
      console.log('실시간 리더보드 업데이트:', entries);
    });

    // 개발자 도구에서 사용할 수 있는 디버깅 함수들
    (window as any).debugLeaderboard = {
      get: async () => {
        const entries = await getTopLeaderboardEntries();
        console.log('현재 Supabase 리더보드:', entries);
        return entries;
      },
      add: async (name: string, score: number) => {
        const newEntry = await addLeaderboardEntry({
          player_name: name,
          score: score,
          time_seconds: 60,
          moves: 10
        });
        console.log('테스트 엔트리가 추가되었습니다:', newEntry);
      }
    };

    // 컴포넌트 언마운트 시 구독 해제
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle player name submission
  const handlePlayerNameSubmit = async (name: string) => {
    setPlayerName(name.trim());
    setShowNameModal(false);
    initializeGame();
    
    // Reload leaderboard when starting a new game
    const entries = await getTopLeaderboardEntries();
    setLeaderboardEntries(entries);
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
