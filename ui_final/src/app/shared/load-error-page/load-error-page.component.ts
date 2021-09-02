import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LocalisationService } from 'src/app/localisation/services/localisation.service';

@Component({
  selector: 'app-load-error-page',
  templateUrl: './load-error-page.component.html',
  styleUrls: ['./load-error-page.component.css']
})
export class LoadErrorPageComponent implements OnInit, OnDestroy {
  generalError = 'Error has occured! Please try again!';

  translations = {
    'en': 'Error has occured! Please try again!',
    'de': 'Ein Fehler ist aufgetreten! Bitte versuchen Sie es erneut!'
  }

  subscription: Subscription;
  
  constructor(private localisationService: LocalisationService, private translate: TranslateService) { }

  ngOnInit(): void {
    this.setLanguage();
    this.subscription = this.localisationService.changeLanguage$.subscribe(res => {
      this.setLanguage();
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  setLanguage() {
    this.generalError = this.translations[this.translate.currentLang];
  }
}
