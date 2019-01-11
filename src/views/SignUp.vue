<template>
  <div class="sign-up">   
    <h3>Create new account</h3>
    <template v-if="error">
      <b-alert variant="danger" show>{{error}}</b-alert>
    </template>     
    
    <b-form-group label="Username:" label-for="displayName">
      <b-form-input id="displayName" type="text" v-model.trim="displayName" placeholder="Username"></b-form-input>   
      <b-form-text id="inputLiveHelp">
        <!-- this is a form text block (formerly known as help block) -->
        This is the name by which your archives will be accessed.
      </b-form-text>      
    </b-form-group>     
    <b-form-group label="Email Address:" label-for="loginEmail">
      <b-form-input id="loginEmail" type="text" v-model="email" placeholder="Email"></b-form-input>       
    </b-form-group>
    <b-form-group label="Password:" label-for="loginPassword">
      <b-form-input id="loginPassword" type="password" v-model="password" placeholder="Password"></b-form-input>
    </b-form-group> 

    <b-button @click="checkUsername" size="lg" variant="outline-primary">Sign Up</b-button>
    <p>or go back to <router-link to="/login">login</router-link>.</p>
  </div>
    

</template>

 <script>
  import firebase from 'firebase';
  export default {
    name: 'signUp',
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
