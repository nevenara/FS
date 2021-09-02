import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpLoaderFactory, SharedModule } from './shared/shared.module';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './layout/header/header.component';
import { BreadCrumbComponent } from './layout/bread-crumb/bread-crumb.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { EventComponent } from './event/event.component';

import { FullCalendarModule } from '@fullcalendar/angular'; // the main connector. must go first
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin
import interactionPlugin from '@fullcalendar/interaction'; // a plugin
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';   // use this
import { HttpRequestInterceptor} from 'src/app/shared/http-interceptor';
import { WebcamModule} from 'ngx-webcam';
import { NotificationsComponent } from './notifications/notifications.component'
import { TranslateModule } from '@ngx-translate/core';

FullCalendarModule.registerPlugins([ // register FullCalendar plugins
  dayGridPlugin,
  interactionPlugin
]);

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    BreadCrumbComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    EventComponent,
    NotificationsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FullCalendarModule, // register FullCalendar with you app
    SharedModule,
    AngularEditorModule,
    BrowserAnimationsModule,
    WebcamModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateModule,
          useFactory: (HttpLoaderFactory),
        deps: [HttpClient]
    }})
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
