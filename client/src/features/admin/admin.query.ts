import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getDashboardStats, getUsers } from "./admin.api";
import { adminQueryKey } from "./constant";

export interface AdminUsersQueryParams {
  q?: string;
  page: number;
  size: number;
}

export const useAdminDashboardQuery = () => {
  return useQuery({
    queryKey: [adminQueryKey.dashboard],
    queryFn: getDashboardStats,
  });
};

export const useAdminUsersQuery = (params: AdminUsersQueryParams) => {
  return useQuery({
    queryKey: [adminQueryKey.users, params],
    queryFn: () =>
      getUsers({
        q: params.q,
        page: Math.max(params.page - 1, 0),
        size: params.size,
      }),
    placeholderData: keepPreviousData,
  });
};
