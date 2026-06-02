import { Link, createFileRoute } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { Mail } from "lucide-react";
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
import { Input } from "#/components/ui/input";
import { useForgotPassword } from "#/features/auth/auth.query";
import { AuthBrandMark } from "#/features/auth/components/auth-brand-mark";
import {
	forgotPasswordSchema,
	type ForgotPasswordData,
} from "#/features/auth/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ApiResponse } from "../../..";

export const Route = createFileRoute("/_auth/forgot-password")({
	component: RouteComponent,
});

function RouteComponent() {
	const forgotPasswordMutation = useForgotPassword();
	const form = useForm<ForgotPasswordData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = async (data: ForgotPasswordData) => {
		await toast.promise(forgotPasswordMutation.mutateAsync(data), {
			pending: "Sending reset link...",
			success: "Reset link sent. Check your inbox.",
			error: {
				render({ data }) {
					const error = data as AxiosError<ApiResponse>;

					return error.response?.data?.message || "Could not send reset link";
				},
			},
		});
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
						<p className="text-sm text-text-secondary">Account recovery</p>
					</div>
				</div>
				<CardTitle className="text-[clamp(1.75rem,2.4vw,2.25rem)] leading-tight">
					Forgot password
				</CardTitle>
				<CardDescription className="max-w-sm text-sm leading-relaxed text-text-secondary">
					Enter your account email and we will send a password reset link.
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-2">
				<Form {...form}>
					<form
						className="auth-field-grid"
						onSubmit={form.handleSubmit(onSubmit)}
					>
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="email"
											placeholder="you@example.com"
											className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							disabled={forgotPasswordMutation.isPending}
							className="mt-3 h-11 w-full rounded-xl text-sm shadow-[0_12px_30px_rgba(43,135,245,0.28)]"
						>
							<Mail className="size-4" />
							Send reset link
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="justify-center border-t border-border-base/80 bg-bg-subtle/40 py-5 text-sm text-text-secondary">
				<Link to="/login" className="auth-text-link">
					Back to login
				</Link>
			</CardFooter>
		</Card>
	);
}
