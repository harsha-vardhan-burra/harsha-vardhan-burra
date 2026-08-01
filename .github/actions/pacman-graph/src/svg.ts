import type { ActionConfig, ContributionGrid, Theme } from "./types";
import {
  CELL_SIZE,
  arrivalFraction,
  buildTraversal,
  gridDimensions,
  pointsToPathD,
} from "./path";

const PALETTE: Record<Theme, [string, string, string, string, string]> = {
  // index = contribution level 0..4
  light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"],
  dark: ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"],
};

const PACMAN_COLOR = "#ffd400";
const MOUTH_COLOR = "#000000";

function cellColor(level: 0 | 1 | 2 | 3 | 4, theme: Theme): string {
  return PALETTE[theme][level];
}

/** Builds the two mouth-wedge path shapes (closed / open), pointing toward +x. */
function mouthWedgeD(radius: number, halfAngleDeg: number): string {
  const rad = (halfAngleDeg * Math.PI) / 180;
  const x = radius * Math.cos(rad);
  const yTop = radius * Math.sin(rad);
  const yBottom = -yTop;
  return `M 0 0 L ${x.toFixed(2)} ${yTop.toFixed(2)} A ${radius} ${radius} 0 0 0 ${x.toFixed(2)} ${yBottom.toFixed(2)} Z`;
}

function pathLength(points: { x: number; y: number }[]): number {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
  }
  return total;
}

export function renderSvg(
  grid: ContributionGrid,
  theme: Theme,
  config: ActionConfig
): string {
  const points = buildTraversal(grid);
  const total = points.length;
  const pathD = pointsToPathD(points);
  const { width, height } = gridDimensions(grid);
  const dur = config.animationSpeed;
  const repeat = config.loop ? "indefinite" : "1";

  const cells = points
    .map((p, i) => {
      const day = p.day!;
      const fill = cellColor(day.level, theme);

      if (day.level === 0) {
        // nothing to "eat" — render as a static cell
        return `<rect x="${p.x - CELL_SIZE / 2}" y="${p.y - CELL_SIZE / 2}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${fill}" />`;
      }

      const t = arrivalFraction(i, total);
      const preT = Math.max(0, t - 0.0015).toFixed(4);
      const tStr = t.toFixed(4);

      return `<rect x="${p.x - CELL_SIZE / 2}" y="${p.y - CELL_SIZE / 2}" width="${CELL_SIZE}" height="${CELL_SIZE}" rx="2" fill="${fill}">
        <animate attributeName="opacity" values="1;1;0;0" keyTimes="0;${preT};${tStr};1" dur="${dur}s" repeatCount="${repeat}" />
      </rect>`;
    })
    .join("\n    ");

  const radius = config.pacmanSize / 2;
  const closedD = mouthWedgeD(radius, 2);
  const openD = mouthWedgeD(radius, 42);

  const trail = config.showTrail
    ? (() => {
        const len = pathLength(points);
        return `<path d="${pathD}" fill="none" stroke="${config.trailColor}" stroke-width="1.5" stroke-linecap="round"
          stroke-dasharray="${len}" stroke-dashoffset="${len}">
          <animate attributeName="stroke-dashoffset" from="${len}" to="0" dur="${dur}s" repeatCount="${repeat}" />
        </path>`;
      })()
    : "";

  const background = config.backgroundColor
    ? `<rect x="0" y="0" width="${width}" height="${height}" fill="${config.backgroundColor}" />`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  ${background}
  ${trail}
  <g>
    ${cells}
  </g>
  <g>
    <circle r="${radius}" fill="${PACMAN_COLOR}" />
    <path d="${closedD}" fill="${MOUTH_COLOR}">
      <animate attributeName="d" values="${closedD};${openD};${closedD}" dur="0.3s" repeatCount="indefinite" />
    </path>
    <animateMotion dur="${dur}s" repeatCount="${repeat}" rotate="auto" path="${pathD}" />
  </g>
</svg>`;
}
