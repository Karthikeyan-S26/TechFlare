-- Remove admin entries from leaderboard table
-- Run this in Supabase SQL Editor to clean existing admin data

DELETE FROM leaderboard 
WHERE student_id IN (
  SELECT id FROM students 
  WHERE reg_no IN ('621323205024', '621323205015')
);

-- Verify the deletion
SELECT COUNT(*) as deleted_count 
FROM students 
WHERE reg_no IN ('621323205024', '621323205015') 
AND id NOT IN (SELECT student_id FROM leaderboard);
