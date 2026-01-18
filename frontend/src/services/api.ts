export type Solve = {
  contestId: number;
  index: string;
  link: string;
  solvedAt: string;
};

export type ReviseResponse = {
  previousDay: Solve[];
  previousWeek: Solve[];
  previousMonth: Solve[];
};

const BASE_URL = "http://localhost:3000/api";

function getToken(): string | null {
  return localStorage.getItem("token");
}

export async function getRevisionSolves(): Promise<ReviseResponse> {
  const token = getToken();

  if (!token) {
    throw new Error("Not authenticated");
  }

  const res = await fetch(`${BASE_URL}/revise`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch revision solves");
  }

  return res.json();
}
