# Adding Students to the Database

This guide explains how to add students from the PDF to the database.

## Method 1: Using the TypeScript Script (Recommended)

### Step 1: Add Student Data
Open `src/data/students.ts` and add all student names and registration numbers from the PDF:

```typescript
export const studentsList = [
  { name: "Student Name 1", reg_no: "REG001" },
  { name: "Student Name 2", reg_no: "REG002" },
  // Add all students from the PDF here
];
```

### Step 2: Install tsx (if not already installed)
```bash
npm install -D tsx
```

### Step 3: Run the Import Script
```bash
npm run add-students
```

The script will:
- ✅ Add new students to the database
- ⏭️ Skip students that already exist
- 🔄 Create leaderboard entries for new students
- 📊 Show a summary of the import

## Method 2: Using SQL Migration

If you prefer to use a SQL file, follow these steps:

### Step 1: Create a New Migration File

Create a new file in `supabase/migrations/` with a timestamp name, for example:
`20260306000000_add_students.sql`

### Step 2: Add SQL Insert Statements

Use this template:

```sql
-- Insert students from II-year list (Batch 2024-28)
INSERT INTO public.students (name, reg_no) VALUES
  ('Student Name 1', 'REG001'),
  ('Student Name 2', 'REG002'),
  -- Add more students here
  ('Student Name N', 'REGN')
ON CONFLICT (reg_no) DO NOTHING;

-- Create leaderboard entries for all students
INSERT INTO public.leaderboard (student_id, aptitude_score, technical_score, total_score)
SELECT id, 0, 0, 0 
FROM public.students 
WHERE id NOT IN (SELECT student_id FROM public.leaderboard);
```

### Step 3: Apply the Migration

Run the migration using Supabase CLI or through the Supabase dashboard.

## Method 3: Using Supabase Dashboard

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Paste the insert statements
4. Execute the query

## Tips

- **Registration Number Format**: Ensure all reg_no values are unique and match the format in your PDF
- **Name Format**: Use the exact names from the PDF
- **Batch Processing**: If you have many students, process them in smaller batches of 50-100 at a time

## Verification

After adding students, verify by:
1. Checking the Supabase dashboard
2. Running this query in the SQL editor:
   ```sql
   SELECT COUNT(*) as total_students FROM public.students;
   SELECT COUNT(*) as students_with_leaderboard 
   FROM public.leaderboard;
   ```
3. Trying to log in with one of the student credentials

## Troubleshooting

- **Duplicate reg_no errors**: A student with that registration number already exists
- **Missing environment variables**: Ensure `.env` file has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- **Connection errors**: Check your internet connection and Supabase project status
