-- Insert Aptitude Round Questions (10 questions total)
-- Timer: 60 seconds per question
-- Marks: 1 point each

-- Question 1: Word Scramble - DATABASE
INSERT INTO public.questions (round, type, content, options, correct_answer, marks) VALUES
('aptitude', 'word_scramble', 'Unscramble the IT word: ETDARAABAS', 
 '["DATABASE", "DATASET", "DATAWARE", "DATASTORE"]'::jsonb, 'DATABASE', 1);

-- Question 2: Word Scramble - ALGORITHM
INSERT INTO public.questions (round, type, content, options, correct_answer, marks) VALUES
('aptitude', 'word_scramble', 'Unscramble the IT word: RGOTIHALM', 
 '["ALGORITHM", "ALGORITHMS", "LOGARITHM", "ALGORITHEM"]'::jsonb, 'ALGORITHM', 1);

-- Question 3: Word Scramble - INTERNET
INSERT INTO public.questions (round, type, content, options, correct_answer, marks) VALUES
('aptitude', 'word_scramble', 'Unscramble the IT word: RETINNET', 
 '["INTERNET", "INTRANET", "NETWORK", "NETWARE"]'::jsonb, 'INTERNET', 1);

-- Question 4: Word Scramble - COMPUTER
INSERT INTO public.questions (round, type, content, options, correct_answer, marks) VALUES
('aptitude', 'word_scramble', 'Unscramble the IT word: RTEPUCOM', 
 '["COMPUTER", "COMPUTE", "COMPUTING", "COMPUTOR"]'::jsonb, 'COMPUTER', 1);

-- Question 5: Number Pattern (4, 6, 9, 13, 18, ?)
INSERT INTO public.questions (round, type, content, options, correct_answer, marks) VALUES
('aptitude', 'number_pattern', 'Find the missing number in the sequence: 4, 6, 9, 13, 18, ?', 
 '["23", "24", "25", "26"]'::jsonb, '24', 1);

-- Question 6: Number Pattern (3, 5, 9, 17, 33, ?)
INSERT INTO public.questions (round, type, content, options, correct_answer, marks) VALUES
('aptitude', 'number_pattern', 'Find the missing number in the sequence: 3, 5, 9, 17, 33, ?', 
 '["60", "64", "65", "70"]'::jsonb, '65', 1);

-- Question 7: Image Logic - Instrument Puzzle
-- Guitar (6) + Microphone (8) + Guitar (6) = 18
-- Microphone (8) + Guitar (6) + Microphone (8) = 20
-- Microphone (8) + Microphone (8) + Violin (10) = 26
-- Microphone (8) + Violin (10) × Guitar (6) = 8 + 60 = 68 (if PEMDAS) or 66 (user says)
INSERT INTO public.questions (round, type, content, image_url, options, correct_answer, marks) VALUES
('aptitude', 'image_logic', 'Find the value of the final expression (Microphone + Violin × Guitar = ?)', 
 '/images/instrument-puzzle.png', '["60", "66", "72", "78"]'::jsonb, '66', 1);

-- Question 8: Image Grid - Number Grid Puzzle
-- Pattern: Each row and column has a mathematical relationship
INSERT INTO public.questions (round, type, content, image_url, options, correct_answer, marks) VALUES
('aptitude', 'image_grid', 'Find the missing number in the grid.', 
 '/images/number-grid-puzzle.png', '["44", "45", "46", "47"]'::jsonb, '45', 1);

-- Question 9: Sequence - 1, 6, 15, ?, 45, 66, 91
-- Pattern: +5, +9, +13, +17, +21, +25
INSERT INTO public.questions (round, type, content, image_url, options, correct_answer, marks) VALUES
('aptitude', 'sequence', 'Find the missing number in the sequence: 1, 6, 15, ?, 45, 66, 91', 
 '/images/sequence-puzzle.png', '["26", "28", "30", "32"]'::jsonb, '28', 1);

-- Question 10: Star Pattern Logic Puzzle
-- Pattern: 64 / 4 = 16, 25 / 5 = 5, 8 / 1 = 8, 2 × 8 = 16
INSERT INTO public.questions (round, type, content, image_url, options, correct_answer, marks) VALUES
('aptitude', 'star_logic', 'Find the missing number in the star pattern.', 
 '/images/star-puzzle.png', '["16", "18", "32", "36"]'::jsonb, '16', 1);

-- Verify the questions were added
SELECT 
  COUNT(*) as total_aptitude_questions,
  COUNT(CASE WHEN type = 'word_scramble' THEN 1 END) as word_scramble,
  COUNT(CASE WHEN type = 'number_pattern' THEN 1 END) as number_pattern,
  COUNT(CASE WHEN type LIKE '%image%' OR type LIKE '%sequence%' OR type LIKE '%star%' THEN 1 END) as visual_puzzles
FROM public.questions
WHERE round = 'aptitude';
