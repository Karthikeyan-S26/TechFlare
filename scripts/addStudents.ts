import { createClient } from '@supabase/supabase-js';
import { studentsList } from '../src/data/students';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Get Supabase credentials
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are set in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function addStudents() {
  console.log('🚀 Starting student import...\n');
  
  if (studentsList.length === 0) {
    console.log('⚠️  No students found in the list.');
    console.log('Please add student data to src/data/students.ts');
    return;
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const student of studentsList) {
    try {
      // Check if student already exists
      const { data: existing } = await supabase
        .from('students')
        .select('id, name, reg_no')
        .eq('reg_no', student.reg_no)
        .maybeSingle();

      if (existing) {
        console.log(`⏭️  Skipped: ${student.name} (${student.reg_no}) - Already exists`);
        skipCount++;
        continue;
      }

      // Insert new student
      const { data: newStudent, error: insertError } = await supabase
        .from('students')
        .insert([{
          name: student.name,
          reg_no: student.reg_no
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      // Create leaderboard entry for the student
      const { error: leaderboardError } = await supabase
        .from('leaderboard')
        .insert({
          student_id: newStudent.id,
          aptitude_score: 0,
          technical_score: 0,
          total_score: 0
        });

      if (leaderboardError) {
        console.warn(`⚠️  Warning: Could not create leaderboard entry for ${student.name}`);
      }

      console.log(`✅ Added: ${student.name} (${student.reg_no})`);
      successCount++;
    } catch (error: any) {
      console.error(`❌ Error adding ${student.name}: ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total processed: ${studentsList.length}`);
}

// Run the script
addStudents()
  .then(() => {
    console.log('\n✨ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
