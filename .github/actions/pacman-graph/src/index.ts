import * as core from "@actions/core";
import * as fs from "node:fs";
import * as path from "node:path";
import { fetchContributionGrid } from "./github";
import { renderSvg } from "./svg";
import type { ActionConfig, OutputTarget, Theme } from "./types";

function parseOutputs(raw: string, defaultTheme: Theme): OutputTarget[] {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return [
      { path: "dist/pacman.svg", theme: "light" },
      { path: "dist/pacman-dark.svg", theme: "dark" },
    ];
  }

  return lines.map((line) => {
    const [filePath, query] = line.split("?");
    const params = new URLSearchParams(query ?? "");
    const explicitTheme = params.get("theme") as Theme | null;
    const theme: Theme =
      explicitTheme ?? (filePath.includes("dark") ? "dark" : defaultTheme);
    return { path: filePath, theme };
  });
}

function readConfig(): ActionConfig {
  const githubUserName = core.getInput("github_user_name", { required: true });
  const githubToken = core.getInput("github_token", { required: true });
  const outputsRaw = core.getInput("outputs");
  const animationSpeed = Number(core.getInput("animation_speed") || "20");
  const pacmanSize = Number(core.getInput("pacman_size") || "14");
  const showTrail = (core.getInput("show_trail") || "false").toLowerCase() === "true";
  const trailColor = core.getInput("trail_color") || "#58a6ff";
  const backgroundColorInput = core.getInput("background_color");
  const loop = (core.getInput("loop") || "true").toLowerCase() === "true";
  const defaultTheme = (core.getInput("theme") || "light") as Theme;

  if (!Number.isFinite(animationSpeed) || animationSpeed <= 0) {
    throw new Error(`animation_speed must be a positive number, got "${animationSpeed}"`);
  }
  if (!Number.isFinite(pacmanSize) || pacmanSize <= 0) {
    throw new Error(`pacman_size must be a positive number, got "${pacmanSize}"`);
  }

  return {
    githubUserName,
    githubToken,
    outputs: parseOutputs(outputsRaw, defaultTheme),
    animationSpeed,
    pacmanSize,
    showTrail,
    trailColor,
    backgroundColor: backgroundColorInput || undefined,
    loop,
  };
}

async function run(): Promise<void> {
  try {
    const config = readConfig();

    core.info(`Fetching contribution data for ${config.githubUserName}...`);
    const grid = await fetchContributionGrid(config.githubUserName, config.githubToken);

    const totalCells = grid.reduce((sum, week) => sum + week.length, 0);
    const eatenCells = grid.reduce(
      (sum, week) => sum + week.filter((d) => d.level > 0).length,
      0
    );
    core.info(`Loaded ${totalCells} days (${eatenCells} with contributions).`);

    for (const output of config.outputs) {
      const svg = renderSvg(grid, output.theme, config);
      const outDir = path.dirname(output.path);
      if (outDir && outDir !== ".") {
        fs.mkdirSync(outDir, { recursive: true });
      }
      fs.writeFileSync(output.path, svg, "utf-8");
      core.info(`Wrote ${output.path} (theme: ${output.theme})`);
    }

    core.setOutput("output_paths", config.outputs.map((o) => o.path).join(","));
  } catch (err) {
    core.setFailed(err instanceof Error ? err.message : String(err));
  }
}

run();
