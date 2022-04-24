import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { StripeElementsService, StripeService } from 'ngx-stripe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material/material-module';
// Import your library
import { NgxStripeModule } from 'ngx-stripe';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    NgxStripeModule.forRoot('pk_test_51KrplgL8U3BNM2iQOPu9Y2SCV5j07e8d1oWbwrYwTe3wYc3QkFX1JlveVgBO0AB5ClKnsOxtHcZP3Re7lsE9nDIe00eP1g0G8G'),
    ReactiveFormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
