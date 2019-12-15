<template>
<div class="container mx-auto">
    <h1 class="h4 mb-5">Annual Subscription —</h1>
    <h2>$36.00 a year.</h2>
    <p>If we did our math right, that is just $3 a month.</p>
    <p><strong>What you get:</strong></p>
    <ul class="list-unstyled">
      <li>— Unlimited archives</li>
      <li>— Unlimited items</li>
      <li>— Help Small Archives be a business</li>
    </ul>
    <div class="bg-yellow-200 p-4 my-4">
      <p><strong>Important!</strong></p>
      <p>When checking out, please make sure to use the same email as you did when signing up for Small Archives. That is how we know that you paid.</p>
      <p>Your email account is: <strong>{{email}}</strong></p>
    </div>
    <button class="btn-dark" id="checkout-button-plan_Fhyo4B7XBn8FbO" role="link">Upgrade</button>  
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
    var stripe = Stripe('pk_live_wowB8pLbUllziTekqZnB1cUb00SFGl1Y20');

    var checkoutButton = document.getElementById('checkout-button-plan_Fhyo4B7XBn8FbO');
    checkoutButton.addEventListener('click', function () {
        // When the customer clicks on the button, redirect
        // them to Checkout.
        stripe.redirectToCheckout({
        items: [{plan: 'plan_Fhyo4B7XBn8FbO', quantity: 1}],

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
