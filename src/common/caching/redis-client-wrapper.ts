 
import { Redis } from "ioredis";
import { IAppLogger } from "../app-logger";
import { IRedisClientFactory } from "./redis-client-factory";
import { ValidationError } from "../errors/validation-error";
import { LocalisationKey } from "../../localisation/localisation-key";
import { ILocalisationProvider } from "../../localisation/localisation-provider";

export interface IRedisClientWrapper {
    addToSet(key: string, value: string, timestamp?: string): Promise<boolean>;
    delete(key: string): Promise<boolean>;

    deleteExpiredValuesFromSet(key: string): Promise<boolean>;
    deleteFromSet(key: string, value: string): Promise<boolean>;
    get(key: string): Promise<any>;
    getAndExtend(key: string, time: number): Promise<any>;
    getTTL(key: string): Promise<any>;
    getNumberOfSessionsInRedis(key: string): Promise<number>;

    existsInSet(key: string, value: string): Promise<boolean>;
    set(key: string, value: any): Promise<any>;
    setExpirySeconds(key: string, value: any, time: number);
    setExpiryMilliseconds(key: string, value: any, time: number);

    shutdown(): boolean;
}

export class RedisClientWrapper implements IRedisClientWrapper {
    private client: Redis;
    constructor(private logger: IAppLogger, redisClientFactory: IRedisClientFactory, private localisationProvider: ILocalisationProvider) {
        this.client = redisClientFactory.createClient();
    }

    public async set(key: string, value: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.client.set(key, value, this.asyncResolveRejectHandler(resolve, reject));
        });
    }

    public async setExpirySeconds(key: string, value: any, time: number) {
        // ex => for expiry in seconds
        return this.setExpiry(key, value, time, "ex");
    }

    public async setExpiryMilliseconds(key: string, value: any, time: number) {
        // px => for expiry in miliseconds
        return this.setExpiry(key, value, time, "px");
    }

    public async addToSet(key: string, value: string, timestamp?: string): Promise<boolean> {
        try {
            const result = await this.client.zadd(
                key,
                timestamp !== undefined
                    ? timestamp
                    : (new Date().getTime() + 1 * 60 * 60 * 1000).toString(),
                value,
            );

            if (result === 1) {
                return Promise.resolve(true);
            }
            return Promise.resolve(false);
        } catch (err) {
            return Promise.reject(err);
        }
    }

    public async get(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.client.get(key, this.asyncResolveRejectHandler(resolve, reject));
        });
    }

    public async getAndExtend(key: string, time: number): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.client.get(key, async (err, res) => {
                if (err) {
                    return reject(err);
                }

                if (res === null) {
                    return resolve(res);
                }

                return res && (await this.setExpirySeconds(key, res, time)) === "OK"
                    ? resolve(res)
                    // problem with lang
                    : reject(new ValidationError( this.localisationProvider.translate(LocalisationKey.ExpiryNotSetForRedisKey)));
            });
        });
    }

    public async getTTL(key: string): Promise<any> {
        return new Promise<any>((resolve, reject) => {
            this.client.ttl(key, this.asyncResolveRejectHandler(resolve, reject));
        });
    }

    public async delete(key: string): Promise<boolean> {
        const result = await this.client.del(key);

        try {
            if (result === 1) {
                return true;
            }

            return false;
        } catch (err) {
            return err;
        }
    }

    public async deleteFromSet(key: string, value: string): Promise<boolean> {
        const result = await this.client.zrem(key, value);

        try {
            if (result === 1) {
                return true;
            }

            return false;
        } catch (err) {
            return err;
        }
    }

    public async existsInSet(key: string, value: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            this.client.zscore(key, value, (err, response) => {
                if (err) {
                    return reject(err);
                }
                if (response === null) {
                    return resolve(false);
                }

                return resolve(true);
            });
        });
    }

    public async getNumberOfSessionsInRedis(key: string): Promise<number> {
        return new Promise<number>((resolve, reject) => {
            this.client.zcard(key, (err, response) => {
                if (err) {
                    return reject(err);
                }
                return resolve(response);
            });
        });
    }

    public shutdown(): boolean {
        try {
            this.client.disconnect();
            return true;
        } catch (err) {
            this.logger.error(err, this.localisationProvider.translate(LocalisationKey.RedisShutdownError));
            return false;
        }
    }

    public async deleteExpiredValuesFromSet(key: string): Promise<boolean> {
        const response = await this.client.zremrangebyscore(
            key,
            -Infinity,
            new Date().getTime(),
        );

        if (response === 0) {
            return false;
        }

        return true;
    }

    private asyncResolveRejectHandler(resolve, reject) {
        return async (err, res) => {
            if (err) {
                return reject(err);
            }
            return resolve(res);
        };
    }

    private async setExpiry(key: string, value: any, time: number, countType: string) {
        return new Promise<any>((resolve, reject) => {
            // ex => for expiry in seconds, px => for expiry in miliseconds
            this.client.set(key, value, countType, time, this.asyncResolveRejectHandler(resolve, reject));
        });
    }
}
