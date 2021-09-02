import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { noWhitespaceValidator } from 'src/app/shared/Validators/no-white-space-validator';
import { SupportService } from '../../services/support-service'
import { FAQModel } from '../models/faq-model'
import { Subscription } from 'rxjs';
import { UserProfileService } from 'src/app/services/user-profile-service';
import { UserProfileData } from 'src/app/profile/profile/models/user-profile-data';
import { SendEmailToSupportRequest } from 'src/app/services/models/send-email-to-support-request';
import { LikeFAQRequest } from 'src/app/services/models/like-faq-request';
import { TranslateService } from '@ngx-translate/core';
import { LocalisationService } from 'src/app/localisation/services/localisation.service';

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit, OnDestroy {
  form: FormGroup;
  isSubmit = false;
  name = 'Angular 6';
  htmlContent = '';
  faqs: FAQModel;
  // highlightLike:boolean;
  // highlightDislike:boolean
  supportContact;
  user: UserProfileData = new UserProfileData();
  supportSubject: string;
  supportMessage: string;
  opened;

  config: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '12rem',
    minHeight: '12rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };


  public isCollapsed = true;
  public isCollapsed1 = true;
  public isCollapsed2 = true;
  public isCollapsed3 = true;
  public isCollapsed4 = true;
  public isCollapsed5 = true;
  public isCollapsed6 = true;
  public isCollapsed7 = true;

  changeLanguageSubscription: Subscription;


  closeResult = '';

  constructor(private modalService: NgbModal, private formBuilder: FormBuilder, private supportService: SupportService, private userProfileService: UserProfileService, private translate: TranslateService, private localisationService: LocalisationService) {

  }

  ngOnInit(): void {
    this.opened = 0;
    this.setLanguage();
    this.changeLanguageSubscription = this.localisationService.changeLanguage$.subscribe(() => {
        this.setLanguage();
    })
    this.getFAQS();
    this.getSupportContact();
    this.create();
  }

  ngOnDestroy() {
    this.changeLanguageSubscription.unsubscribe();
  }

  create(){
    this.form = this.formBuilder.group({
      email: [''],
      name: [''],
      subject : ['', [Validators.required, noWhitespaceValidator ]],
      message: ['', [Validators.required, noWhitespaceValidator ]]
    })
  }

  get f() {
    return this.form.controls; 
  }

  open(content) {
    this.modalService.open(content, { size: 'xl', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  setLanguage() {
    this.translate.get('support.messagePlaceholder').subscribe((data:any)=> {
      this.config.placeholder = data;
     });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }


  getFAQS(){
    this.supportService.getFAQS().subscribe(
        (response) => {
            this.faqs = response;
            for (let i = 0; i < this.faqs.FAQsByCategory.length; i++) {
            for (let j = 0; j < this.faqs.FAQsByCategory[i].FAQs.length; j++) {
              if(this.faqs.FAQsByCategory[i].FAQs[j].likes == undefined){
                this.faqs.FAQsByCategory[i].FAQs[j].isLiked = false;
                this.faqs.FAQsByCategory[i].FAQs[j].isDisliked = false;
              }             
            }  
            }
            console.log(this.faqs);
            this.opened = 1;
        },
        (error) => {
            console.log(error);
        }
    );
  }
  getSupportContact(){
    this.supportService.getSupportContact().subscribe(
        (response) => {
          this.supportContact = response;
            console.log(response);
        },
        (error) => {
            console.log(error);
        }
    );
  }
  getUserProfile(){
    this.userProfileService.getUserProfile().subscribe(response => {
      this.user = response;
    }, err => {
      console.log(err);
    });
  }

  sendSupportMail(){
    this.isSubmit = true;
    if (this.form.invalid) { 
      return; 
    }
    let request = new SendEmailToSupportRequest();
    request.email = this.user.email;
    request.username = this.user.username;
    request.subject = this.supportSubject;
    request.message = this.supportMessage;
    this.supportService.sendMailToSupport(request).subscribe(
        (response) => {
            console.log(response);
        },
        (error) => {
            console.log(error);
        }
    );
  }

  likeAnswer(id, i, j){
    let request = new LikeFAQRequest();
    request.id = id;
    this.supportService.likeFAQ(request).subscribe(
      (response) => {
        this.faqs.FAQsByCategory[i].FAQs[j].likes = response.faq.likes
        this.faqs.FAQsByCategory[i].FAQs[j].dislikes = response.faq.dislikes
        this.faqs.FAQsByCategory[i].FAQs[j].isLiked = !this.faqs.FAQsByCategory[i].FAQs[j].isLiked;
        this.faqs.FAQsByCategory[i].FAQs[j].isDisliked = false;
        console.log(response);
    },
    (error) => {
        console.log(error);
    }
);
  }

  dislikeAnswer(id, i, j){
    let request = new LikeFAQRequest();
    request.id = id;
    this.supportService.dislikeFAQ(request).subscribe(
      (response) => {
        this.faqs.FAQsByCategory[i].FAQs[j].likes = response.faq.likes
        this.faqs.FAQsByCategory[i].FAQs[j].dislikes = response.faq.dislikes
        this.faqs.FAQsByCategory[i].FAQs[j].isLiked = false;
        this.faqs.FAQsByCategory[i].FAQs[j].isDisliked = !this.faqs.FAQsByCategory[i].FAQs[j].isDisliked
        console.log(response);
    },
    (error) => {
        console.log(error);
    }
);
  }

  


}
