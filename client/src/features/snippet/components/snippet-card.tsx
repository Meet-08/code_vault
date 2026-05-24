import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
} from "#/components/ui/card";
import { snippetTagOptions } from "#/features/snippet/constant";
import type { SnippetList } from "#/features/snippet/snippet.type";
import { cn } from "#/lib/utils";
import { Code2, Star } from "lucide-react";

interface SnippetCardProps {
	snippet: SnippetList;
}

const getLabel = (
	value: string,
	options: readonly { label: string; value: string }[],
) => options.find((option) => option.value === value)?.label ?? value;

function SnippetCard({ snippet }: SnippetCardProps) {
	const tagLabels = snippet.tags.map((tag) => getLabel(tag, snippetTagOptions));

	return (
		<Card className="group overflow-hidden border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.22)] transition-all duration-150 hover:-translate-y-1 hover:border-border-strong hover:shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
			<CardHeader className="border-b border-border-base/70 bg-[radial-gradient(circle_at_top_right,rgba(43,135,245,0.08),transparent_40%)] px-5 py-4">
				<div className="flex items-start justify-between gap-4">
					<div className="space-y-2">
						<div className="inline-flex w-fit items-center gap-2 rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
							<Code2 className="size-3.5" />
							{snippet.language.toUpperCase()}
						</div>
						<div className="text-lg font-semibold tracking-tight text-text-primary">
							{snippet.title}
						</div>
					</div>

					<div className="flex size-9 items-center justify-center rounded-full border border-border-base bg-bg-subtle text-text-muted">
						<Star
							className={cn(
								"size-4",
								snippet.isFavorite && "fill-current text-accent-300",
							)}
						/>
					</div>
				</div>
			</CardHeader>

			<CardContent className="space-y-4 px-5 py-4">
				<CardDescription className="text-sm leading-relaxed text-text-secondary">
					{snippet.description}
				</CardDescription>

				<div className="flex flex-wrap gap-2">
					{tagLabels.map((tag) => (
						<span
							key={tag}
							className="inline-flex items-center rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-text-secondary"
						>
							{tag}
						</span>
					))}
				</div>
			</CardContent>
		</Card>
	);
}

export { SnippetCard };
