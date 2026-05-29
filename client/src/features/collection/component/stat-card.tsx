import type { LucideIcon } from "lucide-react";

interface StatCardProps {
	icon: LucideIcon;
	label: string;
	value: string;
}

function StatCard({ icon: Icon, label, value }: StatCardProps) {
	return (
		<div className="rounded-2xl border border-border-base/80 bg-bg-subtle/55 p-4">
			<div className="flex items-center justify-between gap-3">
				<div className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
					{label}
				</div>
				<Icon className="size-4 text-accent-300" />
			</div>
			<div className="mt-3 text-2xl font-semibold leading-none text-text-primary">
				{value}
			</div>
		</div>
	);
}

export default StatCard;
