import { Button } from "#/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "#/components/ui/popover";
import { Separator } from "#/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "#/components/ui/sheet";
import { useCurrentUser, useLogout } from "#/features/auth/auth.query";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import { navigationItems } from "#/lib/constant";
import { Link, useMatchRoute, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { CircleUserRound, LogOut, Menu, MoveRight } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import type { ApiResponse } from "../..";

const Navbar = () => {
	const { queryClient } = getContext();
	const { data: user } = useCurrentUser();
	const logoutMutation = useLogout(queryClient);
	const matchRoute = useMatchRoute();
	const navigate = useNavigate();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
	const [profileMenuOpen, setProfileMenuOpen] = useState(false);
	const profileCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	const activeItem = navigationItems.find((item) =>
		matchRoute({
			to: item.to,
			fuzzy: !item.exact,
		}),
	);

	const handleLogout = async () => {
		try {
			await toast.promise(logoutMutation.mutateAsync(), {
				pending: "Logging out...",
				success: "Logged out successfully",
				error: {
					render({ data }) {
						const error = data as AxiosError<ApiResponse>;
						return error.response?.data?.message || "Logout failed";
					},
				},
			});
		} finally {
			navigate({ to: "/login", replace: true });
		}
	};

	const openProfileMenu = () => {
		if (profileCloseTimer.current) {
			clearTimeout(profileCloseTimer.current);
			profileCloseTimer.current = null;
		}

		setProfileMenuOpen(true);
	};

	const closeProfileMenu = () => {
		if (profileCloseTimer.current) {
			clearTimeout(profileCloseTimer.current);
		}

		profileCloseTimer.current = setTimeout(() => {
			setProfileMenuOpen(false);
			profileCloseTimer.current = null;
		}, 120);
	};

	return (
		<header className="sticky top-0 z-200 w-full border-b border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(10,11,13,0.94))] shadow-[0_1px_0_rgba(255,255,255,0.03),0_12px_40px_rgba(0,0,0,0.16)] backdrop-blur-xl">
			<div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(74,158,255,0.85),transparent)]" />
			<div className="flex h-16 w-full items-center gap-3 px-3 sm:px-6">
				<div className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3">
					<Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="shrink-0 rounded-full border border-border-base/80 bg-[radial-gradient(circle_at_top,rgba(43,135,245,0.14),rgba(30,34,43,0.95))] text-text-primary shadow-[0_10px_24px_rgba(0,0,0,0.22)] hover:border-border-strong hover:bg-bg-overlay hover:text-text-primary md:hidden"
								aria-label="Open navigation menu"
							>
								<Menu className="size-4" />
							</Button>
						</SheetTrigger>
						<SheetContent
							side="left"
							className="w-[min(84vw,18rem)] border-border-base bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(10,11,13,0.98))] p-0 text-text-primary shadow-[24px_0_80px_rgba(0,0,0,0.45)] sm:max-w-sm"
						>
							<SheetHeader className="border-b border-border-base/80 px-5 py-5 text-left">
								<div className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
									<img
										src="/logo.png"
										alt="Code Vault logo"
										className="size-4 rounded-md object-cover"
									/>
									Menu
								</div>
								<SheetTitle className="text-lg">Navigation</SheetTitle>
								<SheetDescription className="text-sm leading-relaxed text-text-secondary">
									Open snippets or collections from the menu.
								</SheetDescription>
							</SheetHeader>

							<div className="flex flex-col gap-2 px-3 py-4">
								{navigationItems.map((item) => (
									<Button
										key={item.to}
										asChild
										variant="ghost"
										className={`group h-auto justify-start rounded-2xl border px-4 py-4 text-left transition-all ${
											activeItem?.to === item.to
												? "border-accent-400/40 bg-[rgba(43,135,245,0.1)] shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
												: "border-transparent hover:border-border-base hover:bg-bg-subtle hover:shadow-[0_10px_28px_rgba(0,0,0,0.18)]"
										}`}
									>
										<Link to={item.to} onClick={() => setMobileMenuOpen(false)}>
											<span className="flex min-w-0 flex-1 flex-col items-start gap-1">
												<span className="flex items-center gap-2 text-sm font-medium text-text-primary">
													{item.label}
													{activeItem?.to === item.to ? (
														<span className="rounded-full border border-accent-400/30 bg-accent-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-accent-300">
															Current
														</span>
													) : null}
												</span>
												<span className="text-xs text-text-muted">
													{item.description}
												</span>
											</span>
											<MoveRight className="size-4 text-text-muted transition-transform group-hover:translate-x-0.5" />
										</Link>
									</Button>
								))}
							</div>
						</SheetContent>
					</Sheet>

					<Link
						to="/dashboard"
						className="flex min-w-0 items-center gap-2.5 sm:gap-3"
					>
						<img
							src="/logo.png"
							alt="Code Vault logo"
							className="size-9 rounded-xl object-cover ring-1 ring-border-base/80 shadow-[0_12px_24px_rgba(43,135,245,0.18)]"
						/>
						<span className="hidden min-w-0 flex-col leading-tight sm:flex">
							<span className="truncate text-[15px] font-semibold tracking-[-0.02em] text-text-primary">
								Code Vault
							</span>
						</span>
					</Link>
				</div>

				<nav className="hidden flex-1 items-center justify-center md:flex">
					<div className="inline-flex items-center gap-1 rounded-full border border-border-base/80 bg-bg-raised/80 p-1 shadow-[0_10px_30px_rgba(0,0,0,0.18)] backdrop-blur-sm">
						{navigationItems.map((item) => (
							<Button
								key={item.to}
								asChild
								variant="ghost"
								className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
									activeItem?.to === item.to
										? "bg-[rgba(43,135,245,0.12)] text-text-primary shadow-[0_0_0_1px_rgba(74,158,255,0.28)]"
										: "text-text-secondary hover:bg-bg-subtle hover:text-text-primary"
								}`}
							>
								<Link to={item.to}>{item.label}</Link>
							</Button>
						))}
					</div>
				</nav>

				<div className="mt-1 ml-auto flex shrink-0 items-center">
					<Popover open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="rounded-full border border-border-base/80 bg-bg-subtle/70 text-text-primary shadow-[0_10px_24px_rgba(0,0,0,0.18)] hover:border-border-strong hover:bg-bg-overlay hover:text-text-primary"
								aria-label="Open user menu"
								onMouseEnter={openProfileMenu}
								onMouseLeave={closeProfileMenu}
							>
								<CircleUserRound className="size-4" />
							</Button>
						</PopoverTrigger>
						<PopoverContent
							align="end"
							sideOffset={12}
							className="z-300 w-80 border-border-base bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] p-4 text-text-primary shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
							onMouseEnter={openProfileMenu}
							onMouseLeave={closeProfileMenu}
						>
							<div className="space-y-4">
								<div className="rounded-2xl border border-border-base bg-bg-subtle/60 p-4">
									<div className="text-[11px] uppercase tracking-[0.28em] text-text-muted">
										Signed in as
									</div>
									<div className="mt-3 flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-full border border-border-base bg-bg-raised text-sm font-semibold text-text-primary">
											{user?.name
												?.split(" ")
												.slice(0, 2)
												.map((part) => part.charAt(0))
												.join("")
												.toUpperCase() || "U"}
										</div>
										<div className="min-w-0">
											<div className="truncate text-sm font-medium text-text-primary">
												{user?.name || "Unknown user"}
											</div>
											<div className="truncate text-sm text-text-secondary">
												{user?.email || "No email available"}
											</div>
										</div>
									</div>
								</div>

								<Separator className="bg-border-base" />

								<Button
									variant="ghost"
									className="w-full justify-start rounded-xl px-3 text-text-primary hover:bg-danger-subtle hover:text-danger-text"
									onClick={handleLogout}
								>
									<LogOut className="size-4" />
									Logout
								</Button>
							</div>
						</PopoverContent>
					</Popover>
				</div>
			</div>
		</header>
	);
};

export default Navbar;
