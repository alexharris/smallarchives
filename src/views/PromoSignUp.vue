<template>
  <div class="sign-up">  
    <div class="row justify-content-center" v-if="notSignedUp">
      <div class="col-12 col-sm-10 col-md-8 col-lg-6" >
        <h3 class="mb-5">Sign up</h3>
          <template v-if="error">
            <div class="alert alert-danger" show>{{error}}</div>
          </template>             
          <form>
            <!-- Username -->
            <div class="form-group row">
              <label for="inputUsername" class="col-sm-2 col-form-label">Username</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputUsername" placeholder="Username" v-model="displayName" required>
                <small class="help-text form-text text-muted">Your archives will be available at smallarchives.com/u/<em>username</em>.</small>
              </div>
            </div>
            <!-- Email -->
            <div class="form-group row">
              <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
              <div class="col-sm-10">
                <input type="email" class="form-control" id="inputEmail" placeholder="Email" v-model="email">
              </div>
            </div>
            <!-- Password -->
            <div class="form-group row">
              <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
              <div class="col-sm-10">
                <input type="password" class="form-control" id="inputPassword" placeholder="Password" v-model="password">
              </div>
            </div>                 

            <div class="btn btn-dark" @click="checkUsername">Sign Up</div>
          </form>
          <p class="mt-5">Already have an account? <router-link to="/login">Login</router-link>.</p>
      </div>
      <!-- <div class="col-12 col-sm-2 col-md-4 col-lg-4" >
        <div class="card" style="width: 18rem;">
          <div class="card-body">
            <h5 class="card-title">Special title treatment</h5>
            <p class="card-text">With supporting text below as a natural lead-in to additional content.</p>
            <a href="#" class="btn btn-primary">Go somewhere</a>
          </div>
        </div>
      </div> -->
    </div>
    <div class="row justify-content-center" v-else>
      <div class="col-12 col-sm-10 col-md-8 col-lg-6" >
        <h2>You've got mail.</h2>
        <p>Thanks for signing up! We sent you an email with a link in it. Please click the link to verify your email address.</p>
      </div>
    </div>
    </div>
  </div>
</template>

 <script>
  import firebase from 'firebase/app';
  export default {
    name: 'UserSignUp',
    data() {
      return {
        email: '',
        password: '',
        displayName: '',
        error: null,
        notSignedUp: true
      }
    },
    beforeCreate: function() {
      if(firebase.auth().currentUser != null) {
        this.$router.replace('admin')
      }
    },
    methods: {
      checkUsername: function() {
        this.displayName = this.displayName.toLowerCase()
        
        if(this.displayName != '') {
          firebase.firestore().collection('users').where("displayName", "==", this.displayName)
          .get()
          .then((querySnapshot) => {
            if(querySnapshot.empty == true) {
              this.signUp()
            } else {
              this.returnError('This username is taken!');
            }
          })
          .catch(function(error) {
              console.log("Error getting documents: ", error);
          }); 
        } else {
          this.returnError('Please select a username');
        }
       
        
      },
      signUp: function() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            //first add the username to the profile
            firebase.auth().currentUser.updateProfile({
              displayName:  this.displayName,
              // photoURL: "https://example.com/jane-q-user/profile.jpg"
            }).then(() => {
              // Update successful. 

              //Also add the username to the users table
              firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).set({
                  displayName: this.displayName
              })
              .then(() => {
                  console.log("Document successfully written!");
                  // start tracking number of items
                  firebase.firestore().collection("archives").doc(firebase.auth().currentUser.uid).set({
                      numberOfItems: 0
                  })

                  var newUser = firebase.auth().currentUser;

                  this.notSignedUp = false

                  //send verification email
                  newUser.sendEmailVerification().then(function() {
                    // Email sent.
                    
                  }).catch(function(error) {
                    // An error happened.
                  });

                  // tell the store to check about the user
                  this.$store.dispatch('setUser')


                  

                  // //then redirect user to home         
                  // this.$router.replace('admin')
              })
              .catch(function(error) {
                  console.error("Error writing document: ", error);
              });              
            }).catch(function(error) {
              // An error happened.
            });    

            
          },
          (err) => {
            this.returnError(err.message)
          }
        );
      },
      returnError(errorMessage) {
        this.error = errorMessage
      }       
    },
    computed: {
      nameState () {
        return this.displayName.length > 2 ? true : false
      }
              
    }    
  }
</script>
