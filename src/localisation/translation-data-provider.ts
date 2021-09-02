import { promises as fs } from 'fs';
import { IAppLogger } from '../common/app-logger';
import { Environment } from '../environment';
const path = require('path');

export interface ITranslationDataProvider {
    getDataForLang(lang: string, be: boolean);
}

export class TranslationDataProvider implements ITranslationDataProvider {
    private container: any;
    private beContainer: any;

    constructor(private logger: IAppLogger) {
        this.container = {};
        this.beContainer = {};
    }

    public getDataForLang(lang: string, be: boolean) {
        let data = be ? this.beContainer[lang] : this.container[lang];

        if (!data) {
            this.logger.log(`No translation found for ${lang}.`);
            data = be ? this.beContainer['en'] : this.container['de'];
        }

        return data;
    }

    public async init() {
        try {
            const dePath =
                Environment.isInsideDocker()
                    ? path.join('out', 'src', 'i18n', 'de.json')
                    : path.join('src', 'i18n', 'de.json');

            this.container['de'] = (await fs.readFile(dePath, 'utf8')).toString();

            const enPath = Environment.isInsideDocker()
                ? path.join('out', 'src', 'i18n', 'en.json')
                : path.join('src', 'i18n', 'en.json');

            this.container['en'] = (await fs.readFile(enPath, 'utf8')).toString();

            const beDePath =
            Environment.isInsideDocker()
                ? path.join('out', 'src', 'i18n', 'be-de.json')
                : path.join('src', 'i18n', 'be-de.json');

            this.beContainer['de'] = JSON.parse(await (await fs.readFile(beDePath, 'utf8')).toString());

            const beEnPath = Environment.isInsideDocker()
                ? path.join('out', 'src', 'i18n', 'be-en.json')
                : path.join('src', 'i18n', 'be-en.json');

            this.beContainer['en'] = JSON.parse(await (await fs.readFile(beEnPath, 'utf8')).toString());
        } catch (error) {
            this.logger.error(error, 'TranslationDataProvider init error.');
            throw error;
        }
    }
}