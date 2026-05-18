import { type QueryClient, useMutation } from "@tanstack/react-query";
import { login, logout, register } from "./auth.api";
import type { LoginRequest, RegisterRequest } from "./auth.type";
import { authKeys } from "./constant";

export const useLogin = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: (data: LoginRequest) => login(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: authKeys.me });
		},
	});
};

export const useRegister = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: (data: RegisterRequest) => register(data),
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: authKeys.me,
			});
		},
	});
};

export const useLogout = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: logout,
		onSuccess: async () => {
			queryClient.removeQueries({
				queryKey: authKeys.me,
			});
		},
	});
};
