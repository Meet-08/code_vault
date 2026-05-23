import type { AuthResponse } from "#/features/auth/auth.type";
import axios from "axios";

import type { ApiResponse } from "../..";

import { tokenStorage } from "./token-storage";

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
		if (error || token === null) {
			p.reject(error);
		} else {
			p.resolve(token);
		}
	});

	failedQueue = [];
}

api.interceptors.request.use((config) => {
	const token = tokenStorage.getAccessToken();

	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}

	return config;
});

api.interceptors.response.use(
	(response) => response,

	async (error) => {
		const original = error.config;

		const isServer = typeof window === "undefined";

		// SSR requests should NOT attempt
		// browser-style refresh flow.
		if (isServer) {
			return Promise.reject(error);
		}

		const isAuthRoute =
			original?.url?.includes("/login") ||
			original?.url?.includes("/register") ||
			original?.url?.includes("/refresh");

		const isUnauthorized = error.response?.status === 401;

		if (!isUnauthorized || original?._retry || isAuthRoute) {
			return Promise.reject(error);
		}

		if (isRefreshing) {
			return new Promise<string>((resolve, reject) => {
				failedQueue.push({
					resolve,
					reject,
				});
			}).then((token) => {
				original.headers.Authorization = `Bearer ${token}`;

				return api(original);
			});
		}

		original._retry = true;

		isRefreshing = true;

		try {
			const { data } =
				await api.post<ApiResponse<AuthResponse>>("/auth/refresh");

			const authData = data.data;

			tokenStorage.setAccessToken(authData.accessToken);

			processQueue(null, authData.accessToken);

			original.headers.Authorization = `Bearer ${authData.accessToken}`;

			return api(original);
		} catch (err) {
			processQueue(err, null);

			tokenStorage.clear();

			if (typeof window !== "undefined") {
				window.dispatchEvent(new Event("auth:expired"));
			}

			return Promise.reject(err);
		} finally {
			isRefreshing = false;
		}
	},
);
