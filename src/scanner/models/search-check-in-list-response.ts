export class SearchCheckInListResponse {
    public checkIns: CheckInResponse[];
    public totalPages: number;
    public totalRecords: number;
}

export class CheckInResponse {
    id: string;
    ticketId: string;
    firstName: string;
    lastName: string;
    ticketStatus: string;
    verificationStatus: string;
    reason: string;
    date: string;
}