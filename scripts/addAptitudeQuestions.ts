import { createClient } from '@supabase/supabase-js';
import { aptitudeQuestions } from '../src/data/aptitude-questions';
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

async function addAptitudeQuestions() {
  console.log('🚀 Starting Aptitude Round questions import...\n');
  
  if (aptitudeQuestions.length === 0) {
    console.log('⚠️  No questions found in the list.');
    return;
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // First, check if aptitude questions already exist
  const { data: existing } = await supabase
    .from('questions')
    .select('id, content')
    .eq('round', 'aptitude');

  if (existing && existing.length > 0) {
    console.log(`⚠️  Found ${existing.length} existing aptitude questions.`);
    console.log('Do you want to:');
    console.log('1. Skip adding new questions');
    console.log('2. Delete existing and add new ones\n');
    console.log('For now, attempting to add questions (duplicates will be handled)...\n');
  }

  for (let i = 0; i < aptitudeQuestions.length; i++) {
    const question = aptitudeQuestions[i];
    try {
      // Check if this exact question already exists
      const { data: duplicate } = await supabase
        .from('questions')
        .select('id')
        .eq('round', 'aptitude')
        .eq('content', question.content)
        .maybeSingle();

      if (duplicate) {
        console.log(`⏭️  Q${i + 1}: Skipped - "${question.content.substring(0, 50)}..." (Already exists)`);
        skipCount++;
        continue;
      }

      // Insert new question
      const { error: insertError } = await supabase
        .from('questions')
        .insert([{
          round: question.round,
          type: question.type,
          content: question.content,
          image_url: question.image_url || null,
          options: question.options,
          correct_answer: question.correct_answer,
          marks: question.marks
        }]);

      if (insertError) throw insertError;

      console.log(`✅ Q${i + 1}: Added - "${question.content.substring(0, 50)}..."`);
      successCount++;
    } catch (error: any) {
      console.error(`❌ Q${i + 1}: Error - ${error.message}`);
      errorCount++;
    }
  }

  console.log('\n📊 Summary:');
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total questions: ${aptitudeQuestions.length}`);
  
  if (successCount > 0) {
    console.log('\n⚠️  Note: Questions with image_url references need image files uploaded to:');
    console.log('   - public/images/instrument-puzzle.png');
    console.log('   - public/images/number-grid-puzzle.png');
    console.log('   - public/images/sequence-puzzle.png');
    console.log('   - public/images/star-puzzle.png');
  }
}

// Run the script
addAptitudeQuestions()
  .then(() => {
    console.log('\n✨ Script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Fatal error:', error);
    process.exit(1);
  });
