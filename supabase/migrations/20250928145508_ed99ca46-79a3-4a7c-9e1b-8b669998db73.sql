-- Create leaderboard table for the memory game
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    moves INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON public.leaderboard(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Anyone can view leaderboard entries" ON public.leaderboard
    FOR SELECT USING (true);

CREATE POLICY "Anyone can insert leaderboard entries" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.leaderboard TO anon;
GRANT ALL ON public.leaderboard TO authenticated;