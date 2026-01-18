export type Solve = {
  contestId: number;
  index: string;
  link: string;
  solvedAt: string;
};

export type ReviseResponse = {
  error?: string;
  success?: boolean;
  previousDay: Solve[];
  previousWeek: Solve[];
  previousMonth: Solve[];
};

import { api } from "../axios";

export async function getRevisionSolves(): Promise<ReviseResponse> {
  try {
    const res = await api.get<ReviseResponse>("/api/revise");

    if (res.data.error) {
      throw new Error(res.data.error);
    }

    return res.data;
  } catch (err) {
    throw err;
  }
}

