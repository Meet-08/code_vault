import { Loader } from "#/components/ui/loader";
import { useCurrentUser } from "#/features/auth/auth.query";
import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: user, isLoading } = useCurrentUser();

	if (isLoading) {
		return (
			<div className="flex min-h-dvh items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!user) {
		return <Navigate to="/login" />;
	}

	return <Navigate to="/dashboard" />;
}
