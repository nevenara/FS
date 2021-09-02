import { IUserContext } from "../../common/user-context";
import { UserType } from "../../models/user-type";
import { BaseExportOrganizersController } from "./base-export-organizers-controller";
import { SearchOrganizersResponse } from "./models/search-organizers-response";

// Require library
var excel = require('excel4node');



export interface IExportOrganizersController {
    exportExcel(data: SearchOrganizersResponse, res);
    exportCSV(data: SearchOrganizersResponse, res)
}

export class ExportOrganizersController extends BaseExportOrganizersController implements IExportOrganizersController {
    constructor(private context: IUserContext) {
        super();
    }

    public exportCSV(data: SearchOrganizersResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.SuperAdmin, UserType.Admin, UserType.SupportLevel2, UserType.EventManager]);

        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const csv = parse(data.organizers, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: SearchOrganizersResponse, res) {
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

        data.organizers.forEach(record => {
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

