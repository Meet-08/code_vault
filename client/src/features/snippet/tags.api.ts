import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse } from "../../..";

export const getUserTags = async () => {
  const res = await api.get<ApiResponse<string[]>>("/tags");
  return unwrap(res.data);
};
