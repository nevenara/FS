import { IUserContext } from "../common/user-context";
import { UserType } from "../models/user-type";
import { UserRepository } from "../user/user-repository";
import { BaseExportTicketsController } from "./base-export-tickets-controller";
import { SearchTicketsResponse } from "./model/search-ticket-response";
// Require library
var excel = require('excel4node');



export interface IExportTicketController {
    exportExcel(data: SearchTicketsResponse, res);
    exportCSV(data: SearchTicketsResponse, res)
}

export class ExportTicketController extends BaseExportTicketsController implements IExportTicketController {
    constructor(private context: IUserContext) {
        super();
    }

    public exportCSV(data: SearchTicketsResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2, UserType.EventManager]);
        
        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const csv = parse(data.tickets, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: SearchTicketsResponse, res) {
        // Create a new instance of a Workbook class
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2, UserType.EventManager]);
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

        data.tickets.forEach(record => {
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