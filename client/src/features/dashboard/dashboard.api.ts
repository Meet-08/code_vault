import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse } from "../../..";
import type { DashboardResponse } from "./dashboard.type";

export const getDashboardData = async () => {
	const res = await api.get<ApiResponse<DashboardResponse>>("/dashboard/stats");
	return unwrap(res.data);
};
