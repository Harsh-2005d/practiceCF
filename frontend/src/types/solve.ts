export type Solve = {
  contestId: number;
  index: string;
  problemName: string;
  link: string;
  solvedAt: string;
};

export type ReviseResponse = {
  success?: boolean;
  previousDay: Solve[];
  previousWeek: Solve[];
  previousMonth: Solve[];
};

export type TimeFilter = "yesterday" | "sevenDaysAgo" | "thirtyDaysAgo";

export type DashboardData = {
  yesterday: Solve[];
  sevenDaysAgo: Solve[];
  thirtyDaysAgo: Solve[];
};
