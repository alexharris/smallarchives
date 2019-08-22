<template>
  <div class="container my-5 p-0">
    <div class="row">
      <div class="col-12">
        <h1 class="h4 mb-5">Account —</h1>
      </div>
    </div>
    <div class="row">
      <div class="col-xs-12 col-lg-6 ">
          <div class="card">
            <div class="card-header">
              <strong>Basic Info</strong>
            </div>            
            <div class="card-body">
              <ul class="list-unstyled">
                  <li><strong>Username:</strong> {{displayName}}</li>
                  <li><strong>Email:</strong> {{emailAddress}} <span v-if="emailVerified"><span class="badge badge-success">Verified</span></span><span v-else><a class="#" @click="resendEmailVerification()" data-toggle="modal" data-target="#exampleModal"><small>Send Verification</small></a></span></li>
                  <li><strong>Joined:</strong> {{joinDate}}</li>
                  <li><strong>User ID:</strong> {{uid}}</li>
                  <li><strong>Number of archives: </strong>{{this.archives.length}}</li>
              </ul>
              <button v-if="!passwordResetSent" class="btn btn-dark btn-sm" @click.stop="sendPasswordReset">Reset Password</button>
              <p v-else><strong>Password reset email sent.</strong></p>
            </div>
          </div>
          <!-- Modal -->
          <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>            
                    Email Verification Sent
                </div>
                </div>
            </div>
          </div>        
      </div>
      <div class="col-xs-12 col-lg-6">
        <div class="card">
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
                <a  href="/payment" class="btn btn-success btn-sm">View Pricing Info</a>
              </div>
          </div>
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
