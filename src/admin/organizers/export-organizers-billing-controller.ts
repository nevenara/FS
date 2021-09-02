const util = require('util');
import moment = require("moment");
import { ConfigService } from "../../common/config-service";
import { ValidationError } from "../../common/errors/validation-error";
import { IUserContext } from "../../common/user-context";
import { LocalisationKey } from "../../localisation/localisation-key";
import { UserType } from "../../models/user-type";
import { OrganizerStatus } from "../../organizer/models/organizer-status";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { SearchTicketsResponse } from "../../tickets/model/search-ticket-response";
import { GetTicketListBillingResponse } from "./models/get-ticket-list-billing-response";
import { SearchOrganizersTicketsRequest } from "./models/search-organizers-ticket-list-request";

var excel = require('excel4node');

const headingColumnNames = [
    { key: "ticketPrice", header: 'Ticket price' },
    { key: "amountOfTickets", header: 'Amount of Tickets' },
    { key: "fee", header: 'Fee p. ticket' },
    { key: "subTotal", header: 'Sub-Total' }
];

export class BaseExportOrganizersBillingController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}


export interface IExportOrganizersBillingController {
    exportExcel(data: GetTicketListBillingResponse, res);
    exportCSV(data: GetTicketListBillingResponse, res);
}

export class ExportOrganizersBillingController extends BaseExportOrganizersBillingController implements IExportOrganizersBillingController {
    constructor(private context: IUserContext) {
        super();
    }

    public exportCSV(data: GetTicketListBillingResponse, res) {
        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const csv = parse(data.rows, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: GetTicketListBillingResponse, res) {
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

        data.rows.forEach(record => {
            let pocoRecord = record; //.toJSON();
            let columnIndex = 1;
            this.getHeadingColumnNames().forEach(columnName => {
                ws.cell(rowIndex, columnIndex++)
                    .string(pocoRecord[columnName.key] && (columnName.key == 'fee' || columnName.key == 'subTotal' || columnName.key == 'ticketPrice') ? '€' + pocoRecord[columnName.key].toString() :
                    pocoRecord[columnName.key] ? pocoRecord[columnName.key].toString() : '');
            });
            rowIndex++;

        });

        const styleForTotal = { 'font': {
            'bold': true
        }};

        ws.cell(rowIndex, 1).string('TICKETS TOTAL').style(styleForTotal);
        ws.cell(rowIndex, 2).string(data.ticketsTotal.toString()).style(styleForTotal);
        ws.cell(rowIndex, 3).string('TOTAL SUM').style(styleForTotal);
        ws.cell(rowIndex, 4).string('€' + data.totalSum).style(styleForTotal);

        workbook.write('ExcelFile.xlsx', res);
    }

    private getDocDefinition(response: SearchTicketsResponse) {
        const headers = this.getHeadingColumnNames();

        const body = [];
        const tableHeaders = headers.map(n => n.header);

        body.push(tableHeaders);

        response.tickets.forEach(organizer => {

            const organizerRow = [];

            headers.forEach(h => {
                organizerRow.push(this.getCellValue(organizer, h));
            });

            body.push(organizerRow);
        });

        console.log(body);

        return {
            // a string or { width: number, height: number }
            pageSize: 'A4',

            // by default we use portrait, you can change it to landscape if you wish
            pageOrientation: 'landscape',
            content: [
                {
                    layout: 'lightHorizontalLines', // optional
                    table: {
                        // headers are automatically repeated if the table spans over multiple pages
                        // you can declare how many rows should be treated as headers
                        headerRows: 1,
                        // widths: ['*', 'auto', 100, '*'],
                        body: body
                    }
                }
            ],
            defaultStyle: {
                font: 'Helvetica'
            }
        };

      
    }

    private getCellValue(organizer: any, h: { key: string; header: string; }): any {
        if (organizer[h.key] && util.types.isDate(organizer[h.key ])) {
            return moment(organizer[h.key]).format();
        }
        return organizer[h.key] ? organizer[h.key].toString() : '';
    }
}



