<template>
   
    <div class="row justify-content-center">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6">
        <h3 class="mb-3">Sign in</h3>
        <div class="card">
          <div class="card-body">
            <div class="form-group row justify-content-center">
              
              <div class="col-sm-10">
                <label for="inputEmail">Email</label>
                <input type="email" class="form-control" id="inputEmail" placeholder="" v-model="email">
              </div>
            </div>
            <div class="form-group row justify-content-center">
              
              <div class="col-sm-10">
                <label for="inputPassword">Password</label>
                <input type="password" class="form-control" id="inputPassword" placeholder="" v-model="password">
              </div>
            </div>    
            <div class="row justify-content-center pt-3">    
              <div class="col-sm-10">
                <button class="btn btn-dark" type="submit" @click.stop="login">Sign In</button>
              </div>
            </div>
          </div>
        </div>
        <p class="mt-3">No account? <router-link to="/sign-up">Create one.</router-link><br />
        Forgot your password? <a href="#" data-toggle="modal" data-target="#exampleModal">Reset it.</a></p>    
      </div>

      <!-- Modal -->
      <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Reset Password</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body" >
              <form v-if="!passwordResetSent"> 
                <div class="form-group row">
                  <label for="resetPasswordEmail" class="col-sm-3 col-form-label">Email</label>
                  <div class="col-sm-9">
                    <input type="email" class="form-control" id="resetPasswordEmail" placeholder="" v-model="resetPasswordEmail">
                  </div>
                </div>
              </form>
              <p v-else>
                Password Reset instructions sent. Please check your email.
              </p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-primary" @click.stop="sendPasswordReset">Send Password Reset</button>
            </div>
          </div>
        </div>
      </div>      
      <!-- <div class="col-12 col-lg-4 px-lg-5"> -->
        <!-- This can come back once I can activate the "collect email address" twitter setting so that firebase can prevent duplicates, but that requires a terms of service and privacy policy which dont exist yet -->
<!--         <button class="btn btn-primary" @click="twitter"><font-awesome-icon class="float-left pt-1 pb-2 mr-2" :icon="['fab', 'twitter']" size="2x" />Sign in with Twitter</button>    -->
      <!-- </div> -->      
    </div>
</template>

<script>
  import firebase from 'firebase/app';
  export default {
    name: 'PromoLogin',
    data() {
      return {
        email: '',
        password: '',
        resetPasswordEmail: '',
        passwordResetSent: false,
      }
    },
    beforeCreate: function() {
      if(firebase.auth().currentUser != null) {
        this.$router.replace('admin')
      }
    },    
    methods: {
      login: function(e) {
        e.preventDefault();
        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(
          (user) => {
            this.$store.dispatch('setUser')
            this.$router.replace('admin')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      },
      sendPasswordReset: function() {
        var auth = firebase.auth();
        var emailAddress = this.resetPasswordEmail

        this.passwordResetSent = true

        auth.sendPasswordResetEmail(emailAddress).then(function() {
          // Email sent.
        }).catch(function(error) {
          // An error happened.
        });

      },
      twitter: function() {

        var provider = new firebase.auth.TwitterAuthProvider();
        
        firebase.auth().signInWithRedirect(provider).then(function(result) {
          // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
          // You can use these server side with your app's credentials to access the Twitter API.
          var token = result.credential.accessToken;
          var secret = result.credential.secret;
          // The signed-in user info.
          var user = result.user;
          // ...
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });      
      } 
    }        
  }
</script>
