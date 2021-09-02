import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NgbDateParserFormatter, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AlphaOnlyDirective } from './Directives/alpha-only.directive';
import { AlphaNumericOnlyDirective } from './Directives/alphanumeric-only.directive';
import { AlphaSpaceOnlyDirective } from './Directives/alphaspace-only.directive';
import { NumericOnlyDirective } from './Directives/numeric-only.directive';
import { UsernameDirective } from './Directives/username.directive';
import { ErrorsComponent } from './errors/errors.component';
import { DecimalOnlyDirective} from './directives/decimal-only.directive'
import { NumbersOnly } from './Directives/number-only-directive'
import { PreloaderComponent } from './Preloader/preloader.component';
import { CardPaymentComponent } from '../card-payment/card-payment.component';
import { UpdateBankAccountComponent } from '../account/update-bank-account/update-bank-account.component';
import { UploadAddressDocumentComponent } from '../account/update-bank-account/upload-address-document/upload-address-document.component';
import { ProvideBankAccountDataComponent } from '../account/update-bank-account/provide-bank-account-data/provide-bank-account-data.component';
import { FailedUpdateComponent } from '../account/update-bank-account/failed-update/failed-update.component';
import { SuccessUpdateComponent } from '../account/update-bank-account/success-update/success-update.component';
import { LoadErrorPageComponent } from './load-error-page/load-error-page.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { LocalisationComponent } from '../localisation/localisation.component';
import { IdVerificationComponent } from '../id-verification/id-verification.component'
import { ChooseIdDocumentComponent } from './../id-verification/choose-id-document/choose-id-document.component'
import { InitialIdVerificationComponent } from '../id-verification/initial-id-verification/initial-id-verification.component'
import { UploadIdDocumentComponent } from '../id-verification/upload-id-document/upload-id-document.component'
import { SelfieImageComponent } from '../id-verification/selfie-image/selfie-image.component'
import { idVerificationFail } from '../id-verification/id-verification-fail/id-verification-fail.component'
import { idVerificationSuccess } from '../id-verification/id-verification-success/id-verification-success.component'
import { CameraViewComponent } from '../camera-view/camera-view.component';
import { WebcamModule } from 'ngx-webcam';
import { LineTruncationLibModule, LineTruncationDirective } from 'ngx-line-truncation';

import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { ChartsModule } from 'ng2-charts';
import { NgbDateCustomParserFormatter } from './DatepickerAdapter/datepickerFormatter';
import { Environment } from '../environments/environment';
import { ApplicationType } from './application-type';
import { TranslationLoader } from '../translation-loader';
import { CookieService } from 'ngx-cookie-service';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslationLoader(http);
}

@NgModule({
  declarations: [
    AlphaOnlyDirective,
    NumericOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphaSpaceOnlyDirective,
    UsernameDirective,
    DecimalOnlyDirective,
    NumbersOnly,
    ErrorsComponent,
    PreloaderComponent,
    CardPaymentComponent,
    UpdateBankAccountComponent,
    UploadAddressDocumentComponent,
    ProvideBankAccountDataComponent,
    FailedUpdateComponent,
    SuccessUpdateComponent,
    LoadErrorPageComponent,
    LocalisationComponent,
    IdVerificationComponent, 
    ChooseIdDocumentComponent, 
    InitialIdVerificationComponent, 
    SelfieImageComponent, 
    UploadIdDocumentComponent, 
    idVerificationFail, 
    idVerificationSuccess,
    CameraViewComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    LineTruncationLibModule,
    NgSelectModule, FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    ChartsModule,
    WebcamModule,
    TranslateModule.forChild({loader: {
      provide: TranslateLoader,
      useFactory: (HttpLoaderFactory),
      deps: [HttpClient] 
    }}),
    
  ],
  exports: [
    // shared modules
    NgbModule,
    HttpClientModule,
    NgSelectModule, FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,

    // shared directives
    AlphaOnlyDirective,
    NumericOnlyDirective,
    AlphaNumericOnlyDirective,
    AlphaSpaceOnlyDirective,
    UsernameDirective,
    DecimalOnlyDirective,
    NumbersOnly,
    LineTruncationDirective,

    // components
    ErrorsComponent,
    PreloaderComponent,
    CardPaymentComponent,
    UpdateBankAccountComponent,
    UploadAddressDocumentComponent,
    ProvideBankAccountDataComponent,
    FailedUpdateComponent,
    SuccessUpdateComponent,
    LoadErrorPageComponent,
    LocalisationComponent,
    IdVerificationComponent, 
    ChooseIdDocumentComponent, 
    InitialIdVerificationComponent, 
    SelfieImageComponent, 
    UploadIdDocumentComponent, 
    idVerificationFail, 
    idVerificationSuccess,

    //localisation
    TranslateModule,

    //charts
    ChartsModule
  ],
  providers: [
  { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
  CookieService 
]
})
export class SharedModule { 
  constructor(private translate: TranslateService, private cookieService: CookieService) {
    translate.addLangs(['en', 'de']);

    if (Environment.applicationType() == ApplicationType.WEB) {
      let lang = this.cookieService.get("fansafe_lang");
      if (!lang) {
        lang = 'de';
        this.cookieService.set("fansafe_lang", lang);
      }

      //translate.setDefaultLang('de');
      translate.use(lang);
    } else {
      translate.setDefaultLang('en');
      translate.use('en');
    }
  }
}
