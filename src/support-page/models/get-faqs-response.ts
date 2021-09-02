export class GetFAQsResponse {
    public FAQsByCategory: FAQsByCategoryResponse[];
}

export class FAQsByCategoryResponse {
    public category: string;
    public FAQs: FAQResponse[];
}

export class FAQResponse {
    id: string;
    question: string;
    answer: string;
    likes: number;
    dislikes: number;
    lastUpdate: string;
    isLiked: boolean;
    isDisliked: boolean;
}
