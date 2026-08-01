# Icon System

A unified, monochrome icon set for the profile README — replaces skillicons.dev
and shields.io icon rendering with local, theme-aware SVGs.

## Structure

```
assets/icons/
  *.svg          source icons — use currentColor, theme via CSS var(--icon-bg)
  dark/*.svg     baked dark-theme variant (fg #E6EDF3, for GitHub dark mode)
  light/*.svg    baked light-theme variant (fg #24292F, for GitHub light mode)
```

Two files exist per icon because **GitHub's markdown sanitizer strips inline
`<svg>` tags and does not apply page CSS to SVGs loaded via `<img>`.**
`currentColor` and CSS variables work great for a website, but not for a
README rendered on github.com — so the dark/light folders are pre-baked,
static-color exports meant specifically for `<picture>` embedding.

## Design tokens

| Token | Value |
|---|---|
| Canvas | 32×32 |
| Content box | 22×22, centered (5px padding on all sides) |
| Line-icon stroke | 1.75, round caps/joins |
| Dark foreground | `#E6EDF3` on transparent |
| Light foreground | `#24292F` on transparent |

## Two tiers, one system

- **Marks** (`github`, `linkedin`, `javascript`, coding-profile icons, language/framework
  logos) — filled solid glyphs. Brand logos are recognized by silhouette, so they stay filled.
- **Line icons** (`git`, `bash`, `email`, `vite`, `react`) — stroked at a
  consistent 1.75 weight, round caps/joins.

Both tiers share the same canvas, padding, and color tokens, which is what
makes them read as one family instead of two icon packs glued together.

## Status: 7 finished, 10 placeholders

Icons hand-built with full geometric confidence (safe to ship as-is):
`git`, `bash`, `email`, `vite`, `react`, `javascript`, `linkedin`.

**Exception — `vscode`:** unlike the other marks, this one is *not*
recolored to `currentColor`/theme tokens. Microsoft's brand guidelines
(code.visualstudio.com/brand) explicitly prohibit modifying the icon's
color or redrawing it in a different style, and specify fixed brand colors.
So `vscode.svg` keeps its original gradient fill, masks, and drop-shadow
filters exactly as shipped in Microsoft's official icon pack — only the
canvas size and padding are normalized to match the rest of the set. Same
file is used for both the dark/ and light/ folders since the blue "stable"
icon has sufficient contrast on this README's dark background (Microsoft's
white "alt" variant is intended only for blue-on-blue situations).

Icons currently shipped as **dashed-border placeholders** (`github`,
`leetcode`, `codeforces`, `codechef`, `java`, `spring`, `postgresql`,
`python`, `sqlite`, `vscode`): these are brand-specific logos with legally
particular curves. Redrawing them from memory risks shipping an inaccurate
trademark, so instead of guessing, run the build script to pull the *exact*
official paths:

```bash
npm install simple-icons
node scripts/build-icons.mjs   # overwrites the 10 placeholders with official marks
python3 bake_themes.py         # re-bake dark/light variants after
```

The build script normalizes each official path into this exact same
32×32 / 22×22-content-box system, so fidelity and consistency both hold.

## Adding a new icon

1. Add source SVG to `assets/icons/<slug>.svg` using the shared template
   (see any existing icon — `viewBox="0 0 32 32"`, `title`/`desc`, `aria-label`).
2. Center content in the 22×22 box (offset 5,5).
3. Run `python3 bake_themes.py` to generate the dark/light variants.
