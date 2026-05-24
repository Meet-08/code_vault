export interface SnippetList {
	id: number;
	title: string;
	language: string;
	description: string;
	tags: string[];
	isFavorite: boolean;
	createdAt: string;
}

export interface SnippetCreate {
	title: string;
	description: string;
	language: string;
	code: string;
	tags: string[];
}

export interface SnippetFilter {
	q?: string;
	language?: string;
	tags?: string[];
	page?: number;
	size?: number;
	sort?: string;
}
