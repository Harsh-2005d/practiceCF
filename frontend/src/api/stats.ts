import { api } from "./client";
import type { HistogramResponse, RefreshUserResponse } from "../types/stats";

export async function getHistogram(): Promise<number[]> {
  const res = await api.get<HistogramResponse>("/api/stats/histogram");
  return res.data.data;
}

export async function refreshUserRating(): Promise<RefreshUserResponse> {
  const res = await api.get<RefreshUserResponse>("/api/refresh/user");
  return res.data;
}
