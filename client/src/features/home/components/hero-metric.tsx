interface HeroMetricProps {
	label: string;
	value: string;
}

export function HeroMetric({ value, label }: HeroMetricProps) {
	return (
		<div className="rounded-2xl border border-border-base/80 bg-bg-raised/70 p-4">
			<div className="text-xl font-semibold text-text-primary">{value}</div>
			<div className="mt-1 text-xs uppercase tracking-[0.18em] text-text-muted">
				{label}
			</div>
		</div>
	);
}
