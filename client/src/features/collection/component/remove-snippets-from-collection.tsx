import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { useRemoveSnippetFromCollection } from "#/features/collection/collection.query";
import type { SnippetList } from "#/features/snippet/snippet.type";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import type { AxiosError } from "axios";
import { Check, Code2, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface RemoveSnippetsFromCollectionProps {
	collectionId: number;
	collectionSnippets: SnippetList[];
}

function RemoveSnippetsFromCollection({
	collectionId,
	collectionSnippets,
}: RemoveSnippetsFromCollectionProps) {
	const { queryClient } = getContext();
	const [selectedSnippetIds, setSelectedSnippetIds] = useState<number[]>([]);
	const removeSnippetMutation = useRemoveSnippetFromCollection(queryClient);

	const toggleSnippet = (snippetId: number) => {
		setSelectedSnippetIds((current) =>
			current.includes(snippetId)
				? current.filter((id) => id !== snippetId)
				: [...current, snippetId],
		);
	};

	const removeSelectedSnippets = () => {
		if (selectedSnippetIds.length === 0) {
			return;
		}

		removeSnippetMutation.mutate(
			{
				collectionId,
				snippetIds: selectedSnippetIds,
			},
			{
				onSuccess: () => {
					toast.success(
						selectedSnippetIds.length === 1
							? "Snippet removed from collection."
							: "Snippets removed from collection.",
					);
					setSelectedSnippetIds([]);
				},
				onError(error) {
					const axiosError = error as AxiosError<{ message?: string }>;
					toast.error(
						axiosError.response?.data.message ||
							"Failed to remove snippets from collection.",
					);
				},
			},
		);
	};

	return (
		<Card className="border-border-base/80 bg-bg-raised/70 p-0">
			<CardContent className="space-y-4 p-5">
				<div className="flex items-start justify-between gap-3">
					<div>
						<h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
							<Trash2 className="size-4 text-danger-text" />
							Remove snippets
						</h2>
						<p className="mt-1 text-xs leading-relaxed text-text-secondary">
							Select snippets to remove from this collection.
						</p>
					</div>

					{selectedSnippetIds.length > 0 ? (
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							aria-label="Clear selected snippets"
							onClick={() => setSelectedSnippetIds([])}
						>
							<X className="size-4" />
						</Button>
					) : null}
				</div>

				<div className="max-h-80 space-y-2 overflow-y-auto pr-1">
					{collectionSnippets.length > 0 ? (
						collectionSnippets.map((snippet) => {
							const isSelected = selectedSnippetIds.includes(snippet.id);

							return (
								<button
									key={snippet.id}
									type="button"
									aria-pressed={isSelected}
									onClick={() => toggleSnippet(snippet.id)}
									className="flex w-full items-start gap-3 rounded-xl border border-border-base/80 bg-bg-subtle/60 px-3 py-3 text-left transition hover:border-border-strong hover:bg-bg-subtle"
								>
									<span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border border-border-base bg-bg-raised text-text-muted">
										{isSelected ? (
											<Check className="size-3.5 text-danger-text" />
										) : null}
									</span>
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-medium text-text-primary">
											{snippet.title}
										</span>
										<span className="mt-1 flex items-center gap-1 text-xs text-text-muted">
											<Code2 className="size-3.5" />
											{snippet.language}
										</span>
									</span>
								</button>
							);
						})
					) : (
						<div className="rounded-xl border border-dashed border-border-base/80 bg-bg-subtle/40 px-3 py-6 text-center text-sm text-text-secondary">
							No snippets to remove.
						</div>
					)}
				</div>

				<Button
					type="button"
					variant="destructive"
					className="w-full rounded-full"
					disabled={
						selectedSnippetIds.length === 0 || removeSnippetMutation.isPending
					}
					onClick={removeSelectedSnippets}
				>
					<Trash2 className="size-4" />
					{removeSnippetMutation.isPending
						? "Removing..."
						: `Remove selected${
								selectedSnippetIds.length > 0
									? ` (${selectedSnippetIds.length})`
									: ""
							}`}
				</Button>
			</CardContent>
		</Card>
	);
}

export { RemoveSnippetsFromCollection };
