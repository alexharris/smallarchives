<template>
  <div class="sign-up">   
    <h3>Create new account</h3>
    <template v-if="error">
      <div class="alert alert-danger" show>{{error}}</div>
    </template>   
    <!-- Username -->
    <div class="form-group row">
      <label for="inputUsername" class="col-sm-2 col-form-label">Username</label>
      <div class="col-sm-10">
        <input class="form-control" id="inputUsername" placeholder="Username" v-model="displayName">
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

    <div class="btn btn-info" @click="checkUsername">Sign Up</div>
    <!-- <p class="mt-5">or go back to <router-link to="/login">login</router-link>.</p> -->
  </div>
    

</template>

 <script>
  import firebase from 'firebase';
  export default {
    name: 'UserSignUp',
    data() {
      return {
        email: '',
        password: '',
        displayName: '',
        error: null
      }
    },
    methods: {
      checkUsername: function() {

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
                  // tell the store to check about the user
                  this.$store.dispatch('setUser')
                  //then redirect user to home         
                  this.$router.replace('admin')
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
      },
              
    }    
  }
</script>
