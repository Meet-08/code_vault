import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";

export const Route = createFileRoute("/_auth")({
	component: RouteComponent,
});

function RouteComponent() {
	const pathName = useLocation({ select: (l) => l.pathname });
	const isRegister = pathName === "/register";
	return (
		<div className="auth-shell">
			<div
				className={`flex min-h-dvh flex-col lg:flex-row ${isRegister ? "lg:flex-row-reverse" : ""}`}
			>
				<section className="auth-panel hidden lg:flex lg:w-[46%]">
					<div className="auth-visual-card auth-page-enter">
						<div className="mx-auto flex w-full max-w-[360px] flex-col items-center text-center">
							<img
								src="/logo.png"
								alt="Code Vault"
								className="w-full max-w-[280px] drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)]"
							/>
							<div className="mt-8 space-y-4">
								<p className="text-xs uppercase tracking-[0.34em] text-text-muted">
									Code Vault
								</p>
								<h2 className="text-4xl font-semibold leading-tight text-text-primary">
									{isRegister
										? "Build your next workspace."
										: "Welcome back to the vault."}
								</h2>
								<p className="text-base leading-relaxed text-text-secondary">
									{isRegister
										? "Create your account and keep every project in one focused place."
										: "Pick up where you left off and move back into your workflow."}
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
