import { Button } from "#/components/ui/button";
import { Input } from "#/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

type PasswordInputProps = Omit<React.ComponentProps<typeof Input>, "type">;

export function PasswordInput({ className, ...props }: PasswordInputProps) {
	const [isVisible, setIsVisible] = useState(false);
	const Icon = isVisible ? EyeOff : Eye;

	return (
		<div className="relative">
			<Input
				{...props}
				type={isVisible ? "text" : "password"}
				className={className}
			/>
			<Button
				type="button"
				variant="ghost"
				size="icon-sm"
				className="absolute top-1/2 right-1.5 -translate-y-1/2 text-text-muted hover:bg-bg-muted hover:text-text-primary"
				aria-label={isVisible ? "Hide password" : "Show password"}
				onClick={() => setIsVisible((value) => !value)}
			>
				<Icon className="size-4" />
			</Button>
		</div>
	);
}
