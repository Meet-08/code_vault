import { useAuthStore } from "#/features/auth/auth.store";
import type { AuthResponse } from "#/features/auth/auth.type";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const api = axios.create({
	baseURL: API_BASE_URL,
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

let isRefreshing = false;
let failedQueue: Array<{
	resolve: (token: string) => void;
	reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null) {
	failedQueue.forEach((p) => {
		if (error instanceof Error || token === null) {
			p.reject(error);
		} else {
			p.resolve(token);
		}
	});
	failedQueue = [];
}

api.interceptors.request.use((config) => {
	const token = useAuthStore.getState().accessToken;
	if (token) config.headers.Authorization = `Bearer ${token}`;
	return config;
});

api.interceptors.response.use(
	(res) => res,
	async (error) => {
		const original = error.config;

		if (error.response?.status !== 401 || original._retry) {
			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise<string>((resolve, reject) => {
				failedQueue.push({ resolve, reject });
			}).then((token) => {
				original.headers.Authorization = `Bearer ${token}`;
				return api(original);
			});
		}

		original._retry = true;
		isRefreshing = true;

		try {
			const { data } = await api.post<AuthResponse>("/refresh");
			useAuthStore.getState().setAccessToken(data.accessToken);
			processQueue(null, data.accessToken);
			original.headers.Authorization = `Bearer ${data.accessToken}`;
			return api(original);
		} catch (err) {
			processQueue(err, null);
			useAuthStore.getState().clearAuth();
			window.dispatchEvent(new Event("auth:expired"));
			return Promise.reject(err);
		} finally {
			isRefreshing = false;
		}
	},
);
