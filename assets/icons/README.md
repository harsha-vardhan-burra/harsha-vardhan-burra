# Icon System

A unified icon set for the profile README — replaces skillicons.dev and
shields.io icon rendering with local, normalized SVGs. **Colored, not
monochrome** — each icon uses its real brand color, since color carries
real recognition value for third-party logos. What's unified is the
*chrome*: canvas, padding, optical alignment, and stroke weight, not the
palette.

## Structure

```
assets/icons/
  *.svg          source icons, each with its own fixed brand color
  dark/*.svg     dark-mode copy — identical to source, except a few
                 too-dark colors get a lighter override (see below)
  light/*.svg    light-mode copy — always identical to source
```

## Design tokens

| Token | Value |
|---|---|
| Canvas | 32×32 |
| Content box | 22×22, centered (5px padding on all sides) |
| Line-icon stroke | 1.75, round caps/joins |
| Color | each icon's real brand hex (see `generate_icons_colored.py` / `scripts/build-icons.mjs`) |

## Dark-mode contrast overrides

A handful of brand colors are too dark to read against this README's
`#0d1117` background. Those get a lighter substitute **only in the dark/
copy** — the light/ copy and the source file keep the true official color:

| Icon | Official | Dark-mode override |
|---|---|---|
| `github` | `#181717` | `#C9D1D9` (GitHub's own dark-mode gray) |
| `codechef` | `#5B4638` | `#A78874` |
| `sqlite` | `#003B57` | `#4FA8D8` |

Everything else uses the same color in both folders.

## Two tiers, one system

- **Marks** — filled solid glyphs (brand/profile logos, lettermark badges).
- **Line icons** (`git`, `bash`, `email`) — stroked at a consistent 1.75
  weight, round caps/joins, colored per-brand instead of monochrome.

Both tiers share the same canvas, padding, and sizing — that's what makes
them read as one family despite each carrying a different color.

## Status: 7 finished, 9 need the build script, 1 exception

Icons hand-built with full geometric confidence (safe to ship as-is):
`git`, `bash`, `email`, `vite`, `react`, `javascript`, `linkedin`.

**Exception — `vscode`:** not built from simple-icons at all. Microsoft's
brand guidelines (code.visualstudio.com/brand) explicitly prohibit
modifying the icon's color or redrawing it in a different style, and
specify fixed brand colors. So `vscode.svg` keeps its original gradient
fill, masks, and drop-shadow filters exactly as shipped in Microsoft's
official icon pack — only the canvas size and padding are normalized to
match the rest of the set. Same file in both dark/ and light/, since the
blue "stable" icon has sufficient contrast on this README's dark
background already.

The other 9 (`github`, `leetcode`, `codeforces`, `codechef`, `java`,
`spring`, `postgresql`, `python`, `sqlite`) need real official path data,
which requires network access this environment doesn't have:

```bash
npm install simple-icons
node scripts/build-icons.mjs   # pulls official paths + brand hex colors
python3 bake_themes.py         # re-bakes dark/light, applies contrast overrides
```

## Adding a new icon

1. Add source SVG to `assets/icons/<slug>.svg` using the shared template
   (see any existing icon — `viewBox="0 0 32 32"`, `title`/`desc`, `aria-label`).
2. Center content in the 22×22 box (offset 5,5). Use the icon's real brand
   color as a fixed hex, not `currentColor`.
3. If the color is too dark for a near-black background, add it to
   `DARK_OVERRIDES` in `bake_themes.py`.
4. Run `python3 bake_themes.py` to generate the dark/light variants.
