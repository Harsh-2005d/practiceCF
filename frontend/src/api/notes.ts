import { api } from "./client";

export type ProblemNote = {
  problemId: string;
  content: string;
  updatedAt: string;
};

export async function getProblemNote(problemId: string): Promise<ProblemNote | null> {
  const response = await api.get<{ note: ProblemNote | null }>(
    `/api/problems/${encodeURIComponent(problemId)}/note`
  );
  return response.data.note;
}

export async function saveProblemNote(
  problemId: string,
  content: string
): Promise<ProblemNote> {
  const response = await api.put<{ note: ProblemNote }>(
    `/api/problems/${encodeURIComponent(problemId)}/note`,
    { content }
  );
  return response.data.note;
}

export async function deleteProblemNote(problemId: string): Promise<void> {
  await api.delete(`/api/problems/${encodeURIComponent(problemId)}/note`);
}
