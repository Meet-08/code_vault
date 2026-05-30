import Navbar from "#/components/Navbar";
import { Loader } from "#/components/ui/loader";
import { useCurrentUser } from "#/features/auth/auth.query";
import { canAccessRoute } from "#/lib/utils";
import {
	createFileRoute,
	Navigate,
	Outlet,
	useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data: user, isLoading } = useCurrentUser();
	const pathname = useLocation({ select: (l) => l.pathname });
	const hideNavbar =
		pathname.startsWith("/snippets/") || pathname.startsWith("/collections/");

	if (isLoading)
		return (
			<div className="auth-shell flex min-h-dvh items-center justify-center px-6">
				<Loader />
			</div>
		);

	if (!user) {
		return <Navigate to="/login" />;
	}

	if (!canAccessRoute(user?.roles || [], ["USER"])) {
		return <Navigate to="/" />;
	}

	return (
		<>
			{!hideNavbar && <Navbar />}
			<Outlet />
		</>
	);
}
