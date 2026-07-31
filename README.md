# MothNode Website

Marketing site for **MothNode**, a remote tank monitoring system for rural fire
departments that depend on fire cisterns and dry hydrants instead of city water.

Built by [LTRJ Labs](https://ltrjlabs.com).

## What this is

A plain static site. No build step, no dependencies, no framework. Open
`index.html` in a browser and it works.

```
index.html          Front page: hero carousel, features, product description, trust
buy/index.html      Coming soon page
privacy/index.html  Privacy policy
mothnode.css        All styles
mothnode.js         All scripts (carousel, mobile menu, scroll spy, anchor offsets)
images/             Photos, dashboard screenshot, logos, favicon
```

## Working on it locally

Open the file directly, or serve it if you want paths to behave exactly as they
do in production:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploying

Published with GitHub Pages from the `main` branch, root folder, at
<https://mothnode.net>. The custom domain is held by the `CNAME` file in the repo
root; deleting that file drops the domain.

`dev` is where work happens. Merge `dev` into `main` to publish:

```bash
git checkout main && git merge dev && git push origin main
```

## House rules

**The palette is four colors and no more.** They are defined as CSS variables at
the top of `mothnode.css`:

| Variable | Value | Use |
|---|---|---|
| `--brand` | `#006086` | Headings, primary buttons, links |
| `--brand-accent` | `#00ADEC` | Hover states, eyebrows |
| `--brand-natural` | `#A7FFD4` | Badges, highlight icons |
| neutrals | grayscale | Text and surfaces |

Tints, borders, and shadows are the brand color at reduced alpha, so nothing
off-palette creeps in. The LTRJ Labs logo in the footer is the one deliberate
exception.

**No invented content.** Testimonials, ratings, and statistics go on the site
only when they are real and attributable.

## Known gaps

- The LinkedIn link in the footer points at `#`. Search for the `TODO` comment in
  each page.
- The repo must be public for GitHub Pages to serve it on the free plan.
- There is no way to capture interest while the buy page says coming soon. Adding
  a form or a mailing list means updating the privacy policy first.

## Credits

Layout originally derived from TemplateMo 599 "Noir Fashion"
(https://templatemo.com/tm-599-noir-fashion).
