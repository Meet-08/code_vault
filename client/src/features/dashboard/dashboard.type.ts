import type { SnippetList } from "../snippet/snippet.type";

export interface LanguageCount {
	language: string;
	count: number;
}

export interface DashboardResponse {
	recentSnippets: SnippetList[];
	totalSnippets: number;
	favouriteCount: number;
	totalCollections: number;
	byLanguage: LanguageCount[];
}
