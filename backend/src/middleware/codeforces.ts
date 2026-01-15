interface CodeforcesResponse<T> {
  status: "OK" | "FAILED";
  result: T;
  comment?: string;
}

interface CodeforcesUser {
  handle: string;
  rating?: number;
  rank?: string;
  maxRating?: number;
  maxRank?: string;
  contribution: number;
  friendOfCount: number;
  avatar: string;
  titlePhoto: string;
}

export async function getUserInfo(handle: string): Promise<CodeforcesUser> {
  const res = await fetch(
    `https://codeforces.com/api/user.info?handles=${handle}`
  );

  if (!res.ok) {
    throw new Error("Failed to reach Codeforces API");
  }

  const data = (await res.json()) as CodeforcesResponse<CodeforcesUser[]>;

  if (data.status !== "OK") {
    throw new Error(data.comment || "Invalid Codeforces handle");
  }

  return data.result[0];
}
