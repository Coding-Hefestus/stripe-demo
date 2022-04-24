import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { StripeService } from 'ngx-stripe';
import {
  StripeElementsOptions,
  PaymentRequestPaymentMethodEvent,
  PaymentIntent,
  PaymentRequestShippingAddressEvent,
} from '@stripe/stripe-js';
import { DOCUMENT } from '@angular/common';
import {loadStripe} from '@stripe/stripe-js';

import { ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


import {  StripePaymentElementComponent } from 'ngx-stripe';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{


 // public stripe = new Stripe("pk_test_TYooMQauvdEDq54NiTphI7jx");

 public items = [{ amount: 100 }];
 public stripe = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx');
 //private document: Document;

 @ViewChild(StripePaymentElementComponent)
 paymentElement: StripePaymentElementComponent;

 public stripeTest : FormGroup;

 public elementsOptions: StripeElementsOptions = {
   locale: 'en'
 };

 public paying = false;

  public constructor(
    private fb: FormBuilder,@Inject(DOCUMENT) private document: Document, private http: HttpClient, private stripeService: StripeService) {
  
  
  }

  ngOnInit(): void {
     this.stripeTest = this.fb.group({
      name: ['Angular v12', [Validators.required]],
      amount: [1109, [Validators.required, Validators.pattern(/\d+/)]]
    });
    this.createPaymentIntent(this.stripeTest.get('amount').value)
    .subscribe(clientSecretResponse => {
      console.log("aaaaaaaaaaaaa: " + clientSecretResponse.clientSecret)
      this.elementsOptions.clientSecret = clientSecretResponse.clientSecret;
    
    });
  }



  ///////////////////////////////////////////////
  // elementsOptions: StripeElementsOptions = {
  //   locale: 'es',
  // };

  // paymentRequestOptions = {
  //   country: 'ES',
  //   currency: 'eur',
  //   total: {
  //     label: 'Demo Total',
  //     amount: 1099,
  //   },
  //   requestPayerName: true,
  //   requestPayerEmail: true,
  // };




  // onPaymentMethod(ev: PaymentRequestPaymentMethodEvent) {
  //   this.createPaymentIntent()
  //     .pipe(
  //       switchMap((pi) => {
  //         return this.stripeService
  //           .confirmCardPayment(
  //             pi.client_secret,
  //             { payment_method: ev.paymentMethod.id },
  //             { handleActions: false }
  //           )
  //           .pipe(
  //             switchMap((confirmResult) => {
  //               if (confirmResult.error) {
  //                 // Report to the browser that the payment failed, 
  //                 // prompting it to re-show the payment interface, 
  //                 // or show an error message and close the payment.
  //                 ev.complete('fail');
  //                 return of({
  //                   error: new Error('Error Confirming the payment'),
  //                 });
  //               } else {
  //                 // Report to the browser that the confirmation was 
  //                 // successful, prompting it to close the browser 
  //                 // payment method collection interface.
  //                 ev.complete('success');
  //                 // Let Stripe.js handle the rest of the payment flow.
  //                 return this.stripeService.confirmCardPayment(
  //                   pi.client_secret
  //                 );
  //               }
  //             })
  //           );
  //       })
  //     )
  //     .subscribe((result) => {
  //       if (result.error) {
  //         // The payment failed -- ask your customer for a new payment method.
  //       } else {
  //         // The payment has succeeded.
  //       }
  //     });
  // }


  pay() {
    if (this.stripeTest.valid) {
      this.paying = true;
      this.stripeService.confirmPayment({
        elements: this.paymentElement.elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: this.stripeTest.get('name').value
            }
          }
        },
        redirect: 'if_required'
      }).subscribe(result => {
        this.paying = false;
        console.log('Result', result);
        if (result.error) {
          // Show error to your customer (e.g., insufficient funds)
          alert({ success: false, error: result.error.message });
        } else {
          // The payment has been processed!
          if (result.paymentIntent.status === 'succeeded') {
            // Show a success message to your customer
            alert({ success: true });
          }
        }
      });
    } else {
      console.log(this.stripeTest);
    }
  }




  // createPaymentIntent(): Observable<PaymentIntent> {
  //   // Replace this with your own custom implementation 
  //   // to perform a Payment Intent Creation
  //   // You will need your own Server to do that
  //   return this.http.post<PaymentIntent>(
  //     'http://localhost:8080/create-payment-intent',
  //     { amount: this.paymentRequestOptions.total.amount }
  //   );
  // }

  private createPaymentIntent(amount: number): Observable<any> {
    return this.http.post<any>(
      `http://localhost:8080/create-payment-intent`,
      { amount : amount }
    );
  }
}
