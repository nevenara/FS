(window.webpackJsonp=window.webpackJsonp||[]).push([[20],{"9TRB":function(t,e,n){"use strict";n.r(e),n.d(e,"PersonalizationModule",(function(){return et}));var i=n("ofXK"),c=n("PCNd"),o=n("tyNb"),s=n("wY2j");class a{}var r=n("B8EC");class b{}var d=n("fXoL"),l=n("tk/3");let g=(()=>{class t{constructor(t){this.http=t}getNonPersonalizedTickets(t){return this.http.post(s.a.serviceUrl+"/tickets/personalization/getnonpersonalizedtickets",t)}getNonPersonalizedTicketsByEvent(t){return this.http.post(s.a.serviceUrl+"/tickets/personalization/getnonpersonalizedticketsbyevent",t)}changeFirstAndLastName(t){return this.http.post(s.a.serviceUrl+"/tickets/personalization/changefirstandlastname",t)}SendEmailChangeFirstAndLastName(t){return this.http.post(s.a.serviceUrl+"/tickets/personalization/sendemailchangefirstandlastname",t)}assignTicket(t){return this.http.post(s.a.serviceUrl+"/tickets/personalization/assigntickets",t)}changeTicketHolder(t){return this.http.post(s.a.serviceUrl+"/tickets/changeticketholder",t)}}return t.\u0275fac=function(e){return new(e||t)(d.ac(l.b))},t.\u0275prov=d.Ib({token:t,factory:t.\u0275fac,providedIn:"root"}),t})();var m=n("E98y"),h=n("lqtM"),p=n("1kSV");function u(t,e){1&t&&d.Nb(0,"preloader-app",7)}function f(t,e){1&t&&d.Nb(0,"app-load-error-page")}function v(t,e){1&t&&(d.Sb(0,"div",11),d.Sb(1,"h3"),d.Kc(2,"There are no tickets to display!"),d.Rb(),d.Rb())}const k=function(t){return{event:t}};function S(t,e){if(1&t&&(d.Sb(0,"div",12),d.Sb(1,"div",13),d.Sb(2,"div",14),d.Nb(3,"img",15),d.Sb(4,"div",16),d.Sb(5,"a",17),d.Kc(6," Details "),d.Rb(),d.Rb(),d.Rb(),d.Sb(7,"div",18),d.Sb(8,"span",19),d.Kc(9,"Waiting for personalization"),d.Rb(),d.Rb(),d.Sb(10,"div",20),d.Sb(11,"h5",21),d.Kc(12),d.Rb(),d.Sb(13,"div",22),d.Sb(14,"span",22),d.Sb(15,"span",23),d.Kc(16,"Date:"),d.Rb(),d.Sb(17,"span",24),d.Kc(18),d.Rb(),d.Rb(),d.Sb(19,"span",25),d.Kc(20,"Begin:"),d.Rb(),d.Sb(21,"span",24),d.Kc(22),d.Rb(),d.Sb(23,"span",25),d.Kc(24,"Doors Open :"),d.Rb(),d.Sb(25,"span",24),d.Kc(26),d.Rb(),d.Rb(),d.Sb(27,"div",26),d.Sb(28,"span",23),d.Kc(29,"Location:"),d.Rb(),d.Sb(30,"span",24),d.Kc(31),d.Nb(32,"br"),d.Kc(33),d.Rb(),d.Rb(),d.Sb(34,"div",27),d.Sb(35,"span",23),d.Kc(36,"Amount of tickets:"),d.Rb(),d.Sb(37,"span",24),d.Kc(38),d.Rb(),d.Rb(),d.Rb(),d.Sb(39,"div",28),d.Sb(40,"div",29),d.Sb(41,"a",30),d.Sb(42,"span"),d.Kc(43,"Personalize"),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb()),2&t){const t=e.$implicit,n=d.hc(2);d.zb(3),d.qc("src","",n.eventImageUrl,"",t.eventId,"",d.Dc),d.zb(2),d.nc("queryParams",d.sc(11,k,t.eventHash)),d.zb(7),d.Lc(t.eventName),d.zb(6),d.Mc(" ",n.dateFormatter.getDate(t.date)," "),d.zb(4),d.Mc(" ",n.dateFormatter.getHours(t.beginTime),""),d.zb(4),d.Mc(" ",t.doorsOpen," "),d.zb(5),d.Mc(" ",t.locationName," "),d.zb(2),d.Mc(" ",t.locationAddress,""),d.zb(5),d.Mc(" ",t.amountOfTickets,""),d.zb(3),d.nc("queryParams",d.sc(13,k,t.eventHash))}}function P(t,e){if(1&t&&(d.Sb(0,"div",8),d.Ic(1,v,3,0,"div",9),d.Ic(2,S,44,15,"div",10),d.Rb()),2&t){const t=d.hc();d.zb(1),d.nc("ngIf",!t.tickets.length),d.zb(1),d.nc("ngForOf",t.tickets)}}function x(t,e){1&t&&d.Kc(0," \u2190 ")}function R(t,e){1&t&&d.Kc(0," \u2192")}function z(t,e){1&t&&d.Kc(0),2&t&&d.Lc(e.$implicit)}function w(t,e){if(1&t){const t=d.Tb();d.Sb(0,"div",31),d.Sb(1,"div",32),d.Sb(2,"div",33),d.Sb(3,"ngb-pagination",34),d.dc("pageChange",(function(e){return d.Bc(t),d.hc().onPageChange(e)}))("pageChange",(function(e){return d.Bc(t),d.hc().page=e})),d.Ic(4,x,1,0,"ng-template",35),d.Ic(5,R,1,0,"ng-template",36),d.Ic(6,z,1,1,"ng-template",37),d.Rb(),d.Rb(),d.Rb(),d.Rb()}if(2&t){const t=d.hc();d.zb(3),d.nc("pageSize",1)("collectionSize",t.pages.length)("page",t.page)}}let M=(()=>{class t{constructor(t){this.ticketPersonalizationService=t,this.tickets=[],this.pages=[],this.page=1,this.loader=!1,this.loadingError=!1,this.eventImageUrl=s.a.serviceUrl+"/events/image?eventId=",this.dateFormatter=new r.a}ngOnInit(){this.getNonPersonalizedTickets()}onPageChange(t){this.page=t,this.getNonPersonalizedTickets()}getNonPersonalizedTickets(){this.loader=!0;let t=new a;t.page=this.page,this.ticketPersonalizationService.getNonPersonalizedTickets(t).subscribe(t=>{console.log(t),this.tickets=t.tickets;for(let e=0;e<this.tickets.length;e++)this.tickets[e].eventHash=this.getEventObject(e);this.pages=[];for(let e=0;e<t.totalPages;e++)this.pages.push(e+1);this.loader=!1},t=>{console.log(t),this.loader=!1,this.loadingError=!0})}getEventObject(t){let e=new b;return e.eventId=this.tickets[t].eventId,e.syncDate=this.tickets[t].syncDate,btoa(JSON.stringify(e))}}return t.\u0275fac=function(e){return new(e||t)(d.Mb(g))},t.\u0275cmp=d.Gb({type:t,selectors:[["app-list"]],decls:9,vars:4,consts:[[1,"container","p-sm-00"],[1,"col-lg-12","text-center","my-3"],[1,"card-title","text-blue-400"],["class","text-center",4,"ngIf"],[4,"ngIf"],["class","row",4,"ngIf"],["class","row my-4 ",4,"ngIf"],[1,"text-center"],[1,"row"],["class","col-lg-12 text-center text-blue-400",4,"ngIf"],["class","col-lg-4",4,"ngFor","ngForOf"],[1,"col-lg-12","text-center","text-blue-400"],[1,"col-lg-4"],[1,"card","p-1"],[1,"card-img-actions"],["alt","",1,"img-fluid",3,"src"],[1,"card-img-actions-overlay","card-img-top"],["routerLink","/personalization/detail",1,"btn","btn-outline","bg-white","text-white","border-white",3,"queryParams"],[1,"header-elements","px-1","mt-2","text-right"],[1,"badge","bg-danger","px-3"],[1,"card-body","px-1","py-2"],[1,"text-dark","font-weight-bold","mb-0"],[1,""],[1,"text-dark","font-weight-bold"],[1,"text-dark"],[1,"ml-md-2","ml-1","text-dark","font-weight-bold"],[1,"mb-0"],[1,"mt-3"],[1,"p-2","text-center","bg-dark"],[1,"d-flex","bg-dark","justify-content-end"],["routerLink","/personalization/detail",1,"btn","action-blue",3,"queryParams"],[1,"row","my-4"],[1,"col-lg-12","text-center"],[1,"d-flex","justify-content-center"],["aria-label","Custom pagination",1,"pagination","text-center",3,"pageSize","collectionSize","page","pageChange"],["ngbPaginationPrevious",""],["ngbPaginationNext",""],["ngbPaginationNumber",""]],template:function(t,e){1&t&&(d.Sb(0,"div",0),d.Sb(1,"div"),d.Sb(2,"div",1),d.Sb(3,"h2",2),d.Kc(4,"Ticket Personalization"),d.Rb(),d.Rb(),d.Ic(5,u,1,0,"preloader-app",3),d.Ic(6,f,1,0,"app-load-error-page",4),d.Ic(7,P,3,2,"div",5),d.Rb(),d.Ic(8,w,7,3,"div",6),d.Rb()),2&t&&(d.zb(5),d.nc("ngIf",e.loader),d.zb(1),d.nc("ngIf",!e.loader&&e.loadingError),d.zb(1),d.nc("ngIf",!e.loader&&!e.loadingError),d.zb(1),d.nc("ngIf",e.pages&&e.pages.length>0))},directives:[i.l,m.a,h.a,i.k,o.f,p.v,p.y,p.w,p.x],styles:[".card-title-h3[_ngcontent-%COMP%]{font-size:12px}.badge[_ngcontent-%COMP%]{font-size:13px;border-radius:5px}.action-blue[_ngcontent-%COMP%]{background:#09a1ce;color:#fff}.red[_ngcontent-%COMP%], .red[_ngcontent-%COMP%]:hover{background:#cf2a27}.red[_ngcontent-%COMP%]{color:#fff}.dropdown-menu[_ngcontent-%COMP%]{min-width:6rem!important}.img-modal[_ngcontent-%COMP%]{width:265px;height:250px}.card-img-actions[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:250px;width:100%}.btn[_ngcontent-%COMP%]{padding:.3rem .4rem}ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{padding:0 8px 0 0;list-style:none}.modal-header[_ngcontent-%COMP%]{justify-content:center!important}  .angular-editor .angular-editor-wrapper .angular-editor-textarea{min-height:5rem!important;height:5rem!important}@media only screen and (max-width:767px){.card-body[_ngcontent-%COMP%]   .text-dark[_ngcontent-%COMP%]{font-size:11px}}.card[_ngcontent-%COMP%]{height:600px}"]}),t})();class C{}class I{constructor(){this.tickets=[]}}class O{}var y=n("CE8T"),_=n("/uUt"),K=n("lJxs"),T=n("XNiG"),N=n("VRyK");class E{}var L=n("KjH8"),B=n("CvAm"),F=n("YK7j"),U=n("3Pt+");function A(t,e){1&t&&d.Nb(0,"preloader-app")}function D(t,e){1&t&&d.Nb(0,"app-load-error-page")}function H(t,e){if(1&t&&(d.Sb(0,"span",28),d.Sb(1,"b"),d.Kc(2,"Pre-personalized to: "),d.Rb(),d.Kc(3),d.Rb()),2&t){const t=d.hc().$implicit;d.zb(3),d.Lc(t.prePersonalizedTo)}}function j(t,e){if(1&t){const t=d.Tb();d.Sb(0,"button",53),d.dc("click",(function(){d.Bc(t);const e=d.hc().index;return d.hc(2).startEditing(e)})),d.Kc(1,"Edit pre-personalization"),d.Rb()}if(2&t){const t=d.hc().$implicit;d.nc("disabled",!t.isPrePersEditable)}}function q(t,e){if(1&t){const t=d.Tb();d.Sb(0,"span"),d.Sb(1,"span",54),d.Sb(2,"b",55),d.Kc(3,"Firstname: "),d.Rb(),d.Sb(4,"input",56),d.dc("ngModelChange",(function(e){return d.Bc(t),d.hc(3).newFirstName=e})),d.Rb(),d.Rb(),d.Sb(5,"span",57),d.Sb(6,"b",55),d.Kc(7,"Lastname: "),d.Rb(),d.Sb(8,"input",58),d.dc("ngModelChange",(function(e){return d.Bc(t),d.hc(3).newLastName=e})),d.Rb(),d.Rb(),d.Sb(9,"button",59),d.dc("click",(function(){d.Bc(t);const e=d.hc().index;return d.hc(2).changeTicketHolder(e)})),d.Kc(10,"Save"),d.Rb(),d.Sb(11,"button",60),d.dc("click",(function(){return d.Bc(t),d.hc(3).cancelEditing()})),d.Kc(12,"Cancel"),d.Rb(),d.Rb()}if(2&t){const t=d.hc(3);d.zb(4),d.nc("ngModel",t.newFirstName),d.zb(4),d.nc("ngModel",t.newLastName),d.zb(1),d.nc("disabled",!t.newFirstName||!t.newLastName)}}function V(t,e){if(1&t){const t=d.Tb();d.Sb(0,"button",61),d.dc("click",(function(){return d.Bc(t),d.hc(3).openIdVerificationComponent()})),d.Kc(1,"ID Check"),d.Rb()}}function $(t,e){if(1&t){const t=d.Tb();d.Sb(0,"button",62),d.dc("click",(function(){d.Bc(t);const e=d.hc().index;return d.hc(2).assignTicket(e)})),d.Kc(1,"Assign Ticket"),d.Rb()}if(2&t){const t=d.hc().$implicit,e=d.hc(2);d.nc("disabled",!t.prePersonalizedToUsername||e.editing)}}const J=function(){return["/profile"]},Y=function(){return{type:"2"}};function G(t,e){if(1&t){const t=d.Tb();d.Sb(0,"div",16),d.Nb(1,"div",17),d.Sb(2,"div",18),d.Sb(3,"div",19),d.Sb(4,"div",20),d.Nb(5,"img",21),d.Rb(),d.Rb(),d.Sb(6,"div",22),d.Sb(7,"div",23),d.Sb(8,"div",24),d.Sb(9,"div",25),d.Sb(10,"b"),d.Kc(11,"Booking ID: "),d.Rb(),d.Kc(12),d.Rb(),d.Sb(13,"div",25),d.Sb(14,"b"),d.Kc(15,"Ticket ID: "),d.Rb(),d.Kc(16),d.Rb(),d.Rb(),d.Sb(17,"div",26),d.Sb(18,"h2",27),d.Kc(19),d.Rb(),d.Sb(20,"div",20),d.Sb(21,"span",28),d.Sb(22,"b"),d.Kc(23,"Date: "),d.Rb(),d.Kc(24),d.Rb(),d.Sb(25,"span",29),d.Sb(26,"b"),d.Kc(27,"Begin: "),d.Rb(),d.Kc(28),d.Rb(),d.Sb(29,"span",28),d.Sb(30,"b"),d.Kc(31,"Doors open: "),d.Rb(),d.Kc(32),d.Rb(),d.Rb(),d.Sb(33,"div",28),d.Sb(34,"b"),d.Kc(35,"Seat: "),d.Rb(),d.Kc(36),d.Rb(),d.Sb(37,"div",30),d.Sb(38,"span",28),d.Sb(39,"b"),d.Kc(40,"Location: \xa0"),d.Rb(),d.Rb(),d.Sb(41,"div",31),d.Sb(42,"span",28),d.Kc(43),d.Nb(44,"br"),d.Kc(45),d.Rb(),d.Rb(),d.Rb(),d.Sb(46,"div",32),d.Sb(47,"b"),d.Kc(48,"Organizer: "),d.Rb(),d.Kc(49),d.Rb(),d.Rb(),d.Sb(50,"div",33),d.Sb(51,"div",34),d.Sb(52,"div",25),d.Sb(53,"b"),d.Kc(54,"Booking ID: "),d.Rb(),d.Kc(55),d.Rb(),d.Sb(56,"div",25),d.Sb(57,"b"),d.Kc(58,"Ticket ID: "),d.Rb(),d.Kc(59),d.Rb(),d.Rb(),d.Sb(60,"div",20),d.Sb(61,"h5",35),d.Sb(62,"b"),d.Kc(63,"EUR "),d.Rb(),d.Kc(64),d.Rb(),d.Sb(65,"div",25),d.Kc(66,"Price incl. VAT"),d.Rb(),d.Rb(),d.Sb(67,"div",36),d.Sb(68,"b"),d.Kc(69,"Organizer: "),d.Rb(),d.Kc(70),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Sb(71,"div",37),d.Sb(72,"div",38),d.Ic(73,H,4,1,"span",39),d.Nb(74,"br"),d.Ic(75,j,2,1,"button",40),d.Ic(76,q,13,3,"span",0),d.Rb(),d.Sb(77,"div",41),d.Sb(78,"div",2),d.Sb(79,"div",42),d.Sb(80,"input",43),d.dc("ngModelChange",(function(n){return d.Bc(t),e.$implicit.prePersonalizedToUsername=n}))("focus",(function(e){return d.Bc(t),d.hc(2).focus$.next(e.target.value)})),d.Rb(),d.Rb(),d.Sb(81,"div",44),d.Ic(82,V,2,0,"button",45),d.Ic(83,$,2,1,"button",46),d.Rb(),d.Sb(84,"div",47),d.Sb(85,"div",48),d.Sb(86,"span",49),d.Kc(87," Die Begleitperson ist minderj\xe4hrig oder hat keinen FanSafe Benutzernamen und m\xf6chte das Ticket vom K\xe4ufer verwalten lassen. Erstelle einen "),d.Sb(88,"a",50),d.Sb(89,"u"),d.Kc(90,"Linked Account"),d.Rb(),d.Rb(),d.Sb(91,"a",51),d.Nb(92,"i",52),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb(),d.Rb()}if(2&t){const t=e.$implicit,n=e.index;d.hc();const i=d.yc(20),c=d.hc();d.zb(5),d.oc("src",c.eventImageUrl,d.Dc),d.zb(7),d.Lc(t.bookingId),d.zb(4),d.Lc(t.ticketId),d.zb(3),d.Lc(t.eventName),d.zb(5),d.Lc(c.dateFormatter.getDate(t.date)),d.zb(4),d.Lc(c.dateFormatter.getHours(t.beginTime)),d.zb(4),d.Lc(t.doorsOpen),d.zb(4),d.Lc(t.seat),d.zb(7),d.Mc(" ",t.locationName,""),d.zb(2),d.Mc(" ",t.locationAddress,""),d.zb(4),d.Lc(t.organizer),d.zb(6),d.Lc(t.bookingId),d.zb(4),d.Lc(t.ticketId),d.zb(5),d.Lc(t.originalPrice.toFixed(2)),d.zb(6),d.Lc(t.organizer),d.zb(3),d.nc("ngIf",c.selectedIndex!=n||!c.editing),d.zb(2),d.nc("ngIf",c.selectedIndex!=n||!c.editing),d.zb(1),d.nc("ngIf",c.selectedIndex==n&&c.editing),d.zb(4),d.nc("ngModel",t.prePersonalizedToUsername)("ngbTypeahead",t.search)("editable",!1),d.zb(2),d.nc("ngIf",!c.idVerified),d.zb(1),d.nc("ngIf",c.idVerified),d.zb(5),d.nc("routerLink",d.rc(26,J))("queryParams",d.rc(27,Y)),d.zb(3),d.nc("ngbPopover",i)}}function X(t,e){1&t&&(d.Kc(0," - Ein Haupkontenbesitzer kann bis zu 4 Personen verwalten. "),d.Nb(1,"br"),d.Kc(2," - Der Hauptkontenbesitzer muss bereits einen ID Check durchgef\xfchrt haben um einen Connected Account anzulegen. "),d.Nb(3,"br"),d.Kc(4," - Personen eines Connected Account m\xfcssen ebenfalls einmalig einem ID Check durchf\xfchren. "),d.Nb(5,"br"),d.Kc(6," - Connected Accounts sind mit Vor- und Nachnamen und Benutzernamen versehen. "),d.Nb(7,"br"),d.Kc(8," - Connected Accounts k\xf6nnen nur vom FanSafe Support ge\xe4ndert werden. "),d.Nb(9,"br"))}function W(t,e){if(1&t){const t=d.Tb();d.Sb(0,"span"),d.Sb(1,"div",2),d.Sb(2,"div",3),d.Sb(3,"h2",4),d.Kc(4,"Ticket personalization "),d.Rb(),d.Rb(),d.Sb(5,"div",5),d.Sb(6,"div",6),d.Ic(7,G,93,28,"div",7),d.Rb(),d.Rb(),d.Rb(),d.Sb(8,"div",8),d.Sb(9,"div",9),d.Sb(10,"button",10),d.Kc(11,"Back to overview"),d.Rb(),d.Rb(),d.Nb(12,"div",11),d.Sb(13,"div",12),d.Sb(14,"button",13),d.dc("click",(function(){return d.Bc(t),d.hc().assignAllTickets()})),d.Kc(15,"Assign all tickets"),d.Rb(),d.Rb(),d.Sb(16,"div",14),d.Sb(17,"button",10),d.Kc(18,"Back to overview"),d.Rb(),d.Rb(),d.Rb(),d.Ic(19,X,10,0,"ng-template",null,15,d.Jc),d.Rb()}if(2&t){const t=d.hc();d.zb(7),d.nc("ngForOf",t.tickets),d.zb(7),d.nc("disabled",t.editing)}}const Q=[{path:"",component:M},{path:"detail",component:(()=>{class t{constructor(t,e,n,i,c,o,a){this.modalService=t,this.activatedRoute=e,this.ticketPersonalizationService=n,this.openIdVerificationModalService=i,this.notificationsService=c,this.router=o,this.qrService=a,this.tickets=[],this.name="Angular 6",this.htmlContent="",this.idVerified=!1,this.loader=!1,this.loadingError=!1,this.eventImageUrl=s.a.serviceUrl+"/events/image?eventId=",this.dateFormatter=new r.a,this.config={editable:!0,spellcheck:!0,height:"15rem",minHeight:"5rem",placeholder:"Enter text here...",translate:"no",defaultParagraphSeparator:"p",defaultFontName:"Arial",toolbarHiddenButtons:[["bold"]],customClasses:[{name:"quote",class:"quote"},{name:"redText",class:"redText"},{name:"titleText",class:"titleText",tag:"h1"}]},this.selectedIndex=-1,this.editing=!1,this.newFirstName="",this.newLastName="",this.focus$=new T.a}ngOnInit(){this.activatedRoute.params.subscribe(t=>{if(this.eventHash=this.activatedRoute.snapshot.queryParamMap.get("event"),this.eventHash)this.event=JSON.parse(atob(this.eventHash)),this.eventImageUrl+=this.event.eventId,this.getTickets();else{let t=this.activatedRoute.snapshot.queryParamMap.get("uuid");this.qrService.getUrlParams(t).subscribe(t=>{this.eventHash=t.urlParams,this.event=JSON.parse(atob(this.eventHash)),this.eventImageUrl+=this.event.eventId,this.selectedIdParam=t.selectedId,this.getTickets()})}})}open(t){this.modalService.open(t,{size:"lg"}).result.then(t=>{},t=>{this.getTickets()})}openIdVerificationComponent(){this.openIdVerificationModalService.openModal()}getTickets(){this.loader=!0;let t=new C;t.eventId=this.event.eventId,t.syncDate=this.event.syncDate,this.ticketPersonalizationService.getNonPersonalizedTicketsByEvent(t).subscribe(t=>{console.log(t),this.idVerified=t.idVerified,this.tickets=[...t.tickets];for(let e=0;e<this.tickets.length;e++){this.tickets[e].prePersonalizedToUsername="",this.tickets[e].usernamesAndEmails=[],this.tickets[e].userIds=[];for(let n=0;n<t.tickets[e].possibleUsernamesAndEmails.length;n++)this.tickets[e].usernamesAndEmails.push(t.tickets[e].possibleUsernamesAndEmails[n].usernameAndEmail),this.tickets[e].userIds.push(t.tickets[e].possibleUsernamesAndEmails[n].userId);this.tickets[e].search=t=>{let n=this.focus$;return Object(N.a)(t,n).pipe(Object(_.a)(),Object(K.a)(t=>this.tickets[e].usernamesAndEmails.filter(e=>new RegExp(t,"mi").test(e))))}}this.loader=!1,this.selectedIdParam&&(this.openIdVerificationComponent(),this.selectedIdParam=0)},t=>{console.log(t),this.loader=!1,this.loadingError=!0})}assignTicket(t){this.loader=!0;let e=new I;e.tickets=[];let n=new O;n.ticketId=this.tickets[t].id;let i=this.tickets[t].usernamesAndEmails.indexOf(this.tickets[t].prePersonalizedToUsername);n.userId=this.tickets[t].userIds[i],e.tickets.push(n),this.ticketPersonalizationService.assignTicket(e).subscribe(t=>{this.notificationsService.showSuccess("Ticket successfully assigned"),1!=this.tickets.length?this.getTickets():this.router.navigateByUrl("/personalization")},t=>{console.log(t),this.loader=!1})}assignAllTickets(){let t=new I;t.tickets=[];for(let e=0;e<this.tickets.length;e++){let n=new O;n.ticketId=this.tickets[e].id;let i=this.tickets[e].usernamesAndEmails.indexOf(this.tickets[e].prePersonalizedToUsername);n.userId=this.tickets[e].userIds[i],t.tickets.push(n)}0!=t.tickets.length&&(this.loader=!0,this.ticketPersonalizationService.assignTicket(t).subscribe(t=>{this.getTickets(),this.notificationsService.showSuccess("Tickets successfully assigned")},t=>{console.log(t),this.loader=!1}))}changeTicketHolder(t){let e=new E;e.ticketId=this.tickets[t].id,e.firstname=this.newFirstName,e.lastname=this.newLastName,this.ticketPersonalizationService.changeTicketHolder(e).subscribe(t=>{this.cancelEditing(),this.getTickets(),this.notificationsService.showSuccess("Ticket holder successfully changed")})}startEditing(t){this.selectedIndex=t,this.newFirstName=this.tickets[t].prePersonalizedToFirstName,this.newLastName=this.tickets[t].prePersonalizedToLastName,this.editing=!0}cancelEditing(){this.selectedIndex=-1,this.newFirstName="",this.newLastName="",this.editing=!1}}return t.\u0275fac=function(e){return new(e||t)(d.Mb(p.n),d.Mb(o.a),d.Mb(g),d.Mb(y.a),d.Mb(L.a),d.Mb(o.c),d.Mb(B.a))},t.\u0275cmp=d.Gb({type:t,selectors:[["app-detail"]],features:[d.yb([y.a])],decls:4,vars:6,consts:[[4,"ngIf"],[3,"selectedIdParam","pageType","urlParams","onFinishEmitter"],[1,"row"],[1,"col-lg-12","text-center","my-2"],[1,"card-title","text-blue-400"],[1,"col-lg-12"],[1,"container"],["class","card border-0",4,"ngFor","ngForOf"],[1,"row","justify-content-center","my-3"],[1,"col-lg-3","mb-3","text-md-right","d-md-block","d-none"],["type","submit","routerLink","/personalization",1,"btn","btn-dark","bg-dark"],[1,"col-lg-3","mb-3","text-center","w-5050"],[1,"col-lg-3","mb-3","text-md-left","w-5050"],["id","disable",1,"btn","bg-blue-400",3,"disabled","click"],[1,"col-lg-3","mb-3","text-md-right","w-1010","d-block","d-md-none"],["popContent",""],[1,"card","border-0"],[1,"card-header","py-2","bg-blue"],[1,"row","m-0","border"],[1,"col-lg-3","w-md-100","px-0","mb-2","mb-md-0"],[1,""],["alt","",1,"img-fluid",3,"src"],[1,"col-lg-9","w-md-100","px-0","px-md-2"],[1,"row","m-0","p-md-1"],[1,"col-md-12","text-right","d-md-none","d-block"],[1,"small"],[1,"col-lg-9","pl-mid-0"],[1,"font-weight-bold","mb-0","hd2"],[1,"custom-size"],[1,"custom-size","mx-md-3"],[1,"media","mt-1","mb-3"],[1,"media-body"],[1,"custom-size","d-none","d-md-block"],[1,"col-lg-3","d-flex","flex-column","justify-content-between","text-right"],[1,"d-none","d-md-block","custom-size"],[1,"mb-0"],[1,"small","d-block","d-md-none","mt-1","text-left","mb-1"],[1,"row","mx-0","my-md-3","my-2"],[1,"col-lg-3","w-md-100","text-md-center","mt-md-1","mb-1","px-3"],["class","custom-size",4,"ngIf"],["type","submit","type","submit","class","btn mr-1 mt-2 bg-green-400",3,"disabled","click",4,"ngIf"],[1,"col-lg-9","w-md-100","px-3"],[1,"col-lg-7","col-70","mb-2"],["id","typeahead-prevent-manual-entry","placeholder","Enter username or email","type","text",1,"form-control",3,"ngModel","ngbTypeahead","editable","ngModelChange","focus"],[1,"col-lg-2","col-30","text-center"],["type","submit","class","btn bg-blue d-md-block",3,"click",4,"ngIf"],["type","submit","class","btn d-md-block bg-blue-400",3,"disabled","click",4,"ngIf"],[1,"col-lg-8","w-md-100"],[1,"media-body","mt-2","px-2","p-md-0"],[1,"text-blue-400","custom-size","c-1"],[1,"font-weight-bold","text-blue-400","text-underline",3,"routerLink","queryParams"],["placement","right","triggers","mouseenter:mouseleave",1,"ml-1","text-blue-400",3,"ngbPopover"],[1,"icon-info22","text-blue"],["type","submit","type","submit",1,"btn","mr-1","mt-2","bg-green-400",3,"disabled","click"],[1,"custom-size","row","align-items-center"],[1,"col-lg-5"],["type","text","placeholder","Enter firstname",1,"form-control","col-lg-7",3,"ngModel","ngModelChange"],[1,"custom-size","row","align-items-center","mt-2"],["type","text","placeholder","Enter lastname",1,"form-control","col-lg-7",3,"ngModel","ngModelChange"],["type","submit",1,"btn","mr-1","mt-2","bg-green-400",3,"disabled","click"],["type","submit",1,"btn","btn-danger","mt-2",3,"click"],["type","submit",1,"btn","bg-blue","d-md-block",3,"click"],["type","submit",1,"btn","d-md-block","bg-blue-400",3,"disabled","click"]],template:function(t,e){1&t&&(d.Ic(0,A,1,0,"preloader-app",0),d.Ic(1,D,1,0,"app-load-error-page",0),d.Ic(2,W,21,2,"span",0),d.Sb(3,"app-id-verification",1),d.dc("onFinishEmitter",(function(){return e.getTickets()})),d.Rb()),2&t&&(d.nc("ngIf",e.loader),d.zb(1),d.nc("ngIf",!e.loader&&e.loadingError),d.zb(1),d.nc("ngIf",!e.loader&&!e.loadingError),d.zb(1),d.nc("selectedIdParam",e.selectedIdParam)("pageType",1)("urlParams",e.eventHash))},directives:[i.l,F.a,m.a,h.a,i.k,o.d,U.b,p.D,U.o,U.r,o.f,p.z],styles:['.text-muted[_ngcontent-%COMP%]{color:#6c757d!important}.img[_ngcontent-%COMP%]{height:175px;width:235px;display:contents}.img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%;width:100%}.custom-checkbox[_ngcontent-%COMP%]   .custom-control-label[_ngcontent-%COMP%]:before{border-color:#fff}@media only screen and (max-width:768px){.img[_ngcontent-%COMP%]{height:auto;width:auto}}.five-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%}.five-img[_ngcontent-%COMP%]{height:265px}.qr-img[_ngcontent-%COMP%]{height:135px;width:auto}.custom-size[_ngcontent-%COMP%]{font-size:16px}.h-230[_ngcontent-%COMP%]{height:230px!important}@media only screen and (max-width:1200px){.h-230[_ngcontent-%COMP%]{height:auto!important}.five-img[_ngcontent-%COMP%], .five-img-1[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:100%}.five-img[_ngcontent-%COMP%]{height:auto}.w-md-500[_ngcontent-%COMP%]{flex:0 0 33%!important;max-width:33%!important;flex:0 0 50%!important;max-width:50%!important}.pr-md-0[_ngcontent-%COMP%]{padding-right:.625rem!important}.text-md-center[_ngcontent-%COMP%]{text-align:left!important}.pl-mid-0[_ngcontent-%COMP%]{padding-left:0!important}.col-70[_ngcontent-%COMP%]{flex:0 0 70%!important;max-width:70%!important}.col-30[_ngcontent-%COMP%]{flex:0 0 30%!important;max-width:30%!important}}@media only screen and (max-width:767px){.h-230[_ngcontent-%COMP%]{height:auto!important}.pl-mid-0[_ngcontent-%COMP%], .px-3[_ngcontent-%COMP%]{padding-left:10px!important}.px-3[_ngcontent-%COMP%]{padding-right:10px!important}.c-1[_ngcontent-%COMP%]{font-size:11px!important}.five-img[_ngcontent-%COMP%], .five-img[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:auto}.w-md-500[_ngcontent-%COMP%]{flex:0 0 50%!important;max-width:50%!important}.w-1010[_ngcontent-%COMP%]{flex:0 0 100%!important;max-width:100%!important}.w-1010[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{width:100%}.w-5050[_ngcontent-%COMP%]{flex:0 0 50%!important;max-width:50%!important}.w-5050[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{width:100%}.col-7[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%]{display:block!important}.reverse-sm[_ngcontent-%COMP%]{flex-direction:column-reverse}.w-md-400[_ngcontent-%COMP%]{flex:0 0 100%!important;max-width:100%!important}.w-md-400[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{height:auto}}.switch[_ngcontent-%COMP%]{position:relative;display:inline-block;width:48px;height:22px}.switch[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]{opacity:0;width:0;height:0}.slider[_ngcontent-%COMP%]{cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc}.slider[_ngcontent-%COMP%], .slider[_ngcontent-%COMP%]:before{position:absolute;transition:.4s}.slider[_ngcontent-%COMP%]:before{content:"";height:20px;width:20px;left:1px;bottom:1px;background-color:#fff}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]{background-color:#64bd63}input[_ngcontent-%COMP%]:focus + .slider[_ngcontent-%COMP%]{box-shadow:0 0 1px #64bd63}input[_ngcontent-%COMP%]:checked + .slider[_ngcontent-%COMP%]:before{transform:translateX(26px)}.slider.round[_ngcontent-%COMP%]{border-radius:34px}.slider.round[_ngcontent-%COMP%]:before{border-radius:50%}']}),t})()},{path:"",component:(()=>{class t{constructor(){}ngOnInit(){}}return t.\u0275fac=function(e){return new(e||t)},t.\u0275cmp=d.Gb({type:t,selectors:[["app-assign"]],decls:2,vars:0,template:function(t,e){1&t&&(d.Sb(0,"p"),d.Kc(1,"assign works!"),d.Rb())},styles:[""]}),t})()}];let Z=(()=>{class t{}return t.\u0275mod=d.Kb({type:t}),t.\u0275inj=d.Jb({factory:function(e){return new(e||t)},imports:[[o.g.forChild(Q)],o.g]}),t})();var tt=n("mUB+");let et=(()=>{class t{}return t.\u0275mod=d.Kb({type:t}),t.\u0275inj=d.Jb({factory:function(e){return new(e||t)},imports:[[i.b,c.a,Z,tt.b]]}),t})()},B8EC:function(t,e,n){"use strict";n.d(e,"a",(function(){return c}));var i=n("wd/R");class c{getDate(t){return i(t).format("DD.MM.YYYY")}getHours(t){return i(t).format("HH:mm")}}}}]);