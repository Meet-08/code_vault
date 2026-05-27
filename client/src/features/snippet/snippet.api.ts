import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse, PageResponse } from "../../..";
import type {
	SnippetCreate,
	SnippetDetail,
	SnippetFilter,
	SnippetList,
	SnippetToggleFavorite,
	SnippetUpdate,
} from "./snippet.type";

export const createSnippet = async (data: SnippetCreate) => {
	const res = await api.post<ApiResponse<SnippetList>>("/snippets", data);
	return unwrap(res.data);
};

export const getSnippet = async (id: string) => {
	const res = await api.get<ApiResponse<SnippetDetail>>(`/snippets/${id}`);
	return unwrap(res.data);
};

export const getSnippets = async (data: SnippetFilter) => {
	const res = await api.get<ApiResponse<PageResponse<SnippetList>>>(
		"/snippets",
		{
			params: data,
		},
	);
	return unwrap(res.data);
};

export const updateSnippet = async (id: string, data: SnippetUpdate) => {
	const res = await api.patch<ApiResponse<SnippetDetail>>(
		`/snippets/${id}`,
		data,
	);
	return unwrap(res.data);
};

export const toggleFavourite = async (id: string) => {
	const res = await api.patch<ApiResponse<SnippetToggleFavorite>>(
		`/snippets/${id}/favourite`,
	);
	return unwrap(res.data);
};
