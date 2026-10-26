# Game Design weekly check-ins

A static website for weekly check-ins on the four Game Design paths (Design,
Programming, Development / Management, Game Writing). Students build each
week's check-in and submit it from the page. The site also explains how the
course is graded and links Word check-in sheets for each path.

There is no build step. Every file here is served as is by GitHub Pages.

## Publish it

1. Push these files to the root of a public repository on the `main` branch.
2. In the repository, open Settings > Pages. Under "Build and deployment" choose
   "Deploy from a branch", select `main` and `/ (root)`, and save.
3. After a minute the site is live at
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

## Turn on Submit

Until `config.js` has a submit address, students see Copy and Download buttons
for turning in through Google Classroom. To turn on Submit, follow the teacher
setup guide (in the separate teacher-private package), then paste the address
into `config.js` and commit it.

## What is in this repository

- `index.html`: start page where students pick a path
- `checkin.html`: the check-in form for every path and week
- `grading.html`: how students are graded
- `data.js`: weekly targets, evidence, and questions for each path
- `config.js`: the submit address (the only file you normally edit)
- `style.css`, `app.js`: styling and behavior
- `assignments/`: one Word check-in sheet per path

No student information is stored in this repository. Drafts stay in the
student's own browser until they submit.
