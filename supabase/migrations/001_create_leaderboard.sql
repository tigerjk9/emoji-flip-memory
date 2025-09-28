-- Create leaderboard table for the memory game
CREATE TABLE IF NOT EXISTS public.leaderboard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    player_name TEXT NOT NULL,
    score INTEGER NOT NULL,
    time_seconds INTEGER NOT NULL,
    moves INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for better performance when sorting by score
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON public.leaderboard(score DESC);

-- Create index for better performance when sorting by created_at
CREATE INDEX IF NOT EXISTS idx_leaderboard_created_at ON public.leaderboard(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read leaderboard entries
CREATE POLICY "Anyone can view leaderboard entries" ON public.leaderboard
    FOR SELECT USING (true);

-- Create policy to allow everyone to insert new leaderboard entries
CREATE POLICY "Anyone can insert leaderboard entries" ON public.leaderboard
    FOR INSERT WITH CHECK (true);

-- Grant permissions
GRANT ALL ON public.leaderboard TO anon;
GRANT ALL ON public.leaderboard TO authenticated;
