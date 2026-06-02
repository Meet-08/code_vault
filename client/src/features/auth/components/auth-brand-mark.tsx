import { cn } from "#/lib/utils";
import { Code2, LockKeyhole } from "lucide-react";
import type * as React from "react";

type AuthBrandMarkProps = React.HTMLAttributes<HTMLDivElement> & {
	size?: "sm" | "lg";
};

export function AuthBrandMark({
	className,
	size = "sm",
	...props
}: AuthBrandMarkProps) {
	const isLarge = size === "lg";

	return (
		<div
			role="img"
			aria-label="Code Vault"
			className={cn(
				"relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-accent-300/30 bg-[radial-gradient(circle_at_top,rgba(74,158,255,0.32),rgba(43,135,245,0.12)_42%,rgba(30,34,43,0.92)_100%)] text-accent-300 shadow-[0_14px_36px_rgba(43,135,245,0.2)]",
				isLarge ? "size-40 rounded-[2rem]" : "size-11",
				className,
			)}
			{...props}
		>
			<Code2 className={isLarge ? "size-18" : "size-6"} strokeWidth={1.9} />
			<LockKeyhole
				className={cn(
					"absolute rounded-full bg-bg-raised text-text-primary",
					isLarge
						? "right-9 bottom-9 size-9 p-1.5"
						: "right-1.5 bottom-1.5 size-4 p-0.5",
				)}
				strokeWidth={2}
			/>
		</div>
	);
}
