export const DURATION_STATUSES = [
  'SIGNIFICANT',
  'INSIGNIFICANT',
  'MEANINGLESS',
] as const;

export const STATUSES = [
  'significant',
  'insignificant',
  'meaningless',
  'countChanged',
  'added',
  'removed',
] as const;

export interface MeasureRenderStats {
  /* average render duration measured by the test */
  meanDuration: number;
  /* standard deviation from average render duration measured by the test */
  stdevDuration: number;
  /* average render count measured by the test */
  meanCount: number;
  /* standard deviation from average render count measured by the test */
  stdevCount: number;
  /* number of test runs */
  runs: number;
  /*name of the component being tested*/
  name?: string;
}

/**
 * Defines output of one specific test
 */
export type Entry = {
  /* name parameter passed down to measureRender function */
  name: string;
} & MeasureRenderStats;

/**
 * Serialised result from entries found in files consumed by the script
 */

/**
 * Type of the performance measure change as compared to the baseline.txt file
 */
export type DurationStatStatusType = typeof DURATION_STATUSES[number];

/**
 * Base properties of Stats object shared between all subtypes
 */
type StatsBase = {
  name: string;
};

/**
 * Stats object for an added test, that does not exist in baseline.txt file
 */
export type StatsAdded = StatsBase & {
  current: Entry;
};

/**
 * Stats object for a removed test, that does not exist in current.txt file
 */
export type StatsRemoved = StatsBase & {
  baseline: Entry;
};

/**
 * Full Stats object as returned by test which was able to compare data between
 * a baseline.txt file Entry and its counterpart in the current.txt file
 */
type StatsFull = StatsAdded &
  StatsRemoved & {
    durationDiff: number;
    durationDiffPercent: number;
    countDiff: number;
    countDiffPercent: number;
  };

/**
 * Shorthands for different Stats objects depending on their `durationDiffStatus`
 */
type StatsSignificant = StatsFull & {
  durationDiffStatus: 'SIGNIFICANT';
};
type StatsInsignificant = StatsFull & {
  durationDiffStatus: 'INSIGNIFICANT';
};
type StatsMeaningless = StatsFull & {
  durationDiffStatus: 'MEANINGLESS';
};

export type RenderDurationStatsTypes =
  | StatsSignificant
  | StatsInsignificant
  | StatsMeaningless;

/**
 * Shorthand for either of the Stats object types
 */
export type Stats = StatsRemoved | StatsAdded | RenderDurationStatsTypes;

/**
 * Output data structure to be consumed by any of the outputting functions
 */

export type AnalyserOutput = {
  significant: StatsSignificant[];
  insignificant: StatsInsignificant[];
  meaningless: StatsMeaningless[];
  countChanged: RenderDurationStatsTypes[];
  added: StatsAdded[];
  removed: StatsRemoved[];
};

/**
 * Type guard functions
 */

export const isStatsSignificant = (data: Stats): data is StatsSignificant =>
  'durationDiffStatus' in data && data.durationDiffStatus === 'SIGNIFICANT';

export const isStatsInsignificant = (data: Stats): data is StatsInsignificant =>
  'durationDiffStatus' in data && data.durationDiffStatus === 'INSIGNIFICANT';

export const isStatsMeaningless = (data: Stats): data is StatsMeaningless =>
  'durationDiffStatus' in data && data.durationDiffStatus === 'MEANINGLESS';

export const isStatsAdded = (data: Stats): data is StatsAdded =>
  'current' in data && !('baseline' in data);

export const isStatsRemoved = (data: Stats): data is StatsRemoved =>
  'baseline' in data && !('current' in data);
export const isStatsRenderCountChanged = (
  data: Stats
): data is RenderDurationStatsTypes => {
  return (
    'current' in data &&
    'baseline' in data &&
    'countDiff' in data &&
    data.countDiff !== 0
  );
};
