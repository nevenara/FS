const headingColumnNames = [
    { key: "editor", header: 'Editor' },
    { key: "date", header: 'Change date' },
    { key: "originalValue", header: 'Original value' },
    { key: "newValue", header: 'New value' }
];

export class BaseExportChangeHistoryController {
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}
