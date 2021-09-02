import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Environment } from '../environments/environment';
import { UserProfileService } from '../services/user-profile-service';
import { ApplicationType } from '../shared/application-type';
import { LocalisationService } from './services/localisation.service';

@Component({
  selector: 'app-localisation',
  templateUrl: './localisation.component.html',
  styleUrls: ['./localisation.component.css'],
  encapsulation: ViewEncapsulation.None,
  providers: [CookieService]
})
export class LocalisationComponent implements OnInit/*, AfterViewInit*/ {

  public current = 'de';
  public currentView = 'Deutsch';
  public show: boolean = false;


  constructor(public translate: TranslateService, private userProfileService: UserProfileService, private LocalisationService: LocalisationService, private cookieService: CookieService) { 
    translate.addLangs(['de', 'en']);
    if (Environment.applicationType() == ApplicationType.WEB) {
      this.useLang(this.cookieService.get("fansafe_lang") || 'de', false);
    }
  }

  ngOnInit(): void {
  }

 /*  ngAfterViewInit() {
    jQuery('.navbar-nav').on('click', function () {
      jQuery('.dropdown-menu').toggleClass("show");
  });
  } */

  onToggle(){
    //jQuery('.dropdown-menu').toggleClass("show");
    this.show = !this.show;
    console.log(this.show)

  }

  useLang(lang, close = true) {
    this.translate.use(lang).subscribe(res => {
      this.LocalisationService.changeLanguage();
    });

    this.cookieService.set("fansafe_lang", lang);

    this.current = lang;

    if(lang == 'de') {
      this.currentView = 'Deutsch';
    }
    else if(lang == 'en'){
      this.currentView = 'English';
    }

    
    this.userProfileService.setLang({lang: this.current}).subscribe(response => {});

    //jQuery('.dropdown-menu').toggleClass("show");
    if (close) {
      this.show = !this.show;
    }
  }

   
}
