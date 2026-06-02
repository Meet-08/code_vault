import { useCurrentUser } from "#/features/auth/auth.query";
import { FeaturesSection } from "#/features/home/components/features-section";
import { HomeHeader } from "#/features/home/components/home-header";
import { HomeHeroSection } from "#/features/home/components/home-hero-section";
import { ServicesSection } from "#/features/home/components/services-section";
import { WorkflowSection } from "#/features/home/components/workflow-section";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "Code Vault - Secure Code Snippet Manager for Developers",
      },
      {
        name: "description",
        content:
          "Code Vault helps developers save, search, favorite, and organize code snippets into collections with a private workspace and dashboard analytics.",
      },
      {
        name: "keywords",
        content:
          "code snippet manager, developer snippet organizer, code vault, save code snippets, searchable snippets, snippet collections",
      },
      {
        property: "og:title",
        content: "Code Vault - Secure Code Snippet Manager",
      },
      {
        property: "og:description",
        content:
          "Store reusable code, filter by language and tags, build collections, and track your developer knowledge base from one focused workspace.",
      },
      {
        property: "og:type",
        content: "website",
      },
      {
        name: "twitter:card",
        content: "summary_large_image",
      },
    ],
    links: [
      {
        rel: "canonical",
        href: "/",
      },
    ],
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: user } = useCurrentUser();
  const primaryTarget = user ? "/dashboard" : "/register";
  const primaryLabel = user ? "Open dashboard" : "Create free account";

  return (
    <main className="min-h-dvh bg-bg-base text-text-secondary">
      <HomeHeader
        primaryLabel={primaryLabel}
        primaryTarget={primaryTarget}
        user={user}
      />
			<HomeHeroSection
				isAuthenticated={Boolean(user)}
				primaryLabel={primaryLabel}
				primaryTarget={primaryTarget}
			/>
      <FeaturesSection />
      <ServicesSection />
			<WorkflowSection
				isAuthenticated={Boolean(user)}
				primaryLabel={primaryLabel}
				primaryTarget={primaryTarget}
			/>
    </main>
  );
}
