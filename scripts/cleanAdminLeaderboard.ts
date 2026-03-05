import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fzmgmivusulkhmtnspma.supabase.co';
const supabaseKey = 'sb_publishable_vCQgv5sGHH8OEu71nC9lyw_GaHEPvxJ';

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_REG_NUMBERS = ['621323205024', '621323205015'];

async function cleanAdminLeaderboard() {
  console.log('🧹 Cleaning admin entries from leaderboard...\n');

  // Get admin student IDs
  const { data: adminStudents, error: adminError } = await supabase
    .from('students')
    .select('id, name, reg_no')
    .in('reg_no', ADMIN_REG_NUMBERS);

  if (adminError) {
    console.error('❌ Error fetching admin students:', adminError);
    return;
  }

  if (!adminStudents || adminStudents.length === 0) {
    console.log('ℹ️  No admin students found');
    return;
  }

  console.log('Found admin students:');
  adminStudents.forEach(admin => {
    console.log(`  - ${admin.name} (${admin.reg_no})`);
  });

  const adminIds = adminStudents.map(s => s.id);

  // Delete leaderboard entries for admin IDs
  const { error: deleteError, count } = await supabase
    .from('leaderboard')
    .delete()
    .in('student_id', adminIds);

  if (deleteError) {
    console.error('\n❌ Error deleting admin leaderboard entries:', deleteError);
    return;
  }

  console.log(`\n✅ Deleted ${count || 0} admin leaderboard entries`);
}

cleanAdminLeaderboard();