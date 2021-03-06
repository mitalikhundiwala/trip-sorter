import { DealsService } from './services/deals.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from '@angular/material';
import { AppComponent } from './app.component';
import { TripListComponent } from './elements/trip-list/trip-list.component';
import { DealListComponent } from './elements/deal-list/deal-list.component';

@NgModule({
  declarations: [
    AppComponent,
    TripListComponent,
    DealListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [
    DealsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
