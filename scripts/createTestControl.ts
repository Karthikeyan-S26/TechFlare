import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL!;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTestControl() {
  console.log('Creating test_control table...');
  
  const sql = fs.readFileSync(
    path.join(__dirname, 'CREATE_TEST_CONTROL.sql'),
    'utf-8'
  );

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    console.error('Error creating test_control table:', error);
    console.log('\nPlease run this SQL manually in Supabase SQL Editor:');
    console.log(sql);
    process.exit(1);
  }

  console.log('✅ Test control table created successfully!');
  
  // Verify
  const { data, error: fetchError } = await supabase
    .from('test_control')
    .select('*')
    .single();
  
  if (fetchError) {
    console.error('Error verifying test_control:', fetchError);
  } else {
    console.log('Current test state:', data);
  }
}

createTestControl();
