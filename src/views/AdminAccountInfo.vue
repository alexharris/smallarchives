<template>
  <div class="row justify-content-center">
    <div class="col-11 my-4">
        <h1 class="h4">Account</h1>
        <h2 class="h5">Basic Info</h2>
        <ul class="list-unstyled">
            <li><strong>Username:</strong> {{displayName}}</li>
            <li><strong>Email:</strong> {{emailAddress}} <span v-if="emailVerified"><span class="badge badge-success">Verified</span></span><span v-else><a class="#" @click="resendEmailVerification()" data-toggle="modal" data-target="#exampleModal"><small>Send Verification</small></a></span></li>
            <li><strong>Joined:</strong> {{joinDate}}</li>
            <li><strong>User ID:</strong> {{uid}}</li>
        </ul>
        <button v-if="!passwordResetSent" class="btn btn-primary btn-sm" @click.stop="sendPasswordReset">Reset Password</button>
        <p v-else><strong>Password reset email sent.</strong></p>
        <h2 class="h5 my-4">Stats</h2>
        <ul class="list-unstyled">
            <li><strong>Number of archives: </strong>{{this.archives.length}}</li>
            <li><strong>Total items: </strong>{{numberOfItems}}</li>
        </ul>
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
      numberOfItems: 0,
      joinDate: firebase.auth().currentUser.metadata.creationTime,
      uid: firebase.auth().currentUser.uid,
      resetPasswordEmail: '',
      passwordResetSent: false
    }
  },
  created () {
    var uid = firebase.auth().currentUser.uid
    this.getNumberOfItems()  

    // this is to get the number of archives
    sa.archiveCollectionDbRef(uid).onSnapshot((querySnapshot) => {
      this.archives = [];
      querySnapshot.forEach((doc) => {
        this.archives.push({
          key: doc.id
        });
      });
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
    getNumberOfItems () {
  
      sa.userArchivesDocumentDbRef(firebase.auth().currentUser.uid).onSnapshot((doc) => {
        
        if(doc.exists != false ) {
          this.numberOfItems = doc.data().numberOfItems;
        }
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
