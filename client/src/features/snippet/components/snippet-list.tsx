import { Card } from "#/components/ui/card";
import { SnippetCard } from "#/features/snippet/components/snippet-card";
import type { SnippetList } from "#/features/snippet/snippet.type";

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
		<div className="snippet-grid">
			{snippets.map((snippet) => (
				<SnippetCard key={snippet.id} snippet={snippet} />
			))}
		</div>
	);
}

export { SnippetListView };
