import { productFeatures } from "#/lib/constant";
import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
	return (
		<section className="mx-auto w-full max-w-360 px-4 py-14 sm:px-6 sm:py-18">
			<div className="max-w-3xl">
				<p className="text-xs font-medium uppercase tracking-[0.28em] text-text-muted">
					Features
				</p>
				<h2 className="mt-3 text-[clamp(2rem,3vw,3rem)] font-semibold leading-tight text-text-primary">
					Everything implemented for a focused code vault.
				</h2>
				<p className="mt-4 text-base leading-8 text-text-secondary">
					The application combines a protected React workspace with Spring Boot
					services for snippets, collections, dashboard summaries, user
					accounts, signed-in sessions, and password recovery.
				</p>
			</div>

			<div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
				{productFeatures.map((feature) => (
					<FeatureCard key={feature.title} {...feature} />
				))}
			</div>
		</section>
	);
}
