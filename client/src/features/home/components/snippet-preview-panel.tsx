import { previewSnippets } from "#/lib/constant";

export function SnippetPreviewPanel() {
	return (
		<div className="rounded-3xl border border-border-base/80 bg-bg-raised/80 p-3 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
			<div className="rounded-2xl border border-border-base/80 bg-bg-base">
				<div className="flex items-center justify-between gap-3 border-b border-border-base/80 px-4 py-3">
					<div className="flex items-center gap-2">
						<span className="size-2.5 rounded-full bg-danger-text" />
						<span className="size-2.5 rounded-full bg-[#facc15]" />
						<span className="size-2.5 rounded-full bg-success-text" />
					</div>
					<div className="rounded-full border border-border-base bg-bg-subtle px-3 py-1 text-xs text-text-muted">
						vault/snippets
					</div>
				</div>

				<div className="grid gap-3 p-4">
					{previewSnippets.map((snippet) => (
						<article
							key={snippet.title}
							className="rounded-2xl border border-border-base/80 bg-bg-raised p-4"
						>
							<div className="flex items-start justify-between gap-3">
								<div>
									<div className="text-sm font-semibold text-text-primary">
										{snippet.title}
									</div>
									<div className="mt-1 text-xs text-text-muted">
										Saved snippet
									</div>
								</div>
								<span className="rounded-full border border-accent-400/30 bg-accent-400/10 px-2.5 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-accent-300">
									{snippet.label}
								</span>
							</div>
							<pre className="mt-4 overflow-hidden rounded-xl border border-border-base bg-[#08090b] p-3 font-mono text-xs leading-6 text-text-secondary">
								{snippet.lines.join("\n")}
							</pre>
						</article>
					))}
				</div>
			</div>
		</div>
	);
}
