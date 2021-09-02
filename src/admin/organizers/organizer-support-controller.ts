const util = require('util');
import moment = require("moment");
import { ConfigService } from "../../common/config-service";
import { ValidationError } from "../../common/errors/validation-error";
import { IUserContext } from "../../common/user-context";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ILocalisationProvider } from "../../localisation/localisation-provider";
import { UserType } from "../../models/user-type";
import { OrganizerStatus } from "../../organizer/models/organizer-status";
import { IOrganizerRepository } from "../../organizer/organizer-repository";
import { InputDateParameterParseUtil } from "../../tickets/model/input-date-parameter-parse";
import { SearchOrganizerSupportRepoResponse } from "./models/search-organizer-support-repo-response";
import { SearchOrganizerSupportRequest } from "./models/search-organizer-support-request";
import { OrganizerSupportResponse, SearchOrganizerSupportResponse } from "./models/search-organizer-support-response";

var excel = require('excel4node');

const headingColumnNames = [
    { key: "companyName", header: 'Organizer / Ticket Seller' },
    { key: "url", header: 'URL' },
    { key: "created", header: "Created" },
    { key: "status", header: 'Status' }
];

export class BaseExportOrganizerSupportController{
    protected getHeadingColumnNames(){
        return headingColumnNames;
    }
}


export interface IOrganizerSupportController {
    exportPdf(data: SearchOrganizerSupportResponse, res);
    exportExcel(data: SearchOrganizerSupportResponse, res);
    exportCSV(data: SearchOrganizerSupportResponse, res);
    search(request: SearchOrganizerSupportRequest): Promise<SearchOrganizerSupportResponse>;
}

export class OrganizerSupportController extends BaseExportOrganizerSupportController implements IOrganizerSupportController {
    constructor(private context: IUserContext, private configService: ConfigService, private organizerRepository: IOrganizerRepository, private localisationProvider: ILocalisationProvider) {
        super();
    }
    
    public exportPdf(data: SearchOrganizerSupportResponse, res: any) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2, UserType.EventManager]);

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
                'Content-disposition': 'attachment;filename=organizers.pdf',
            })
                .end(pdfData);

        });


        // this.generateTable(doc);


        doc.end();
    }
    
    public async search(request: SearchOrganizerSupportRequest): Promise<SearchOrganizerSupportResponse> {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel1, UserType.SupportLevel2, UserType.EventManager]);

        if(request.status && request.status.length > 0) {
            request.status.forEach( status => {
                if (!Object.keys(OrganizerStatus).map(k => OrganizerStatus[k as any]).includes(status)) {
                    throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidOrganizerStatus));
                }
            });
           
        }

        if (request.limit && request.limit > 50) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.LimitPerPageIs50));
        }

        request.limit = request.limit || await this.configService.getConfig('pageLimit', 10);
        request.page = request.page || 1;

        const repoResponse: SearchOrganizerSupportRepoResponse = await this.organizerRepository.searchOrganizerSupport(request);
        const response = new SearchOrganizerSupportResponse();
        response.organizers = [];
        const timeZone = await this.configService.getConfig("timeZone", "Europe/Vienna");

        for (let i = 0; i < repoResponse.organizers.length; i++) {
            const repoRes = repoResponse.organizers[i];
            const res = new OrganizerSupportResponse();
            res.organizerId = repoRes._id;
            res.companyName = repoRes.companyName;
            res.url = repoRes.url;
            res.status = repoRes.status;
            res.userId = repoRes.user ? repoRes.user._id : null;
            res.created = InputDateParameterParseUtil.getDateInTimeZone(repoRes.created, timeZone);
            response.organizers.push(res);
        }
        response.totalPages = repoResponse.totalPages;
        response.totalRecords = repoResponse.totalRecords;

        return response;

    }

    public exportCSV(data: SearchOrganizerSupportResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2, UserType.EventManager]);

        const { parse } = require('json2csv');

        const fields = this.getHeadingColumnNames().map(n => ({ label:n.header, value:n.key}));
        const opts = { fields };

        const csv = parse(data.organizers, opts);

        res.attachment('file.csv');
        res.send(csv);
    }

    public exportExcel(data: SearchOrganizerSupportResponse, res) {
        this.context.validateIfAuthenticated();
        this.context.validateAuthorization([UserType.Admin, UserType.SuperAdmin, UserType.SupportLevel2, UserType.EventManager]);

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

    private getDocDefinition(response: SearchOrganizerSupportResponse) {
        const headers = this.getHeadingColumnNames();

        const body = [];
        const tableHeaders = headers.map(n => n.header);

        body.push(tableHeaders);

        response.organizers.forEach(organizer => {

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



