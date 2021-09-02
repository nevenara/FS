import { IUserContext } from "../common/user-context";
import { BaseExportTicketsController } from "./base-export-tickets-controller";
import { SearchTicketsResponse } from "./model/search-ticket-response";
const util = require('util');
import moment = require("moment");

export class ExportPdfTicketController extends BaseExportTicketsController {
    constructor(private context: IUserContext) {
        super();
    }
    // https://github.com/PSPDFKit-labs/pdfkit-invoice/blob/master/createInvoice.js
    public exportPDF(response: SearchTicketsResponse, res: any) {
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
        var docDefinition = this.getDocDefinition(response);

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

    private getDocDefinition(response: SearchTicketsResponse) {
        const headers = this.getHeadingColumnNames();

        const body = [];
        const tableHeaders = headers.map(n => n.header);

        body.push(tableHeaders);

        response.tickets.forEach(ticket => {

            const ticketRow = [];

            headers.forEach(h => {
                ticketRow.push(this.getCellValue(ticket, h));
            });

            body.push(ticketRow);
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

    private getCellValue(ticket: any, h: { key: string; header: string; }): any {
        if (ticket[h.key] && util.types.isDate(ticket[h.key ])) {
            return moment(ticket[h.key]).format();
        }
        return ticket[h.key] ? ticket[h.key].toString() : '';
    }

    private generateTable(doc) {
        const headers = this.getHeadingColumnNames();
        let i;
        const invoiceTableTop = 330;

        doc.font("Helvetica-Bold");
        this.generateTableRow(
            doc,
            invoiceTableTop,
            headers[0].header,
            headers[1].header,
            headers[2].header,
            headers[3].header,
            headers[4].header,
            headers[5].header,
            headers[6].header,
            headers[7].header,
        );

        this.generateHr(doc, invoiceTableTop + 20);
        doc.font("Helvetica");

    }

    private generateTableRow(
        doc,
        y,
        c1,
        c2,
        c3,
        c4,
        c5,
        c6,
        c7,
        c8
    ) {
        doc
            .fontSize(10)
            .text(c1, 20, y)
            .text(c2, 120, y)
            .text(c3, 250, y)
            .text(c4, 320, y)
            .text(c5, 360, y,)
            .text(c6, 420, y)
            .text(c7, 430, y)
            .text(c8, 500, y);
    }

    private generateHr(doc, y) {
        doc
            .strokeColor("#aaaaaa")
            .lineWidth(1)
            .moveTo(20, y)
            .lineTo(550, y)
            .stroke();
    }
}