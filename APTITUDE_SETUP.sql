-- ============================================================================
-- COMPLETE TECH ARENA SETUP - Run this entire script in Supabase SQL Editor
-- ============================================================================
-- This script will:
-- 1. Create all necessary tables (if they don't exist)
-- 2. Set up Row Level Security policies
-- 3. Insert all 10 aptitude questions
-- 4. Verify the setup
-- ============================================================================

-- ============================================================================
-- STEP 1: CREATE TABLES (if they don't exist)
-- ============================================================================

-- Students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  reg_no TEXT UNIQUE NOT NULL,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Questions table
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  round TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT,
  options JSONB,
  correct_answer TEXT NOT NULL,
  marks INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Submissions table
CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  answer TEXT,
  score INTEGER DEFAULT 0,
  time_taken INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Leaderboard table
CREATE TABLE IF NOT EXISTS public.leaderboard (
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE PRIMARY KEY,
  aptitude_score INTEGER DEFAULT 0,
  technical_score INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  rank INTEGER
);

-- Violations table
CREATE TABLE IF NOT EXISTS public.violations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Plagiarism logs table
CREATE TABLE IF NOT EXISTS public.plagiarism_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student1 UUID REFERENCES public.students(id) ON DELETE CASCADE,
  student2 UUID REFERENCES public.students(id) ON DELETE CASCADE,
  similarity NUMERIC,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- ============================================================================
-- STEP 2: ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.violations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plagiarism_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: CREATE POLICIES (if they don't exist)
-- ============================================================================

-- Students policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Anyone can read students') THEN
    CREATE POLICY "Anyone can read students" ON public.students FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'students' AND policyname = 'Anyone can insert students') THEN
    CREATE POLICY "Anyone can insert students" ON public.students FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Questions policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'Anyone can read questions') THEN
    CREATE POLICY "Anyone can read questions" ON public.questions FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'questions' AND policyname = 'Anyone can insert questions') THEN
    CREATE POLICY "Anyone can insert questions" ON public.questions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Submissions policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Anyone can read submissions') THEN
    CREATE POLICY "Anyone can read submissions" ON public.submissions FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'submissions' AND policyname = 'Anyone can insert submissions') THEN
    CREATE POLICY "Anyone can insert submissions" ON public.submissions FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Leaderboard policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leaderboard' AND policyname = 'Anyone can read leaderboard') THEN
    CREATE POLICY "Anyone can read leaderboard" ON public.leaderboard FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leaderboard' AND policyname = 'Anyone can insert leaderboard') THEN
    CREATE POLICY "Anyone can insert leaderboard" ON public.leaderboard FOR INSERT WITH CHECK (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'leaderboard' AND policyname = 'Anyone can update leaderboard') THEN
    CREATE POLICY "Anyone can update leaderboard" ON public.leaderboard FOR UPDATE USING (true);
  END IF;
END $$;

