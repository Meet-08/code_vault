import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	const pathName = useLocation().pathname;
	return (
		<div>
			<Outlet />
		</div>
	);
}
