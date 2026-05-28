import { tokenStorage } from "#/api/token-storage";
import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { getCurrentUser, login, logout, register } from "./auth.api";
import type { LoginRequest, RegisterRequest } from "./auth.type";
import { authKeys } from "./constant";

export const useCurrentUser = () => {
	return useQuery({
		queryKey: authKeys.me,

		queryFn: async () => {
			const user = await getCurrentUser();

			return user;
		},
		retry: false,
		staleTime: 5 * 60 * 1000,
	});
};

export const useLogin = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: (data: LoginRequest) => login(data),

		onSuccess: async (data) => {
			tokenStorage.setAccessToken(data.accessToken);

			await queryClient.invalidateQueries({
				queryKey: authKeys.me,
			});
		},
	});
};

export const useRegister = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: (data: RegisterRequest) => register(data),

		onSuccess: async (data) => {
			tokenStorage.setAccessToken(data.accessToken);

			await queryClient.invalidateQueries({
				queryKey: authKeys.me,
			});
		},
	});
};

export const useLogout = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: logout,

		onMutate: async () => {
			await queryClient.cancelQueries({
				queryKey: authKeys.me,
			});

			tokenStorage.clear();
			queryClient.setQueryData(authKeys.me, null);
		},

		onSettled: () => {
			tokenStorage.clear();
			queryClient.setQueryData(authKeys.me, null);
		},
	});
};
