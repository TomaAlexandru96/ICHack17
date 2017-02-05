import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { Page2 } from '../pages/page2/page2';
import { LoginPage } from '../pages/login/login';
import { EventCreationPage } from '../pages/event_creation/event_creation';
import { CurrentUserService } from '../providers/current_user';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    EventCreationPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    LoginPage,
    EventCreationPage
  ],
  providers: [CurrentUserService,
        {provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
