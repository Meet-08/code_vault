import { Link, createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

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

export const Route = createFileRoute("/_auth/register")({
	component: RouteComponent,
});

function RouteComponent() {
	const form = useForm({
		defaultValues: {
			name: "",
			email: "",
			password: "",
		},
	});

	return (
		<Card className="overflow-hidden border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(14,16,20,0.98))] shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
			<CardHeader>
				<div className="mb-2 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
					Start here
				</div>
				<CardTitle className="text-[clamp(1.75rem,2.4vw,2.25rem)] leading-tight">
					Register
				</CardTitle>
				<CardDescription className="max-w-sm text-sm leading-relaxed text-text-secondary">
					Create your account with your name, email, and password.
				</CardDescription>
			</CardHeader>

			<CardContent className="pt-2">
				<Form {...form}>
					<form
						className="auth-field-grid"
						onSubmit={form.handleSubmit(() => undefined)}
					>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem className="gap-2">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											{...field}
											type="text"
											placeholder="Your name"
											className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

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
											placeholder="Create a password"
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
							Create account
						</Button>
					</form>
				</Form>
			</CardContent>

			<CardFooter className="justify-center border-t border-border-base/80 bg-bg-subtle/40 py-5 text-sm text-text-secondary">
				<div>
					Already have an account?{" "}
					<Link to="/login" className="auth-text-link">
						Login
					</Link>
				</div>
			</CardFooter>
		</Card>
	);
}
