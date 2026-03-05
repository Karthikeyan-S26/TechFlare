-- Check and fix test_control table permissions

-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'test_control';

-- Drop existing policies if any
DROP POLICY IF EXISTS "Enable all for anon" ON test_control;
DROP POLICY IF EXISTS "Enable all for authenticated" ON test_control;

-- Disable RLS temporarily for testing (IMPORTANT: Enable this in production with proper policies)
ALTER TABLE test_control DISABLE ROW LEVEL SECURITY;

-- Or create permissive policies
ALTER TABLE test_control ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations" ON test_control
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);
