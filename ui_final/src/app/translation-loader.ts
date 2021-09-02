import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';
import { Environment } from './environments/environment';
import 'rxjs/add/operator/map';

export class TranslationLoader implements TranslateLoader {
    constructor(private http: HttpClient) { }

    getTranslation(lang: string): Observable<any> {
        return this.http.get(Environment.serviceUrl  + "/api/translation/?lang=" + lang).map(
            (res: any) => {
              return JSON.parse(res);
            }
          );
    }
}
