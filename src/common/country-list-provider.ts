export class Country {
    public key: string;
    public name: string;
}

export const countryList = Array<Country>();

countryList.push(
    {
        key: 'AU',
        name: 'Australia'
    },
    {
        key: 'AT',
        name: 'Austria'
    },
    {
        key: 'BE',
        name: 'Belgium'
    },

    {
        key: 'BG',
        name: 'Bulgaria'
    },
    {
        key: 'CA',
        name: 'Canada'
    },
    {
        key: 'CZ',
        name: 'Czech Republic'
    },
    {
        key: 'DK',
        name: 'Denmark'
    },
    {
        key: 'EE',
        name: 'Estonia'
    },
    {
        key: 'FI',
        name: 'Finland'
    },
    {
        key: 'FR',
        name: 'France'
    },
    {
        key: 'DE',
        name: 'Germany'
    },
    {
        key: 'GR',
        name: 'Greece'
    },
    {
        key: 'HU',
        name: 'Hungary'
    },
    {
        key: 'IE',
        name: 'Ireland'
    },
    {
        key: 'IT',
        name: 'Italy'
    },
    {
        key: 'JP',
        name: 'Japan'
    },
    {
        key: 'LT',
        name: 'Lithuania'
    },
    {
        key: 'LU',
        name: 'Luxembourg'
    },
    {
        key: 'MT',
        name: 'Malta'
    },
    {
        key: 'NL',
        name: 'Netherlands'
    },
    {
        key: 'NO',
        name: 'Norway'
    },
    {
        key: 'PL',
        name: 'Poland'
    },
    {
        key: 'PT',
        name: 'Portugal'
    },
    {
        key: 'RO',
        name: 'Romania'
    }
    ,
    {
        key: 'SK',
        name: 'Slovakia'
    },
    {
        key: 'SI',
        name: 'Slovenia'
    },
    {
        key: 'ES',
        name: 'Spain'
    },
    {
        key: 'SE',
        name: 'Sweden'
    },
    {
        key: 'CH',
        name: 'Switzerland'
    },
    {
        key: 'GB',
        name: 'United Kingdom'
    },
    {
        key: 'US',
        name: 'United States'
    })



export interface ICountryListProvider {
    getList(): Array<Country>;
}

export class CountryListProvider implements ICountryListProvider {
    public getList(): Array<Country> {
        return countryList;
    }
}
