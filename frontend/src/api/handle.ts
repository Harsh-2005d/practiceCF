import { api } from "./client";

type SetHandleResponse = {
  success: boolean;
  handle: string;
};

export async function setHandle(handle: string): Promise<SetHandleResponse> {
  const res = await api.post<SetHandleResponse>("/api/handle", { handle });
  return res.data;
}
