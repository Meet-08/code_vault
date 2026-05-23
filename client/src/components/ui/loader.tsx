import { LockKeyhole } from "lucide-react";

import { cn } from "#/lib/utils.ts";

type LoaderProps = {
	className?: string;
	title?: string;
	description?: string;
};

function Loader({
	className,
	title = "Loading your vault",
	description = "Checking session state",
}: LoaderProps) {
	return (
		<output
			aria-live="polite"
			aria-busy="true"
			className={cn("flex flex-col items-center gap-4 text-center", className)}
		>
			<div className="relative grid size-28 place-items-center">
				<div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(43,135,245,0.18),transparent_58%)] blur-xl" />
				<div className="absolute inset-0 rounded-full border border-border-strong/80 bg-bg-raised/85 shadow-[0_0_50px_rgba(0,0,0,0.35)]" />
				<div className="absolute inset-2 rounded-full border border-accent-400/25 border-dashed animate-spin [animation-duration:10s]" />
				<div className="absolute inset-5 rounded-full border border-accent-300/20 animate-spin [animation-direction:reverse] [animation-duration:16s]" />
				<div className="relative flex size-14 items-center justify-center rounded-2xl border border-border-strong bg-[linear-gradient(160deg,rgba(43,135,245,0.22),rgba(10,11,13,0.96))] text-accent-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_0_30px_rgba(43,135,245,0.25)]">
					<LockKeyhole className="size-6 animate-pulse" />
				</div>
				<span className="absolute left-1/2 top-4 size-2 -translate-x-1/2 rounded-full bg-accent-300 shadow-[0_0_18px_rgba(74,158,255,0.9)] animate-pulse" />
				<span className="absolute bottom-4 right-5 size-1.5 rounded-full bg-accent-400/70 shadow-[0_0_12px_rgba(43,135,245,0.7)] animate-pulse [animation-delay:200ms]" />
				<span className="absolute bottom-5 left-5 size-1.5 rounded-full bg-accent-300/70 shadow-[0_0_12px_rgba(74,158,255,0.7)] animate-pulse [animation-delay:400ms]" />
			</div>

			<div className="space-y-1">
				<p className="text-sm font-medium text-text-primary">{title}</p>
				<p className="text-caption">{description}</p>
			</div>
		</output>
	);
}

export { Loader };
