import { Loader } from "#/components/ui/loader";
import { useCurrentUser } from "#/features/auth/auth.query";
import { canAccessRoute } from "#/lib/utils";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading)
    return (
      <div className="auth-shell flex min-h-dvh items-center justify-center px-6">
        <Loader />
      </div>
    );

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!canAccessRoute(user?.roles || [], ["ADMIN"])) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
