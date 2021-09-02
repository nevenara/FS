export class FAQModel {
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
    likes: string;
    dislikes: string;
    lastUpdate: string;
    isCollapsed: boolean; 
    isLiked: boolean;
    isDisliked: boolean;
}