-- Violations policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'violations' AND policyname = 'Anyone can read violations') THEN
    CREATE POLICY "Anyone can read violations" ON public.violations FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'violations' AND policyname = 'Anyone can insert violations') THEN
    CREATE POLICY "Anyone can insert violations" ON public.violations FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Plagiarism logs policies
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plagiarism_logs' AND policyname = 'Anyone can read plagiarism_logs') THEN
    CREATE POLICY "Anyone can read plagiarism_logs" ON public.plagiarism_logs FOR SELECT USING (true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plagiarism_logs' AND policyname = 'Anyone can insert plagiarism_logs') THEN
    CREATE POLICY "Anyone can insert plagiarism_logs" ON public.plagiarism_logs FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- ============================================================================
-- STEP 4: DELETE EXISTING APTITUDE QUESTIONS (optional - uncomment if needed)
-- ============================================================================
-- DELETE FROM public.questions WHERE round = 'aptitude';

-- ============================================================================
-- STEP 5: INSERT 10 APTITUDE QUESTIONS
-- ============================================================================
INSERT INTO public.questions (round, type, content, image_url, options, correct_answer, marks) VALUES

-- Q1: Word Scramble - DATABASE
('aptitude', 'word_scramble', 'Unscramble the IT word: ETDARAABAS', 
 NULL, '["DATABASE", "DATASET", "DATAWARE", "DATASTORE"]'::jsonb, 'DATABASE', 1),

-- Q2: Word Scramble - ALGORITHM
('aptitude', 'word_scramble', 'Unscramble the IT word: RGOTIHALM', 
 NULL, '["ALGORITHM", "ALGORITHMS", "LOGARITHM", "ALGORITHEM"]'::jsonb, 'ALGORITHM', 1),

-- Q3: Word Scramble - INTERNET
('aptitude', 'word_scramble', 'Unscramble the IT word: RETINNET', 
 NULL, '["INTERNET", "INTRANET", "NETWORK", "NETWARE"]'::jsonb, 'INTERNET', 1),

-- Q4: Word Scramble - COMPUTER
('aptitude', 'word_scramble', 'Unscramble the IT word: RTEPUCOM', 
 NULL, '["COMPUTER", "COMPUTE", "COMPUTING", "COMPUTOR"]'::jsonb, 'COMPUTER', 1),

-- Q5: Number Pattern (4, 6, 9, 13, 18, ?)
('aptitude', 'number_pattern', 'Find the missing number in the sequence: 4, 6, 9, 13, 18, ?', 
 NULL, '["23", "24", "25", "26"]'::jsonb, '24', 1),

-- Q6: Number Pattern (3, 5, 9, 17, 33, ?)
('aptitude', 'number_pattern', 'Find the missing number in the sequence: 3, 5, 9, 17, 33, ?', 
 NULL, '["60", "64", "65", "70"]'::jsonb, '65', 1),

-- Q7: Image Logic - Instrument Puzzle
('aptitude', 'image_logic', 'Find the value of the final expression (Microphone + Violin × Guitar = ?)', 
 '/images/instrument-puzzle.png', '["60", "66", "72", "78"]'::jsonb, '66', 1),

-- Q8: Image Grid - Number Grid Puzzle
('aptitude', 'image_grid', 'Find the missing number in the grid.', 
 '/images/number-grid-puzzle.png', '["44", "45", "46", "47"]'::jsonb, '45', 1),

-- Q9: Sequence - 1, 6, 15, ?, 45, 66, 91
('aptitude', 'sequence', 'Find the missing number in the sequence: 1, 6, 15, ?, 45, 66, 91', 
 '/images/sequence-puzzle.png', '["26", "28", "30", "32"]'::jsonb, '28', 1),

-- Q10: Star Pattern Logic Puzzle
('aptitude', 'star_logic', 'Find the missing number in the star pattern.', 
 '/images/star-puzzle.png', '["16", "18", "32", "36"]'::jsonb, '16', 1);

-- ============================================================================
-- STEP 6: VERIFY THE SETUP
-- ============================================================================

-- Check tables exist
SELECT 
  table_name,
  'EXISTS' as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('students', 'questions', 'submissions', 'leaderboard', 'violations')
ORDER BY table_name;

-- Check aptitude questions
SELECT 
  COUNT(*) as total_aptitude_questions,
  COUNT(CASE WHEN type = 'word_scramble' THEN 1 END) as word_scramble,
  COUNT(CASE WHEN type = 'number_pattern' THEN 1 END) as number_pattern,
  COUNT(CASE WHEN image_url IS NOT NULL THEN 1 END) as with_images
FROM public.questions
WHERE round = 'aptitude';

-- Show all aptitude questions with details
SELECT 
  id,
  type,
  LEFT(content, 50) as content_preview,
  correct_answer,
  marks,
  image_url
FROM public.questions
WHERE round = 'aptitude'
ORDER BY created_at;

-- ============================================================================
-- ✅ SETUP COMPLETE!
-- ============================================================================
-- You should see:
-- - 5 tables created (students, questions, submissions, leaderboard, violations)
-- - 10 aptitude questions added
-- - All policies configured
--
-- Next steps:
-- 1. Add the 4 puzzle images to public/images/
-- 2. Test the login with: npm run add-students (if students not added yet)
-- 3. Open the app and navigate to /aptitude
-- ============================================================================
