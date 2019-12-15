<template>
  <div class="container mx-auto">
    <h1>Account —</h1>
    <h2>Basic Info</h2>          

    <ul>
        <li><strong>Username:</strong> {{displayName}}</li>
        <li><strong>Email:</strong> {{emailAddress}} <span v-if="emailVerified"><span class="badge badge-success">Verified</span></span><span v-else><a class="#" @click="resendEmailVerification()" data-toggle="modal" data-target="#exampleModal"><small>Send Verification</small></a></span></li>
        <li><strong>Joined:</strong> {{joinDate}}</li>
        <li><strong>User ID:</strong> {{uid}}</li>
        <li><strong>Number of archives: </strong>{{this.archives.length}}</li>
    </ul>
    <button  class="btn-dark" @click.stop="sendPasswordReset">Reset Password</button>
    <p v-if="passwordResetSent"><strong>Password reset email sent, please check your email.</strong></p>
    <div class="shadow bg-blue-100 p-4 my-4">
      <div class="card-header">
        <strong>Subscription Info</strong>
      </div>
      <div class="card-body">
          <ul class="list-unstyled" v-if="subscriptionType != 'None'">
              <li><strong>Subscription Type:</strong> {{subscriptionType}}</li>
              <li><strong>Subscription Start:</strong> {{subscriptionStart}} </li>
              <li><strong>Subscription End:</strong> {{subscriptionEnd}} </li>
          </ul>
          <div  v-else>
            <span>You are currently using the free plan, and will be limited to 1 archive.</span><br /><br />
            <a  href="/payment">View Pricing Info</a>
          </div>
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'

export default {
  name: 'AdminAccountInfo',
  data () {
    return {
      archives: [],
      errors: [],
      displayName: this.$store.getters.getUser.displayName,
      emailAddress: this.$store.getters.getUser.email,
      joinDate: firebase.auth().currentUser.metadata.creationTime,
      uid: firebase.auth().currentUser.uid,
      resetPasswordEmail: '',
      passwordResetSent: false,
      subscriptionType: 'None',
      subscriptionStart: '',
      subscriptionEnd: ''
    }
  },
  created () {
    var uid = firebase.auth().currentUser.uid

    // this is to get the number of archives
    sa.archiveCollectionDbRef(uid).onSnapshot((querySnapshot) => {
      this.archives = [];
      querySnapshot.forEach((doc) => {
        this.archives.push({
          key: doc.id
        });
      });
    });  
   
   // get the user information stored in the firestore 'users' collection
    sa.userDocumentDbRef(uid).get()
    .then((doc) => {
      this.subscriptionType = doc.data().subscriptionType
      this.subscriptionStart = sa.getFormattedDate(doc.data().subscriptionStart)
      this.subscriptionEnd = sa.getFormattedDate(doc.data().subscriptionEnd)
    }); 
  },
  methods: {
    sendPasswordReset: function() {
      var auth = firebase.auth();
      this.passwordResetSent = true

      auth.sendPasswordResetEmail(this.emailAddress).then(function() {
        // Email sent.
      }).catch(function(error) {
        // An error happened.
      });

    },
    resendEmailVerification() {
        //send verification email
        firebase.auth().currentUser.sendEmailVerification().then(function() {
        // Email sent.
        }).catch(function(error) {
        // An error happened.
        });
    },     
  },
  computed: {
    emailVerified () {
      return firebase.auth().currentUser.emailVerified 
    }
  }
}
</script>
