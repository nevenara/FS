export class GetChangeHistoryResponse {
    data: ChangeRecordResponse[];
    totalRecords: number;
    totalPages: number;
}

export class ChangeRecordResponse {
    editor: string;
    date: Date;
    originalValue: string;
    newValue: string;
}