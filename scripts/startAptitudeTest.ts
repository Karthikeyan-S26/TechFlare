import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fzmgmivusulkhmtnspma.supabase.co';
const supabaseKey = 'sb_publishable_vCQgv5sGHH8OEu71nC9lyw_GaHEPvxJ';
const supabase = createClient(supabaseUrl, supabaseKey);

async function startAptitudeTest() {
  console.log('🎮 Starting Aptitude Round...\n');

  const { data, error } = await supabase
    .from('test_control')
    .update({ 
      aptitude_active: true,
      updated_at: new Date().toISOString()
    })
    .eq('id', 1)
    .select()
    .single();

  if (error) {
    console.error('❌ Error starting aptitude:', error);
    return;
  }

  console.log('✅ Aptitude Round Started!');
  console.log('\nCurrent Status:');
  console.log(`   - Aptitude: ${data.aptitude_active ? '🟢 ACTIVE' : '⚫ Inactive'}`);
  console.log(`   - Technical: ${data.technical_active ? '🟢 ACTIVE' : '⚫ Inactive'}`);
  console.log('\n📢 Students can now access the aptitude round!');
}

startAptitudeTest();
