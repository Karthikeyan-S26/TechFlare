-- Add students from II-year name list (Batch 2024-28)
-- 
-- Instructions:
-- 1. Replace the example data below with actual student names and registration numbers from the PDF
-- 2. Add as many rows as needed for all students
-- 3. Run this migration file

-- Insert students
INSERT INTO public.students (name, reg_no) VALUES
  -- Add student data in this format:
  -- ('Full Student Name', 'REGISTRATION_NUMBER'),
  
  -- Example entries (replace with actual data):
  ('Example Student 1', '2024CSE001'),
  ('Example Student 2', '2024CSE002')
  -- Add more students here, separated by commas
  -- Remember: Last entry should NOT have a comma after it
ON CONFLICT (reg_no) DO NOTHING;

-- Create leaderboard entries for all new students
INSERT INTO public.leaderboard (student_id, aptitude_score, technical_score, total_score)
SELECT 
  s.id, 
  0 as aptitude_score, 
  0 as technical_score, 
  0 as total_score
FROM public.students s
WHERE s.id NOT IN (SELECT student_id FROM public.leaderboard);

-- Verify the import
SELECT 
  COUNT(*) as total_students,
  COUNT(CASE WHEN login_time > NOW() - INTERVAL '1 hour' THEN 1 END) as recent_additions
FROM public.students;
