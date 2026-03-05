

# IT Tech Arena AI — Implementation Plan

## Overview
A college technical competition platform with two rounds (Aptitude & Technical), real-time leaderboard, anti-cheating measures, and an admin dashboard. Students log in with name + register number.

---

## Phase 1: Foundation & Database

### Supabase Setup
- Connect Supabase to the project
- Create all database tables: `students`, `questions`, `submissions`, `leaderboard`, `violations`, `plagiarism_logs`
- Enable Realtime on the `leaderboard` table
- Create a `question-assets` storage bucket for images
- Set up RLS policies for all tables

### Supabase Client
- Install `@supabase/supabase-js`
- Create `src/lib/supabaseClient.ts`

---

## Phase 2: Login System

### Login Page
- Simple form: Name + Register Number
- On submit: upsert student (check if reg_no exists, create if not)
- Store student session in React context
- Redirect to the Aptitude Round after login
- Clean, competition-themed UI with Framer Motion entrance animations

---

## Phase 3: Aptitude Round

### Question Display
- Fetch MCQ/visual puzzle questions from the `questions` table (filtered by `round = 'aptitude'`)
- Display one question at a time with 4 options
- Show puzzle images from Supabase Storage when applicable

### Timer & Auto-Submit
- 60-second countdown per question
- Auto-submit current answer when timer expires
- Visual timer indicator (progress bar or countdown circle)

### Scoring
- On answer submit: insert into `submissions`, compare with `correct_answer`
- Calculate score and update `leaderboard.aptitude_score`
- After all questions: show summary and wait for Technical Round access

---

## Phase 4: Technical Round

### Question Types
1. **Rearrange Statements** — Drag-and-drop using `@dnd-kit` to reorder code lines
2. **Find Syntax Error** — Display code, student selects/types the error
3. **Pseudocode Output** — Student types the expected output
4. **Write Output** — Given code, student writes what it prints
5. **Coding Question** — Monaco Editor for writing code solutions

### Flow
- Only students selected after aptitude can access this round
- 60-second timer per question (coding questions may get more time)
- Answers stored in `submissions`, scores updated in `leaderboard.technical_score`

### Dependencies to Install
- `@dnd-kit/core`, `@dnd-kit/sortable` for drag-and-drop
- `@monaco-editor/react` for the code editor
- `framer-motion` for animations

---

## Phase 5: Real-Time Leaderboard

### Public Leaderboard Page
- Displays: Rank, Student Name, Register Number, Aptitude Score, Technical Score, Total Score
- Subscribe to Supabase Realtime `postgres_changes` on the `leaderboard` table
- Live updates with smooth animations when rankings change
- Sortable columns

---

## Phase 6: Anti-Cheating

### Tab Switch Detection
- Listen to `visibilitychange` and `blur` events during rounds
- Log violations to the `violations` table with timestamp
- Show warning to student on first violation

### Plagiarism Detection
- After coding question submissions, compare answers using basic string similarity (Levenshtein or token-based)
- If similarity > 85%, log to `plagiarism_logs`
- Flag affected students in admin dashboard

---

## Phase 7: Admin Dashboard

### Dashboard Features
- **Students Overview** — List of all logged-in students with login times
- **Live Leaderboard** — Same real-time leaderboard with admin controls
- **Submissions Viewer** — Browse answers per student/question
- **Violation Alerts** — List of tab-switch violations with student details
- **Plagiarism Alerts** — Flagged similar submissions with similarity scores
- Admin access via a simple route (e.g., `/admin`) — no separate auth for MVP

---

## Pages & Routing

| Route | Page |
|---|---|
| `/` | Login Page |
| `/aptitude` | Aptitude Round |
| `/technical` | Technical Round |
| `/leaderboard` | Public Leaderboard |
| `/admin` | Admin Dashboard |

---

## Design & UX
- Dark-themed competition aesthetic with accent colors
- Framer Motion animations for page transitions, timer, and leaderboard updates
- Mobile-responsive layout
- Clear progress indicators showing current question number and round status
- Toast notifications for submissions and warnings

