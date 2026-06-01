import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Loader } from "#/components/ui/loader";
import { useAddSnippetToCollection } from "#/features/collection/collection.query";
import { useSnippetQuery } from "#/features/snippet/snippet.query";
import type { SnippetList } from "#/features/snippet/snippet.type";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import type { AxiosError } from "axios";
import { Check, Code2, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

interface AddSnippetToCollectionProps {
	collectionId: number;
	collectionSnippets: SnippetList[];
}

function AddSnippetToCollection({
	collectionId,
	collectionSnippets,
}: AddSnippetToCollectionProps) {
	const { queryClient } = getContext();
	const [search, setSearch] = useState("");
	const [selectedSnippetIds, setSelectedSnippetIds] = useState<number[]>([]);
	const addSnippetMutation = useAddSnippetToCollection(queryClient);
	const collectionSnippetIds = useMemo(
		() => new Set(collectionSnippets.map((snippet) => snippet.id)),
		[collectionSnippets],
	);
	const snippetQuery = useSnippetQuery({
		q: search.trim() || undefined,
		page: 1,
		size: 20,
	});
	const availableSnippets =
		snippetQuery.data?.content.filter(
			(snippet) => !collectionSnippetIds.has(snippet.id),
		) ?? [];

	const toggleSnippet = (snippetId: number) => {
		setSelectedSnippetIds((current) =>
			current.includes(snippetId)
				? current.filter((id) => id !== snippetId)
				: [...current, snippetId],
		);
	};

	const addSelectedSnippets = () => {
		if (selectedSnippetIds.length === 0) {
			return;
		}

		addSnippetMutation.mutate(
			{
				collectionId,
				snippetIds: selectedSnippetIds,
			},
			{
				onSuccess: () => {
					toast.success(
						selectedSnippetIds.length === 1
							? "Snippet added to collection."
							: "Snippets added to collection.",
					);
					setSelectedSnippetIds([]);
					setSearch("");
				},
				onError(error) {
					const axiosError = error as AxiosError<{ message?: string }>;
					toast.error(
						axiosError.response?.data.message ||
							"Failed to add snippets to collection.",
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
							<Plus className="size-4 text-accent-300" />
							Add snippets
						</h2>
						<p className="mt-1 text-xs leading-relaxed text-text-secondary">
							Search existing snippets and add them to this collection.
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

				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
					<Input
						value={search}
						onChange={(event) => setSearch(event.target.value)}
						placeholder="Search snippets"
						className="h-10 rounded-xl border-border-base/80 bg-bg-subtle/90 pl-10 pr-4"
					/>
				</div>

				<div className="max-h-80 space-y-2 overflow-y-auto pr-1">
					{snippetQuery.isPending ? (
						<Loader
							title="Loading snippets"
							description="Finding snippets to add"
							className="py-4"
						/>
					) : snippetQuery.isError ? (
						<div className="rounded-xl border border-border-base/80 bg-bg-subtle/60 px-3 py-4 text-sm text-text-secondary">
							Unable to load snippets.
						</div>
					) : availableSnippets.length > 0 ? (
						availableSnippets.map((snippet) => {
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
											<Check className="size-3.5 text-accent-300" />
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
							No available snippets found.
						</div>
					)}
				</div>

				<Button
					type="button"
					className="w-full rounded-full"
					disabled={
						selectedSnippetIds.length === 0 || addSnippetMutation.isPending
					}
					onClick={addSelectedSnippets}
				>
					<Plus className="size-4" />
					{addSnippetMutation.isPending
						? "Adding..."
						: `Add selected${
								selectedSnippetIds.length > 0
									? ` (${selectedSnippetIds.length})`
									: ""
							}`}
				</Button>
			</CardContent>
		</Card>
	);
}

export { AddSnippetToCollection };
