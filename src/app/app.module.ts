import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing';
import { DefaultLayoutComponent } from './containers';
import { SidebarComponent, SidebarNavItem } from './containers/sidebar/sidebar.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';

const APP_CONTAINERS = [DefaultLayoutComponent];
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpBackend,
  HttpClient,
} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    SidebarComponent,
    SidebarNavItem,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent]
})
export class AppModule { }
