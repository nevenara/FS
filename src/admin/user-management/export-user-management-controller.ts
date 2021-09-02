import { IUserContext } from "../../common/user-context";
import { UserType } from "../../models/user-type";
import { BaseExportUserManagementController } from "./base-export-user-management-controller";
import { SearchUserManagementResponse } from "./models/search-user-management-response";

// Require library
var excel = require('excel4node');



export interface IExportUserManagementController {
    exportExcel(data: SearchUserManagementResponse, res);
    exportCSV(data: SearchUserManagementResponse, res)
}

export class ExportUserManagementController extends BaseExportUserManagementController implements IExportUserManagementController {
    constructor(private context: IUserContext) {
        super();
    }

    public exportCSV(data: SearchUserManagementResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin, UserType.Admin, UserType.SupportLevel2, UserType.EventManager]);

        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const users = this.mapResponse(data);
        const csv = parse(users, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: SearchUserManagementResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin, UserType.Admin, UserType.SupportLevel2, UserType.EventManager]);

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

        const users = this.mapResponse(data);

        users.forEach(record => {
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