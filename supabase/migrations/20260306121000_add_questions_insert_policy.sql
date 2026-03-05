-- Add INSERT policy for questions table
-- This allows anyone (especially admins) to insert questions

CREATE POLICY "Anyone can insert questions" ON public.questions
FOR INSERT
WITH CHECK (true);

-- Verify policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE tablename = 'questions';
