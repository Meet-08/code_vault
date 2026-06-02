import { Button } from "#/components/ui/button";
import { Card, CardContent } from "#/components/ui/card";
import { Input } from "#/components/ui/input";
import { Loader } from "#/components/ui/loader";
import { useAdminUsersQuery } from "#/features/admin/admin.query";
import { adminUsersSearchSchema } from "#/features/admin/admin.schema";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
	Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export const Route = createFileRoute("/_app/admin/users")({
	component: RouteComponent,
	validateSearch: adminUsersSearchSchema,
});

function RouteComponent() {
	const navigate = useNavigate();
	const search = Route.useSearch();
	const [queryInput, setQueryInput] = useState(search.q ?? "");
	const usersQuery = useAdminUsersQuery({
		q: search.q,
		page: search.page,
		size: search.size,
	});

	useEffect(() => {
		setQueryInput(search.q ?? "");
	}, [search.q]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			const nextQuery = queryInput.trim() || undefined;

			if (nextQuery === search.q) {
				return;
			}

			navigate({
				to: "/admin/users",
				replace: true,
				resetScroll: false,
				search: (previous) => ({
					...previous,
					q: nextQuery,
					page: 1,
					size: previous.size ?? 10,
				}),
			});
		}, 400);

		return () => clearTimeout(timeout);
	}, [navigate, queryInput, search.q]);

	const usersPage = usersQuery.data;
	const users = usersPage?.content ?? [];
	const totalPages = usersPage?.totalPages ?? 1;
	const currentPage = search.page;
	const pageSize = search.size;
	const pageNumbers = useMemo(() => {
		const windowSize = 2;
		const start = Math.max(1, currentPage - windowSize);
		const end = Math.min(totalPages, currentPage + windowSize);
		const pages = [];

		for (let page = start; page <= end; page += 1) {
			pages.push(page);
		}

		return pages;
	}, [currentPage, totalPages]);

	const goToPage = (page: number) => {
		navigate({
			to: "/admin/users",
			replace: true,
			resetScroll: false,
			search: (previous) => ({
				...previous,
				page,
				size: previous.size ?? 10,
			}),
		});
	};

	const updatePageSize = (size: number) => {
		navigate({
			to: "/admin/users",
			replace: true,
			resetScroll: false,
			search: (previous) => ({
				...previous,
				page: 1,
				size,
			}),
		});
	};

	if (usersQuery.isPending) {
		return (
			<div className="page-wide">
				<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-16">
					<Loader
						title="Loading admin users"
						description="Fetching the current page of users"
					/>
				</Card>
			</div>
		);
	}

	if (usersQuery.isError) {
		return (
			<div className="page-wide">
				<Card className="border-border-base/80 bg-bg-raised/70 px-6 py-12 text-center">
					<div className="text-lg font-semibold text-text-primary">
						Unable to load users
					</div>
					<p className="mt-2 text-sm leading-relaxed text-text-secondary">
						Check the admin users endpoint and try again.
					</p>
				</Card>
			</div>
		);
	}

	return (
		<div className="page-wide space-y-6">
			<section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
				<div className="border-b border-border-base/70 px-6 py-6">
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div>
							<div className="mb-3 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
								<Users className="mr-2 size-3.5" />
								Admin users
							</div>
							<h1 className="text-[clamp(1.75rem,2.4vw,2.4rem)] font-semibold leading-tight tracking-tight text-text-primary">
								User directory
							</h1>
							<p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
								Search users and move through pages without leaving the URL.
							</p>
						</div>

						<div className="flex flex-col gap-3 sm:flex-row">
							<div className="flex flex-col gap-2">
								<label
									htmlFor="admin-user-query"
									className="text-sm font-medium text-text-primary"
								>
									Search
								</label>
								<div className="relative w-full sm:w-80">
									<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-text-muted" />
									<Input
										id="admin-user-query"
										value={queryInput}
										onChange={(event) => setQueryInput(event.target.value)}
										placeholder="Search name or email"
										className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 pl-10 pr-4"
									/>
								</div>
							</div>

							<div className="flex flex-col gap-2">
								<label
									htmlFor="admin-user-page-size"
									className="text-sm font-medium text-text-primary"
								>
									Page size
								</label>
								<select
									id="admin-user-page-size"
									value={pageSize}
									onChange={(event) =>
										updatePageSize(Number(event.target.value))
									}
									className="h-11 w-full rounded-xl border border-border-base/80 bg-bg-subtle/90 px-4 text-sm text-text-primary outline-none transition-colors focus:border-accent-400/60 sm:w-40"
								>
									{[10, 20, 50, 100].map((value) => (
										<option key={value} value={value}>
											{value} per page
										</option>
									))}
								</select>
							</div>
						</div>
					</div>
				</div>

				<CardContent className="space-y-6 px-6 py-6">
					<div className="flex items-center justify-between gap-3 text-sm text-text-muted">
						<div>
							Showing {users.length} user{users.length === 1 ? "" : "s"} on page{" "}
							{currentPage} of {totalPages}
						</div>
						<div>{usersPage?.totalElements ?? 0} total users</div>
					</div>

					<div className="overflow-hidden rounded-2xl border border-border-base/80 bg-bg-raised/70">
						<table className="min-w-full divide-y divide-border-base/70 text-left">
							<thead className="bg-bg-subtle/40 text-xs uppercase tracking-[0.18em] text-text-muted">
								<tr>
									<th className="px-4 py-3 font-medium">ID</th>
									<th className="px-4 py-3 font-medium">Name</th>
									<th className="px-4 py-3 font-medium">Email</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-border-base/70">
								{users.length === 0 ? (
									<tr>
										<td
											colSpan={3}
											className="px-4 py-12 text-center text-sm text-text-secondary"
										>
											No users found for the current filters.
										</td>
									</tr>
								) : (
									users.map((user) => (
										<tr
											key={user.id}
											className="transition-colors hover:bg-bg-subtle/50"
										>
											<td className="px-4 py-4 text-sm text-text-muted">
												#{user.id}
											</td>
											<td className="px-4 py-4 text-sm font-medium text-text-primary">
												{user.name}
											</td>
											<td className="px-4 py-4 text-sm text-text-secondary">
												{user.email}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					<div className="flex flex-col gap-3 border-t border-border-base/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="text-sm text-text-muted">
							URL state: q, page, and size stay in sync with the list.
						</div>
						<div className="flex flex-wrap items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={() => goToPage(1)}
								disabled={currentPage <= 1}
							>
								<ChevronsLeft className="size-4" />
								First
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => goToPage(Math.max(1, currentPage - 1))}
								disabled={currentPage <= 1}
							>
								<ChevronLeft className="size-4" />
								Previous
							</Button>

							<div className="flex items-center gap-1 rounded-xl border border-border-base/80 bg-bg-subtle/90 p-1">
								{pageNumbers.map((page) => (
									<Button
										key={page}
										variant={page === currentPage ? "default" : "ghost"}
										size="sm"
										className="min-w-10 rounded-lg px-3"
										onClick={() => goToPage(page)}
									>
										{page}
									</Button>
								))}
							</div>

							<Button
								variant="outline"
								size="sm"
								onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
								disabled={currentPage >= totalPages}
							>
								Next
								<ChevronRight className="size-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={() => goToPage(totalPages)}
								disabled={currentPage >= totalPages}
							>
								Last
								<ChevronsRight className="size-4" />
							</Button>
						</div>
					</div>
				</CardContent>
			</section>
		</div>
	);
}
