export class GetTicketCategoriesResponse {
    public categories: GetCategoryResponse[];
}

export class GetCategoryResponse {
    public categoryName: string;
    public categoryId: string;
}