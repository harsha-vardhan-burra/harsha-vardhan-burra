export type ContributionLevel = 0 | 1 | 2 | 3 | 4;

export interface ContributionDay {
  date: string;
  count: number;
  level: ContributionLevel;
  /** index of the week this day belongs to, 0 = oldest week */
  weekIndex: number;
  /** 0 = Sunday .. 6 = Saturday */
  dayIndex: number;
}

/** weeks[weekIndex][dayIndex] */
export type ContributionGrid = ContributionDay[][];

export type Theme = "light" | "dark";

export interface OutputTarget {
  /** file path relative to the working directory, e.g. "dist/pacman-dark.svg" */
  path: string;
  theme: Theme;
}

export interface ActionConfig {
  githubUserName: string;
  githubToken: string;
  outputs: OutputTarget[];
  /** seconds for one full traversal of the graph */
  animationSpeed: number;
  /** pac-man diameter in px */
  pacmanSize: number;
  showTrail: boolean;
  trailColor: string;
  /** optional background fill; omitted = transparent */
  backgroundColor?: string;
  loop: boolean;
}

export interface PathPoint {
  x: number;
  y: number;
  day: ContributionDay | null; // null for padding cells that don't exist in the calendar
}
