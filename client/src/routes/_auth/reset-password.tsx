import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { KeyRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

import { Button } from "#/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "#/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "#/components/ui/form";
import { AuthBrandMark } from "#/features/auth/components/auth-brand-mark";
import { PasswordInput } from "#/features/auth/components/password-input";
import { useResetPassword } from "#/features/auth/auth.query";
import {
	resetPasswordSchema,
	type ResetPasswordData,
} from "#/features/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiResponse } from "../../..";

export const Route = createFileRoute("/_auth/reset-password")({
	validateSearch: (search) => ({
		token: typeof search.token === "string" ? search.token : "",
	}),
	component: RouteComponent,
});

function RouteComponent() {
	const { token } = Route.useSearch();
	const navigate = useNavigate();
	const resetPasswordMutation = useResetPassword();
	const form = useForm<ResetPasswordData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			newPassword: "",
		},
	});

	const onSubmit = async (data: ResetPasswordData) => {
		if (!token) {
			toast.error("Password reset token is missing.");
			return;
		}

		await toast.promise(
			resetPasswordMutation.mutateAsync({
				token,
				newPassword: data.newPassword,
			}),
			{
				pending: "Resetting password...",
				success: "Password reset successfully. Please log in.",
				error: {
					render({ data }) {
						const error = data as AxiosError<ApiResponse>;

						return error.response?.data?.message || "Password reset failed";
					},
				},
			},
		);

		navigate({ to: "/login" });
	};

	return (
		<Card className="overflow-hidden border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(14,16,20,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
			<CardHeader>
				<div className="mb-3 flex items-center gap-3">
					<AuthBrandMark />
					<div>
						<p className="text-xs font-medium uppercase tracking-[0.24em] text-text-muted">
							Code Vault
						</p>
						<p className="text-sm text-text-secondary">New password setup</p>
					</div>
				</div>
				<CardTitle className="text-[clamp(1.75rem,2.4vw,2.25rem)] leading-tight">
					Reset password
				</CardTitle>
				<CardDescription className="max-w-sm text-sm leading-relaxed text-text-secondary">
					Choose a new password for your Code Vault account.
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-2">
				{!token ? (
					<div className="mb-4 rounded-xl border border-danger-base/50 bg-danger-subtle px-4 py-3 text-sm text-danger-text">
						This reset link is missing a token. Request a new password reset
						link to continue.
					</div>
				) : null}

				<Form {...form}>
					<form
						className="auth-field-grid"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel>New password</FormLabel>
									<FormControl>
										<PasswordInput
											{...field}
											placeholder="Create a new password"
											className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4 pr-11"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={resetPasswordMutation.isPending || !token}
							className="mt-3 h-11 w-full rounded-xl text-sm shadow-[0_12px_30px_rgba(43,135,245,0.28)]"
						>
							<KeyRound className="size-4" />
							Reset password
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="justify-center border-t border-border-base/80 bg-bg-subtle/40 py-5 text-sm text-text-secondary">
				<div>
					Remembered your password?{" "}
					<Link to="/login" className="auth-text-link">
						Login
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
