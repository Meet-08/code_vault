import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { PageResponse } from "../../..";
import { snippetQueryKey } from "./constant";
import {
	createSnippet,
	getSnippet,
	getSnippets,
	toggleFavourite,
	updateSnippet,
} from "./snippet.api";
import type {
	SnippetCreate,
	SnippetDetail,
	SnippetFilter,
	SnippetList,
	SnippetToggleFavorite,
	SnippetUpdate,
} from "./snippet.type";

export const useSnippetByIdQuery = (id: string) => {
	return useQuery({
		queryKey: [snippetQueryKey.snippets, id],
		queryFn: () => getSnippet(id),
	});
};

export const useSnippetQuery = (filters: SnippetFilter) => {
	const apiFilters = {
		...filters,
		page: Math.max((filters.page ?? 1) - 1, 0),
	};

	return useQuery({
		queryKey: [snippetQueryKey.snippets, filters],
		queryFn: () => getSnippets(apiFilters),
	});
};

export const useCreateSnippet = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: (data: SnippetCreate) => createSnippet(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [snippetQueryKey.snippets],
			});
		},
	});
};

export const useUpdateSnippet = (queryClient: QueryClient, id: string) => {
	return useMutation({
		mutationFn: (data: SnippetUpdate) => updateSnippet(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [snippetQueryKey.snippets],
			});
			queryClient.invalidateQueries({
				queryKey: [snippetQueryKey.snippets, id],
				exact: true,
				refetchType: "active",
			});
		},
	});
};

export const useToggleFavorite = (queryClient: QueryClient, id: string) => {
	return useMutation({
		mutationFn: () => toggleFavourite(id),
		onSuccess: (data: SnippetToggleFavorite) => {
			queryClient.setQueriesData<PageResponse<SnippetList>>(
				{ queryKey: [snippetQueryKey.snippets] },
				(page) => {
					if (!page || !("content" in page) || !Array.isArray(page.content)) {
						return page;
					}

					return {
						...page,
						content: page.content.map((snippet) =>
							snippet.id === data.id
								? { ...snippet, isFavourite: data.isFavourite }
								: snippet,
						),
					};
				},
			);

			queryClient.setQueryData<SnippetDetail>(
				[snippetQueryKey.snippets, id],
				(snippet) =>
					snippet ? { ...snippet, isFavourite: data.isFavourite } : snippet,
			);
		},
	});
};
