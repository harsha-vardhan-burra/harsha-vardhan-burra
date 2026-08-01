# Pac-Man Contribution Graph

A GitHub Action that renders your contribution graph as an animated SVG where Pac-Man travels across the grid and consumes contribution days.

**No ghosts. No pellets. No score. No game.** Just your contribution graph, with a small animated cursor that clears it. The graph stays the primary visual — Pac-Man enhances it, he doesn't turn it into an arcade screen.

<p align="center">
  <img src="./example/pacman-dark.svg" width="90%" alt="Example Pac-Man contribution graph" />
</p>

## How it works

1. Fetches your last 12 months of contribution data from GitHub's GraphQL API (the same data your profile page's contribution graph uses).
2. Builds a single continuous path through every day in the grid, using a boustrophedon ("snake") order — down one week's column, up the next, and so on. No random movement, no backtracking.
3. Renders an SVG where Pac-Man moves along that path at a constant speed (native SMIL `animateMotion`), automatically facing the direction of travel.
4. Each contribution square fades out at the exact moment Pac-Man's motion reaches it — timed against the same animation clock, so it's always in sync.
5. Loops indefinitely by default.

Everything is a single self-contained SVG. No canvas, no GIF, no client-side JavaScript — it works anywhere SVG + SMIL renders, including GitHub's own README viewer.

## Usage

Add this to a workflow in the repository that matches your GitHub username (the one that powers your profile page):

```yaml
name: Generate Pac-Man Contribution Graph

on:
  schedule:
    - cron: "0 0 * * *"
  workflow_dispatch:
  push:
    branches: [main]

permissions:
  contents: write

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Generate Pac-Man graph
        uses: ./.github/actions/pacman-graph
        with:
          github_user_name: ${{ github.repository_owner }}
          github_token: ${{ secrets.GITHUB_TOKEN }}

      - name: Push SVGs to the output branch
        uses: crazy-max/ghaction-github-pages@v4
        with:
          target_branch: output
          build_dir: dist
        env:
          GITHUB_TOKEN: ${{ secrets.PAGES_TOKEN || secrets.GITHUB_TOKEN }}
```

Then embed it in your `README.md`:

```markdown
<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/<you>/<you>/output/dist/pacman-dark.svg">
  <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/<you>/<you>/output/dist/pacman.svg">
  <img alt="Pac-Man contribution graph" src="https://raw.githubusercontent.com/<you>/<you>/output/dist/pacman.svg" width="90%">
</picture>
```

## Inputs

| Name | Required | Default | Description |
|---|---|---|---|
| `github_user_name` | yes | — | GitHub username to read the contribution graph from |
| `github_token` | yes | — | Token that can read that user's contributions (default `GITHUB_TOKEN` works for public profiles) |
| `outputs` | no | `dist/pacman.svg` + `dist/pacman-dark.svg` | Newline-separated output paths, each optionally suffixed `?theme=dark` |
| `animation_speed` | no | `20` | Seconds for one full traversal of the graph |
| `pacman_size` | no | `14` | Pac-Man diameter in pixels |
| `show_trail` | no | `false` | Draw a fading trail line behind Pac-Man |
| `trail_color` | no | `#58a6ff` | Trail color, if enabled |
| `background_color` | no | *(transparent)* | Optional background fill |
| `loop` | no | `true` | Whether the animation repeats indefinitely |
| `theme` | no | `light` | Fallback theme for any output that doesn't specify its own |

## Outputs

| Name | Description |
|---|---|
| `output_paths` | Comma-separated list of file paths written |

## Customization examples

Slower animation with a visible trail:

```yaml
with:
  github_user_name: ${{ github.repository_owner }}
  github_token: ${{ secrets.GITHUB_TOKEN }}
  animation_speed: "35"
  show_trail: "true"
  trail_color: "#39d353"
```

Only generate a dark-theme output:

```yaml
with:
  github_user_name: ${{ github.repository_owner }}
  github_token: ${{ secrets.GITHUB_TOKEN }}
  outputs: |
    dist/pacman-dark.svg?theme=dark
```

## FAQ

**Why does it only show the last 12 months?**
That's the same window GitHub's GraphQL `contributionsCollection` API returns by default, and it matches what your profile page itself displays.

**Can I add ghosts back?**
Not with this action — it's built deliberately without game logic. If you want the full arcade version (Pac-Man vs. ghosts, power pellets, scoring), [`abozanona/pacman-contribution-graph`](https://github.com/abozanona/pacman-contribution-graph) is the tool for that instead.

**Why SMIL (`<animate>`, `<animateMotion>`) instead of CSS or JS animation?**
GitHub strips `<script>` tags and most CSS animation triggers from embedded SVGs for security, but does render SMIL. It's the only animation approach that reliably survives GitHub's README sanitizer.

## Architecture

```
src/
  types.ts    — shared types (grid, config, path points)
  github.ts   — GraphQL fetch + response mapping
  path.ts     — boustrophedon traversal, pixel coordinates, timing
  svg.ts      — SVG string rendering (cells, Pac-Man, trail)
  index.ts    — action entry point (inputs → fetch → render → write files)
dist/
  index.js    — esbuild bundle checked in so the action runs with no install step
```

## Development

```bash
npm install
npm run typecheck   # tsc --noEmit
npm run build        # esbuild bundle to dist/index.js
```

## License

MIT — see [LICENSE](./LICENSE).
