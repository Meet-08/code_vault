import { api } from "#/api/axios";
import { unwrap } from "#/lib/api-response";
import type { ApiResponse, PageResponse } from "../../..";
import type { SnippetCreate, SnippetFilter, SnippetList } from "./snippet.type";

export const createSnippet = async (data: SnippetCreate) => {
	const res = await api.post<ApiResponse<SnippetList>>("/snippets", data);
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
