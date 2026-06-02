import type { LucideIcon } from "lucide-react";

interface WorkflowItemProps {
	icon: LucideIcon;
	label: string;
	text: string;
}

export function WorkflowItem({ icon: Icon, label, text }: WorkflowItemProps) {
	return (
		<div className="rounded-2xl border border-border-base/80 bg-bg-base/70 p-5">
			<Icon className="size-5 text-accent-300" />
			<div className="mt-4 text-base font-semibold text-text-primary">
				{label}
			</div>
			<p className="mt-2 text-sm leading-6 text-text-secondary">{text}</p>
		</div>
	);
}
