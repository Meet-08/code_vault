import z from "zod";

export const loginSchema = z.object({
	email: z
		.email("Please enter a valid email address.")
		.min(1, "Email is required."),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long.")
		.max(10, "Password must be at most 10 characters long."),
});

export const registerSchema = z.object({
	name: z.string().min(1, "Name is required."),
	email: z
		.email("Please enter a valid email address.")
		.min(1, "Email is required."),
	password: z
		.string()
		.min(6, "Password must be at least 6 characters long.")
		.max(10, "Password must be at most 10 characters long."),
});

export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
