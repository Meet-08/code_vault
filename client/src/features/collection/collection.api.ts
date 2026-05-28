import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse } from "../../..";
import type { CollectionCreate, CollectionList } from "./collection.type";

export const createCollection = async (data: CollectionCreate) => {
	const res = await api.post<ApiResponse<CollectionList>>("/collections", data);
	return unwrap(res.data);
};

export const getCollections = async () => {
	const res = await api.get<ApiResponse<CollectionList[]>>("/collections");
	return unwrap(res.data);
};
