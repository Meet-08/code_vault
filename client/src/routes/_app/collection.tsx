import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Label } from "#/components/ui/label";
import { Loader } from "#/components/ui/loader";
import {
	useCollectionsQuery,
	useCreateCollection,
} from "#/features/collection/collection.query";
import { useSnippetQuery } from "#/features/snippet/snippet.query";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import { cn } from "#/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import {
	BookOpen,
	Check,
	Code2,
	FolderPlus,
	Library,
	Plus,
	Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../..";

export const Route = createFileRoute("/_app/collection")({
	component: RouteComponent,
});

function RouteComponent() {
	const { queryClient } = getContext();
	const collectionQuery = useCollectionsQuery();
	const snippetsQuery = useSnippetQuery({ page: 1, size: 100 });
	const createCollectionMutation = useCreateCollection(queryClient);
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [snippetSearch, setSnippetSearch] = useState("");
	const [selectedSnippetIds, setSelectedSnippetIds] = useState<number[]>([]);

	const snippets = snippetsQuery.data?.content ?? [];
	const filteredSnippets = useMemo(() => {
		const query = snippetSearch.trim().toLowerCase();

		if (!query) {
			return snippets;
		}

		return snippets.filter((snippet) =>
			[snippet.title, snippet.description, snippet.language, ...snippet.tags]
				.join(" ")
				.toLowerCase()
				.includes(query),
		);
	}, [snippetSearch, snippets]);

	const collections = collectionQuery.data ?? [];
	const canCreate =
		name.trim().length > 0 &&
		description.trim().length > 0 &&
		selectedSnippetIds.length > 0 &&
		!createCollectionMutation.isPending;

	const toggleSnippet = (snippetId: number) => {
		setSelectedSnippetIds((current) =>
			current.includes(snippetId)
				? current.filter((id) => id !== snippetId)
				: [...current, snippetId],
		);
	};

	const resetForm = () => {
		setName("");
		setDescription("");
		setSnippetSearch("");
		setSelectedSnippetIds([]);
	};

	const onCreateCollection = async () => {
		if (!canCreate) {
			return;
		}

		await toast.promise(
			createCollectionMutation.mutateAsync({
				name: name.trim(),
				description: description.trim(),
				snippetsIds: selectedSnippetIds,
			}),
			{
				pending: "Creating collection...",
				success: "Collection created successfully.",
				error: {
					render({ data }) {
						const error = data as AxiosError<ApiResponse>;
						return (
							error.response?.data.message || "Failed to create collection."
						);
					},
				},
			},
		);

		resetForm();
	};

	return (
		<div className="page-wide space-y-6">
			<section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
				<div className="flex flex-col gap-4 border-b border-border-base/70 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="mb-3 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
							<Library className="mr-2 size-3.5" />
							Collections
						</div>
						<h1 className="text-[clamp(1.75rem,2.4vw,2.4rem)] font-semibold leading-tight tracking-tight text-text-primary">
							Organize snippets into collections
						</h1>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
							Create focused groups from existing snippets, then browse every
							collection from this page.
						</p>
					</div>

					<Button asChild variant="secondary" className="rounded-full px-4">
						<Link to="/snippets" search={{ page: 1, size: 10 }}>
							<BookOpen className="size-4" />
							Back to snippets
						</Link>
					</Button>
				</div>

				<CardContent className="grid gap-6 px-6 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
					<form
						className="space-y-6 rounded-2xl border border-border-base/80 bg-bg-subtle/45 p-5"
						onSubmit={(event) => {
							event.preventDefault();
							void onCreateCollection();
						}}
					>
						<div className="flex items-center justify-between gap-3">
							<div>
								<div className="text-lg font-semibold text-text-primary">
									Create collection
								</div>
								<p className="mt-1 text-sm text-text-secondary">
									Select one or more snippets before saving.
								</p>
							</div>
							<div className="rounded-full border border-border-base bg-bg-raised px-3 py-1 text-xs text-text-muted">
								{selectedSnippetIds.length} selected
							</div>
						</div>

						<div className="grid gap-4 sm:grid-cols-2">
							<div className="space-y-2">
								<Label htmlFor="collection-name">Name</Label>
								<Input
									id="collection-name"
									value={name}
									onChange={(event) => setName(event.target.value)}
									placeholder="React patterns"
									className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="snippet-search">Find snippets</Label>
								<div className="relative">
									<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
									<Input
										id="snippet-search"
										value={snippetSearch}
										onChange={(event) => setSnippetSearch(event.target.value)}
										placeholder="Search title, tag, language"
										className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 pl-10 pr-4"
									/>
								</div>
							</div>
						</div>

						<div className="space-y-2">
							<Label htmlFor="collection-description">Description</Label>
							<textarea
								id="collection-description"
								value={description}
								onChange={(event) => setDescription(event.target.value)}
								rows={3}
								placeholder="What belongs in this collection?"
								className="min-h-24 w-full rounded-xl border border-border-base/80 bg-bg-subtle/90 px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20"
							/>
						</div>

						<div className="space-y-3">
							<div className="flex items-center justify-between gap-3">
								<Label>Snippets</Label>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="rounded-full text-text-secondary"
									onClick={() => setSelectedSnippetIds([])}
									disabled={selectedSnippetIds.length === 0}
								>
									Clear
								</Button>
							</div>

							{snippetsQuery.isPending ? (
								<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-8">
									<Loader
										title="Loading snippets"
										description="Fetching snippets for selection"
									/>
								</Card>
							) : snippetsQuery.isError ? (
								<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-8 text-center">
									<div className="font-semibold text-text-primary">
										Unable to load snippets
									</div>
									<p className="mt-2 text-sm text-text-secondary">
										Check the snippets API and try again.
									</p>
								</Card>
							) : filteredSnippets.length === 0 ? (
								<Card className="border-dashed border-border-base/80 bg-bg-raised/70 px-6 py-8 text-center text-text-secondary">
									No snippets match the current search.
								</Card>
							) : (
								<div className="grid max-h-120 gap-3 overflow-y-auto pr-1">
									{filteredSnippets.map((snippet) => {
										const isSelected = selectedSnippetIds.includes(snippet.id);

										return (
											<button
												key={snippet.id}
												type="button"
												aria-pressed={isSelected}
												onClick={() => toggleSnippet(snippet.id)}
												className={cn(
													"grid w-full grid-cols-[auto_1fr] gap-3 rounded-2xl border border-border-base/80 bg-bg-raised/70 p-4 text-left transition hover:border-border-strong hover:bg-bg-overlay/80",
													isSelected &&
														"border-accent-400/60 bg-[rgb(43_135_245/0.12)]",
												)}
											>
												<span
													className={cn(
														"mt-0.5 flex size-5 items-center justify-center rounded-md border border-border-base bg-bg-subtle text-transparent",
														isSelected &&
															"border-accent-400 bg-accent-400 text-white",
													)}
												>
													<Check className="size-3.5" />
												</span>
												<span className="min-w-0">
													<span className="flex flex-wrap items-center gap-2">
														<span className="font-medium text-text-primary">
															{snippet.title}
														</span>
														<span className="inline-flex items-center rounded-full border border-border-base bg-bg-subtle px-2 py-0.5 text-[11px] uppercase tracking-[0.18em] text-text-muted">
															<Code2 className="mr-1 size-3" />
															{snippet.language}
														</span>
													</span>
													<span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-text-secondary">
														{snippet.description}
													</span>
												</span>
											</button>
										);
									})}
								</div>
							)}
						</div>

						<Button
							type="submit"
							disabled={!canCreate}
							className="h-11 rounded-full px-5 shadow-[0_12px_30px_rgba(43,135,245,0.28)]"
						>
							<FolderPlus className="size-4" />
							Create collection
						</Button>
					</form>

					<section className="space-y-4">
						<div className="flex items-center justify-between gap-3">
							<div>
								<div className="text-lg font-semibold text-text-primary">
									Your collections
								</div>
								<p className="mt-1 text-sm text-text-secondary">
									{collections.length} saved collection
									{collections.length === 1 ? "" : "s"}.
								</p>
							</div>
						</div>

						{collectionQuery.isPending ? (
							<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-12">
								<Loader
									title="Loading collections"
									description="Fetching your saved collections"
								/>
							</Card>
						) : collectionQuery.isError ? (
							<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-10 text-center">
								<div className="text-lg font-semibold text-text-primary">
									Unable to load collections
								</div>
								<p className="mt-2 text-sm leading-relaxed text-text-secondary">
									Check the collections API and try again.
								</p>
							</Card>
						) : collections.length === 0 ? (
							<Card className="border-dashed border-border-base/80 bg-bg-raised/70 px-6 py-10 text-center">
								<div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border-base bg-bg-subtle text-text-secondary">
									<Plus className="size-5" />
								</div>
								<div className="mt-4 text-lg font-semibold text-text-primary">
									No collections yet
								</div>
								<p className="mt-2 text-sm leading-relaxed text-text-secondary">
									Create the first collection by selecting snippets from the
									form.
								</p>
							</Card>
						) : (
							<div className="grid gap-3">
								{collections.map((collection) => (
									<Link
										key={collection.id}
										to="/collections/$id"
										params={{ id: collection.id.toString() }}
										className="block"
									>
										<Card className="border-border-base/80 bg-bg-raised/70 p-0 transition hover:border-border-strong hover:bg-bg-overlay/80">
											<CardContent className="p-5">
												<div className="flex items-start justify-between gap-4">
													<div className="min-w-0">
														<div className="text-base font-semibold text-text-primary">
															{collection.name}
														</div>
														<p className="mt-2 text-sm leading-relaxed text-text-secondary">
															{collection.description}
														</p>
													</div>
													<div className="shrink-0 rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-xs font-medium text-text-secondary">
														{collection.snippetCount} snippet
														{collection.snippetCount === 1 ? "" : "s"}
													</div>
												</div>
											</CardContent>
										</Card>
									</Link>
								))}
							</div>
						)}
					</section>
				</CardContent>
			</section>
		</div>
	);
}
