import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export type LeaderboardEntry = Database['public']['Tables']['leaderboard']['Row'];
export type LeaderboardInsert = Database['public']['Tables']['leaderboard']['Insert'];

// 리더보드 항목 추가
export const addLeaderboardEntry = async (entry: Omit<LeaderboardInsert, 'id' | 'created_at'>): Promise<LeaderboardEntry | null> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .insert([entry])
      .select()
      .single();

    if (error) {
      console.error('리더보드 저장 오류:', error);
      return null;
    }

    console.log('리더보드에 저장됨:', data);
    return data;
  } catch (error) {
    console.error('리더보드 저장 중 예외 발생:', error);
    return null;
  }
};

// 상위 10개 리더보드 항목 가져오기
export const getTopLeaderboardEntries = async (limit: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('score', { ascending: false })
      .order('time_seconds', { ascending: true }) // 같은 점수면 더 빠른 시간이 우선
      .limit(limit);

    if (error) {
      console.error('리더보드 로드 오류:', error);
      return [];
    }

    console.log('리더보드 로드됨:', data);
    return data || [];
  } catch (error) {
    console.error('리더보드 로드 중 예외 발생:', error);
    return [];
  }
};

// 실시간 리더보드 구독
export const subscribeToLeaderboard = (callback: (entries: LeaderboardEntry[]) => void) => {
  const subscription = supabase
    .channel('leaderboard_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'leaderboard' 
      }, 
      async () => {
        // 리더보드가 변경되면 최신 데이터를 가져와서 콜백 실행
        const entries = await getTopLeaderboardEntries();
        callback(entries);
      }
    )
    .subscribe();

  return subscription;
};

// localStorage에서 Supabase로 기존 데이터 마이그레이션
export const migrateLocalStorageToSupabase = async (): Promise<void> => {
  try {
    const localData = localStorage.getItem('memoryGameLeaderboard');
    if (!localData) return;

    const localEntries = JSON.parse(localData);
    if (!Array.isArray(localEntries) || localEntries.length === 0) return;

    console.log('localStorage 데이터를 Supabase로 마이그레이션 중...', localEntries);

    // 기존 localStorage 데이터를 Supabase 형식으로 변환
    const supabaseEntries = localEntries.map(entry => ({
      player_name: entry.playerName,
      score: entry.score,
      time_seconds: entry.time,
      moves: entry.moves,
      created_at: entry.createdAt
    }));

    // 배치로 삽입
    const { error } = await supabase
      .from('leaderboard')
      .insert(supabaseEntries);

    if (error) {
      console.error('마이그레이션 오류:', error);
    } else {
      console.log('마이그레이션 완료! localStorage 데이터 삭제');
      localStorage.removeItem('memoryGameLeaderboard');
    }
  } catch (error) {
    console.error('마이그레이션 중 예외 발생:', error);
  }
};
