# Aptitude Round Setup Guide

## 🎯 Overview

The Aptitude Round consists of **10 questions** with the following specifications:
- **Timer**: 60 seconds per question
- **Format**: 4 options, 1 correct answer
- **Marks**: 1 point per question (Total: 10 points)
- **Display**: One question at a time
- **Auto-submit**: When timer expires
- **Scoring**: Real-time score calculation
- **Leaderboard**: Auto-updates after each submission

## 📊 Question Breakdown

### Word Scramble Questions (4 questions)
1. **ETDARAABAS** → DATABASE
2. **RGOTIHALM** → ALGORITHM
3. **RETINNET** → INTERNET
4. **RTEPUCOM** → COMPUTER

### Number Pattern Questions (2 questions)
5. **Sequence**: 4, 6, 9, 13, 18, ? → **24** (Pattern: +2, +3, +4, +5, +6)
6. **Sequence**: 3, 5, 9, 17, 33, ? → **65** (Pattern: ×2 - 1)

### Visual Puzzle Questions (4 questions)
7. **Instrument Puzzle** → **66** (Requires: instrument-puzzle.png)
8. **Number Grid** → **45** (Requires: number-grid-puzzle.png)
9. **Number Sequence** → **28** (Requires: sequence-puzzle.png)
10. **Star Pattern** → **16** (Requires: star-puzzle.png)

## 🚀 Setup Instructions

### Method 1: Using Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project: `vmtnmklrmklekrsisucb`
   - Navigate to: SQL Editor

2. **Run the Setup Script**
   - Open file: `APTITUDE_SETUP.sql`
   - Copy entire contents
   - Paste in SQL Editor
   - Click "Run"

3. **Verify Success**
   - Check the query results
   - Should show: 10 aptitude questions added
   - Types: 4 word_scramble, 2 number_pattern, 4 visual puzzles

### Method 2: Using the Import Script

```bash
npm run add-aptitude
```

**Note**: This requires the INSERT policy to be added first (included in Method 1).

## 🖼️ Image Setup

### Required Images (4 files)

Place these images in `public/images/`:

1. **instrument-puzzle.png** - Musical instruments equation puzzle
2. **number-grid-puzzle.png** - 3×3 number grid pattern
3. **sequence-puzzle.png** - Number sequence with one missing
4. **star-puzzle.png** - Star/radial pattern with numbers

### How to Add Images

1. Save the 4 images from your attachments
2. Rename them exactly as listed above
3. Place in: `public/images/`
4. Verify accessibility at: `http://localhost:8081/images/[filename].png`

**Important**: Without these images, Questions 7-10 will show a broken image placeholder but will still function.

## 🎮 How It Works

### Student Experience

1. **Login** with name and registration number
2. **Navigate** to Aptitude Round
3. **Answer** questions one by one
   - 60 seconds per question
   - Select one option from A, B, C, D
   - Can change answer before time expires
4. **Auto-submit** when time expires
5. **View** real-time score updates
6. **Complete** all 10 questions
7. **See** final score and leaderboard position

### System Behavior

```
Question Load → Timer Start (60s) → Student Selects Answer → 
Timer Expires/Submit → Save to Database → Calculate Score → 
Update Leaderboard → Next Question (or Finish)
```

### Database Tables Used

- **questions**: Stores all questions
- **submissions**: Records every answer
- **leaderboard**: Tracks scores and ranks
- **violations**: Monitors tab switches (anti-cheat)

## 📝 Testing the Round

### Quick Test Checklist

- [ ] Login with test account
- [ ] Navigate to `/aptitude`
- [ ] Verify 10 questions load
- [ ] Check 60-second timer works
- [ ] Test option selection
- [ ] Verify auto-submit on timer expiry
- [ ] Check score calculation
- [ ] Confirm leaderboard updates
- [ ] Test image display (Q7-10)
- [ ] Verify tab switch detection

### Test User Accounts

- **Admin**: KARTHIKEYAN (621323205024)
- **Admin**: ESWARI (621323205015)
- **Student**: ABINIVESH K (621324205001)

## 🔧 Troubleshooting

### Questions Not Loading
- Check database connection
- Verify questions table has data
- Run: `SELECT * FROM questions WHERE round = 'aptitude'`

### Images Not Showing
- Check file names match exactly
- Ensure files are in `public/images/`
- Clear browser cache
- Restart dev server

### Timer Not Working
- Check browser console for errors
- Verify `useTimer` hook is functioning
- Ensure JavaScript is enabled

### Scores Not Updating
- Check leaderboard table policies
- Verify student_id is correct
- Check submissions table for entries

### Policy Errors
- Ensure INSERT policy exists on questions table
- Run policy creation script from `APTITUDE_SETUP.sql`

## 📂 Files Created

### Data Files
- `src/data/aptitude-questions.ts` - Question data array
- `public/images/README.md` - Image setup instructions

### Scripts
- `scripts/addAptitudeQuestions.ts` - Automated import script
- `APTITUDE_SETUP.sql` - Complete SQL setup script

### Migrations
- `supabase/migrations/20260306120000_add_aptitude_questions.sql`
- `supabase/migrations/20260306121000_add_questions_insert_policy.sql`

### Documentation
- `APTITUDE_SETUP_GUIDE.md` - This file

## 🎯 Next Steps

1. ✅ Add the 10 questions to database (Method 1 or 2)
2. 🖼️ Place 4 puzzle images in `public/images/`
3. 🧪 Test the round with a student account
4. 📊 Monitor the leaderboard for score updates
5. 🚀 Move on to Technical Round setup

## 💡 Tips

- **Preview Mode**: Test questions before competition
- **Backup**: Export questions after setup
- **Images**: Use high-quality, clear images
- **Timer**: Consider adjusting if needed (currently 60s)
- **Marks**: All questions are 1 mark (can be adjusted)

## 🔒 Security Features

- Row-level security on all tables
- Tab switch detection
- Automatic violation logging
- Real-time monitoring
- Auto-submission prevents cheating

## 📞 Support

If issues persist:
1. Check database policies in Supabase dashboard
2. Verify environment variables in `.env`
3. Review browser console for errors
4. Check network tab for failed requests

---

**Ready to go!** Run the SQL script and add the images to complete the setup.
