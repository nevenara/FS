(window.webpackJsonp=window.webpackJsonp||[]).push([[21],{FrOK:function(e,t,s){"use strict";s.d(t,"a",(function(){return y}));var n=s("fXoL"),o=s("ofXK");function i(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1,"Selection is required"),n.Rb())}function r(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1,"Field is required"),n.Rb())}function c(e,t){if(1&e&&(n.Sb(0,"span",2),n.Kc(1),n.Rb()),2&e){const e=n.hc(2);n.zb(1),n.Mc(" Username must have at least ",e.control.errors.minlength.requiredLength," characters ")}}function a(e,t){if(1&e&&(n.Sb(0,"span",2),n.Kc(1),n.Rb()),2&e){const e=n.hc(2);n.zb(1),n.Mc(" Field must have upto ",e.control.errors.maxlength.requiredLength," characters ")}}function l(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Bad Format "),n.Rb())}function b(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Password and Confirm Password didn't match. "),n.Rb())}function d(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Password must include at least 1 upper case letter. "),n.Rb())}function u(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Password must include at least 1 lower case letter. "),n.Rb())}function p(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Password must include at least 1 digit. "),n.Rb())}function g(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Password must consist of min. 6 characters. "),n.Rb())}function m(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1,"Email must be a valid email address "),n.Rb())}function h(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," An account with email is already existing! If you forgot your\npassword, please use the password recovery link. "),n.Rb())}function f(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Email format is not valid. "),n.Rb())}function S(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Email address is not valid. "),n.Rb())}function R(e,t){1&e&&(n.Sb(0,"span",2),n.Kc(1," Username must have 4 Characters\n"),n.Rb())}function v(e,t){if(1&e&&(n.Sb(0,"div"),n.Ic(1,i,2,0,"span",1),n.Ic(2,r,2,0,"span",1),n.Ic(3,c,2,1,"span",1),n.Ic(4,a,2,1,"span",1),n.Ic(5,l,2,0,"span",1),n.Ic(6,b,2,0,"span",1),n.Ic(7,d,2,0,"span",1),n.Ic(8,u,2,0,"span",1),n.Ic(9,p,2,0,"span",1),n.Ic(10,g,2,0,"span",1),n.Ic(11,m,2,0,"span",1),n.Ic(12,h,2,0,"span",1),n.Ic(13,f,2,0,"span",1),n.Ic(14,S,2,0,"span",1),n.Ic(15,R,2,0,"span",1),n.Rb()),2&e){const e=n.hc();n.zb(1),n.nc("ngIf",e.control.errors.selectionRequired),n.zb(1),n.nc("ngIf",e.control.errors.required),n.zb(1),n.nc("ngIf",e.control.errors.minlength),n.zb(1),n.nc("ngIf",e.control.errors.maxlength),n.zb(1),n.nc("ngIf",e.control.errors.pattern),n.zb(1),n.nc("ngIf",e.control.errors.confirmPasswordValidator),n.zb(1),n.nc("ngIf",e.control.errors.hasCapitalCase),n.zb(1),n.nc("ngIf",e.control.errors.hasSmallCase),n.zb(1),n.nc("ngIf",e.control.errors.hasNumber),n.zb(1),n.nc("ngIf",e.control.errors.invalidPassword),n.zb(1),n.nc("ngIf",e.control.errors.email),n.zb(1),n.nc("ngIf",e.control.errors.emailAlreadyRegistered),n.zb(1),n.nc("ngIf",e.control.errors.wrongEmailFormat),n.zb(1),n.nc("ngIf",e.control.errors.blacklistTemporaryEmailAddresses),n.zb(1),n.nc("ngIf",e.control.errors.invalidusername)}}let y=(()=>{class e{constructor(){}ngOnInit(){}}return e.\u0275fac=function(t){return new(t||e)},e.\u0275cmp=n.Gb({type:e,selectors:[["errors"]],inputs:{control:"control",isSubmit:"isSubmit"},decls:1,vars:1,consts:[[4,"ngIf"],["class","validation-invalid-label",4,"ngIf"],[1,"validation-invalid-label"]],template:function(e,t){1&e&&n.Ic(0,v,16,15,"div",0),2&e&&n.nc("ngIf",t.isSubmit&&t.control.errors)},directives:[o.l],styles:[""]}),e})()},ZlwT:function(e,t,s){"use strict";s.r(t),s.d(t,"SupportModule",(function(){return A}));var n=s("ofXK"),o=s("tyNb"),i=s("1kSV"),r=s("3Pt+"),c=s("MBRw"),a=s("JxTd");class l{}class b{}var d=s("fXoL"),u=s("wY2j"),p=s("tk/3");let g=(()=>{class e{constructor(e){this.http=e}getFAQS(){return this.http.get(u.a.serviceUrl+"/support/faq")}getSupportContact(){return this.http.get(u.a.serviceUrl+"/support/contact")}likeFAQ(e){return this.http.post(u.a.serviceUrl+"/support/faq/like",e)}dislikeFAQ(e){return this.http.post(u.a.serviceUrl+"/support/faq/dislike",e)}sendMailToSupport(e){return this.http.post(u.a.serviceUrl+"/support/sendemail",e)}}return e.\u0275fac=function(t){return new(t||e)(d.ac(p.b))},e.\u0275prov=d.Ib({token:e,factory:e.\u0275fac,providedIn:"root"}),e})();var m=s("1Kgi"),h=s("FrOK"),f=s("mUB+");function S(e,t){if(1&e){const e=d.Tb();d.Sb(0,"div",3),d.Sb(1,"div",4),d.Sb(2,"h2",5),d.Kc(3,"Need help? Get in touch with our Support Team"),d.Rb(),d.Rb(),d.Sb(4,"div",6),d.Sb(5,"div",7),d.Sb(6,"div",8),d.Nb(7,"i",9),d.Sb(8,"h5",10),d.Kc(9,"Frequently Asked Questions"),d.Rb(),d.Sb(10,"p",11),d.Kc(11,"Please browse our FAQs below to fnd a solution for your problem. If you are still left with open questions don\xb4t hestitate to contact us. "),d.Nb(12,"br"),d.Kc(13," Our Support Team will be happy to help you. "),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Sb(14,"div",6),d.Sb(15,"div",7),d.Sb(16,"div",8),d.Nb(17,"i",12),d.Sb(18,"h5",13),d.Kc(19,"Contact us via Email "),d.Rb(),d.Sb(20,"p",11),d.Kc(21,"Ouch found swore much dear conductively hid submissively hatchet vexed far"),d.Rb(),d.Sb(22,"a",14),d.dc("click",(function(){d.Bc(e);const t=d.hc(),s=d.yc(3);return t.getUserProfile(),t.open(s)})),d.Kc(23,"Send Email"),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Sb(24,"div",6),d.Sb(25,"div",7),d.Sb(26,"div",8),d.Nb(27,"i",15),d.Sb(28,"h5",5),d.Kc(29),d.Rb(),d.Sb(30,"p",11),d.Kc(31,"Monday - Friday 9:00 - 17:00 After business hours and weekends please contact us via email. "),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb()}if(2&e){const e=d.hc();d.zb(29),d.Mc("Support Hotline: ",e.supportContact.phone,"")}}function R(e,t){if(1&e){const e=d.Tb();d.Sb(0,"div",19),d.Sb(1,"div",20),d.Sb(2,"div",21),d.Sb(3,"h6",22),d.Sb(4,"a",23),d.dc("click",(function(){const e=t.$implicit;return e.isCollapsed=!e.isCollapsed})),d.Nb(5,"i",24),d.Kc(6),d.Rb(),d.Rb(),d.Rb(),d.Sb(7,"div",25),d.Sb(8,"div",26),d.Kc(9),d.Rb(),d.Sb(10,"div",27),d.Sb(11,"span",28),d.Kc(12),d.Rb(),d.Sb(13,"ul",29),d.Sb(14,"li",30),d.Sb(15,"a",31),d.dc("click",(function(){d.Bc(e);const s=t.$implicit,n=t.index,o=d.hc().index;return d.hc(2).likeAnswer(s.id,o,n)})),d.Nb(16,"i",32),d.Rb(),d.Kc(17),d.Rb(),d.Sb(18,"li",30),d.Sb(19,"a",31),d.dc("click",(function(){d.Bc(e);const s=t.$implicit,n=t.index,o=d.hc().index;return d.hc(2).dislikeAnswer(s.id,o,n)})),d.Nb(20,"i",33),d.Rb(),d.Kc(21),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb()}if(2&e){const e=t.$implicit,s=d.hc().$implicit;d.zb(4),d.Ab("aria-expanded",s.isCollapsed),d.zb(2),d.Mc(" ",e.question," "),d.zb(1),d.nc("ngbCollapse",!e.isCollapsed),d.zb(2),d.Mc(" ",e.answer," "),d.zb(3),d.Lc(e.lastUpdate),d.zb(3),d.nc("ngClass",e.isLiked?"text-primary":"text-muted"),d.zb(2),d.Mc(" ",e.likes," "),d.zb(2),d.nc("ngClass",e.isDisliked?"text-primary":"text-muted"),d.zb(2),d.Mc(" ",e.dislikes," ")}}function v(e,t){if(1&e&&(d.Sb(0,"div",17),d.Sb(1,"p"),d.Kc(2),d.Rb(),d.Ic(3,R,22,9,"div",18),d.Rb()),2&e){const e=t.$implicit;d.zb(2),d.Lc(e.category),d.zb(1),d.nc("ngForOf",e.FAQs)}}function y(e,t){if(1&e&&(d.Sb(0,"div",3),d.Sb(1,"div",4),d.Sb(2,"h2",5),d.Kc(3,"Frequently Asked Questions"),d.Rb(),d.Rb(),d.Ic(4,v,4,2,"div",16),d.Rb()),2&e){const e=d.hc();d.zb(4),d.nc("ngForOf",e.faqs.FAQsByCategory)}}const C=function(){return{standalone:!0}};function k(e,t){if(1&e){const e=d.Tb();d.Sb(0,"div",34),d.Sb(1,"h6",35),d.Kc(2,"Send Email"),d.Rb(),d.Rb(),d.Sb(3,"form",36),d.dc("ngSubmit",(function(){return d.Bc(e),d.hc().onSubmit()})),d.Sb(4,"div",37),d.Sb(5,"div",38),d.Sb(6,"label",39),d.Kc(7,"Email"),d.Rb(),d.Sb(8,"div",40),d.Sb(9,"input",41),d.dc("ngModelChange",(function(t){return d.Bc(e),d.hc().user.email=t})),d.Rb(),d.Rb(),d.Rb(),d.Sb(10,"div",38),d.Sb(11,"label",39),d.Kc(12,"Name"),d.Rb(),d.Sb(13,"div",40),d.Sb(14,"input",42),d.dc("ngModelChange",(function(t){return d.Bc(e),d.hc().user.username=t})),d.Rb(),d.Rb(),d.Rb(),d.Sb(15,"div",38),d.Sb(16,"label",39),d.Kc(17,"Subject"),d.Rb(),d.Sb(18,"div",40),d.Sb(19,"input",43),d.dc("ngModelChange",(function(t){return d.Bc(e),d.hc().supportSubject=t})),d.Rb(),d.Nb(20,"errors",44),d.Rb(),d.Rb(),d.Sb(21,"div",38),d.Sb(22,"label",39),d.Kc(23,"Message"),d.Rb(),d.Sb(24,"div",40),d.Nb(25,"textarea",45),d.Sb(26,"angular-editor",46),d.dc("ngModelChange",(function(t){return d.Bc(e),d.hc().supportMessage=t})),d.Rb(),d.Nb(27,"errors",44),d.Rb(),d.Rb(),d.Rb(),d.Sb(28,"div",47),d.Sb(29,"button",48),d.dc("click",(function(){return t.$implicit.dismiss("Cross click")})),d.Kc(30,"Cancel"),d.Rb(),d.Sb(31,"button",49),d.dc("click",(function(){d.Bc(e);const s=t.$implicit;return d.hc().sendSupportMail(),s.close("Save click")})),d.Kc(32,"Send"),d.Rb(),d.Rb(),d.Rb()}if(2&e){const e=d.hc();d.zb(3),d.nc("formGroup",e.form),d.zb(6),d.nc("ngModel",e.user.email),d.zb(5),d.nc("ngModel",e.user.username)("ngModelOptions",d.rc(13,C)),d.zb(5),d.nc("ngModel",e.supportSubject)("ngModelOptions",d.rc(14,C)),d.zb(1),d.nc("control",e.f.subject)("isSubmit",e.isSubmit),d.zb(6),d.nc("ngModel",e.supportMessage)("config",e.config)("ngModelOptions",d.rc(15,C)),d.zb(1),d.nc("control",e.f.message)("isSubmit",e.isSubmit)}}const w=[{path:"",component:(()=>{class e{constructor(e,t,s,n){this.modalService=e,this.formBuilder=t,this.supportService=s,this.userProfileService=n,this.isSubmit=!1,this.name="Angular 6",this.htmlContent="",this.user=new a.a,this.config={editable:!0,spellcheck:!0,height:"12rem",minHeight:"12rem",placeholder:"Enter text here...",translate:"no",defaultParagraphSeparator:"p",defaultFontName:"Arial",toolbarHiddenButtons:[["bold"]],customClasses:[{name:"quote",class:"quote"},{name:"redText",class:"redText"},{name:"titleText",class:"titleText",tag:"h1"}]},this.isCollapsed=!0,this.isCollapsed1=!0,this.isCollapsed2=!0,this.isCollapsed3=!0,this.isCollapsed4=!0,this.isCollapsed5=!0,this.isCollapsed6=!0,this.isCollapsed7=!0,this.closeResult=""}ngOnInit(){this.opened=0,this.getFAQS(),this.getSupportContact(),this.create()}create(){this.form=this.formBuilder.group({email:[""],name:[""],subject:["",[r.x.required,c.a]],message:["",[r.x.required,c.a]]})}get f(){return this.form.controls}onSubmit(){this.isSubmit=!0}open(e){this.modalService.open(e,{size:"xl",ariaLabelledBy:"modal-basic-title"}).result.then(e=>{this.closeResult="Closed with: "+e},e=>{this.closeResult="Dismissed "+this.getDismissReason(e)})}getDismissReason(e){return e===i.a.ESC?"by pressing ESC":e===i.a.BACKDROP_CLICK?"by clicking on a backdrop":"with: "+e}getFAQS(){this.supportService.getFAQS().subscribe(e=>{this.faqs=e;for(let t=0;t<this.faqs.FAQsByCategory.length;t++)for(let e=0;e<this.faqs.FAQsByCategory[t].FAQs.length;e++)null==this.faqs.FAQsByCategory[t].FAQs[e].likes&&(this.faqs.FAQsByCategory[t].FAQs[e].isLiked=!1,this.faqs.FAQsByCategory[t].FAQs[e].isDisliked=!1);console.log(this.faqs),this.opened=1},e=>{console.log(e)})}getSupportContact(){this.supportService.getSupportContact().subscribe(e=>{this.supportContact=e,console.log(e)},e=>{console.log(e)})}getUserProfile(){this.userProfileService.getUserProfile().subscribe(e=>{this.user=e},e=>{console.log(e)})}sendSupportMail(){let e=new l;e.email=this.user.email,e.username=this.user.username,e.subject=this.supportSubject,e.message=this.supportMessage,this.supportService.sendMailToSupport(e).subscribe(e=>{console.log(e)},e=>{console.log(e)})}likeAnswer(e,t,s){let n=new b;n.id=e,this.supportService.likeFAQ(n).subscribe(e=>{this.faqs.FAQsByCategory[t].FAQs[s].likes=e.faq.likes,this.faqs.FAQsByCategory[t].FAQs[s].dislikes=e.faq.dislikes,this.faqs.FAQsByCategory[t].FAQs[s].isLiked=!this.faqs.FAQsByCategory[t].FAQs[s].isLiked,this.faqs.FAQsByCategory[t].FAQs[s].isDisliked=!1,console.log(e)},e=>{console.log(e)})}dislikeAnswer(e,t,s){let n=new b;n.id=e,this.supportService.dislikeFAQ(n).subscribe(e=>{this.faqs.FAQsByCategory[t].FAQs[s].likes=e.faq.likes,this.faqs.FAQsByCategory[t].FAQs[s].dislikes=e.faq.dislikes,this.faqs.FAQsByCategory[t].FAQs[s].isLiked=!1,this.faqs.FAQsByCategory[t].FAQs[s].isDisliked=!this.faqs.FAQsByCategory[t].FAQs[s].isDisliked,console.log(e)},e=>{console.log(e)})}}return e.\u0275fac=function(t){return new(t||e)(d.Mb(i.n),d.Mb(r.d),d.Mb(g),d.Mb(m.a))},e.\u0275cmp=d.Gb({type:e,selectors:[["app-support"]],decls:4,vars:2,consts:[["class","row",4,"ngIf"],["p",""],["content",""],[1,"row"],[1,"col-lg-12","text-center","my-2"],[1,"card-title","text-blue-400"],[1,"col-lg-4"],[1,"card","custom-height"],[1,"card-body","text-center"],[1,"icon-question3","icon-2x","text-success-400","border-success-400","border-3","rounded-round","p-3","mb-3","mt-1"],[1,"card-title","text-success-400"],[1,"mb-3"],[1,"icon-envelop","icon-2x","text-warning","border-warning","border-3","rounded-round","p-3","mb-3","mt-1"],[1,"card-title","text-warning-400"],[1,"btn","bg-warning",3,"click"],[1,"icon-phone2","icon-2x","text-blue","border-blue","border-3","rounded-round","p-3","mb-3","mt-1"],["class","col-lg-12",4,"ngFor","ngForOf"],[1,"col-lg-12"],["class","card-group-control card-group-control-right",4,"ngFor","ngForOf"],[1,"card-group-control","card-group-control-right"],[1,"card","mb-2"],[1,"card-header"],[1,"card-title"],["data-toggle","collapse","aria-expanded","false",1,"text-default","collapsed",3,"click"],["placement","top","ngbTooltip","Open the question",1,"icon-help","mr-2","text-slate"],["id","question1","id","collapseExample",1,"collapse",3,"ngbCollapse"],[1,"card-body"],[1,"card-footer","bg-transparent","d-sm-flex","align-items-sm-center","border-top-0","pt-0"],[1,"text-muted"],[1,"list-inline","text-nowrap","mb-0","ml-auto","mt-2","mt-sm-0"],[1,"list-inline-item"],[1,"mr-2",3,"ngClass","click"],[1,"icon-thumbs-up2"],[1,"icon-thumbs-down2"],[1,"modal-header","bg-warning"],[1,"modal-title"],[3,"formGroup","ngSubmit"],[1,"modal-body","px-md-4"],[1,"form-group","row"],[1,"col-form-label","col-lg-2"],[1,"col-lg-10","w-md-100"],["type","text","readonly","","formControlName","email",1,"form-control",3,"ngModel","ngModelChange"],["type","text","readonly","","formArrayName","name",1,"form-control",3,"ngModel","ngModelOptions","ngModelChange"],["type","text","placeholder","","formControlName","subject",1,"form-control",3,"ngModel","ngModelOptions","ngModelChange"],[3,"control","isSubmit"],["resize","vertical","_ngcontent-eos-c94","","rows","5","cols","5","formControlName","message","placeholder","Enter your message here",1,"form-control","d-block","d-md-none",2,"margin-top","0px","margin-top","0px","height","130px"],["formControlName","message",1,"d-none","d-md-block",3,"ngModel","config","ngModelOptions","ngModelChange"],[1,"modal-footer","justify-content-center"],["type","button","aria-label","Close",1,"btn","btn-dark","px-md-4",3,"click"],["type","submit",1,"btn","btn-warning","px-md-4",3,"click"]],template:function(e,t){1&e&&(d.Ic(0,S,32,1,"div",0),d.Ic(1,y,5,1,"div",0),d.Ic(2,k,33,16,"ng-template",1,2,d.Jc)),2&e&&(d.nc("ngIf",t.faqs),d.zb(1),d.nc("ngIf",t.faqs))},directives:[n.l,n.k,i.C,i.e,n.j,r.z,r.p,r.h,r.b,r.o,r.f,r.c,r.r,h.a,f.a],styles:['.custom-height[_ngcontent-%COMP%]{height:280px}.modal-header[_ngcontent-%COMP%]{display:block!important;text-align:center!important;padding:1.25rem;border-bottom:1px solid rgba(0,0,0,.125);border-top-left-radius:.25rem;border-top-right-radius:.25rem}  [data-action=collapse]:after{content:""!important}a[_ngcontent-%COMP%]{cursor:pointer}@media (min-width:1700px){.custom-height[_ngcontent-%COMP%]{height:325px}}@media (max-width:1150px){.custom-height[_ngcontent-%COMP%]{height:300px}}@media (max-width:768px){.custom-height[_ngcontent-%COMP%]{height:350px}}']}),e})()}];let x=(()=>{class e{}return e.\u0275mod=d.Kb({type:e}),e.\u0275inj=d.Jb({factory:function(t){return new(t||e)},imports:[[o.g.forChild(w)],o.g]}),e})();var F=s("PCNd");let A=(()=>{class e{}return e.\u0275mod=d.Kb({type:e}),e.\u0275inj=d.Jb({factory:function(t){return new(t||e)},imports:[[n.b,x,F.a,f.b]]}),e})()}}]);