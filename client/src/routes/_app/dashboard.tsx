import { Button } from "#/components/ui/button";
import { Card } from "#/components/ui/card";
import { Loader } from "#/components/ui/loader";
import { useDashboardQuery } from "#/features/dashboard/dashboard.query";
import { SnippetListView } from "#/features/snippet/components/snippet-list";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
	BookOpen,
	Code2,
	FolderKanban,
	Library,
	Plus,
	Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const dashboardQuery = useDashboardQuery();

	if (dashboardQuery.isPending) {
		return (
			<div className="page-wide">
				<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-16">
					<Loader
						title="Loading dashboard"
						description="Fetching your vault summary"
					/>
				</Card>
			</div>
		);
	}

	if (dashboardQuery.isError) {
		return (
			<div className="page-wide">
				<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-12 text-center">
					<div className="text-lg font-semibold text-text-primary">
						Unable to load dashboard
					</div>
					<p className="mt-2 text-sm leading-relaxed text-text-secondary">
						Check the dashboard API and try again.
					</p>
				</Card>
			</div>
		);
	}

	const dashboard = dashboardQuery.data;
	const recentSnippets = dashboard.recentSnippets ?? [];
	const languageTotal = dashboard.byLanguage.reduce(
		(total, item) => total + item.count,
		0,
	);
	const topLanguage = dashboard.byLanguage[0];

	return (
		<div className="page-wide space-y-6">
			<section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
				<div className="flex flex-col gap-4 border-b border-border-base/70 px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
					<div>
						<div className="mb-3 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
							<Library className="mr-2 size-3.5" />
							Dashboard
						</div>
						<h1 className="text-[clamp(1.75rem,2.4vw,2.4rem)] font-semibold leading-tight tracking-tight text-text-primary">
							Vault overview
						</h1>
						<p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
							A quick view of saved snippets, favourites, collections, and
							recent work.
						</p>
					</div>

					<div className="flex flex-col gap-2 sm:flex-row">
						<Button
							asChild
							variant="secondary"
							className="rounded-full border border-border-base/80 px-4"
						>
							<Link to="/collections">
								<FolderKanban className="size-4" />
								Collections
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

				<div className="grid gap-4 px-6 py-6 sm:grid-cols-2 xl:grid-cols-4">
					<DashboardStat
						icon={BookOpen}
						label="Snippets"
						value={dashboard.totalSnippets}
					/>
					<DashboardStat
						icon={Star}
						label="Favourites"
						value={dashboard.favouriteCount}
					/>
					<DashboardStat
						icon={FolderKanban}
						label="Collections"
						value={dashboard.totalCollections}
					/>
					<DashboardStat
						icon={Code2}
						label="Top language"
						value={topLanguage?.language ?? "None"}
						detail={topLanguage ? `${topLanguage.count} snippets` : undefined}
					/>
				</div>
			</section>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
				<section className="space-y-4">
					<div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<div className="text-lg font-semibold text-text-primary">
								Recent snippets
							</div>
							<p className="mt-1 text-sm text-text-secondary">
								{recentSnippets.length} recently saved snippet
								{recentSnippets.length === 1 ? "" : "s"}.
							</p>
						</div>
						<Button
							asChild
							variant="ghost"
							size="sm"
							className="rounded-full text-text-secondary"
						>
							<Link to="/snippets" search={{ page: 1, size: 10 }}>
								View all
							</Link>
						</Button>
					</div>

					<SnippetListView snippets={recentSnippets} />
				</section>

				<section className="space-y-4">
					<div>
						<div className="text-lg font-semibold text-text-primary">
							Language mix
						</div>
						<p className="mt-1 text-sm text-text-secondary">
							{dashboard.byLanguage.length} language
							{dashboard.byLanguage.length === 1 ? "" : "s"} represented.
						</p>
					</div>

					<Card className="border-border-base/80 bg-bg-raised/70 p-5">
						{dashboard.byLanguage.length === 0 ? (
							<div className="py-8 text-center text-sm text-text-secondary">
								No language data available yet.
							</div>
						) : (
							<div className="space-y-4">
								{dashboard.byLanguage.map((item) => {
									const percentage =
										languageTotal > 0
											? Math.round((item.count / languageTotal) * 100)
											: 0;

									return (
										<div key={item.language} className="space-y-2">
											<div className="flex items-center justify-between gap-3 text-sm">
												<div className="font-medium text-text-primary">
													{item.language}
												</div>
												<div className="text-text-muted">
													{item.count} ({percentage}%)
												</div>
											</div>
											<div className="h-2 overflow-hidden rounded-full bg-bg-subtle">
												<div
													className="h-full rounded-full bg-accent-400"
													style={{ width: `${percentage}%` }}
												/>
											</div>
										</div>
									);
								})}
							</div>
						)}
					</Card>
				</section>
			</div>
		</div>
	);
}

interface DashboardStatProps {
	icon: LucideIcon;
	label: string;
	value: number | string;
	detail?: string;
}

function DashboardStat({
	icon: Icon,
	label,
	value,
	detail,
}: DashboardStatProps) {
	return (
		<div className="rounded-2xl border border-border-base/80 bg-bg-subtle/55 p-4">
			<div className="flex items-center justify-between gap-3">
				<div className="text-xs font-medium uppercase tracking-[0.18em] text-text-muted">
					{label}
				</div>
				<Icon className="size-4 text-accent-300" />
			</div>
			<div className="mt-3 truncate text-2xl font-semibold leading-none text-text-primary">
				{value}
			</div>
			{detail ? (
				<div className="mt-2 text-xs text-text-muted">{detail}</div>
			) : null}
		</div>
	);
}
