import { IUserContext } from "../common/user-context";
import { UserType } from "../models/user-type";
import { BaseExportChangeHistoryController } from "./base-export-change-history-controller";
import { GetChangeHistoryResponse } from "./model/get-change-history-response";

var excel = require('excel4node');

export interface IExportChangeHistoryController {
    exportExcel(data: GetChangeHistoryResponse, res);
    exportCSV(data: GetChangeHistoryResponse, res)
}

export class ExportChangeHistoryController extends BaseExportChangeHistoryController implements IExportChangeHistoryController {

    constructor(private context: IUserContext) {
        super();
    }

    public exportCSV(data: GetChangeHistoryResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2]);

        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const csv = parse(data.data, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: GetChangeHistoryResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2]);
        
        // Create a new instance of a Workbook class
        const workbook = new excel.Workbook();

        // Add Worksheets to the workbook
        var ws = workbook.addWorksheet('Sheet 1');
 
        //Write Column Title in Excel file
        let headingColumnIndex = 1;
        this.getHeadingColumnNames().forEach(heading => {
            ws.cell(1, headingColumnIndex++)
                .string(heading.header)
        });

        //Write Data in Excel file
        let rowIndex = 2;

        data.data.forEach(record => {
            let pocoRecord = record; //.toJSON();
            let columnIndex = 1;
            this.getHeadingColumnNames().forEach(columnName => {
                ws.cell(rowIndex, columnIndex++)
                    .string(pocoRecord[columnName.key] ? pocoRecord[columnName.key].toString() : '');
            });
            rowIndex++;

        });

        workbook.write('ExcelFile.xlsx', res);
    }
}

