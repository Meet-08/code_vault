import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";

interface HomeHeaderProps {
  primaryLabel: string;
  primaryTarget: "/dashboard" | "/register";
  user?: unknown;
}

export function HomeHeader({
  primaryLabel,
  primaryTarget,
  user,
}: HomeHeaderProps) {
  return (
    <header className="border-b border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(10,11,13,0.94))]">
      <nav
        className="mx-auto flex h-16 w-full max-w-360 items-center justify-between gap-4 px-4 sm:px-6"
        aria-label="Main navigation"
      >
        <Link to="/" className="flex min-w-0 items-center gap-3">
          <img
            src="/logo.png"
            alt="Code Vault logo"
            className="size-9 rounded-xl object-cover ring-1 ring-border-base/80"
          />
          <span className="truncate text-base font-semibold text-text-primary">
            Code Vault
          </span>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className="rounded-full px-4 text-text-secondary hover:text-text-primary"
          >
            {!user && <Link to="/login">Login</Link>}
          </Button>
          <Button asChild className="rounded-full px-4">
            <Link to={primaryTarget}>{primaryLabel}</Link>
          </Button>
        </div>
      </nav>
    </header>
  );
}
