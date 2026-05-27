export interface SnippetList {
	id: number;
	title: string;
	language: string;
	description: string;
	tags: string[];
	isFavourite: boolean;
	createdAt: string;
}

export interface SnippetDetail {
	id: number;
	title: string;
	language: string;
	description: string;
	code: string;
	tags: string[];
	isFavourite: boolean;
	createdAt: string;
}

export interface SnippetCreate {
	title: string;
	description: string;
	language: string;
	code: string;
	tags: string[];
}

export interface SnippetUpdate {
	title: string | null;
	description: string | null;
	language: string | null;
	code: string | null;
	tags: string[] | null;
}

export interface SnippetFilter {
	q?: string;
	language?: string;
	tags?: string[];
	page?: number;
	size?: number;
	sort?: string;
}

export interface SnippetToggleFavorite {
	id: number;
	isFavourite: boolean;
}
