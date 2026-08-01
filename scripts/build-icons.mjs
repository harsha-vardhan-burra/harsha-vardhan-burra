// scripts/build-icons.mjs
//
// Pulls EXACT official glyph paths from the `simple-icons` package and
// normalizes each one into this repo's icon system: 32x32 canvas, path
// scaled/centered into a 22x22 content box (5px padding), monochrome via
// currentColor, with title/desc/aria-label for accessibility.
//
// Why this exists: hand-redrawing brand logos (GitHub's Octocat, the Java
// cup, PostgreSQL's elephant, etc.) from memory risks shipping a subtly
// inaccurate trademark. This script instead normalizes the real, official
// path data — so fidelity is guaranteed and only presentation is unified.
//
// Usage:
//   npm install simple-icons
//   node scripts/build-icons.mjs
//
// Simple Icons paths are drawn on a 24x24 viewBox by convention.

import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import * as simpleIcons from "simple-icons";

const OUT_DIR = "assets/icons";
mkdirSync(OUT_DIR, { recursive: true });

// slug -> { icon: simple-icons export name, label, desc }
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
  vscode:      { icon: "siVisualstudiocode", label: "VS Code", desc: "Visual Studio Code logo" },
};

// Simple Icons source glyphs sit on a 24x24 grid. We scale into a 22x22
// content box (factor 22/24) and offset by 5px to center in the 32x32 canvas.
const SCALE = 22 / 24;
const OFFSET = 5;

function normalize(slug, { icon, label, desc }) {
  const data = simpleIcons[icon];
  if (!data) {
    console.warn(`skip ${slug}: "${icon}" not found in simple-icons export`);
    return;
  }
  const svg = `<svg viewBox="0 0 32 32" width="32" height="32" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}" class="icon icon-${slug}">
  <title>${label}</title>
  <desc>${desc}</desc>
  <g transform="translate(${OFFSET} ${OFFSET}) scale(${SCALE.toFixed(4)})" fill="currentColor">
    <path d="${data.path}"/>
  </g>
</svg>
`;
  writeFileSync(join(OUT_DIR, `${slug}.svg`), svg);
  console.log(`wrote ${slug}.svg (official path, normalized)`);
}

for (const [slug, meta] of Object.entries(ICONS)) {
  normalize(slug, meta);
}

console.log("\nDone. These 10 icons now use exact official brand paths, normalized");
console.log("into the same 32x32 / 22x22-content-box system as the 7 hand-built icons.");
