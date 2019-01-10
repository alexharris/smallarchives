<template>
  <div class="sign-up">   
    <p>Let's create a new account !</p>
    <b-form-group label="Username:" label-for="displayName">
      <b-form-input id="displayName" type="text" v-model="displayName" placeholder="Username"></b-form-input>
    </b-form-group>     
    <b-form-group label="Email Address:" label-for="loginEmail">
      <b-form-input id="loginEmail" type="text" v-model="email" placeholder="Email"></b-form-input>
    </b-form-group>
    <b-form-group label="Password:" label-for="loginPassword">
      <b-form-input id="loginPassword" type="password" v-model="password" placeholder="Password"></b-form-input>
    </b-form-group> 
    <b-button @click="checkUsername">Sign Up</b-button>
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
        displayName: ''
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
            console.log('already exists!')
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
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  }
</script>
