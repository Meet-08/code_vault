import { useQuery } from "@tanstack/react-query";
import { dashboardKey } from "./constant";
import { getDashboardData } from "./dashboard.api";

export const useDashboardQuery = () => {
	return useQuery({
		queryKey: [dashboardKey.dashboard],
		queryFn: () => getDashboardData(),
	});
};
