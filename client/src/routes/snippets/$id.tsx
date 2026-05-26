import { Button } from "#/components/ui/button";
import { Loader } from "#/components/ui/loader";
import { useSnippetByIdQuery } from "#/features/snippet/snippet.query";
import { cn } from "#/lib/utils";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowLeft,
	CalendarDays,
	Check,
	Code2,
	Copy,
	Star,
	Tags,
} from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const Route = createFileRoute("/snippets/$id")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const snippetQuery = useSnippetByIdQuery(id);
	const snippet = snippetQuery.data;
	const [hasCopied, setHasCopied] = useState(false);

	if (snippetQuery.isPending) {
		return (
			<main className="page grid min-h-[calc(100dvh-4rem)] place-items-center">
				<Loader
					title="Loading snippet"
					description="Fetching the saved code block"
				/>
			</main>
		);
	}

	if (snippetQuery.isError || !snippet) {
		return (
			<main className="page">
				<section className="rounded-lg border border-border-base bg-bg-raised p-6">
					<div className="mb-5 flex items-center justify-between gap-4">
						<div>
							<p className="text-xs font-semibold uppercase tracking-[0.18em] text-danger-text">
								Snippet unavailable
							</p>
							<h1 className="mt-2 text-heading-2">
								Unable to load this snippet.
							</h1>
						</div>

						<Button asChild variant="secondary">
							<Link to="/snippets" search={{ page: 1, size: 10 }}>
								<ArrowLeft className="size-4" />
								Back
							</Link>
						</Button>
					</div>

					<p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
						The snippet may have been removed, or the server could not return it
						right now.
					</p>
				</section>
			</main>
		);
	}

	const createdAt = new Intl.DateTimeFormat("en", {
		dateStyle: "medium",
		timeStyle: "short",
	}).format(new Date(snippet.createdAt));

	const copyCode = async () => {
		await navigator.clipboard.writeText(snippet.code);
		setHasCopied(true);
		window.setTimeout(() => setHasCopied(false), 1800);
	};

	return (
		<main className="page-wide space-y-6 py-6">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<Button asChild variant="ghost" className="w-fit">
					<Link to="/snippets" search={{ page: 1, size: 10 }}>
						<ArrowLeft className="size-4" />
						Back to snippets
					</Link>
				</Button>

				<div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-text-muted">
					<CalendarDays className="size-4" />
					{createdAt}
				</div>
			</div>

			<section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
				<div className="min-w-0 overflow-hidden rounded-lg border border-border-base bg-bg-raised shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
					<header className="border-b border-border-base bg-bg-subtle px-5 py-5 sm:px-6">
						<div className="mb-4 flex flex-wrap items-center gap-2">
							<span className="inline-flex items-center gap-2 rounded-md border border-border-strong bg-bg-overlay px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-accent-300">
								<Code2 className="size-3.5" />
								{snippet.language}
							</span>

							<button
								type="button"
								aria-pressed={snippet.isFavorite}
								className={cn(
									"inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors hover:border-accent-400/60 hover:text-accent-300",
									snippet.isFavorite
										? "border-accent-400/50 bg-[rgb(43_135_245/0.12)] text-accent-300"
										: "border-border-base bg-bg-overlay text-text-muted",
								)}
							>
								<Star
									className={cn(
										"size-3.5",
										snippet.isFavorite && "fill-current",
									)}
								/>
								{snippet.isFavorite ? "Favourited" : "Favourite"}
							</button>
						</div>

						<h1 className="text-heading-1">{snippet.title}</h1>
						<p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">
							{snippet.description}
						</p>
					</header>

					<div className="flex items-center justify-between gap-3 border-b border-border-base bg-[#0d1117] px-4 py-3">
						<div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
							<Code2 className="size-4" />
							Code
						</div>

						<Button
							type="button"
							variant="secondary"
							size="sm"
							className="border-border-base bg-bg-subtle"
							onClick={copyCode}
						>
							{hasCopied ? (
								<Check className="size-4 text-success-text" />
							) : (
								<Copy className="size-4" />
							)}
							{hasCopied ? "Copied" : "Copy"}
						</Button>
					</div>

					<div className="overflow-x-auto bg-[#0d1117]">
						<SyntaxHighlighter
							language={snippet.language.toLowerCase()}
							style={vscDarkPlus}
							showLineNumbers
							wrapLongLines
							customStyle={{
								margin: 0,
								minHeight: "28rem",
								padding: "1.25rem",
								background: "#0d1117",
								fontSize: "0.875rem",
								lineHeight: "1.75",
							}}
							codeTagProps={{
								className: "font-mono",
							}}
							lineNumberStyle={{
								color: "#5c6480",
								minWidth: "2.75em",
								paddingRight: "1.25em",
							}}
						>
							{snippet.code}
						</SyntaxHighlighter>
					</div>
				</div>

				<aside className="space-y-4">
					<section className="rounded-lg border border-border-base bg-bg-raised p-5">
						<h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
							<Tags className="size-4 text-accent-300" />
							Tags
						</h2>

						<div className="mt-4 flex flex-wrap gap-2">
							{snippet.tags.length ? (
								snippet.tags.map((tag) => (
									<span
										key={tag}
										className="rounded-md border border-border-base bg-bg-subtle px-2.5 py-1 text-xs font-medium text-text-secondary"
									>
										{tag}
									</span>
								))
							) : (
								<p className="text-sm text-text-muted">No tags added.</p>
							)}
						</div>
					</section>

					<section className="rounded-lg border border-border-base bg-bg-raised p-5">
						<h2 className="text-sm font-semibold text-text-primary">Details</h2>
						<dl className="mt-4 space-y-3 text-sm">
							<div className="flex items-center justify-between gap-4">
								<dt className="text-text-muted">Language</dt>
								<dd className="text-text-primary">
									{snippet.language.toUpperCase()}
								</dd>
							</div>
							<div className="flex items-center justify-between gap-4">
								<dt className="text-text-muted">Created</dt>
								<dd className="text-right text-text-primary">{createdAt}</dd>
							</div>
						</dl>
					</section>
				</aside>
			</section>
		</main>
	);
}
