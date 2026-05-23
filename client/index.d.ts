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