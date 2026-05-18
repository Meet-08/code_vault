import type { ApiResponse } from "../..";

export const unwrap = <T>(response: ApiResponse<T>): T => {
	if (!response.success) {
		throw new Error(response.message);
	}
	return response.data;
};
