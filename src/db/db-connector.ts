import { IAppLogger } from "../common/app-logger";
import { Environment } from "../environment";
const mongoose = require("mongoose");

export class DbConnector{
    public async connectDb(logger: IAppLogger): Promise<void>{
        try {
            const uri: string = Environment.getMongoConnectionString();

            const dbInstance = await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                autoIndex: false,
                dbName: "funsafedb",
                poolSize: 10 // Can now run 10 operations at a time
            });

            logger.log("Mongoose connected.");
        } catch (error) {
            logger.error(error, "Failed to connect to mongodb.");
            throw error;
        }
    }
}