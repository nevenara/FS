export enum SortOrder {
    ASCEND = 1,
    DESCEND = -1,
}

export interface ISortOption {
    field: string;
    sortOrder: SortOrder;
}
