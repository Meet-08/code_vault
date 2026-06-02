import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse, PageResponse } from "../../..";
import type {
  AdminDashboardStatsResponse,
  AdminUserListItem,
} from "./admin.type";

export const getDashboardStats = async () => {
  const res = await api.get<ApiResponse<AdminDashboardStatsResponse>>(
    "/admin/dashboard/stats",
  );
  return unwrap(res.data);
};

export const getUsers = async ({
  q,
  page,
  size,
}: {
  q?: string;
  page: number;
  size: number;
}) => {
  const res = await api.get<ApiResponse<PageResponse<AdminUserListItem>>>(
    "/admin/users",
    {
      params: {
        q,
        page,
        size,
      },
    },
  );
  return unwrap(res.data);
};
