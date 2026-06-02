import { Loader } from "#/components/ui/loader";
import { useCurrentUser } from "#/features/auth/auth.query";
import {
  createFileRoute,
  Navigate,
  Outlet,
  useLocation,
} from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user, isLoading } = useCurrentUser();
  const pathName = useLocation({ select: (l) => l.pathname });
  const isRegister = pathName === "/register" || pathName === "/reset-password";
  const sidePanelCopy = getSidePanelCopy(pathName);

  if (isLoading) {
    return (
      <div className="auth-shell flex min-h-dvh items-center justify-center px-6">
        <Loader />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="auth-shell">
      <div
        className={`flex min-h-dvh flex-col lg:flex-row ${isRegister ? "lg:flex-row-reverse" : ""}`}
      >
        <section className="auth-panel hidden lg:flex lg:w-[46%]">
          <div className="auth-visual-card auth-page-enter">
            <div className="mx-auto flex w-full max-w-90 flex-col items-center text-center">
              <img
                src="/logo.png"
                alt="Code Vault"
                className="w-full max-w-70 drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
              />
              <div className="mt-8 space-y-4">
                <p className="text-xs uppercase tracking-[0.34em] text-text-muted">
                  Code Vault
                </p>
                <h2 className="text-4xl font-semibold leading-tight text-text-primary">
                  {sidePanelCopy.title}
                </h2>
                <p className="text-base leading-relaxed text-text-secondary">
                  {sidePanelCopy.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-panel w-full lg:w-[54%]">
          <div key={pathName} className="auth-panel-surface auth-page-enter">
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}

function getSidePanelCopy(pathName: string) {
  if (pathName === "/register") {
    return {
      title: "Build your next workspace.",
      description:
        "Create your account and keep every project in one focused place.",
    };
  }

  if (pathName === "/forgot-password" || pathName === "/reset-password") {
    return {
      title: "Recover access quickly.",
      description:
        "Reset your password and return to your saved snippets without losing your flow.",
    };
  }

  return {
    title: "Welcome back to the vault.",
    description: "Pick up where you left off and move back into your workflow.",
  };
}
