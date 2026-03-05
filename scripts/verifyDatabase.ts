import { createClient } from '@supabase/supabase-js';

// Hardcoded credentials from .env for simplicity in scripts
const supabaseUrl = 'https://fzmgmivusulkhmtnspma.supabase.co';
const supabaseKey = 'sb_publishable_vCQgv5sGHH8OEu71nC9lyw_GaHEPvxJ';

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyDatabase() {
  console.log('🔍 Verifying database setup...\n');

  // Count total students
  const { count: studentCount, error: studentError } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true });

  if (studentError) {
    console.error('❌ Error counting students:', studentError);
  } else {
    console.log(`✅ Total students: ${studentCount}`);
  }

  // Count admins
  const { count: adminCount, error: adminError } = await supabase
    .from('students')
    .select('*', { count: 'exact', head: true })
    .in('reg_no', ['621323205024', '621323205015']);

  if (adminError) {
    console.error('❌ Error counting admins:', adminError);
  } else {
    console.log(`👑 Admins in database: ${adminCount}`);
  }

  // Count aptitude questions
  const { count: aptCount, error: aptError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('round', 'aptitude');

  if (aptError) {
    console.error('❌ Error counting aptitude questions:', aptError);
  } else {
    console.log(`📝 Aptitude questions: ${aptCount}`);
  }

  // Count technical questions
  const { count: techCount, error: techError } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('round', 'technical');

  if (techError) {
    console.error('❌ Error counting technical questions:', techError);
  } else {
    console.log(`🛠️  Technical questions: ${techCount}`);
  }

  // Count leaderboard entries
  const { count: leaderboardCount, error: leaderError } = await supabase
    .from('leaderboard')
    .select('*', { count: 'exact', head: true });

  if (leaderError) {
    console.error('❌ Error counting leaderboard entries:', leaderError);
  } else {
    console.log(`🏆 Leaderboard entries: ${leaderboardCount}`);
  }

  // Check if admins are in leaderboard
  const { data: adminLeaderboard, error: adminLeaderError } = await supabase
    .from('leaderboard')
    .select('*, students(name, reg_no)')
    .in('students.reg_no', ['621323205024', '621323205015']);

  if (adminLeaderError) {
    console.error('❌ Error checking admin leaderboard:', adminLeaderError);
  } else if (adminLeaderboard && adminLeaderboard.length > 0) {
    console.log(`\n⚠️  Found ${adminLeaderboard.length} admin(s) in leaderboard:`);
    adminLeaderboard.forEach((entry: any) => {
      console.log(`   - ${entry.students?.name} (${entry.students?.reg_no})`);
    });
    console.log('\n💡 Run CLEAN_ADMIN_LEADERBOARD.sql in Supabase SQL Editor to remove them.');
  } else {
    console.log('✅ No admins in leaderboard');
  }

  // Check test_control table
  console.log('\n🎮 Checking test control status...');
  const { data: testControl, error: controlError } = await supabase
    .from('test_control')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (controlError) {
    console.error('❌ test_control table not found or error:', controlError.message);
    console.log('\n🔧 IMPORTANT: Run this SQL in Supabase SQL Editor:');
    console.log('   https://fzmgmivusulkhmtnspma.supabase.co/project/_/sql/new');
    console.log('\n   Copy the SQL from: supabase/migrations/20260306130000_create_test_control.sql\n');
  } else if (testControl) {
    console.log(`✅ Test Control Table exists`);
    console.log(`   - Aptitude Round: ${testControl.aptitude_active ? '🟢 ACTIVE' : '⚫ Inactive'}`);
    console.log(`   - Technical Round: ${testControl.technical_active ? '🟢 ACTIVE' : '⚫ Inactive'}`);
  } else {
    console.log('⚠️  test_control table exists but no data');
  }

  console.log('\n📊 Summary:');
  console.log(`   - Expected students: 68 (excluding 2 admins)`);
  console.log(`   - Expected aptitude questions: 10`);
  console.log(`   - Expected technical questions: 8`);
  console.log(`   - Expected leaderboard entries: ${studentCount ? studentCount - 2 : '?'} (students only)`);
}

verifyDatabase();
