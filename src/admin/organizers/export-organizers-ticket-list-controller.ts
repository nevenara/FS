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
import { SearchOrganizersTicketsRequest } from "./models/search-organizers-ticket-list-request";

var excel = require('excel4node');

const headingColumnNames = [
    { key: "bookingId", header: 'Booking Id' },
    { key: "ticketId", header: 'Ticket Id' },
    { key: "eventName", header: 'Event Name' },
    { key: "eventDate", header: 'Event Date' },
    { key: "seat", header: 'Seat Info' },
    { key: "eventLocation", header: 'Event Location' },
    { key: "ticketBuyer", header: 'Ticket Buyer' },
    { key: "ticketHolder", header: 'Ticket Holder' },
    { key: "status", header: 'Status' }
];

export class BaseExportOrganizersTicketsController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}


export interface IExportOrganizersTicketsController {
    exportPdf(data: SearchTicketsResponse, res);
    exportExcel(data: SearchTicketsResponse, res);
    exportCSV(data: SearchTicketsResponse, res);
}

export class ExportOrganizersTicketsController extends BaseExportOrganizersTicketsController implements IExportOrganizersTicketsController {
    constructor(private context: IUserContext) {
        super();
    }
    
    public exportPdf(data: SearchTicketsResponse, res: any) {
        const PdfPrinter = require('pdfmake');

        var fonts = {
            Helvetica: {
                normal: 'Helvetica',
                bold: 'Helvetica-Bold',
                italics: 'Helvetica-Oblique',
                bolditalics: 'Helvetica-BoldOblique'
            }
        };

        var printer = new PdfPrinter(fonts);
        var docDefinition = this.getDocDefinition(data);

        var doc = printer.createPdfKitDocument(docDefinition);

        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {

            let pdfData = Buffer.concat(buffers);
            res.writeHead(200, {
                'Content-Length': Buffer.byteLength(pdfData),
                'Content-Type': 'application/pdf',
                'Content-disposition': 'attachment;filename=tickets.pdf',
            })
                .end(pdfData);

        });


        // this.generateTable(doc);


        doc.end();
    }

    public exportCSV(data: SearchTicketsResponse, res) {
        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const csv = parse(data.tickets, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: SearchTicketsResponse, res) {
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



