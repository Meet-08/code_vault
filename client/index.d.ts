export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data: T
}

export interface User {
	id: number;
	email: string;
	name: string;
	roles: string[];
}

export interface PageResponse<T> {
	content: T[];
	page: number;
	size: number;
	totalElements: number;
	totalPages: number;
	last: boolean;
}