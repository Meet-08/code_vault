import { type QueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createCollection, getCollections } from "./collection.api";
import type { CollectionCreate } from "./collection.type";
import { collectionKey } from "./constant";

export const useCollectionQuery = () => {
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
