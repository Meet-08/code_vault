import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Loader } from "#/components/ui/loader";
import { SnippetListView } from "#/features/snippet/components/snippet-list";
import { snippetTagOptions } from "#/features/snippet/constant";
import { useSnippetQuery } from "#/features/snippet/snippet.query";
import { snippetSearchSchema } from "#/features/snippet/snippet.schema";
import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useNavigate,
} from "@tanstack/react-router";
import { FolderPlus, Plus, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/_app/snippets")({
	component: RouteComponent,
	validateSearch: snippetSearchSchema,
});

function RouteComponent() {
	const location = useLocation();

	if (location.pathname !== "/snippets") {
		return <Outlet />;
	}

	return <SnippetsIndexPage />;
}

function SnippetsIndexPage() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const [searchInput, setSearchInput] = useState(search.q ?? "");
	const [languageInput, setLanguageInput] = useState(search.language ?? "");
	const snippetQuery = useSnippetQuery({
		q: search.q,
		language: search.language,
		tags: search.tags,
		page: search.page,
		size: search.size,
		sort: search.sort,
	});

	useEffect(() => {
		setSearchInput(search.q ?? "");
	}, [search.q]);

	useEffect(() => {
		setLanguageInput(search.language ?? "");
	}, [search.language]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const nextQuery = searchInput.trim() || undefined;
			const nextLanguage = languageInput.trim() || undefined;

			if (nextQuery === search.q && nextLanguage === search.language) {
				return;
			}

			navigate({
				to: "/snippets",
				replace: true,
				resetScroll: false,
				search: (previous) => ({
					...previous,
					q: nextQuery,
					language: nextLanguage,
					page: 1,
					size: previous.size ?? 10,
				}),
			});
		}, 500);

		return () => clearTimeout(timeout);
	}, [languageInput, navigate, search.language, search.q, searchInput]);

	const hasActiveFilters = Boolean(
		search.q?.trim() || search.language || (search.tags?.length ?? 0) > 0,
	);

	const clearFilters = () => {
		navigate({
			to: "/snippets",
			replace: true,
			resetScroll: false,
			search: (previous) => ({
				...previous,
				q: undefined,
				language: undefined,
				tags: undefined,
				page: 1,
				size: previous.size ?? 10,
			}),
		});
		setSearchInput("");
		setLanguageInput("");
	};

	const selectedTags = search.tags ?? [];

	const toggleTag = (tag: string) => {
		const nextTags = selectedTags.includes(tag)
			? selectedTags.filter((item) => item !== tag)
			: [...selectedTags, tag];

		navigate({
			to: "/snippets",
			replace: true,
			resetScroll: false,
			search: (previous) => ({
				...previous,
				tags: nextTags.length > 0 ? nextTags : undefined,
				page: 1,
				size: previous.size ?? 10,
			}),
		});
	};

	const snippets = snippetQuery.data?.content ?? [];
	const totalSnippets = snippetQuery.data?.totalElements ?? snippets.length;

	return (
		<div className="page-wide space-y-6">
			<section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
				<div className="flex flex-col gap-4 border-b border-border-base/70 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<h1 className="text-[clamp(1.75rem,2.4vw,2.4rem)] font-semibold leading-tight tracking-tight text-text-primary">
							Snippets
						</h1>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
							Search with plain text fields and keep the page focused on the
							list.
						</p>
					</div>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Button
							asChild
							variant="secondary"
							className="rounded-full border border-border-base/80 px-4"
						>
							<Link to="/collection">
								<FolderPlus className="size-4" />
								Create collection
							</Link>
						</Button>

						<Button asChild className="rounded-full px-4">
							<Link to="/snippets/new">
								<Plus className="size-4" />
								Create snippet
							</Link>
						</Button>
					</div>
				</div>

				<CardContent className="space-y-6 px-6 py-6">
					<div className="grid gap-4 lg:grid-cols-3">
						<div className="space-y-2">
							<label
								htmlFor="snippets-search"
								className="text-sm font-medium text-text-primary"
							>
								Search
							</label>
							<div className="relative">
								<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
								<Input
									id="snippets-search"
									value={searchInput}
									onChange={(event) => setSearchInput(event.target.value)}
									placeholder="Search snippets"
									className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 pl-10 pr-4"
								/>
							</div>
						</div>

						<div className="space-y-2">
							<label
								htmlFor="snippets-language"
								className="text-sm font-medium text-text-primary"
							>
								Language
							</label>
							<Input
								id="snippets-language"
								value={languageInput}
								onChange={(event) => setLanguageInput(event.target.value)}
								placeholder="typescript"
								className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
							/>
						</div>

						<div className="space-y-2">
							<div className="text-sm font-medium text-text-primary">Tags</div>
							<div className="flex flex-wrap gap-2">
								{snippetTagOptions.map((option) => {
									const isSelected = selectedTags.includes(option.value);

									return (
										<Button
											key={option.value}
											type="button"
											variant={isSelected ? "default" : "outline"}
											size="sm"
											className="rounded-full"
											onClick={() => toggleTag(option.value)}
										>
											{option.label}
										</Button>
									);
								})}
							</div>
						</div>
					</div>

					<div className="flex items-center justify-between gap-3 text-sm text-text-muted">
						<div>{totalSnippets} snippets match the current search state.</div>
						{hasActiveFilters ? (
							<Button variant="ghost" size="sm" onClick={clearFilters}>
								<X className="size-4" />
								Clear filters
							</Button>
						) : null}
					</div>
				</CardContent>
			</section>

			<section className="space-y-4">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<div className="text-lg font-semibold text-text-primary">
							Results
						</div>
					</div>
					<div className="text-sm text-text-muted">
						{searchInput
							? `Searching for "${searchInput}"`
							: "Type to start filtering"}
					</div>
				</div>

				{snippetQuery.isPending ? (
					<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-12">
						<Loader
							title="Loading snippets"
							description="Fetching snippets for the current filters"
							className="py-6"
						/>
					</Card>
				) : snippetQuery.isError ? (
					<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-10 text-center">
						<div className="text-lg font-semibold text-text-primary">
							Unable to load snippets
						</div>
						<p className="mt-2 text-sm leading-relaxed text-text-secondary">
							Check the snippets API and try again.
						</p>
					</Card>
				) : (
					<SnippetListView snippets={snippets} />
				)}
			</section>
		</div>
	);
}
