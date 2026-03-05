# Image Setup Instructions for Aptitude Round

## Required Images

Place the following 4 image files in the `public/images/` directory:

### 1. instrument-puzzle.png
- **Question 7**: Musical instruments logic puzzle
- Shows: Guitar + Microphone + Guitar = 18, etc.
- Answer: 66

### 2. number-grid-puzzle.png
- **Question 8**: Number grid pattern puzzle  
- Shows: 3×3 grid with numbers and one missing value
- Answer: 45

### 3. sequence-puzzle.png
- **Question 9**: Number sequence puzzle
- Shows: 1, 6, 15, ?, 45, 66, 91
- Answer: 28

### 4. star-puzzle.png
- **Question 10**: Star/radial pattern with numbers
- Shows: Numbers arranged in a star pattern with one missing
- Answer: 16

## How to Add Images

1. Save the 4 puzzle images from your attachments
2. Rename them exactly as listed above
3. Place them in: `public/images/`
4. Restart the dev server if running

## File Structure
```
public/
  ├── images/
  │   ├── instrument-puzzle.png
  │   ├── number-grid-puzzle.png
  │   ├── sequence-puzzle.png
  │   └── star-puzzle.png
  ├── favicon.ico
  └── robots.txt
```

## Verification

After adding images, they will be accessible at:
- http://localhost:8081/images/instrument-puzzle.png
- http://localhost:8081/images/number-grid-puzzle.png
- http://localhost:8081/images/sequence-puzzle.png
- http://localhost:8081/images/star-puzzle.png

## Note

If images are not showing:
1. Check file names match exactly (case-sensitive)
2. Ensure they are PNG format
3. Clear browser cache and refresh
4. Restart the Vite dev server
