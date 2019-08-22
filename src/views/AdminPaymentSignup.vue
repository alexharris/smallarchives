<template>
<div class="container my-5 p-0">
    <div class="row">
      <div class="col-12">
        <h1 class="h4 mb-5">Annual Subscription —</h1>
      </div>
    </div>

    <div class="row">
      <div class="col-xs-12 col-lg-6">
        <h2>$36.00 a year.</h2>
        <p>If we did our math right, that is just $3 a month.</p>
      </div>
      <div class="col-xs-12 col-lg-6">
        <!-- <div class="card border-success">
          <div class="card-header">
            <strong>Features</strong>
          </div>
          <div class="text-success">
            <ul class="list-group list-group-flush">
              <li class="list-group-item">Unlimited archives</li>
              <li class="list-group-item">Unlimited items</li>
              <li class="list-group-item">Support us</li>
            </ul>
          </div>
        </div> -->
          <p><strong>What you get:</strong></p>
          <ul class="list-unstyled">
            <li>— Unlimited archives</li>
            <li>— Unlimited items</li>
            <li>— Help Small Archives be a business</li>
          </ul>
      </div>      
    </div>

    <div class="row my-4">
      <div class="col-12">
        <div class="alert alert-warning">
          <h4><strong>Important!</strong></h4>
          <p>When checking out, please make sure to use the same email as you did when signing up for Small Archives. That is how we know that you paid.

          </p>
          <p>Your email account is: <strong>{{email}}</strong></p>
        
        </div>
      </div>
    </div>    

                <button
            class="btn btn-success"
            id="checkout-button-plan_FT2uZXGDbyqpas"
            role="link"
            >
            Checkout
            </button>  



    <!-- Create a button that your customers click to complete their purchase. Customize the styling to suit your branding. -->


    <div id="error-message"></div>
</div>
</template>

<script>

import firebase from 'firebase/app';
import sa from '../sa'

export default {
  name: "PublicPaymentSignup",
  data() {
    return {
      email: this.$store.getters.getUser.email,
    }
  },
  mounted () {
    var stripe = Stripe('pk_test_1Xevbq0rqu1q2qQzMe5bFGBR00C58N65EB');

    var checkoutButton = document.getElementById('checkout-button-plan_FT2uZXGDbyqpas');
    checkoutButton.addEventListener('click', function () {
        // When the customer clicks on the button, redirect
        // them to Checkout.
        stripe.redirectToCheckout({
        items: [{plan: 'plan_FT2uZXGDbyqpas', quantity: 1}],

        // Do not rely on the redirect to the successUrl for fulfilling
        // purchases, customers may not always reach the success_url after
        // a successful payment.
        // Instead use one of the strategies described in
        // https://stripe.com/docs/payments/checkout/fulfillment
        successUrl: 'https://smallarchives.com/success',
        cancelUrl: 'https://smallarchives.com/canceled',
        })
        .then(function (result) {
        if (result.error) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, display the localized error message to your customer.
            var displayError = document.getElementById('error-message');
            displayError.textContent = result.error.message;
        }
        });
    });
  },


};
</script>
