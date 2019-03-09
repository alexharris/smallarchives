<template>
  <div class="login">     
    <div class="row px-sm-5 justify-content-center">
      <div class="col-12 col-lg-5">
        
        <form>
          <div class="form-group row">
            <label for="inputEmail" class="col-sm-3 col-form-label">Email</label>
            <div class="col-sm-9">
              <input type="email" class="form-control" id="inputEmail" placeholder="" v-model="email">
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-3 col-form-label">Password</label>
            <div class="col-sm-9">
              <input type="password" class="form-control" id="inputPassword" placeholder="" v-model="password">
            </div>
          </div>        
          <button class="btn btn-outline-dark" type="submit" @click.stop="login">Submit</button>
        </form>
        <!-- <p class="mt-5">No account? <router-link to="/sign-up">Create one.</router-link></p>     -->
      </div>
      <div class="col-12 col-lg-4 px-lg-5">
        <!-- This can come back once I can activate the "collect email address" twitter setting so that firebase can prevent duplicates, but that requires a terms of service and privacy policy which dont exist yet -->
<!--         <button class="btn btn-primary" @click="twitter"><font-awesome-icon class="float-left pt-1 pb-2 mr-2" :icon="['fab', 'twitter']" size="2x" />Sign in with Twitter</button>    -->
      </div>      
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        password: ''
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
            this.$router.replace('admin/archives')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
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
