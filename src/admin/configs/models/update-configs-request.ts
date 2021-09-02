import { Bootstrapper } from "../../../bootstrapper";
import { ValidationError } from "../../../common/errors/validation-error";
import { IConfigValue } from "../../../config/config-value";
import { LocalisationKey } from "../../../localisation/localisation-key";

export class UpdateConfigsRequest {
    public configs: Array<ConfigToUpdate>;

    public validate(lang: string) {
        const localisationProvider = Bootstrapper.getLocalisationProvider();

        if (!this.configs || this.configs.length == 0) {
            throw new ValidationError(localisationProvider.translate(LocalisationKey.ConfigsRequired));
        }

        this.configs.forEach(config => {
            if (!config.param) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.ConfigParamRequired));
            }

            if (!config.value) {
                throw new ValidationError(localisationProvider.translate(LocalisationKey.ConfigValueRequired));
            }
        });
    }
}

export class ConfigToUpdate {
    public param: string;
    public value: any;
}