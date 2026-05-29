import { Button } from "#/components/ui/button";
import { CardContent, CardDescription, CardTitle } from "#/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
} from "#/components/ui/form";
import { Input } from "#/components/ui/input";
import { Loader } from "#/components/ui/loader";
import {
	useSnippetByIdQuery,
	useUpdateSnippet,
} from "#/features/snippet/snippet.query";
import {
	snippetCreateSchema,
	type SnippetCreate,
} from "#/features/snippet/snippet.schema";
import { getContext } from "#/integrations/tanstack-query/root-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { AxiosError } from "axios";
import { Plus, Save, Tag, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import type { ApiResponse } from "../../../..";

export const Route = createFileRoute("/_app/snippets/$id/edit")({
	component: RouteComponent,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const { queryClient } = getContext();
	const snippetQuery = useSnippetByIdQuery(id);
	const updateSnippetMutation = useUpdateSnippet(queryClient, id);
	const [customTag, setCustomTag] = useState("");

	const form = useForm<SnippetCreate>({
		resolver: zodResolver(snippetCreateSchema),
		defaultValues: {
			title: "",
			description: "",
			language: "",
			code: "",
			tags: [],
		},
	});

	useEffect(() => {
		if (!snippetQuery.data) {
			return;
		}

		form.reset({
			title: snippetQuery.data.title,
			description: snippetQuery.data.description,
			language: snippetQuery.data.language,
			code: snippetQuery.data.code,
			tags: snippetQuery.data.tags,
		});
	}, [form, snippetQuery.data]);

	const selectedTags = form.watch("tags") as string[];

	const addCustomTag = () => {
		const nextTag = customTag.trim().toLowerCase();

		if (!nextTag || selectedTags.includes(nextTag)) {
			return;
		}

		form.setValue("tags", [...selectedTags, nextTag], {
			shouldDirty: true,
			shouldTouch: true,
		});
		setCustomTag("");
	};

	const removeTag = (tag: string) => {
		form.setValue(
			"tags",
			selectedTags.filter((item) => item !== tag),
			{
				shouldDirty: true,
				shouldTouch: true,
			},
		);
	};

	const onSubmit = async (data: SnippetCreate) => {
		await toast.promise(updateSnippetMutation.mutateAsync(data), {
			pending: "Updating snippet...",
			success: "Snippet updated successfully!",
			error: {
				render({ data }) {
					const error = data as AxiosError<ApiResponse>;
					return error.response?.data.message || "Failed to update snippet.";
				},
			},
		});

		navigate({
			to: "/snippets/$id",
			params: { id },
		});
	};

	if (snippetQuery.isPending) {
		return (
			<main className="page grid min-h-[calc(100dvh-4rem)] place-items-center">
				<Loader title="Loading snippet" description="Preparing edit form" />
			</main>
		);
	}

	if (snippetQuery.isError || !snippetQuery.data) {
		return (
			<main className="page">
				<section className="rounded-lg border border-border-base bg-bg-raised p-6">
					<h1 className="text-heading-2">Unable to load this snippet.</h1>
					<p className="mt-3 text-sm text-text-secondary">
						The snippet may have been removed, or the server could not return
						it.
					</p>
					<Button asChild variant="secondary" className="mt-5">
						<Link to="/snippets" search={{ page: 1, size: 10 }}>
							Back
						</Link>
					</Button>
				</section>
			</main>
		);
	}

	return (
		<div className="page-wide space-y-6 py-6">
			<section className="overflow-hidden rounded-3xl border border-border-base/80 bg-[linear-gradient(180deg,rgba(17,19,24,0.98),rgba(13,15,19,0.98))] shadow-[0_18px_50px_rgba(0,0,0,0.2)]">
				<div className="border-b border-border-base/70 px-6 py-6 sm:px-8">
					<div className="mb-4 inline-flex w-fit items-center rounded-full border border-border-strong bg-bg-subtle px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-text-muted">
						<Plus className="mr-2 size-3.5" />
						Edit snippet
					</div>
					<div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
						<div className="max-w-2xl space-y-3">
							<CardTitle className="text-[clamp(1.8rem,2.6vw,2.6rem)] leading-tight tracking-tight">
								Edit snippet
							</CardTitle>
							<CardDescription className="text-sm leading-relaxed text-text-secondary sm:text-[15px]">
								Update title, description, language, code, or tags for this
								snippet.
							</CardDescription>
						</div>

						<Button asChild variant="ghost" className="w-fit rounded-full">
							<Link to="/snippets/$id" params={{ id }}>
								<X className="size-4" />
								Back to snippet
							</Link>
						</Button>
					</div>
				</div>

				<CardContent className="px-6 py-6 sm:px-8 sm:py-8">
					<Form {...form}>
						<form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
							<div className="grid gap-5 lg:grid-cols-2">
								<FormField
									control={form.control}
									name="title"
									render={({ field }) => (
										<FormItem className="gap-2">
											<FormLabel>Title</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Build a nested modal with a portal"
													className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
												/>
											</FormControl>
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="language"
									render={({ field }) => (
										<FormItem className="gap-2">
											<FormLabel>Language</FormLabel>
											<FormControl>
												<Input
													{...field}
													placeholder="Language used for this snippet"
													className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
												/>
											</FormControl>
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="gap-2">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<textarea
												{...field}
												rows={4}
												placeholder="Explain when this snippet is useful and what it solves."
												className="min-h-28 rounded-xl border border-border-base/80 bg-bg-subtle/90 px-4 py-3 text-sm text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20"
											/>
										</FormControl>
										<FormDescription>
											A short summary helps you find the snippet later.
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="code"
								render={({ field }) => (
									<FormItem className="gap-2">
										<FormLabel>Code</FormLabel>
										<FormControl>
											<textarea
												{...field}
												rows={14}
												spellCheck={false}
												placeholder={`export function example() {
	const message = "hello";
	return message;
	}`}
												className="min-h-72 rounded-xl border border-border-base/80 bg-bg-subtle/90 px-4 py-3 font-mono text-sm leading-6 text-text-primary outline-none transition placeholder:text-text-muted focus:border-accent-400/60 focus:ring-2 focus:ring-accent-400/20"
											/>
										</FormControl>
										<FormDescription>
											Paste the full snippet body here. Formatting is up to you
											for now.
										</FormDescription>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="tags"
								render={() => (
									<FormItem className="gap-3">
										<div className="flex items-center justify-between gap-3">
											<FormLabel className="flex items-center gap-2">
												<Tag className="size-4" />
												Tags
											</FormLabel>
											<span className="text-xs uppercase tracking-[0.22em] text-text-muted">
												{selectedTags.length} selected
											</span>
										</div>

										<div className="space-y-4 rounded-2xl border border-border-base/80 bg-bg-subtle/50 p-4">
											<div className="flex flex-col gap-3 sm:flex-row">
												<Input
													value={customTag}
													onChange={(event) => setCustomTag(event.target.value)}
													onKeyDown={(event) => {
														if (event.key === "Enter" || event.key === ",") {
															event.preventDefault();
															addCustomTag();
														}
													}}
													placeholder="Add a custom tag"
													className="h-11 rounded-xl border-border-base/80 bg-bg-subtle/90 px-4"
												/>

												<Button
													type="button"
													className="h-11 rounded-xl"
													onClick={addCustomTag}
												>
													<Plus className="size-4" />
													Add tag
												</Button>
											</div>

											<div className="flex flex-wrap gap-2">
												{selectedTags.length ? (
													selectedTags.map((tag) => (
														<Button
															key={tag}
															type="button"
															variant="secondary"
															className="rounded-full pr-2"
															onClick={() => removeTag(tag)}
														>
															{tag}
															<Trash2 className="size-3.5" />
														</Button>
													))
												) : (
													<div className="rounded-full border border-dashed border-border-base/80 px-3 py-1.5 text-sm text-text-muted">
														No tags selected yet.
													</div>
												)}
											</div>
										</div>
									</FormItem>
								)}
							/>

							<div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
								<Button
									type="submit"
									disabled={updateSnippetMutation.isPending}
									className="h-11 rounded-full px-5 shadow-[0_12px_30px_rgba(43,135,245,0.28)]"
								>
									<Save className="size-4" />
									Save changes
								</Button>
							</div>
						</form>
					</Form>
				</CardContent>
			</section>
		</div>
	);
}
