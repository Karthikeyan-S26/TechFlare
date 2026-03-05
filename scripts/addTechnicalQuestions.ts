import { createClient } from '@supabase/supabase-js';
import { technicalQuestions } from '../src/data/technical-questions';
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

async function addTechnicalQuestions() {
  console.log('🚀 Starting Technical Round questions import...\n');
  
  if (technicalQuestions.length === 0) {
    console.log('⚠️  No questions found in the list.');
    return;
  }

  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  // First, check if technical questions already exist
  const { data: existing } = await supabase
    .from('questions')
    .select('id, content')
    .eq('round', 'technical');

  if (existing && existing.length > 0) {
    console.log(`⚠️  Found ${existing.length} existing technical questions.`);
    console.log('Attempting to add new questions...\n');
  }

  for (let i = 0; i < technicalQuestions.length; i++) {
    const q = technicalQuestions[i];
    console.log(`Processing Q${i + 1}: ${q.section_name}...`);

    try {
      // Prepare options object
      let optionsData: any = {
        section: q.section,
        section_name: q.section_name
      };

      // For rearrange questions, add code lines
      if (q.type === 'rearrange') {
        optionsData.code_lines = q.code_lines;
        optionsData.shuffled_lines = q.shuffled_lines;
      }

      // For MCQ questions, add options array
      if (['pseudocode', 'syntax_error', 'output_prediction'].includes(q.type) && q.options) {
        optionsData = { ...optionsData, ...q.options };
      }

      const { data, error } = await supabase
        .from('questions')
        .insert({
          round: q.round,
          type: q.type,
          content: q.content,
          options: optionsData,
          correct_answer: q.correct_answer,
          marks: q.marks
        })
        .select();

      if (error) {
        console.log(`   ❌ Error: ${error.message}`);
        errorCount++;
      } else if (data && data.length > 0) {
        console.log(`   ✅ Added successfully`);
        successCount++;
      }
    } catch (err: any) {
      console.log(`   ❌ Exception: ${err.message}`);
      errorCount++;
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`   ✅ Successfully added: ${successCount}`);
  console.log(`   ⏭️  Skipped (already exists): ${skipCount}`);
  console.log(`   ❌ Errors: ${errorCount}`);
  console.log(`   📝 Total questions: ${technicalQuestions.length}`);
  console.log(`\n✨ Script completed!`);
}

addTechnicalQuestions();