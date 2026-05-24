import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { snippetQueryKey } from "./constant";
import { createSnippet, getSnippets } from "./snippet.api";
import type { SnippetCreate, SnippetFilter } from "./snippet.type";

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
