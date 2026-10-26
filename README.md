# Game Design course kit

Everything for the weekly check-ins and the grading in one package.

```
game-design-kit/
  README.md                     this file
  site/                         the student website (upload to GitHub Pages)
    index.html, checkin.html, grading.html, style.css, app.js, data.js
    config.js                   the one file you edit (online submit address)
    assignments/                Word check-in sheets, one per path
  teacher/
    Submissions-Apps-Script.gs  receives check-ins into a Google Sheet
    Gradebook.xlsx              applies the 100-point scoring
    Scoring-Guide.docx          the full scoring guide and rubrics
```

## What students can do

- Pick their path, then build each week's check-in on the site: what they
  finished, what is next, what is blocking them, two questions, a green /
  yellow / red status, and a goal.
- Submit it from the page. It lands in your Google Sheet, one row per student,
  per path, per week. Submitting again updates the row instead of adding a copy.
- Read "How you are graded" (grading.html).
- If online submit is off or fails, they can copy the check-in into Google
  Classroom or download it as a text file.

## Setup, in order (about 15 minutes)

### 1. Put the site on GitHub Pages

1. Create a new public repository, for example `game-design-checkins`.
2. Upload everything inside the `site` folder (keep the `assignments` folder).
3. Open Settings > Pages. Under "Build and deployment" choose "Deploy from a
   branch", pick `main` and the `/ (root)` folder, then Save.
4. After a minute the site is at
   `https://YOUR-NAME-OR-ORG.github.io/game-design-checkins/`.

Until step 2 below is done, students see Copy and Download buttons instead of
Submit. That is a working fallback with Google Classroom.

### 2. Turn on online submit (Google Sheet + Apps Script)

1. Create a new Google Sheet, for example "Game Design Check-ins".
2. Open Extensions > Apps Script. Delete the sample code and paste in the
   contents of `teacher/Submissions-Apps-Script.gs`.
3. Near the top, change `CLASS_CODE` to a word or phrase of your choice.
   Students type this code when they submit. Click Save.
4. In the function menu choose `setup`, click Run, and approve the permissions.
   This creates the "Check-ins" tab with its column headings.
5. Click Deploy > New deployment. Choose the gear icon > Web app. Set
   "Execute as" to Me and "Who has access" to Anyone. Click Deploy and copy the
   Web app URL (it ends in `/exec`).
6. Open `config.js` in your GitHub repository, paste the URL between the quotes
   of `submitUrl`, and commit the change.
7. Test: open your site, fill in a check-in, enter the class code, and press
   Submit. A row should appear in the sheet within a few seconds.

If you edit the script later, use Deploy > Manage deployments > Edit > New
version so the change goes live.

If "Anyone" is not available (some school Google accounts restrict it), ask
your district's Google administrator, or keep using Copy and Download with
Google Classroom.

### 3. Set up scoring

Open `teacher/Gradebook.xlsx` (upload it to Google Drive and open it with
Google Sheets if you like). Type each student's scores in the yellow cells.
Totals, the letter grade, and the class summary calculate themselves. Row 6 is
an example student: delete it before you start. Change the point values or
letter cutoffs on the Key sheet if you want a different scale.

## Weekly routine

1. During check-ins, open the "Check-ins" tab, filter to the week and path, and
   read the status and evidence for each student.
2. Enter a check-in score (0 to 4) and a path work score (0 to 6) in the last
   columns of each row. Scoring is explained in `Scoring-Guide.docx`.
3. Copy those scores into the gradebook.

## Privacy and safety notes

- The public site and repository contain no student information. Check-ins go
  only to your Google Sheet, which is private to you unless you share it.
- Names are typed by students. Consider telling them to use first name and last
  initial.
- The class code keeps outsiders from posting to your sheet, but anyone who has
  the code can submit. Change it between terms.
- Drafts are saved in each student's own browser until they submit. On shared
  computers, students should press "Clear this week" afterward.
- The script keeps text from being run as spreadsheet formulas and limits each
  answer to 2000 characters.

## Changing the content

Weekly targets, evidence, and questions live in `site/data.js`. The Word
sheets in `site/assignments` were generated from the same content, so update
both if you change a target.
