import { api } from "./client";
import type { ReviseResponse } from "../types/solve";

export async function getRevisionSolves(): Promise<ReviseResponse> {
  const res = await api.get<ReviseResponse>("/api/revise");
  return res.data;
}
