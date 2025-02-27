import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HeaderComponent } from './header/header.component';
import { FeaturesComponent } from './features/features.component';
import { FeaturesGraphsComponent } from './features-graphs/features-graphs.component';
import { KPIsComponent } from './kpis/kpis.component';
import { NgChartsModule } from 'ng2-charts';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// material
import {MatCardModule} from '@angular/material/card';
import { BreakTextAtPointDirective } from './directives/break-text-at-point.directive';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FeaturesComponent,
    FeaturesGraphsComponent,
    KPIsComponent,
    BreakTextAtPointDirective
  ],
  imports: [
    BrowserModule,
    NgbModule,
    NgChartsModule,
    BrowserAnimationsModule,
    MatCardModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
