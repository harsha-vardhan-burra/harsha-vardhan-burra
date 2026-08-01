import type { ContributionGrid, PathPoint } from "./types";

export const CELL_SIZE = 10;
export const CELL_GAP = 3;
export const CELL_PITCH = CELL_SIZE + CELL_GAP;
export const MARGIN = 20;

/**
 * Builds a single continuous traversal of every cell in the grid using a
 * boustrophedon ("snake") order: go down column 0, up column 1, down column
 * 2, etc. This visits every cell exactly once with zero backtracking, and
 * reads as an intentional left-to-right sweep rather than a random walk.
 */
export function buildTraversal(grid: ContributionGrid): PathPoint[] {
  const points: PathPoint[] = [];

  grid.forEach((week, weekIndex) => {
    const dayOrder =
      weekIndex % 2 === 0
        ? [...week].sort((a, b) => a.dayIndex - b.dayIndex)
        : [...week].sort((a, b) => b.dayIndex - a.dayIndex);

    for (const day of dayOrder) {
      points.push({
        x: MARGIN + weekIndex * CELL_PITCH + CELL_SIZE / 2,
        y: MARGIN + day.dayIndex * CELL_PITCH + CELL_SIZE / 2,
        day,
      });
    }
  });

  return points;
}

/** SVG path `d` attribute string connecting every point in order. */
export function pointsToPathD(points: PathPoint[]): string {
  return points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`)
    .join(" ");
}

/**
 * Fraction (0..1) of the total animation duration at which Pac-Man reaches
 * a given index in the traversal. Used to time each cell's "eaten" fade.
 */
export function arrivalFraction(index: number, total: number): number {
  if (total <= 1) return 0;
  return index / (total - 1);
}

export function gridDimensions(grid: ContributionGrid): { width: number; height: number } {
  const weeks = grid.length;
  const days = 7;
  return {
    width: MARGIN * 2 + weeks * CELL_PITCH - CELL_GAP,
    height: MARGIN * 2 + days * CELL_PITCH - CELL_GAP,
  };
}
