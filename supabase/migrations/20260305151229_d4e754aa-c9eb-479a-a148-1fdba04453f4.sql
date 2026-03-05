
-- Students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  reg_no TEXT UNIQUE NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);
CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);

-- Questions table
CREATE TABLE public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  options JSONB,
  correct_answer TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 1
);
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);

-- Submissions table
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  answer TEXT,
  score INTEGER DEFAULT 0,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read submissions" ON public.submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);

-- Leaderboard table
CREATE TABLE public.leaderboard (
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE PRIMARY KEY,
  aptitude_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  rank INTEGER
);
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read leaderboard" ON public.leaderboard FOR SELECT USING (true);
CREATE POLICY "Anyone can insert leaderboard" ON public.leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update leaderboard" ON public.leaderboard FOR UPDATE USING (true);

-- Enable Realtime on leaderboard
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;

-- Violations table
CREATE TABLE public.violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read violations" ON public.violations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert violations" ON public.violations FOR INSERT WITH CHECK (true);

-- Plagiarism logs table
CREATE TABLE public.plagiarism_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student1 UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student2 UUID REFERENCES public.students(id) ON DELETE CASCADE,
  similarity NUMERIC,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);
ALTER TABLE public.plagiarism_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read plagiarism_logs" ON public.plagiarism_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert plagiarism_logs" ON public.plagiarism_logs FOR INSERT WITH CHECK (true);

-- Storage bucket for question assets
INSERT INTO storage.buckets (id, name, public) VALUES ('question-assets', 'question-assets', true);
CREATE POLICY "Public read access for question assets" ON storage.objects FOR SELECT USING (bucket_id = 'question-assets');
