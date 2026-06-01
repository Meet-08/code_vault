import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import type { PageResponse } from "../../..";
import type { CollectionDetail } from "../collection/collection.type";
import { collectionKey } from "../collection/constant";
import { snippetQueryKey } from "./constant";
import {
	createSnippet,
	deleteSnippet,
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

const updateSnippetFavourite = <T extends SnippetDetail | SnippetList>(
	snippet: T,
	id: number,
	isFavourite: boolean,
) => (snippet.id === id ? { ...snippet, isFavourite } : snippet);

const isSnippetPage = (
	data: PageResponse<SnippetList> | unknown,
): data is PageResponse<SnippetList> =>
	Boolean(
		data &&
			typeof data === "object" &&
			"content" in data &&
			Array.isArray(data.content),
	);

const isCollectionDetail = (data: unknown): data is CollectionDetail =>
	Boolean(
		data &&
			typeof data === "object" &&
			"snippets" in data &&
			Array.isArray(data.snippets),
	);

const getCachedFavouriteState = (
	id: number,
	snippetQueries: Array<[unknown, unknown]>,
	collectionQueries: Array<[unknown, unknown]>,
) => {
	for (const [, data] of snippetQueries) {
		if (isSnippetPage(data)) {
			const snippet = data.content.find((item) => item.id === id);

			if (snippet) {
				return snippet.isFavourite;
			}
		}
	}

	for (const [, data] of collectionQueries) {
		if (isCollectionDetail(data)) {
			const snippet = data.snippets.find((item) => item.id === id);

			if (snippet) {
				return snippet.isFavourite;
			}
		}
	}

	return false;
};

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
				queryKey: [collectionKey.collection],
			});
			queryClient.invalidateQueries({
				queryKey: [snippetQueryKey.snippets, id],
				exact: true,
				refetchType: "active",
			});
		},
	});
};

export const useDeleteSnippet = (queryClient: QueryClient, id: string) => {
	return useMutation({
		mutationFn: () => deleteSnippet(id),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [snippetQueryKey.snippets],
			});
			queryClient.invalidateQueries({
				queryKey: [snippetQueryKey.snippets, id],
				exact: true,
			});
		},
	});
};

export const useToggleFavorite = (queryClient: QueryClient, id: string) => {
	return useMutation({
		mutationFn: () => toggleFavourite(id),
		onMutate: async () => {
			const snippetId = Number(id);

			await Promise.all([
				queryClient.cancelQueries({ queryKey: [snippetQueryKey.snippets] }),
				queryClient.cancelQueries({ queryKey: [collectionKey.collection] }),
			]);

			const previousSnippetQueries = queryClient.getQueriesData({
				queryKey: [snippetQueryKey.snippets],
			});
			const previousCollectionQueries = queryClient.getQueriesData({
				queryKey: [collectionKey.collection],
			});
			const currentSnippet = queryClient.getQueryData<SnippetDetail>([
				snippetQueryKey.snippets,
				id,
			]);
			const currentIsFavourite =
				currentSnippet?.isFavourite ??
				getCachedFavouriteState(
					snippetId,
					previousSnippetQueries,
					previousCollectionQueries,
				);
			const nextIsFavourite = !currentIsFavourite;

			queryClient.setQueriesData<PageResponse<SnippetList>>(
				{ queryKey: [snippetQueryKey.snippets] },
				(page) => {
					if (!isSnippetPage(page)) {
						return page;
					}

					return {
						...page,
						content: page.content.map((snippet) =>
							updateSnippetFavourite(snippet, snippetId, nextIsFavourite),
						),
					};
				},
			);

			queryClient.setQueryData<SnippetDetail>(
				[snippetQueryKey.snippets, id],
				(snippet) =>
					snippet
						? updateSnippetFavourite(snippet, snippetId, nextIsFavourite)
						: snippet,
			);

			queryClient.setQueriesData<CollectionDetail>(
				{ queryKey: [collectionKey.collection] },
				(collection) => {
					if (!isCollectionDetail(collection)) {
						return collection;
					}

					return {
						...collection,
						snippets: collection.snippets.map((snippet) =>
							updateSnippetFavourite(snippet, snippetId, nextIsFavourite),
						),
					};
				},
			);

			return {
				previousCollectionQueries,
				previousSnippetQueries,
			};
		},
		onError: (_error, _variables, context) => {
			for (const [queryKey, data] of context?.previousSnippetQueries ?? []) {
				queryClient.setQueryData(queryKey, data);
			}

			for (const [queryKey, data] of context?.previousCollectionQueries ?? []) {
				queryClient.setQueryData(queryKey, data);
			}
		},
		onSuccess: (data: SnippetToggleFavorite) => {
			queryClient.setQueriesData<PageResponse<SnippetList>>(
				{ queryKey: [snippetQueryKey.snippets] },
				(page) => {
					if (!isSnippetPage(page)) {
						return page;
					}

					return {
						...page,
						content: page.content.map((snippet) =>
							updateSnippetFavourite(snippet, data.id, data.isFavourite),
						),
					};
				},
			);

			queryClient.setQueryData<SnippetDetail>(
				[snippetQueryKey.snippets, id],
				(snippet) =>
					snippet ? { ...snippet, isFavourite: data.isFavourite } : snippet,
			);

			queryClient.setQueriesData<CollectionDetail>(
				{ queryKey: [collectionKey.collection] },
				(collection) => {
					if (!isCollectionDetail(collection)) {
						return collection;
					}

					return {
						...collection,
						snippets: collection.snippets.map((snippet) =>
							updateSnippetFavourite(snippet, data.id, data.isFavourite),
						),
					};
				},
			);
		},
	});
};
