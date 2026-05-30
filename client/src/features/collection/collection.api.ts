import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse } from "../../..";
import type {
	CollectionCreate,
	CollectionDetail,
	CollectionList,
} from "./collection.type";

export const createCollection = async (data: CollectionCreate) => {
	const res = await api.post<ApiResponse<CollectionList>>("/collections", data);
	return unwrap(res.data);
};

export const getCollections = async () => {
	const res = await api.get<ApiResponse<CollectionList[]>>("/collections");
	return unwrap(res.data);
};

export const getCollection = async (id: number) => {
	const res = await api.get<ApiResponse<CollectionDetail>>(
		`/collections/${id}`,
	);
	return unwrap(res.data);
};

export const addSnippetToCollection = async (
	collectionId: number,
	snippetIds: number[],
) => {
	const res = await api.post<ApiResponse<void>>(
		`/collections/${collectionId}`,
		{
			snippetIds,
		},
	);
	return unwrap(res.data);
};
