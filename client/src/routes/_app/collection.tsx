import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/collection")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="page">
			<h1 className="text-heading-1">Collection</h1>
			<p className="mt-3 max-w-2xl text-text-secondary">
				Organize grouped snippets and related assets in one place.
			</p>
		</div>
	);
}
