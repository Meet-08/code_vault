import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse, User } from "../../..";
import type {
	AuthResponse,
	ForgotPasswordRequest,
	LoginRequest,
	RegisterRequest,
	ResetPasswordRequest,
} from "./auth.type";

export const login = async (data: LoginRequest) => {
	const res = await api.post<ApiResponse<AuthResponse>>("/auth/login", data);
	return unwrap(res.data);
};

export const register = async (data: RegisterRequest) => {
	const res = await api.post<ApiResponse<AuthResponse>>("/auth/register", data);
	return unwrap(res.data);
};

export const refreshToken = async () => {
	const res = await api.post<ApiResponse<AuthResponse>>("/auth/refresh");
	return unwrap(res.data);
};

export const getCurrentUser = async () => {
	const res = await api.get<ApiResponse<User>>("/users/me");
	return unwrap(res.data);
};

export const logout = async () => {
	await api.post("/auth/logout");
};

export const forgotPassword = async (data: ForgotPasswordRequest) => {
	const res = await api.post<ApiResponse<void>>("/auth/forgot-password", data);
	return unwrap(res.data);
};

export const resetPassword = async (data: ResetPasswordRequest) => {
	const res = await api.post<ApiResponse<void>>("/auth/reset-password", data);
	return unwrap(res.data);
};
