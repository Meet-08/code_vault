import { Button } from "#/components/ui/button";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, KeyRound } from "lucide-react";
import { HeroMetric } from "./hero-metric";
import { SnippetPreviewPanel } from "./snippet-preview-panel";

interface HomeHeroSectionProps {
	isAuthenticated: boolean;
	primaryLabel: string;
	primaryTarget: "/dashboard" | "/register";
}

export function HomeHeroSection({
	isAuthenticated,
	primaryLabel,
	primaryTarget,
}: HomeHeroSectionProps) {
  return (
    <section className="border-b border-border-base/80 bg-[linear-gradient(180deg,#0f1117_0%,#0a0b0d_100%)]">
      <div className="mx-auto grid w-full max-w-360 gap-10 px-4 py-14 sm:px-6 sm:py-18 lg:grid-cols-[minmax(0,1.02fr)_minmax(22rem,0.98fr)] lg:items-center">
        <div>
          <h1 className="mt-6 max-w-4xl text-[clamp(2.5rem,5vw,5rem)] font-semibold leading-[1.02] tracking-tight text-text-primary">
            Save code snippets, find them fast, and keep your workflow
            organized.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-text-secondary sm:text-lg">
            Code Vault is a secure snippet manager for developers who want a
            private, searchable library of reusable code, project notes,
            favorites, and curated collections.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-6 shadow-[0_12px_30px_rgba(43,135,245,0.28)]"
            >
              <Link to={primaryTarget}>
                {primaryLabel}
                <CheckCircle2 className="size-4" />
              </Link>
            </Button>
						{!isAuthenticated ? (
							<Button
								asChild
								size="lg"
								variant="secondary"
								className="h-12 rounded-full border border-border-base/80 px-6"
							>
								<Link to="/login">
									<KeyRound className="size-4" />
									Sign in
								</Link>
							</Button>
						) : null}
					</div>

          <div className="mt-10 grid gap-3 text-sm text-text-secondary sm:grid-cols-3">
            <HeroMetric value="Manage" label="Snippet library" />
            <HeroMetric value="Tags" label="Language filters" />
            <HeroMetric value="Account" label="Private workspace" />
          </div>
        </div>

        <SnippetPreviewPanel />
      </div>
    </section>
  );
}
