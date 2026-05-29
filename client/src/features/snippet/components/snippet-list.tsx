import { Card } from "#/components/ui/card";
import { SnippetCard } from "#/features/snippet/components/snippet-card";
import type { SnippetList } from "#/features/snippet/snippet.type";
import { Link } from "@tanstack/react-router";

interface SnippetListProps {
	snippets: SnippetList[];
}

function SnippetListView({ snippets }: SnippetListProps) {
	if (snippets.length === 0) {
		return (
			<Card className="border-dashed border-border-base/80 bg-bg-raised/70 px-6 py-10 text-center text-text-secondary">
				No snippets match these filters.
			</Card>
		);
	}

	return (
		<div className="snippet-grid items-stretch auto-rows-[1fr]">
			{snippets.map((snippet) => (
				<Link
					key={snippet.id}
					to="/snippets/$id"
					params={{ id: snippet.id.toString() }}
					search={(previous) => previous}
					className="flex h-full"
				>
					<SnippetCard snippet={snippet} />
				</Link>
			))}
		</div>
	);
}

export { SnippetListView };
