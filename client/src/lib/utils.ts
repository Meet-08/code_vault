import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function canAccessRoute(userRoles: string[], allowedRoles: string[]) {
	return userRoles.some((role) => allowedRoles.includes(role));
}
