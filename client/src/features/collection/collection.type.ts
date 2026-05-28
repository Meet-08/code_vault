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
