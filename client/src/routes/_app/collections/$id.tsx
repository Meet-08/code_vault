import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Loader } from "#/components/ui/loader";
import {
	useAddSnippetToCollection,
	useCollectionQuery,
} from "#/features/collection/collection.query";
import StatCard from "#/features/collection/component/stat-card";
import { SnippetListView } from "#/features/snippet/components/snippet-list";
import { snippetTagOptions } from "#/features/snippet/constant";
import { useSnippetQuery } from "#/features/snippet/snippet.query";
import type { SnippetList } from "#/features/snippet/snippet.type";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import type { AxiosError } from "axios";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	BookOpen,
	Check,
	Code2,
	FolderOpen,
	Hash,
	Library,
	Plus,
	Search,
	Star,
	Tags,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

export const Route = createFileRoute("/_app/collections/$id")({
	component: RouteComponent,
});

const getTagLabel = (value: string) =>
	snippetTagOptions.find((option) => option.value === value)?.label ?? value;

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

function RouteComponent() {
	const { id } = Route.useParams();
	const collectionId = Number(id);
	const isValidId = Number.isInteger(collectionId) && collectionId > 0;
	const collectionQuery = useCollectionQuery(collectionId, isValidId);
	const collection = collectionQuery.data;
	const snippets = collection?.snippets ?? [];
	const favouriteCount = snippets.filter(
		(snippet) => snippet.isFavourite,
	).length;
	const tags = new Map<string, number>();

	for (const snippet of snippets) {
		for (const tag of snippet.tags) {
			tags.set(tag, (tags.get(tag) ?? 0) + 1);
		}
	}

	const tagEntries = Array.from(tags.entries()).sort((a, b) => b[1] - a[1]);

	if (!isValidId) {
		return (
			<main className="page">
				<section className="rounded-lg border border-border-base bg-bg-raised p-6">
					<div className="mb-5 flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-danger-text">
								Collection unavailable
							</p>
							<h1 className="mt-2 text-heading-2">Invalid collection id.</h1>
						</div>

						<Button asChild variant="secondary">
							<Link to="/collection">
								<ArrowLeft className="size-4" />
								Back
							</Link>
						</Button>
					</div>

					<p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
						The collection route needs a valid numeric id.
					</p>
				</section>
			</main>
		);
	}

	if (collectionQuery.isPending) {
		return (
			<main className="page grid min-h-[calc(100dvh-4rem)] place-items-center">
				<Loader
					title="Loading collection"
					description="Fetching collection details and snippets"
				/>
			</main>
		);
	}

	if (collectionQuery.isError || !collection) {
		return (
			<main className="page">
				<section className="rounded-lg border border-border-base bg-bg-raised p-6">
					<div className="mb-5 flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-danger-text">
								Collection unavailable
							</p>
							<h1 className="mt-2 text-heading-2">
								Unable to load this collection.
							</h1>
						</div>

						<Button asChild variant="secondary">
							<Link to="/collection">
								<ArrowLeft className="size-4" />
								Back
							</Link>
						</Button>
					</div>

					<p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
						The collection may have been removed, or the server could not return
						it right now.
					</p>
				</section>
			</main>
		);
	}

	return (
		<main className="page-wide space-y-6 py-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Button asChild variant="ghost" className="w-fit rounded-full">
					<Link to="/collection">
						<ArrowLeft className="size-4" />
						Back to collections
					</Link>
				</Button>

				<Button asChild variant="secondary" className="w-fit rounded-full px-4">
					<Link to="/snippets" search={{ page: 1, size: 10 }}>
						<BookOpen className="size-4" />
						Browse snippets
					</Link>
				</Button>
			</div>

			<section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
				<header className="border-b border-border-base/70 px-6 py-6 sm:px-8">
					<div className="mb-4 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
						<Library className="mr-2 size-3.5" />
						Collection
					</div>

					<div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-3xl">
							<h1 className="text-[clamp(2rem,3vw,3rem)] font-semibold leading-tight tracking-tight text-text-primary">
								{collection.name}
							</h1>
							<p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-[15px]">
								{collection.description}
							</p>
						</div>

						<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:min-w-104">
							<StatCard
								icon={FolderOpen}
								label="Snippets"
								value={snippets.length.toString()}
							/>
							<StatCard
								icon={Star}
								label="Favourites"
								value={favouriteCount.toString()}
							/>
							<StatCard
								icon={Tags}
								label="Tags"
								value={tagEntries.length.toString()}
							/>
						</div>
					</div>
				</header>

				<CardContent className="grid gap-6 px-6 py-6 xl:grid-cols-[minmax(0,1fr)_minmax(20rem,24rem)]">
					<section className="min-w-0 space-y-4">
						<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<h2 className="text-lg font-semibold text-text-primary">
									Collection snippets
								</h2>
								<p className="mt-1 text-sm text-text-secondary">
									{snippets.length} snippet{snippets.length === 1 ? "" : "s"} in
									this collection.
								</p>
							</div>
						</div>

						{snippets.length === 0 ? (
							<Card className="border-dashed border-border-base/80 bg-bg-raised/70 px-6 py-10 text-center">
								<div className="mx-auto flex size-11 items-center justify-center rounded-full border border-border-base bg-bg-subtle text-text-secondary">
									<FolderOpen className="size-5" />
								</div>
								<div className="mt-4 text-lg font-semibold text-text-primary">
									No snippets in this collection
								</div>
								<p className="mt-2 text-sm leading-relaxed text-text-secondary">
									Add snippets when creating a collection to see them here.
								</p>
							</Card>
						) : (
							<SnippetListView snippets={snippets} />
						)}
					</section>

					<aside className="min-w-0 space-y-4 xl:pt-[68px]">
						<AddSnippetToCollection
							collectionId={collectionId}
							collectionSnippets={snippets}
						/>

						<Card className="border-border-base/80 bg-bg-raised/70 p-0">
							<CardContent className="p-5">
								<h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
									<Tags className="size-4 text-accent-300" />
									Tags
								</h2>

								<div className="mt-4 space-y-2">
									{tagEntries.length ? (
										tagEntries.map(([tag, count]) => (
											<div
												key={tag}
												className="flex items-center justify-between gap-3 rounded-xl border border-border-base/80 bg-bg-subtle/60 px-3 py-2"
											>
												<span className="min-w-0 truncate text-sm text-text-secondary">
													{getTagLabel(tag)}
												</span>
												<span className="inline-flex items-center gap-1 rounded-full border border-border-base bg-bg-raised px-2 py-0.5 text-xs text-text-muted">
													<Hash className="size-3" />
													{count}
												</span>
											</div>
										))
									) : (
										<p className="text-sm text-text-muted">No tags to show.</p>
									)}
								</div>
							</CardContent>
						</Card>
					</aside>
				</CardContent>
			</section>
		</main>
	);
}
