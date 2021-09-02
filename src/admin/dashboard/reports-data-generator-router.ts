import { Bootstrapper } from "../../bootstrapper";
import { ExpressAppWrapper } from "../../http/express-app-wrapper";
import { IReportsDataGeneratorController } from "./reports-data-generator-contoller";

export class ReportsDataGeneratorRouter{
    public static generateUsersRegisteredVsUsersVerifiedGroupedPerYear = '/reportsgenerator/generateUsersRegisteredVsUsersVerifiedGroupedPerYear';
    public static generateIncomingTicketsVsPersonalizedTicketsGroupedPerYear = '/reportsgenerator/generateIncomingTicketsVsPersonalizedTicketsGroupedPerYear';
    public static generateIncomingTicketsPerOrganizerGroupedPerMonth = '/reportsgenerator/generateIncomingTicketsPerOrganizerGroupedPerMonth';
    

    constructor(private readonly expressApp: ExpressAppWrapper){}

    public registerRoutes(): void {
        this.expressApp.post(ReportsDataGeneratorRouter.generateUsersRegisteredVsUsersVerifiedGroupedPerYear, async (req, res, next) => {
            // const context = req.context as IUserContext;

            const controller: IReportsDataGeneratorController = Bootstrapper.getReportsDataGeneratorController();
            const response = await controller.generateUsersRegisteredVsUsersVerifiedGroupedPerYear();

            res.json(response);
        });

        this.expressApp.post(ReportsDataGeneratorRouter.generateIncomingTicketsVsPersonalizedTicketsGroupedPerYear, async (req, res, next) => {
            // const context = req.context as IUserContext;

            const controller: IReportsDataGeneratorController = Bootstrapper.getReportsDataGeneratorController();
            const response = await controller.generateIncomingTicketsVsPersonalizedTicketsGroupedPerYear(req.body.organizerId);

            res.json(response);
        });

        
        this.expressApp.post(ReportsDataGeneratorRouter.generateIncomingTicketsPerOrganizerGroupedPerMonth, async (req, res, next) => {
            // const context = req.context as IUserContext;

            const controller: IReportsDataGeneratorController = Bootstrapper.getReportsDataGeneratorController();
            const response = await controller.generateIncomingTicketsPerOrganizerGroupedPerMonth();

            res.json(response);
        });

    }
}