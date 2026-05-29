import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
	createCollection,
	getCollection,
	getCollections,
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
