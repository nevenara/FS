import { Environment } from "../../environment"; 
import { RedisOptions } from "ioredis";
import { IAppLogger } from "../app-logger";
import { Bootstrapper } from "../../bootstrapper";

export interface IRedisClientFactory {
    createClient(): any;
}

export class RedisClientFactory implements IRedisClientFactory {
    constructor(private logger: IAppLogger) {}
    public createClient(): any {
        const redisOptions: RedisOptions = {
            host: Environment.getRedisHost(),
            port: parseInt(Environment.getRedisPort(), 10),
            password: Environment.getRedisPassword(),
            // This is the default value of `retryStrategy`
            retryStrategy: function (times) {
                const delay = Math.min(times * 50, 2000);
                return delay;
            },
            showFriendlyErrorStack: true, // Should be false for production, impacts performance
        };

        const client = Bootstrapper.getRedis(redisOptions);

        client.on("connect", () => {
            this.logger.log("Redis client connected");
        });

        client.on("ready", () => {
            this.logger.log("Redis client ready");
        });

        client.on("close", () => {
            this.logger.log("Redis client close");
        });

        client.on("end", () => {
            this.logger.log("Redis client end");
        });

        client.on("reconnecting", () => {
            this.logger.log("Redis client reconnecting");
        });

        client.on("error", (err) => {
            this.logger.log(`Redis client error ${err}`);
        });

        return client;
    }
}
