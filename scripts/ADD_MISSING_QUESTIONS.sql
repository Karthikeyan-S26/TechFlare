-- Add missing 5 aptitude questions (Total should be 10)
-- Run this in Supabase SQL Editor

-- Insert the 5 missing questions
INSERT INTO questions (round, type, content, options, correct_answer, marks, image_url)
VALUES
  -- Question 6
  (
    'aptitude',
    'number_pattern',
    'Find the missing number in the sequence: 3, 5, 9, 17, 33, ?',
    '["60", "64", "65", "70"]'::jsonb,
    '65',
    1,
    NULL
  ),
  -- Question 7
  (
    'aptitude',
    'image_logic',
    'Find the value of the final expression (Microphone + Violin × Guitar = ?)',
    '["60", "66", "72", "78"]'::jsonb,
    '66',
    1,
    '/images/instrument-puzzle.png'
  ),
  -- Question 8
  (
    'aptitude',
    'image_grid',
    'Find the missing number in the grid.',
    '["44", "45", "46", "47"]'::jsonb,
    '45',
    1,
    '/images/number-grid-puzzle.png'
  ),
  -- Question 9
  (
    'aptitude',
    'sequence',
    'Find the missing number in the sequence: 1, 6, 15, ?, 45, 66, 91',
    '["26", "28", "30", "32"]'::jsonb,
    '28',
    1,
    '/images/sequence-puzzle.png'
  ),
  -- Question 10
  (
    'aptitude',
    'star_logic',
    'Find the missing number in the star pattern.',
    '["16", "18", "32", "36"]'::jsonb,
    '16',
    1,
    '/images/star-puzzle.png'
  );

-- Verify total question count
SELECT 'Total aptitude questions:' as label, COUNT(*) as count
FROM questions
WHERE round = 'aptitude';
