// scripts/build-icons.mjs — COLORED VERSION
//
// Same normalization as before (32x32 canvas, 22x22 content box, official
// path data from simple-icons) but now fills each icon with its real brand
// color (data.hex) instead of currentColor, since color is part of what
// makes these logos recognizable.
//
// Usage:
//   npm install simple-icons
//   node scripts/build-icons.mjs
//   python3 bake_themes.py   (applies dark-mode contrast overrides, see below)

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as simpleIcons from "simple-icons";

const OUT_DIR = "assets/icons";
mkdirSync(OUT_DIR, { recursive: true });

const ICONS = {
  github:      { icon: "siGithub",      label: "GitHub",      desc: "GitHub logo" },
  leetcode:    { icon: "siLeetcode",    label: "LeetCode",    desc: "LeetCode logo" },
  codeforces:  { icon: "siCodeforces",  label: "Codeforces",  desc: "Codeforces logo" },
  codechef:    { icon: "siCodechef",    label: "CodeChef",    desc: "CodeChef logo" },
  java:        { icon: "siOpenjdk",     label: "Java",        desc: "Java / OpenJDK logo" },
  spring:      { icon: "siSpringboot",  label: "Spring Boot", desc: "Spring Boot logo" },
  postgresql:  { icon: "siPostgresql",  label: "PostgreSQL",  desc: "PostgreSQL elephant logo" },
  python:      { icon: "siPython",      label: "Python",      desc: "Python logo" },
  sqlite:      { icon: "siSqlite",      label: "SQLite",      desc: "SQLite feather logo" },
  // vscode intentionally excluded — built by hand from Microsoft's official
  // brand-kit SVG, kept fully unmodified (see assets/icons/README.md).
};

const SCALE = 22 / 24;
const OFFSET = 5;

function normalize(slug, { icon, label, desc }) {
  const data = simpleIcons[icon];
  if (!data) {
    console.warn(`skip ${slug}: "${icon}" not found in simple-icons export`);
    return;
  }
  const hex = `#${data.hex}`;
  const svg = `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" class="icon icon-${slug}">
  <title>${label}</title>
  <desc>${desc}</desc>
  <g transform="translate(${OFFSET} ${OFFSET}) scale(${SCALE.toFixed(4)})" fill="${hex}">
    <path d="${data.path}"/>
  </g>
</svg>
`;
  writeFileSync(join(OUT_DIR, `${slug}.svg`), svg);
  console.log(`wrote ${slug}.svg  (${hex})`);
}

for (const [slug, meta] of Object.entries(ICONS)) {
  normalize(slug, meta);
}

console.log("\nDone. Run `python3 bake_themes.py` next to apply dark-mode");
console.log("contrast overrides (github/codechef/sqlite are too dark as-is).");
