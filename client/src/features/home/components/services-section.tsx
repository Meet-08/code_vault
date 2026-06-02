import { serviceHighlights } from "#/lib/constant";
import { CheckCircle2, LockKeyhole } from "lucide-react";

export function ServicesSection() {
	return (
		<section className="border-y border-border-base/80 bg-bg-raised/45">
			<div className="mx-auto grid w-full max-w-360 gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
				<div>
					<div className="inline-flex items-center gap-2 rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
						<LockKeyhole className="size-3.5 text-success-text" />
						Services
					</div>
					<h2 className="mt-4 text-3xl font-semibold leading-tight text-text-primary">
						Built around real app workflows.
					</h2>
					<p className="mt-4 text-base leading-8 text-text-secondary">
						Use the vault as a personal developer library: capture the code,
						attach context, organize it into collections, and return to the best
						examples through search, tags, and favorites.
					</p>
				</div>

				<div className="grid gap-3 sm:grid-cols-2">
					{serviceHighlights.map((service) => (
						<div
							key={service}
							className="flex items-start gap-3 rounded-2xl border border-border-base/80 bg-bg-base/70 p-4"
						>
							<CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success-text" />
							<span className="text-sm leading-6 text-text-secondary">
								{service}
							</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
