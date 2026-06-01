import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
	addSnippetToCollection,
	createCollection,
	getCollection,
	getCollections,
	removeSnippetFromCollection,
} from "./collection.api";
import type { CollectionCreate } from "./collection.type";
import { collectionKey } from "./constant";

export const useCollectionQuery = (id: number, enabled = true) => {
	return useQuery({
		queryKey: [collectionKey.collection, id],
		queryFn: () => getCollection(id),
		enabled,
	});
};

export const useCollectionsQuery = () => {
	return useQuery({
		queryKey: [collectionKey.collection],
		queryFn: () => getCollections(),
	});
};

export const useCreateCollection = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: (data: CollectionCreate) => createCollection(data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [collectionKey.collection] });
		},
	});
};

export const useAddSnippetToCollection = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: ({
			collectionId,
			snippetIds,
		}: {
			collectionId: number;
			snippetIds: number[];
		}) => addSnippetToCollection(collectionId, snippetIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [collectionKey.collection] });
		},
	});
};

export const useRemoveSnippetFromCollection = (queryClient: QueryClient) => {
	return useMutation({
		mutationFn: ({
			collectionId,
			snippetIds,
		}: {
			collectionId: number;
			snippetIds: number[];
		}) => removeSnippetFromCollection(collectionId, snippetIds),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: [collectionKey.collection] });
		},
	});
};
