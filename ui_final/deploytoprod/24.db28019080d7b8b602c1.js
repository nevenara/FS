(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{AeVW:function(e,t,n){"use strict";n.r(t),n.d(t,"DetailModule",(function(){return W}));var i=n("ofXK"),o=n("PCNd"),r=n("tyNb"),a=n("7o4C"),s=n("fXoL"),c=n("O3NZ"),l=n("1kSV"),d=n("3Pt+"),b=n("t34c");class g{}class u{}var h=n("wY2j");class m{}class p{}class S{}class f{}var R=n("8o32");class v{}var z=n("KjH8"),C=n("ff27"),M=n("jK67"),k=n("FrOK"),y=n("ZOsW");function O(e,t){1&e&&(s.Sb(0,"div",56),s.Kc(1,"Phone Required"),s.Rb())}const x=function(){return{standalone:!0}},I=function(e,t){return[e,t]};function w(e,t){if(1&e){const e=s.Tb();s.Sb(0,"div",5),s.Sb(1,"div",6),s.Sb(2,"h4",7),s.Kc(3),s.Rb(),s.Sb(4,"div",8),s.Nb(5,"img",9),s.Rb(),s.Sb(6,"div",10),s.Sb(7,"label",11),s.Kc(8,"Upload Organizer Logo"),s.Rb(),s.Sb(9,"div",12),s.Sb(10,"div",13),s.Sb(11,"div",14),s.Sb(12,"div"),s.Nb(13,"input",15),s.Sb(14,"input",16),s.dc("change",(function(t){return s.Bc(e),s.hc().uploadImage(t)})),s.Rb(),s.Rb(),s.Sb(15,"a",17),s.dc("click",(function(){return s.Bc(e),s.hc().deleteImage()})),s.Nb(16,"i",18),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(17,"div",10),s.Sb(18,"label",11),s.Kc(19,"Allows Ticket return"),s.Rb(),s.Sb(20,"div",12),s.Sb(21,"div",19),s.Sb(22,"label",20),s.Sb(23,"input",21),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.ticketReturn=t})),s.Rb(),s.Nb(24,"span",22),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(25,"div",10),s.Sb(26,"label",11),s.Kc(27,"Sells at FanSafe Ticketshop"),s.Rb(),s.Sb(28,"div",12),s.Sb(29,"div",19),s.Sb(30,"label",20),s.Sb(31,"input",21),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.dansafeSale=t})),s.Rb(),s.Nb(32,"span",22),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(33,"div",10),s.Sb(34,"label",11),s.Kc(35,"Link to Lomnido Bridge"),s.Rb(),s.Sb(36,"div",12),s.Sb(37,"input",23),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.linkToLomnidoBridge=t})),s.Rb(),s.Nb(38,"errors",24),s.Rb(),s.Rb(),s.Sb(39,"div",10),s.Sb(40,"label",11),s.Kc(41,"Revenue sharing "),s.Rb(),s.Sb(42,"div",12),s.Sb(43,"div",19),s.Sb(44,"input",25),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.revenueSharing=t})),s.Rb(),s.Sb(45,"span"),s.Kc(46,"per Ticket"),s.Rb(),s.Rb(),s.Nb(47,"errors",24),s.Rb(),s.Sb(48,"div",26),s.Sb(49,"span",27),s.Kc(50,"Enter amount in \u20ac shared with organizer"),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(51,"div",28),s.Sb(52,"div",29),s.Sb(53,"label",30),s.Kc(54,"Status"),s.Rb(),s.Sb(55,"div",31),s.Sb(56,"div",32),s.Sb(57,"div",33),s.Sb(58,"input",34),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.status=t})),s.Rb(),s.Sb(59,"label",35),s.Kc(60,"Active"),s.Rb(),s.Rb(),s.Sb(61,"div",33),s.Sb(62,"input",36),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.status=t})),s.Rb(),s.Sb(63,"label",37),s.Kc(64,"Inactive"),s.Rb(),s.Rb(),s.Rb(),s.Nb(65,"errors",24),s.Rb(),s.Rb(),s.Sb(66,"div",10),s.Sb(67,"label",38),s.Kc(68,"Contact Person"),s.Rb(),s.Sb(69,"div",31),s.Sb(70,"input",39),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.contactPerson=t})),s.Rb(),s.Nb(71,"errors",24),s.Rb(),s.Rb(),s.Sb(72,"div",10),s.Sb(73,"label",38),s.Kc(74,"Email"),s.Rb(),s.Sb(75,"div",31),s.Sb(76,"input",40),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.email=t})),s.Rb(),s.Nb(77,"errors",24),s.Rb(),s.Rb(),s.Sb(78,"div",10),s.Sb(79,"label",38),s.Kc(80,"Phone"),s.Rb(),s.Sb(81,"div",31),s.Sb(82,"ngx-intl-tel-input",41),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.phone=t}))("ngModelChange",(function(){return s.Bc(e),s.hc().checkIsEmpty()})),s.Rb(),s.Ic(83,O,2,0,"div",42),s.Rb(),s.Rb(),s.Sb(84,"div",10),s.Sb(85,"label",38),s.Kc(86,"URL"),s.Rb(),s.Sb(87,"div",31),s.Sb(88,"input",43),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.url=t})),s.Rb(),s.Nb(89,"errors",24),s.Rb(),s.Rb(),s.Sb(90,"div",10),s.Sb(91,"label",38),s.Kc(92,"Address"),s.Rb(),s.Sb(93,"div",31),s.Sb(94,"input",44),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.address=t})),s.Rb(),s.Nb(95,"errors",24),s.Rb(),s.Rb(),s.Sb(96,"div",10),s.Sb(97,"label",38),s.Kc(98,"Zip Code"),s.Rb(),s.Sb(99,"div",31),s.Sb(100,"input",45),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.postCode=t})),s.Rb(),s.Nb(101,"errors",24),s.Rb(),s.Rb(),s.Sb(102,"div",10),s.Sb(103,"label",38),s.Kc(104,"City"),s.Rb(),s.Sb(105,"div",31),s.Sb(106,"input",46),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.city=t})),s.Rb(),s.Nb(107,"errors",24),s.Rb(),s.Rb(),s.Sb(108,"div",10),s.Sb(109,"label",38),s.Kc(110,"Country"),s.Rb(),s.Sb(111,"div",31),s.Sb(112,"ng-select",47),s.dc("ngModelChange",(function(t){return s.Bc(e),s.hc().organizers.country=t})),s.Rb(),s.Nb(113,"errors",24),s.Rb(),s.Rb(),s.Sb(114,"div",5),s.Sb(115,"div",48),s.Sb(116,"button",49),s.dc("click",(function(){s.Bc(e);const t=s.hc(),n=s.yc(4);return t.open3(n)})),s.Kc(117,"Delete Organizer"),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(118,"div",26),s.Sb(119,"label",30),s.Kc(120,"Email"),s.Rb(),s.Sb(121,"button",50),s.dc("click",(function(){return s.Bc(e),s.hc().passwordRecovery()})),s.Kc(122,"Send Password Recovery Link"),s.Rb(),s.Sb(123,"div",51),s.Sb(124,"p",52),s.Kc(125),s.Rb(),s.Rb(),s.Sb(126,"div",53),s.Sb(127,"button",54),s.Kc(128,"Cancel"),s.Rb(),s.Sb(129,"button",55),s.dc("click",(function(){return s.Bc(e),s.hc().updateOrganizer()})),s.Kc(130,"Save"),s.Rb(),s.Rb(),s.Rb(),s.Rb()}if(2&e){const e=s.hc();s.zb(3),s.Lc(e.organizers.companyName),s.zb(2),s.oc("src",e.organizerImageUrl,s.Dc),s.zb(18),s.nc("ngModel",e.organizers.ticketReturn)("ngModelOptions",s.rc(55,x)),s.zb(8),s.nc("ngModel",e.organizers.dansafeSale)("ngModelOptions",s.rc(56,x)),s.zb(6),s.nc("ngModel",e.organizers.linkToLomnidoBridge),s.zb(1),s.nc("control",e.f.Bridge)("isSubmit",e.isSubmit),s.zb(6),s.nc("ngModel",e.organizers.revenueSharing),s.zb(3),s.nc("control",e.f.Revenue)("isSubmit",e.isSubmit),s.zb(11),s.nc("ngModel",e.organizers.status)("checked",e.organizers.status==e.Active),s.zb(4),s.nc("ngModel",e.organizers.status)("checked",e.organizers.status==e.Inactive),s.zb(3),s.nc("control",e.f.Status)("isSubmit",e.isSubmit),s.zb(5),s.nc("ngModel",e.organizers.contactPerson),s.zb(1),s.nc("control",e.f.Contact)("isSubmit",e.isSubmit),s.zb(5),s.nc("ngModel",e.organizers.email),s.zb(1),s.nc("control",e.f.Email)("isSubmit",e.isSubmit),s.zb(5),s.nc("cssClass","custom")("preferredCountries",e.preferredCountries)("enableAutoCountrySelect",!0)("enablePlaceholder",!0)("searchCountryFlag",!0)("searchCountryField",s.tc(57,I,e.SearchCountryField.Iso2,e.SearchCountryField.Name))("selectFirstCountry",!1)("selectedCountryISO",e.CountryISO.Austria)("maxLength",15)("tooltipField",e.TooltipLabel.Name)("phoneValidation",!0)("ngModelOptions",s.rc(60,x))("ngModel",e.organizers.phone),s.zb(1),s.nc("ngIf",!0===e.isEmpty),s.zb(5),s.nc("ngModel",e.organizers.url),s.zb(1),s.nc("control",e.f.URLl)("isSubmit",e.isSubmit),s.zb(5),s.nc("ngModel",e.organizers.address),s.zb(1),s.nc("control",e.f.Address)("isSubmit",e.isSubmit),s.zb(5),s.nc("ngModel",e.organizers.postCode),s.zb(1),s.nc("control",e.f.zipcode)("isSubmit",e.isSubmit),s.zb(5),s.nc("ngModel",e.organizers.city),s.zb(1),s.nc("control",e.f.City)("isSubmit",e.isSubmit),s.zb(5),s.nc("items",e.countries)("ngModel",e.organizers.country),s.zb(1),s.nc("control",e.f.Country)("isSubmit",e.isSubmit),s.zb(12),s.Lc(e.organizerAccount.email)}}function P(e,t){if(1&e){const e=s.Tb();s.Sb(0,"div",57),s.Sb(1,"h3",58),s.Kc(2,"Delete Organizer"),s.Rb(),s.Rb(),s.Sb(3,"div",59),s.Sb(4,"div",60),s.Nb(5,"i",61),s.Rb(),s.Sb(6,"span",62),s.Kc(7,"All data of this organizer will be deleted form the system account and all connected "),s.Nb(8,"br"),s.Kc(9," data will be lost! "),s.Nb(10,"br"),s.Kc(11," Are you sure you want to delete this organizer? "),s.Rb(),s.Rb(),s.Sb(12,"div",63),s.Sb(13,"button",64),s.dc("click",(function(){return t.$implicit.dismiss("Cross click")})),s.Kc(14,"Cancel"),s.Rb(),s.Sb(15,"button",65),s.dc("click",(function(){s.Bc(e);const n=t.$implicit;return s.hc().deleteOrganizer(),n.dismiss("Cross click")})),s.Kc(16,"Delete"),s.Rb(),s.Rb()}}let N=(()=>{class e{constructor(e,t,n,i,o,r,a,s){this.notificationsService=e,this.updateOrganizerRequest=t,this.route=n,this.getCountriesService=i,this.router=o,this.modalService=r,this.formBuilder=a,this.organizerService=s,this.separateDialCode=!1,this.SearchCountryField=b.e,this.TooltipLabel=b.f,this.CountryISO=b.a,this.preferredCountries=[b.a.UnitedStates,b.a.UnitedKingdom],this.organizerImageAPIUrl=h.a.serviceUrl+"/organizers/adminpanel/image",this.loader=!0,this.organizerAccount={companyName:"",email:""},this.countries=[],this.closeResult="",this.isSubmit=!1}open3(e){this.modalService.open(e,{centered:!0})}ngOnInit(){this.route.params.subscribe(e=>{this.organizerId=e["organizer.id"]}),this.getCountries(),this.create(),this.organizerId=this.route.snapshot.paramMap.get("organizerId"),this.organizerImageUrl=this.organizerImageAPIUrl+"?organizerId="+this.organizerId+"&random="+Math.random(),console.log("organizer is"),this.getOrganizersAccount(),this.getOrganizers()}getCountries(){this.loader=!0,this.countries=[],this.getCountriesService.getCountryList().subscribe(e=>{this.countries=e,this.loader=!1},e=>{console.log(e),this.loader=!1,this.loadingError=!0})}create(){this.form=this.formBuilder.group({Revenue:["",d.x.required],Bridge:["",d.x.required],Status:["",d.x.required],Contact:["",d.x.required],Email:["",[d.x.required,d.x.pattern("^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],URLl:["",d.x.required],Address:["",d.x.required],zipcode:["",d.x.required],City:["",d.x.required],Country:[null,d.x.required]})}get f(){return this.form.controls}onSubmit(){this.isSubmit=!0}checkIsEmpty(){null!=this.isEmpty&&(this.isEmpty=null==this.organizers.phone)}validatePhone(){if(null==this.organizers.phone)return this.isEmpty=!0,!1;this.isEmpty=!1}uploadImage(e){this.organizerImage=e.target.files[0];var t=new FileReader;t.readAsDataURL(e.target.files[0]),t.onload=e=>{this.organizerImageUrl=t.result.toString()};const n=new S;n.image=e.target.files[0],n.organizerId=this.organizerId,console.log(n.image),this.organizerService.uploadOrganizerImage(n).subscribe(e=>{this.loader=!1,this.organizerImageUrl=this.organizerImageAPIUrl+"?organizerId="+this.organizerId+"&random="+Math.random()},e=>{})}deleteImage(){const e=new f;e.organizerId=this.organizerId,this.organizerImageUrl=this.organizerImageAPIUrl,this.organizerService.deleteOrganizerImage(e).subscribe(e=>{})}getOrganizers(){let e=new g;e.organizerId=this.organizerId,this.organizerService.getOrganizerMainData(e).subscribe(e=>{this.organizers=e,console.log(e)},e=>{console.log(e),this.loader=!1,this.loadingError=!0})}deleteOrganizer(){let e=new m;e.organizerId=this.organizerId,this.organizerService.deleteOrganizer(e).subscribe(e=>{console.log(e)},e=>{console.log(e),this.loader=!1,this.loadingError=!0})}updateOrganizer(){this.phoneValid=0!=this.validatePhone(),this.isSubmit=!0,console.log(this.phoneValid),this.form.invalid||0==this.phoneValid||(console.log(this.organizers.phone),this.updateOrganizerRequest.organizerId=this.organizerId,this.updateOrganizerRequest.address=this.organizers.address,this.updateOrganizerRequest.city=this.organizers.city,this.updateOrganizerRequest.contactPerson=this.organizers.contactPerson,this.updateOrganizerRequest.country=this.organizers.country.name,this.updateOrganizerRequest.email=this.organizers.email,this.updateOrganizerRequest.fansafeSale=this.organizers.fansafeSale,this.updateOrganizerRequest.phone=this.organizers.phone.internationalNumber,this.updateOrganizerRequest.linkToLomnidoBridge=this.organizers.linkToLomnidoBridge,this.updateOrganizerRequest.postCode=this.organizers.postCode,this.updateOrganizerRequest.status=this.organizers.status,this.updateOrganizerRequest.url=this.organizers.url,this.updateOrganizerRequest.ticketReturn=this.organizers.ticketReturn,this.updateOrganizerRequest.revenueSharing=this.organizers.revenueSharing,this.organizerService.updateOrganizer(this.updateOrganizerRequest).subscribe(e=>{this.notificationsService.showSuccess("Organizer updated successfully!"),this.loader=!1,console.log(e)},e=>{console.log(e),this.loader=!1,this.loadingError=!0}))}passwordRecovery(){let e=new R.a;e.email=this.organizers.email,console.log({email:e}),this.organizerService.passwordRecovery(e).subscribe(e=>{this.notificationsService.showSuccess("Password reset sent successfully! Check your email."),console.log(e)},e=>{console.log(e)})}getOrganizersAccount(){let e=new v;e.organizerId=this.organizerId,this.organizerService.getOrganizersAccountSettings(e).subscribe(e=>{this.organizerAccount=e,console.log(e)},e=>{console.log(e)})}}return e.\u0275fac=function(t){return new(t||e)(s.Mb(z.a),s.Mb(p),s.Mb(r.a),s.Mb(C.a),s.Mb(r.c),s.Mb(l.n),s.Mb(d.d),s.Mb(M.a))},e.\u0275cmp=s.Gb({type:e,selectors:[["app-main"]],features:[s.yb([u,p])],decls:5,vars:2,consts:[[1,"content"],["action","#",3,"formGroup","ngSubmit"],["class","row",4,"ngIf"],["p",""],["content3",""],[1,"row"],[1,"col-lg-6","w-md-100","mb-3"],[1,""],[1,"company-img","my-2"],["alt","",1,"",3,"src"],[1,"form-group","row","text-left"],[1,"col-lg-5","col-form-label","font-weight-semibold"],[1,"col-lg-7"],[1,"form-group","row","text-left","align-items-center"],[1,"d-flex","justify-content-center","align-items-center","mt-2"],["type","button","id","loadFileXml","value","Upload Image","onclick","document.getElementById('organizerDetail').click()",1,"action","btn","bg-primary","rounded"],["type","file","id","organizerDetail","name","organizerDetail",2,"display","none",3,"change"],[3,"click"],[1,"fas","fa-trash","ml-3","text-primary"],[1,"d-flex","align-items-center"],[1,"switch","mb-0"],["type","checkbox",3,"ngModel","ngModelOptions","ngModelChange"],[1,"slider","round"],["type","text","formControlName","Bridge","placeholder","http//:www.agentur.stage.com",1,"form-control",3,"ngModel","ngModelChange"],[3,"control","isSubmit"],["type","text","placeholder","\u20ac ","formControlName","Revenue",1,"form-control","w-25","mr-2",3,"ngModel","ngModelChange"],[1,"col-lg-12"],[1,"text-muted"],[1,"col-lg-6","w-md-100"],[1,"form-group","text-left","row"],[1,"col-lg-2","col-form-label","font-weight-semibold"],[1,"col-lg-8"],[1,"form-group","mb-3","mb-md-2"],[1,"custom-control","custom-radio","custom-control-inline"],["type","radio","id","custom_radio_inline_unchecked-9","value","Active","formControlName","Status",1,"custom-control-input",3,"ngModel","checked","ngModelChange"],["for","custom_radio_inline_unchecked-9",1,"custom-control-label","text-success"],["type","radio","id","custom_radio_inline_checked-1","value","Inactive","formControlName","Status",1,"custom-control-input",3,"ngModel","checked","ngModelChange"],["for","custom_radio_inline_checked-1",1,"custom-control-label","text-danger"],[1,"col-lg-4","col-form-label","font-weight-semibold"],["type","text","placeholder","Birgitt Gletthofer","formControlName","Contact",1,"form-control",3,"ngModel","ngModelChange"],["type","text","formControlName","Email","placeholder","office@gmail.com",1,"form-control",3,"ngModel","ngModelChange"],["name","phonenumber",3,"cssClass","preferredCountries","enableAutoCountrySelect","enablePlaceholder","searchCountryFlag","searchCountryField","selectFirstCountry","selectedCountryISO","maxLength","tooltipField","phoneValidation","ngModelOptions","ngModel","ngModelChange"],["class","text-danger",4,"ngIf"],["type","text","formControlName","URLl","placeholder","http://www.agentur.stage.com",1,"form-control",3,"ngModel","ngModelChange"],["type","text","formControlName","Address","placeholder","Welser Strasse 3, 2.OG",1,"form-control",3,"ngModel","ngModelChange"],["type","text","formControlName","zipcode","placeholder","4614",1,"form-control",3,"ngModel","ngModelChange"],["type","text","formControlName","City","placeholder","Enter City",1,"form-control",3,"ngModel","ngModelChange"],["formControlName","Country","bindLabel","name","placeholder","Please Choose",1,"custom",3,"items","ngModel","ngModelChange"],[1,"col-md-12","text-right"],["type","submit",1,"btn","btn-danger",3,"click"],["type","submit",1,"btn","bg-blue-400","col-lg-3",3,"click"],[1,"col-lg-6","mb-3"],[1,"mb-0"],[1,"text-center"],["type","submit",1,"btn","btn-dark","px-4","mr-3"],["type","submit",1,"btn","bg-green-400","px-4",3,"click"],[1,"text-danger"],[1,"modal-header","bg-danger-800","justify-content-center"],[1,"modal-title","m-0"],[1,"modal-body","justify-content-center","text-center","px-md-4"],[1,"mb-3"],[1,"icon-cancel-circle2","icon-2x","text-danger-800"],[1,"font-weight-semibold"],[1,"modal-footer","justify-content-center"],["type","button","aria-label","Close",1,"btn","btn-dark","px-md-4",3,"click"],["type","button","aria-label","Close","routerLink","/admin/organizer",1,"btn","btn-danger","bg-danger-800","px-md-4","ml-md-2",3,"click"]],template:function(e,t){1&e&&(s.Sb(0,"div",0),s.Sb(1,"form",1),s.dc("ngSubmit",(function(){return t.onSubmit()})),s.Ic(2,w,131,61,"div",2),s.Rb(),s.Rb(),s.Ic(3,P,17,0,"ng-template",3,4,s.Jc)),2&e&&(s.zb(1),s.nc("formGroup",t.form),s.zb(1),s.nc("ngIf",t.organizers))},directives:[d.z,d.p,d.h,i.l,d.a,d.o,d.r,b.b,d.b,d.f,k.a,d.u,b.c,y.a,r.d],styles:['.profile-img[_ngcontent-%COMP%]{height:160px;width:160px}.profile-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{border-radius:50%;height:100%;width:100%}.company-img[_ngcontent-%COMP%]{height:150px;width:80%}.company-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;width:100%}.validation-invalid-label[_ngcontent-%COMP%]{margin-bottom:0!important}  .iti{width:100%}.iti[_ngcontent-%COMP%]   input[type=tel][_ngcontent-%COMP%],   .iti input{position:relative;width:100%!important;height:calc(1.5385em + .875rem + 2px)!important;border:1px solid #ddd;border-radius:.1875rem;box-shadow:0 0 0 0 transparent;transition:border-color .15s ease-in-out,box-shadow .15s ease-in-out}.iti[_ngcontent-%COMP%]   input[type=tel][_ngcontent-%COMP%]:focus,   .iti input{box-shadow:none!important;outline:none!important}  .iti input::placeholder{color:#acacac!important}@media (max-width:1150px){.w-md-100[_ngcontent-%COMP%]{flex:0 0 100%;max-width:100%;padding-left:20px;padding-right:20px}}.switch[_ngcontent-%COMP%]{position:relative;display:inline-block;width:48px;height:22px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{opacity:0;width:0;height:0}.slider[_ngcontent-%COMP%]{cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc}.slider[_ngcontent-%COMP%], .slider[_ngcontent-%COMP%]:before{position:absolute;transition:.4s}.slider[_ngcontent-%COMP%]:before{content:"";height:20px;width:20px;left:1px;bottom:1px;background-color:#fff}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#64bd63}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #64bd63}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translateX(26px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}']}),e})();var L=n("wd/R"),T=n("qb46");class _{}class K{}class A{}var E=n("B8EC"),q=n("Iab2"),F=n("Egam"),B=n("LLiQ"),D=n("LPYB");function U(e,t){if(1&e&&(s.Sb(0,"h6",26),s.Sb(1,"b"),s.Kc(2),s.Rb(),s.Rb()),2&e){const e=s.hc(2);s.zb(2),s.Nc("",e.ticketListResponse.eventName,", ",e.dateFormatter.getDate(e.ticketListResponse.eventDate),"")}}function Y(e,t){if(1&e&&(s.Sb(0,"tr"),s.Sb(1,"td"),s.Kc(2),s.Rb(),s.Sb(3,"td"),s.Kc(4),s.Rb(),s.Sb(5,"td"),s.Kc(6),s.Rb(),s.Sb(7,"td"),s.Kc(8),s.Rb(),s.Rb()),2&e){const e=t.$implicit;s.zb(2),s.Mc("\u20ac",e.ticketPrice.toFixed(2),""),s.zb(2),s.Lc(e.amountOfTickets),s.zb(2),s.Mc("\u20ac",e.fee.toFixed(2),""),s.zb(2),s.Mc("\u20ac",e.subTotal.toFixed(2),"")}}function j(e,t){if(1&e){const e=s.Tb();s.Sb(0,"div",34),s.Ic(1,U,3,2,"h6",35),s.Sb(2,"div",36),s.Sb(3,"table",37),s.Sb(4,"thead",38),s.Sb(5,"tr"),s.Sb(6,"th",39),s.Kc(7,"Ticket price"),s.Rb(),s.Sb(8,"th",39),s.Kc(9,"Amount of Tickets"),s.Rb(),s.Sb(10,"th",39),s.Kc(11,"Fee p. ticket"),s.Rb(),s.Sb(12,"th",39),s.Kc(13,"Sub-Total"),s.Rb(),s.Rb(),s.Rb(),s.Sb(14,"tbody"),s.Ic(15,Y,9,4,"tr",40),s.Sb(16,"tr"),s.Sb(17,"td"),s.Sb(18,"b"),s.Kc(19,"TICKETS TOTAL"),s.Rb(),s.Rb(),s.Sb(20,"td"),s.Sb(21,"b"),s.Kc(22),s.Rb(),s.Rb(),s.Sb(23,"td"),s.Sb(24,"b"),s.Kc(25,"TOTAL SUM"),s.Rb(),s.Rb(),s.Sb(26,"td"),s.Sb(27,"b",41),s.Kc(28),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(29,"div",42),s.Sb(30,"span",43),s.Sb(31,"button",44),s.dc("click",(function(){return s.Bc(e),s.hc().exportExcel()})),s.Kc(32,"Export Excel"),s.Rb(),s.Rb(),s.Sb(33,"span",45),s.Sb(34,"button",44),s.dc("click",(function(){return s.Bc(e),s.hc().exportCsv()})),s.Kc(35,"Export CSV"),s.Rb(),s.Rb(),s.Rb(),s.Rb()}if(2&e){const e=s.hc();s.zb(1),s.nc("ngIf",e.ticketListResponse.eventName),s.zb(14),s.nc("ngForOf",e.ticketListResponse.rows),s.zb(7),s.Lc(e.ticketListResponse.ticketsTotal.toFixed(2)),s.zb(6),s.Mc("\u20ac",e.ticketListResponse.totalSum.toFixed(2),"")}}const V=function(){return{color:"black"}};let G=(()=>{class e{constructor(e,t){this.organizerService=e,this.route=t,this.dateOptions={autoApply:!0,minDate:L("2020-01-01T00:00:00+02:00"),maxDate:L("2022-01-01T00:00:00+02:00"),clickOutsideAllowed:!1,format:"DD.MM.YYYY",position:"left"},this.searchTicketsRequest=new _,this.loader=!1,this.loadingError=!1,this.pieChartOptions={responsive:!0,legend:{position:"right"},plugins:{datalabels:{formatter:this.getLabelFormating,color:"#fff"}},tooltips:{enabled:!0,mode:"single",callbacks:{label:this.getTooltipFormating}}},this.pieChartPlugins=[T],this.pieChartLabels=["Ticket price: up to \u20ac30.00","Ticket price: \u20ac30.01 - \u20ac49.99","Ticket price: from \u20ac50.00"],this.pieChartData=[0,0,0],this.colors=[{backgroundColor:["#14A149","#297CE9","#D11A1A"]}],this.totalEvents=0,this.totalIncomingTickets=0,this.totalIncome=0,this.ticketListResponse=null,this.dateFormatter=new E.a,this.dropdownListNames=[],this.selectedItemsNames=[],this.dropdownListLocations=[],this.selectedItemsLocations=[],this.dropdownSettings={}}ngOnInit(){this.route.params.subscribe(e=>{this.searchTicketsRequest.organizerId=e.organizerId,this.dropdownSettings={singleSelection:!1,idField:"item_id",textField:"item_text",selectAllText:"Select All",unSelectAllText:"UnSelect All",itemsShowLimit:1,allowSearchFilter:!0},this.searchEventNames(!0)})}getFromToDate(e){this.searchTicketsRequest.dateFrom=L(e.split(" - ")[0],"DD.MM.YYYY").tz("Europe/Vienna").format(),this.searchTicketsRequest.dateTo=L(e.split(" - ")[1],"DD.MM.YYYY").tz("Europe/Vienna").format(),this.searchEventNames(!0)}resetDate(){this.searchTicketsRequest.dateFrom=null,this.searchTicketsRequest.dateTo=null,this.searchEventNames(!0)}unselectAllNames(){this.selectedItemsNames=[],this.searchEventLocations()}onSelectAllNames(e){this.selectedItemsNames=[];for(let t=0;t<this.dropdownListNames.length;t++)this.selectedItemsNames.push(this.dropdownListNames[t]);this.searchEventLocations()}unselectAllLocations(){this.selectedItemsLocations=[],this.searchEventNames()}onSelectAllLocations(e){this.selectedItemsLocations=[];for(let t=0;t<this.dropdownListLocations.length;t++)this.selectedItemsLocations.push(this.dropdownListLocations[t]);this.searchEventNames()}searchTickets(){this.searchTicketsRequest.locations=[...this.selectedItemsLocations],this.searchTicketsRequest.eventNames=[...this.selectedItemsNames],this.getTotalEvents(),this.getTotalIncomingTickets(),this.getIncome(),this.getDistributionByPrice(),this.getTicketList()}getTotalEvents(){this.organizerService.getTotalEvents(this.searchTicketsRequest).subscribe(e=>{this.totalEvents=e.total})}getTotalIncomingTickets(){this.organizerService.getTotalIncomingTickets(this.searchTicketsRequest).subscribe(e=>{this.totalIncomingTickets=e.total})}getIncome(){this.organizerService.getIncome(this.searchTicketsRequest).subscribe(e=>{this.totalIncome=e.income})}getDistributionByPrice(){this.organizerService.getDistributionByPrice(this.searchTicketsRequest).subscribe(e=>{this.pieChartData=[e.firstCount,e.secondConut,e.thirdCount]})}getTicketList(){this.organizerService.getTicketList(this.searchTicketsRequest).subscribe(e=>{this.ticketListResponse=e})}searchEventLocations(){let e=new K;e.dateFrom=this.searchTicketsRequest.dateFrom,e.dateTo=this.searchTicketsRequest.dateTo,e.organizerId=this.searchTicketsRequest.organizerId,e.eventNames=[],this.organizerService.searchEventLocations(e).subscribe(e=>{this.dropdownListLocations=e.locations;let t=[...this.selectedItemsLocations];this.selectedItemsLocations=[];for(let n=0;n<t.length;n++)this.dropdownListLocations.includes(t[n])&&this.selectedItemsLocations.push(t[n]);this.searchTickets()})}searchEventNames(e=!1){let t=new A;t.dateFrom=this.searchTicketsRequest.dateFrom,t.dateTo=this.searchTicketsRequest.dateTo,t.organizerId=this.searchTicketsRequest.organizerId,t.locations=[],this.organizerService.searchEventNames(t).subscribe(t=>{this.dropdownListNames=t.eventNames;let n=[...this.selectedItemsNames];this.selectedItemsNames=[];for(let e=0;e<n.length;e++)this.dropdownListNames.includes(n[e])&&this.selectedItemsNames.push(n[e]);e?this.searchEventLocations():this.searchTickets()})}exportExcel(){this.organizerService.exportBillingExcel(this.searchTicketsRequest).subscribe(e=>{Object(q.saveAs)(e,"billing")},e=>{console.log(e)})}exportCsv(){this.organizerService.exportBillingCsv(this.searchTicketsRequest).subscribe(e=>{Object(q.saveAs)(e,"billing.csv")},e=>{console.log(e)})}getLabelFormating(e,t){let n=0,i=t.chart.data.datasets[0].data;for(let r=0;r<i.length;r++)n+=+i[r];let o=(100*e/n).toFixed(2)+"%";return 100*e/n>10?o:""}getTooltipFormating(e,t){let n=t.datasets[e.datasetIndex].data,i=t.labels[e.index],o=n[e.index],r=0;for(let a=0;a<n.length;a++)r+=+n[a];return i+": "+o+" ("+(100*+o/r).toFixed(2)+"%)"}}return e.\u0275fac=function(t){return new(t||e)(s.Mb(M.a),s.Mb(r.a))},e.\u0275cmp=s.Gb({type:e,selectors:[["app-billing"]],decls:63,vars:25,consts:[[1,"content"],[1,"row"],[1,"col-lg-4"],["for","",1,"text-blue-400","font-weight-bold"],[1,"",3,"settings","placeholder","data","ngModel","ngModelChange","onSelect","onSelectAll","onDeSelect","onDeSelectAll"],[3,"ngStyle","instanceId","controlName","options","datepickerReset","rangeSelected"],["dateRangePicker",""],[1,"form-group"],[1,"input-group"],["id","secondDateRange","type","text","name","dateRange","placeholder","From - To",1,"form-control",3,"readonly","value"],[1,"input-group-prepend"],["id","date-range-icon",1,"input-group-text"],[1,"icon-calendar22"],[1,"col-sm-6","col-xl-4"],[1,"card","card-body","turkis","has-bg-image"],[1,"media"],[1,"media-body"],[1,"mb-0"],[1,"text-uppercase","font-size-xs"],[1,"ml-3","mt-3","align-self-center"],[1,"fas","fa-calendar-alt","fa-3x"],[1,"card","card-body","green","has-bg-image"],[1,"fas","fa-ticket-alt","fa-rotate-135","fa-2x"],[1,"card","card-body","blue","has-bg-image"],[1,"far","fa-money-bill-alt","fa-3x"],[1,"col-lg-5"],[1,"text-center","my-2"],[1,"card"],[1,"card-body","row"],[1,"chart-container"],[1,"col-lg-12","my-2","text-center"],[1,"card-title","text-blue-400"],["baseChart","","chartType","pie",3,"data","labels","options","plugins","legend","colors"],["class","col-lg-7",4,"ngIf"],[1,"col-lg-7"],["class","text-center my-2",4,"ngIf"],[1,"table-responsive"],[1,"table","table-bordered","border","table-striped"],[1,"table-dark"],[1,"p-2"],[4,"ngFor","ngForOf"],[2,"color","green"],[1,"row","mr-0","ml-0"],[1,"col-lg-6","row","mr-3","mt-1","pr-0"],[1,"col-lg-12","btn","bg-blue-400",3,"click"],[1,"col-lg-6","row","mt-1","pr-0"]],template:function(e,t){if(1&e){const e=s.Tb();s.Sb(0,"div",0),s.Sb(1,"div",1),s.Sb(2,"div",2),s.Sb(3,"label",3),s.Kc(4,"Event Name"),s.Rb(),s.Sb(5,"ng-multiselect-dropdown",4),s.dc("ngModelChange",(function(e){return t.selectedItemsNames=e}))("onSelect",(function(){return t.searchEventLocations()}))("onSelectAll",(function(e){return t.onSelectAllNames(e)}))("onDeSelect",(function(){return t.searchEventLocations()}))("onDeSelectAll",(function(){return t.unselectAllNames()})),s.Rb(),s.Rb(),s.Sb(6,"div",2),s.Sb(7,"label",3),s.Kc(8,"Location"),s.Rb(),s.Sb(9,"ng-multiselect-dropdown",4),s.dc("ngModelChange",(function(e){return t.selectedItemsLocations=e}))("onSelect",(function(){return t.searchEventNames()}))("onSelectAll",(function(e){return t.onSelectAllLocations(e)}))("onDeSelect",(function(){return t.searchEventNames()}))("onDeSelectAll",(function(){return t.unselectAllLocations()})),s.Rb(),s.Rb(),s.Sb(10,"div",2),s.Sb(11,"date-range-picker",5,6),s.dc("datepickerReset",(function(){return t.resetDate()}))("rangeSelected",(function(){s.Bc(e);const n=s.yc(12);return t.getFromToDate(n.range)})),s.Sb(13,"div",7),s.Sb(14,"label",3),s.Kc(15,"Date From - To "),s.Rb(),s.Sb(16,"div",8),s.Nb(17,"input",9),s.Sb(18,"div",10),s.Sb(19,"span",11),s.Nb(20,"i",12),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(21,"div",1),s.Sb(22,"div",13),s.Sb(23,"div",14),s.Sb(24,"div",15),s.Sb(25,"div",16),s.Sb(26,"h3",17),s.Kc(27),s.Rb(),s.Sb(28,"span",18),s.Kc(29,"Events"),s.Rb(),s.Rb(),s.Sb(30,"div",19),s.Nb(31,"i",20),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(32,"div",13),s.Sb(33,"div",21),s.Sb(34,"div",15),s.Sb(35,"div",16),s.Sb(36,"h3",17),s.Kc(37),s.Rb(),s.Sb(38,"span",18),s.Kc(39,"Incoming Tickets "),s.Rb(),s.Rb(),s.Sb(40,"div",19),s.Nb(41,"i",22),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(42,"div",13),s.Sb(43,"div",23),s.Sb(44,"div",15),s.Sb(45,"div",16),s.Sb(46,"h3",17),s.Kc(47),s.Rb(),s.Sb(48,"span",18),s.Kc(49,"Income"),s.Rb(),s.Rb(),s.Sb(50,"div",19),s.Nb(51,"i",24),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Sb(52,"div",1),s.Sb(53,"div",25),s.Sb(54,"div",26),s.Sb(55,"div",27),s.Sb(56,"div",28),s.Sb(57,"div",29),s.Sb(58,"div",30),s.Sb(59,"h5",31),s.Kc(60,"Distribution of Ticket prices"),s.Rb(),s.Rb(),s.Nb(61,"canvas",32),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Rb(),s.Ic(62,j,36,4,"div",33),s.Rb(),s.Rb()}if(2&e){const e=s.yc(12);s.zb(5),s.nc("settings",t.dropdownSettings)("placeholder","Select event name")("data",t.dropdownListNames)("ngModel",t.selectedItemsNames),s.zb(4),s.nc("settings",t.dropdownSettings)("placeholder","Select location")("data",t.dropdownListLocations)("ngModel",t.selectedItemsLocations),s.zb(2),s.nc("ngStyle",s.rc(24,V))("instanceId","secondDateRange")("controlName","secondDateRange")("options",t.dateOptions),s.zb(6),s.nc("readonly",!0)("value",e.range),s.zb(10),s.Lc(t.totalEvents),s.zb(10),s.Lc(t.totalIncomingTickets),s.zb(10),s.Lc(t.totalIncome),s.zb(14),s.nc("data",t.pieChartData)("labels",t.pieChartLabels)("options",t.pieChartOptions)("plugins",t.pieChartPlugins)("legend",!0)("colors",t.colors),s.zb(1),s.nc("ngIf",t.ticketListResponse)}},directives:[F.a,d.o,d.r,b.b,B.a,i.m,D.a,i.l,i.k],styles:[".company-img[_ngcontent-%COMP%]{height:150px;width:90%}.company-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;width:100%}.opacity-75[_ngcontent-%COMP%]{opacity:1!important}.green[_ngcontent-%COMP%]{background-color:#00b300}.blue[_ngcontent-%COMP%]{background-color:#09a1ce}.turkis[_ngcontent-%COMP%]{background-color:#00b386}.grey[_ngcontent-%COMP%]{background-color:#a9a9a9}.fa-stack[_ngcontent-%COMP%]{display:inline-block;height:1em;line-height:1em;position:relative;vertical-align:middle;width:1.5em}.fa-stack-1x[_ngcontent-%COMP%], .fa-stack-2x[_ngcontent-%COMP%]{left:0;position:absolute;text-align:center;width:100%}.fa-stack-1x[_ngcontent-%COMP%]{line-height:inherit;font-size:.1em}.fa-stack-2x[_ngcontent-%COMP%]{font-size:1em}.fa-inverse[_ngcontent-%COMP%]{color:#a9a9a9}.fa-2x[_ngcontent-%COMP%]{font-size:1.25em}.fa-3x[_ngcontent-%COMP%]{font-size:1.5em}.fa-rotate-135[_ngcontent-%COMP%]{transform:rotate(135deg)}.fa-stack-bottom[_ngcontent-%COMP%]{vertical-align:bottom}.form-group.hidden[_ngcontent-%COMP%]{width:0;margin:0;border:none;padding:0}.custom-day[_ngcontent-%COMP%]{text-align:center;padding:.185rem .25rem;display:inline-block;height:2rem;width:2rem}.custom-day.focused[_ngcontent-%COMP%]{background-color:#e6e6e6}.custom-day.range[_ngcontent-%COMP%], .custom-day[_ngcontent-%COMP%]:hover{background-color:#0275d8;color:#fff}.custom-day.faded[_ngcontent-%COMP%]{background-color:rgba(2,117,216,.5)}.ranges[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:active{background-color:#26a69a}  .dateRangePicker-wrapper .dateRangePicker.open-left{left:-335px!important}  .dateRangePicker-wrapper .dateRangePicker.open-left:before{left:565px!important}  .dateRangePicker-wrapper .dateRangePicker .form-inputs{background-color:#09a1ce!important}  .dateRangePicker-wrapper .dateRangePicker:after{border-bottom:10px solid #09a1ce!important}.text-left[_ngcontent-%COMP%]{text-align:left!important}  .dateRangePicker-wrapper .dateRangePicker:before{border-bottom:10px solid #09a1ce!important}.calendar[_ngcontent-%COMP%]   .table[_ngcontent-%COMP%]   td.selected.in-selected-range[_ngcontent-%COMP%],   .calendar .table td.selected,   .calendar .table td:not(.disabled):not(.selected):hover{background-color:#09a1ce!important}  .calendar .table td.different-month{color:#273237!important}  .btn-outline-secondary{background-color:#273237!important;border-color:#273237!important;color:#fff!important}.datatable-header[_ngcontent-%COMP%] > div[_ngcontent-%COMP%]:first-child{margin-left:1.25rem}.custom-padding[_ngcontent-%COMP%]   th[_ngcontent-%COMP%]{padding:10px 8px!important}.table[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:.75rem 1.25rem;vertical-align:middle}.custom-padding[_ngcontent-%COMP%]   td[_ngcontent-%COMP%]{padding:10px 8px!important}.badge-purple[_ngcontent-%COMP%]{background-color:#90f;color:#fff}"]}),e})();function J(e,t){1&e&&(s.Sb(0,"div",9),s.Sb(1,"div",10),s.Nb(2,"app-main"),s.Rb(),s.Rb())}function X(e,t){1&e&&s.Nb(0,"app-billing")}function Z(e,t){if(1&e&&(s.Sb(0,"div",9),s.Sb(1,"div",10),s.Ic(2,X,1,0,"app-billing",11),s.Rb(),s.Rb()),2&e){const e=s.hc();s.zb(2),s.nc("ngIf",e.superAdmin)}}const $=[{path:"",component:(()=>{class e{constructor(e){this.authService=e,this.superAdmin=!1}ngOnInit(){this.authService.getUserContext().subscribe(e=>{e.userType==a.b.SuperAdmin&&(this.superAdmin=!0)})}}return e.\u0275fac=function(t){return new(t||e)(s.Mb(c.a))},e.\u0275cmp=s.Gb({type:e,selectors:[["app-layout"]],decls:14,vars:5,consts:[[1,"container-fluid"],["ngbNav","",1,"nav-tabs","nav","nav-justified",3,"destroyOnHide"],["nav","ngbNav"],[3,"ngbNavItem"],["ngbNavLink",""],[1,"mb-0","font-weight-normal"],["ngbNavContent",""],[3,"ngbNavItem","disabled"],[3,"ngbNavOutlet"],[1,"card","border-0"],[1,"card-body"],[4,"ngIf"]],template:function(e,t){if(1&e&&(s.Sb(0,"div",0),s.Sb(1,"ul",1,2),s.Sb(3,"li",3),s.Sb(4,"a",4),s.Sb(5,"h3",5),s.Kc(6,"Main Data "),s.Rb(),s.Rb(),s.Ic(7,J,3,0,"ng-template",6),s.Rb(),s.Sb(8,"li",7),s.Sb(9,"a",4),s.Sb(10,"h3",5),s.Kc(11,"Billing"),s.Rb(),s.Rb(),s.Ic(12,Z,3,1,"ng-template",6),s.Rb(),s.Rb(),s.Nb(13,"div",8),s.Rb()),2&e){const e=s.yc(2);s.zb(1),s.nc("destroyOnHide",!1),s.zb(2),s.nc("ngbNavItem",1),s.zb(5),s.nc("ngbNavItem",3)("disabled",!t.superAdmin),s.zb(5),s.nc("ngbNavOutlet",e)}},directives:[l.p,l.r,l.s,l.q,l.t,N,i.l,G],styles:[".nav-tabs .nav-link.active{color:#29b6f6;background-color:#fff;border-color:#ddd #ddd #fff;border-top:3px solid #09a1ce}  .custom-tabs .nav-tabs{border-bottom:none!important}  .custom-tabs .nav-tabs .nav-item{width:50%;text-align:center}"]}),e})()}];let H=(()=>{class e{}return e.\u0275mod=s.Kb({type:e}),e.\u0275inj=s.Jb({factory:function(t){return new(t||e)},imports:[[r.g.forChild($)],r.g]}),e})(),W=(()=>{class e{}return e.\u0275mod=s.Kb({type:e}),e.\u0275inj=s.Jb({factory:function(t){return new(t||e)},imports:[[i.b,o.a,H,b.d,B.b]]}),e})()}}]);