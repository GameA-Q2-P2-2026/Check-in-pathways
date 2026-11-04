# Game Design weekly check-ins

A static website for weekly check-ins. Everyone starts with two Unity
Essentials check-ins, then checks in five times on their path (Design,
Programming, Development / Management, or Game Writing). Students build each
check-in and submit it from the page. The site also explains how the course is
graded (1000 points) and links a Word check-in sheet for Essentials and for each
path.

There is no build step. Every file here is served as is by GitHub Pages.

## Publish it

1. Push these files to the root of a public repository on the `main` branch.
   Keep the hidden `.github` folder: it holds the publishing workflow.
2. In the repository, open Settings > Pages. Under "Build and deployment", set
   Source to **GitHub Actions** and save.
3. Open the Actions tab. The "Deploy site" workflow runs on every push to
   `main`. You can also start it by hand with Run workflow.
4. After a few minutes the site is live at
   `https://YOUR-NAME-OR-ORG.github.io/REPOSITORY-NAME/`.

From a terminal:

```
git init
git add .
git commit -m "Game Design check-ins"
git branch -M main
git remote add origin https://github.com/YOUR-NAME-OR-ORG/REPOSITORY-NAME.git
git push -u origin main
```

### If a deployment is slow or times out

GitHub Pages is sometimes slow to publish, even for a small site like this one.
The "Deploy site" workflow waits up to 30 minutes instead of 10. If a run still
fails with "Timeout reached, aborting!", check githubstatus.com, wait a few
minutes, and use Re-run all jobs on the failed run. If a new run complains that
another deployment is in progress, wait 10 to 15 minutes and try again.

## Submit and the Word file

Students must enter the class code your teacher gives them, their class period,
and a link to their GitHub repository on every check-in.

Pressing Submit downloads the check-in as a Word (.docx) file, and students turn
that file in on Google Classroom. Until `config.js` has a submit address, Submit
only downloads the file. To also send each check-in to your Google Sheet, follow
`TEACHER-SETUP.md` in the separate teacher-private package, then paste the
address into `config.js` and commit it.

## What is in this repository

- `index.html`: start page (Unity Essentials first, then the four paths)
- `checkin.html`: the check-in form for every path and week
- `grading.html`: how students are graded
- `data.js`: weekly targets, evidence, and questions for Essentials and each path
- `config.js`: the submit address (the only file you normally edit)
- `style.css`, `app.js`: styling and behavior
- `assignments/`: one Word check-in sheet for Essentials and one per path

No student information is stored in this repository. Drafts stay in the
student's own browser until they submit.
