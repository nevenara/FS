import { LocalisationKey } from "../localisation/localisation-key";
import { ILocalisationProvider } from "../localisation/localisation-provider";
import { Country, ICountryListProvider } from "./country-list-provider";
import { ValidationError } from "./errors/validation-error";

export interface ICountryIsoCodeProvider {
    getIsoCode(countryName: string): string;
}

export class CountryIsoCodeProvider implements ICountryIsoCodeProvider {
    constructor(private countryListProvider: ICountryListProvider, private localisationProvider: ILocalisationProvider) {

    }

    public getIsoCode(countryName: string): string {
        //set country code
        // https://stripe.com/docs/api/country_specs/object
        //Austria is hard coded for now..
        //we need to convert in format that Stripe accepts...
        // return "AT";//hard coded for Austria.

        const country: Country =
            this.countryListProvider.getList().find(c => { return c.name === countryName || c.key === countryName });

        if (!country) {
            throw new ValidationError(this.localisationProvider.translate(LocalisationKey.InvalidCountryName + ' ' + countryName));
        }

        return country.key;
    }
}


