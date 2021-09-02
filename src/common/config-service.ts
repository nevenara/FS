import { ConfigToUpdate } from "../admin/configs/models/update-configs-request";
import { ConfigDbObject } from "../config/config-db-object";
import { IConfigRepository } from "../config/config-repository";
import { IConfigValue } from "../config/config-value";
import { Configs } from "../models/configs";
import { LocalisationKey } from "../localisation/localisation-key";
import { ValidationError } from "./errors/validation-error";
import { ILocalisationProvider } from "../localisation/localisation-provider";

export class ConfigService {
    private config: IConfigValue = null;

    public constructor(private configRepository: IConfigRepository, private localisationProvider: ILocalisationProvider) {}

    private async importConfigs(): Promise<void> {
        if (!this.config) {
            //TODO add cache
            this.config = await this.configRepository.getConfigs();
        }
    }

    public async getConfig(param: string, defaultValue: any = null): Promise<any> {
        await this.importConfigs();

        return this.config ? (this.config.configs[param] || defaultValue) : defaultValue;
    }

    public async getConfigs(): Promise<Configs> {
        await this.importConfigs();

        return this.config ? this.config.configs : null;
    }

    public async updateConfigs(configsToUpdate: Array<ConfigToUpdate>): Promise<void> {
        await this.importConfigs();

        if (!this.config) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ConfigParamDoesntExist));
        }

        configsToUpdate.forEach(configToUpdate => {
            if (!this.config.configs[configToUpdate.param]) {
                throw new ValidationError(this.localisationProvider.translate(LocalisationKey.ConfigParamDoesntExist));
            }
        });

        for (let i = 0; i < configsToUpdate.length; i++) {
            this.config.configs[configsToUpdate[i].param] = configsToUpdate[i].value;
        }

        await this.configRepository.updateObjectById(this.config._id, new ConfigDbObject(this.config));
    }
}