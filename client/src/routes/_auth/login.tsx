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
import { useLogin } from "#/features/auth/auth.query";
import { loginSchema, type LoginData } from "#/features/auth/auth.schema";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../..";

export const Route = createFileRoute("/_auth/login")({
	component: RouteComponent,
});

function RouteComponent() {
	const { queryClient } = getContext();
	const navigate = useNavigate();
	const loginMutation = useLogin(queryClient);
	const form = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginData) => {
		await toast.promise(loginMutation.mutateAsync(data), {
			pending: "Logging in...",
			success: "Welcome back",
			error: {
				render({ data }) {
					const error = data as AxiosError<ApiResponse>;

					return error.response?.data?.message || "Login failed";
				},
			},
		});

		navigate({ to: "/" });
	};

	return (
		<Card className="overflow-hidden border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(14,16,20,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
			<CardHeader>
				<div className="mb-2 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
					Welcome back
				</div>
				<CardTitle className="text-[clamp(1.75rem,2.4vw,2.25rem)] leading-tight">
					Login
				</CardTitle>
				<CardDescription className="max-w-sm text-sm leading-relaxed text-text-secondary">
					Enter your email and password to continue.
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

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="password"
											placeholder="Enter your password"
											className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<Button
							type="submit"
							className="mt-3 h-11 w-full rounded-xl text-sm shadow-[0_12px_30px_rgba(43,135,245,0.28)]"
						>
							Login
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="justify-center border-t border-border-base/80 bg-bg-subtle/40 py-5 text-sm text-text-secondary">
				<div>
					Don&apos;t have an account?{" "}
					<Link to="/register" className="auth-text-link">
						Register
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
