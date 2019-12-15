<template>
   
    <div class="container mx-auto">
      <div class="w-4/5 sm:w-2/3 md:w-1/2 mx-auto">
        <h2>Sign in</h2>
        <div class="shadow-lg p-8">
            <div class="form-group row justify-content-center ">
                <FormField 
                  id="email"
                  label="Email"
                  type="email"
                  placeholder="Email Address"
                  v-model="email"
                />
                <FormField 
                  id="password"
                  label="Password"
                  type="password"
                  placeholder="Password"
                  v-model="password"
                />                
                <!-- <div class="form-field">
                <label for="inputEmail">Email</label>
                <input type="email" id="inputEmail" placeholder="" v-model="email">
                </div> -->
                <!-- <div class="form-field">

                  <label for="inputPassword">Password</label>
                  <input type="password" id="inputPassword" placeholder="" v-model="password">
                </div> -->

                <button class="btn btn-dark" type="submit" @click.stop="login">Sign In</button>

            </div>
        </div>
        <p class="mt-3">No account? <router-link to="/sign-up">Create one.</router-link><br />
        Forgot your password? <span class="link" @click="resetVisible = !resetVisible">Reset it.</span></p>    
        <div v-if="resetVisible" class="bg-yellow-200 p-4 rounded">
          <h3>Password Reset</h3>
              <form class="form-group" v-if="!passwordResetSent"> 
                <FormField 
                  id="reset"
                  label="Email Address"
                  type="email"
                  placeholder="Email Address"
                  v-model="resetPasswordEmail"
                />                   
                <!-- <div class="form-field">
                  <label for="resetPasswordEmail">Email</label>
                  <input type="email" class="form-control" id="resetPasswordEmail" placeholder="" v-model="resetPasswordEmail">
                </div> -->
              <button type="button" class="btn-dark" @click.stop="sendPasswordReset">Send Password Reset</button>

              </form>
              <p v-else>
                Password Reset instructions sent. Please check your email.
              </p>
        </div>
      </div>

      <!-- Modal -->
      <!-- <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Reset Password</h5>

            </div>
            <div class="modal-body" >

            </div>
            <div class="modal-footer">
            </div>
          </div>
        </div>
      </div>       -->
      <!-- <div class="col-12 col-lg-4 px-lg-5"> -->
        <!-- This can come back once I can activate the "collect email address" twitter setting so that firebase can prevent duplicates, but that requires a terms of service and privacy policy which dont exist yet -->
<!--         <button class="btn btn-primary" @click="twitter"><font-awesome-icon class="float-left pt-1 pb-2 mr-2" :icon="['fab', 'twitter']" size="2x" />Sign in with Twitter</button>    -->
      <!-- </div> -->      
    </div>
</template>

<script>
  import firebase from 'firebase/app';
  import FormField from '../components/FormField'

  export default {
    name: 'PromoLogin', 
    components: {
      FormField
    },
    data() {
      return {
        email: '',
        password: '',
        resetVisible: false,
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
