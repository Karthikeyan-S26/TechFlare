-- Reset and create exactly 10 aptitude questions
-- Run this in Supabase SQL Editor

-- Step 1: Delete all existing aptitude questions
DELETE FROM questions WHERE round = 'aptitude';

-- Step 2: Insert exactly 10 aptitude questions
INSERT INTO questions (round, type, content, options, correct_answer, marks, image_url)
VALUES
  -- Question 1: Word Scramble
  (
    'aptitude',
    'word_scramble',
    'Unscramble the IT word: ETDARAABAS',
    '["DATABASE", "DATASET", "DATAWARE", "DATASTORE"]'::jsonb,
    'DATABASE',
    1,
    NULL
  ),
  -- Question 2: Word Scramble
  (
    'aptitude',
    'word_scramble',
    'Unscramble the IT word: RGOTIHALM',
    '["ALGORITHM", "ALGORITHMS", "LOGARITHM", "ALGORITHEM"]'::jsonb,
    'ALGORITHM',
    1,
    NULL
  ),
  -- Question 3: Word Scramble
  (
    'aptitude',
    'word_scramble',
    'Unscramble the IT word: RETINNET',
    '["INTERNET", "INTRANET", "NETWORK", "NETWARE"]'::jsonb,
    'INTERNET',
    1,
    NULL
  ),
  -- Question 4: Word Scramble
  (
    'aptitude',
    'word_scramble',
    'Unscramble the IT word: RTEPUCOM',
    '["COMPUTER", "COMPUTE", "COMPUTING", "COMPUTOR"]'::jsonb,
    'COMPUTER',
    1,
    NULL
  ),
  -- Question 5: Number Pattern
  (
    'aptitude',
    'number_pattern',
    'Find the missing number in the sequence: 4, 6, 9, 13, 18, ?',
    '["23", "24", "25", "26"]'::jsonb,
    '24',
    1,
    NULL
  ),
  -- Question 6: Number Pattern
  (
    'aptitude',
    'number_pattern',
    'Find the missing number in the sequence: 3, 5, 9, 17, 33, ?',
    '["60", "64", "65", "70"]'::jsonb,
    '65',
    1,
    NULL
  ),
  -- Question 7: Image Logic
  (
    'aptitude',
    'image_logic',
    'Find the value of the final expression (Microphone + Violin × Guitar = ?)',
    '["60", "66", "72", "78"]'::jsonb,
    '66',
    1,
    '/images/instrument-puzzle.png'
  ),
  -- Question 8: Image Grid
  (
    'aptitude',
    'image_grid',
    'Find the missing number in the grid.',
    '["44", "45", "46", "47"]'::jsonb,
    '45',
    1,
    '/images/number-grid-puzzle.png'
  ),
  -- Question 9: Sequence
  (
    'aptitude',
    'sequence',
    'Find the missing number in the sequence: 1, 6, 15, ?, 45, 66, 91',
    '["26", "28", "30", "32"]'::jsonb,
    '28',
    1,
    '/images/sequence-puzzle.png'
  ),
  -- Question 10: Star Logic
  (
    'aptitude',
    'star_logic',
    'Find the missing number in the star pattern.',
    '["16", "18", "32", "36"]'::jsonb,
    '16',
    1,
    '/images/star-puzzle.png'
  );

-- Step 3: Verify exactly 10 questions
SELECT 'Total aptitude questions:' as label, COUNT(*) as count
FROM questions
WHERE round = 'aptitude';
