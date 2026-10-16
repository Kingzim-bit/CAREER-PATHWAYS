# COSMO Career Pathways

A professional, self-contained career pathway UI for students. Pick your starting qualification and years of experience, choose an ICT track, and see the exact route — with qualifications, skills and certifications — at every step.

**Theme:** blue `#1E2859` · yellow `#FCD00F`

## Features

- **Start-point selector** — O'Level (BDQF 3), BTEC Level 2 (BDQF 3), BTEC Level 3 (BDQF 4), A Level / HNTec (BDQF 4), HND / Diploma (BDQF 5)
- **Experience slider** — 0–15+ years, recomputes every status live
- **4 tracks** — Software & Applications, Cyber Security, Network & Infrastructure, Data & AI
- **Status badges** — ✓ Ready now · ⏳ Experience needed · 🎓 Study needed (with a study-step card when you need another qualification first)
- **Detail drawer** — click any step for your best route, all skills with levels (1 Follow → 5 Strategise), recommended certifications and the next promotion
- **Responsive** — horizontal pathway on desktop, vertical timeline on mobile

## Run it

No build step, no dependencies. Double-click `index.html`, or serve the folder:

```bash
python -m http.server 8080
# then open http://localhost:8080
```

## Files

| File | Purpose |
|---|---|
| `index.html` | Page shell |
| `styles.css` | Theme and layout (blue/yellow design system) |
| `data.js` | Entry points, 4 tracks, 20 roles — routes, skills, certifications |
| `app.js` | Pathway rendering, status logic, detail drawer |

## Data

Routes, skills and certifications are based on the Brunei ICT Industry Competency Framework (BIICF). This is an unofficial student guide — always confirm entry requirements with COSMO.

MIT licensed.
