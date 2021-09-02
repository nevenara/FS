//Re-personalization fee  -  €5.00

import { ICountryIsoCodeProvider } from "../common/country-iso-code-provider";

const reporsanilizationFee = 5;
const euCountries = [];
euCountries.push('AT');
euCountries.push('BE');
euCountries.push('BG');
euCountries.push('CZ');
euCountries.push('DK');
euCountries.push('EE');
euCountries.push('FI');
euCountries.push('FR');
euCountries.push('DE');
euCountries.push('GR');
euCountries.push('HU');
euCountries.push('IE');
euCountries.push('IT');
euCountries.push('LU');
euCountries.push('NL');
euCountries.push('NO');
euCountries.push('PL');
euCountries.push('PT');
euCountries.push('RO');
euCountries.push('SK');
euCountries.push('SI');
euCountries.push('ES');
euCountries.push('SE');

export interface ITicketPriceCalculator {
    getRepersonalizationFee(country: string): number;
    calculateAdditionalFee(ticketPrice: number, country: string): number;
    getPercentage(country: string): number;
    getRepersonalizationFeeConstant(): number
}

//calculate ticket price 
export class TicketPriceCalculator implements ITicketPriceCalculator {

    constructor(private countryIsoCodeProvider: ICountryIsoCodeProvider) {
    }

    public getRepersonalizationFeeConstant(): number {
        return reporsanilizationFee;
    }

    public getRepersonalizationFee(country: string): number {
        return this.addPercentage(reporsanilizationFee, country);;
    }

    public calculateAdditionalFee(ticketPrice: number, country: string): number {
        let newTicketPrice = ticketPrice + reporsanilizationFee;

        return this.addPercentage(newTicketPrice, country);
    }

    public addPercentage(newTicketPrice: number, country: string): number {

        //calculate 1.4 percent
        const percentage = ((newTicketPrice * this.getPercentage(country)) / 100) + 0.25;

        return newTicketPrice + percentage;
    }

    public getPercentage(country: string): number {
        const isoCode = this.countryIsoCodeProvider.getIsoCode(country);

        if (!this.isEuCountry(isoCode)) {
            return 2.9;
        }

        return 1.4;
    }

    private isEuCountry(code) {
        return euCountries.find(n => n === code);
    }
}