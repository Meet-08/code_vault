import type { SnippetList } from "../snippet/snippet.type";

export interface CollectionList {
	id: number;
	name: string;
	description: string;
	snippetCount: number;
}

export interface CollectionCreate {
	name: string;
	description: string;
	snippetsIds: number[];
}

export interface CollectionDetail {
	id: number;
	name: string;
	description: string;
	snippets: SnippetList[];
}
