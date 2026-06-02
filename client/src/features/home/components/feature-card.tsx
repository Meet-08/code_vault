import type { FeatureItem } from "#/lib/constant";

export function FeatureCard({ icon: Icon, title, description }: FeatureItem) {
	return (
		<article className="rounded-2xl border border-border-base/80 bg-bg-raised/70 p-5 transition hover:border-border-strong hover:bg-bg-overlay/80">
			<div className="flex size-11 items-center justify-center rounded-2xl border border-border-base bg-bg-subtle text-accent-300">
				<Icon className="size-5" />
			</div>
			<h3 className="mt-5 text-lg font-semibold text-text-primary">{title}</h3>
			<p className="mt-3 text-sm leading-7 text-text-secondary">
				{description}
			</p>
		</article>
	);
}
