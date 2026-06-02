export interface AdminUserResponse {
  id: number;
  name: string;
  email: string;
}

export interface AdminDashboardStatsResponse {
  userCount: number;
  snippetsCount: number;
  collectionCount: number;
}

export type AdminUserListItem = AdminUserResponse;
