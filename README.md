# Abhinav Avasarala — Personal Page

Static site ready for GitHub Pages. Content is data-driven: edit JSON, not HTML.

## Structure
- `index.html` – landing page (hero, skills, experience, projects, contact)
- `project.html` – deep-dive view for any project (`?id=<project-id>`)
- `css/style.css` – styles/theme (dark, systems-inspired)
- `js/app.js` – renders content from JSON onto each page
- `data/profile.json` – name, tagline, skills, experience, education, contact links
- `data/projects.json` – projects and deep-dive content
- `logs/README.md` – project log template (use while building)

## View locally
Because the site fetches local JSON, open it with a tiny server:
```bash
python3 -m http.server 8000
```
Then open http://localhost:8000 in a browser. (Double-clicking the HTML file may block JSON fetches.)

## Update content
1) Edit profile details: `data/profile.json`
   - Update `contact.linkedin`, `contact.github`, and `contact.resume` when you have URLs.
2) Add or edit projects: `data/projects.json`
   - Each project needs a unique `id`, `title`, `timeframe`, `summary`, `outcome`, `stack`, optional `links` (`repo`/`demo`), `highlights`, and `lessons`.
   - Use the log template in `logs/` while building; paste key bullets into `projects.json`.
3) Deep dives: open `project.html?id=<project-id>` (cards link there automatically).

## Deploy to GitHub Pages
1) Commit and push to GitHub.
2) In the repo settings → Pages: set Source to the `main` branch and root folder (`/`).  
3) Visit `https://<your-username>.github.io/<repo-name>/` after Pages finishes building.

## Quick customization ideas
- Swap accent colors or fonts in `css/style.css`.
- Add more skill groups or experience entries in `data/profile.json`.
- Wire real repo/demo links in `data/projects.json` so buttons point to your work.
