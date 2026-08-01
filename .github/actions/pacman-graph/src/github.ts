import type { ContributionGrid, ContributionLevel } from "./types";

const GRAPHQL_ENDPOINT = "https://api.github.com/graphql";

const QUERY = `
  query ($userName: String!) {
    user(login: $userName) {
      contributionsCollection {
        contributionCalendar {
          weeks {
            contributionDays {
              date
              contributionCount
              contributionLevel
            }
          }
        }
      }
    }
  }
`;

interface GraphQLDay {
  date: string;
  contributionCount: number;
  contributionLevel:
    | "NONE"
    | "FIRST_QUARTILE"
    | "SECOND_QUARTILE"
    | "THIRD_QUARTILE"
    | "FOURTH_QUARTILE";
}

interface GraphQLResponse {
  data?: {
    user: {
      contributionsCollection: {
        contributionCalendar: {
          weeks: { contributionDays: GraphQLDay[] }[];
        };
      };
    } | null;
  };
  errors?: { message: string }[];
}

const LEVEL_MAP: Record<GraphQLDay["contributionLevel"], ContributionLevel> = {
  NONE: 0,
  FIRST_QUARTILE: 1,
  SECOND_QUARTILE: 2,
  THIRD_QUARTILE: 3,
  FOURTH_QUARTILE: 4,
};

/**
 * Fetches the last 12 months of contribution data for a user (this matches
 * what GitHub itself shows on a profile page contribution graph).
 */
export async function fetchContributionGrid(
  userName: string,
  token: string
): Promise<ContributionGrid> {
  const res = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "pacman-contribution-graph-action",
    },
    body: JSON.stringify({ query: QUERY, variables: { userName } }),
  });

  if (!res.ok) {
    throw new Error(
      `GitHub GraphQL request failed: ${res.status} ${res.statusText}`
    );
  }

  const json = (await res.json()) as GraphQLResponse;

  if (json.errors && json.errors.length > 0) {
    throw new Error(
      `GitHub GraphQL returned errors: ${json.errors.map((e) => e.message).join("; ")}`
    );
  }

  if (!json.data?.user) {
    throw new Error(
      `No user found for "${userName}" — check github_user_name and that the token can read that user's contributions.`
    );
  }

  const rawWeeks = json.data.user.contributionsCollection.contributionCalendar.weeks;

  const grid: ContributionGrid = rawWeeks.map((week, weekIndex) =>
    week.contributionDays.map((day, dayIndex) => ({
      date: day.date,
      count: day.contributionCount,
      level: LEVEL_MAP[day.contributionLevel],
      weekIndex,
      dayIndex,
    }))
  );

  return grid;
}
