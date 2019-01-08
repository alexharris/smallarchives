<template>
  <div class="sign-up">   
    <p>Let's create a new account !</p>
    <b-form-group label="Email Address:" label-for="loginEmail">
      <b-form-input type="text" v-model="email" placeholder="Email"></b-form-input>
    </b-form-group>
    <b-form-group label="Password:" label-for="loginPassword">
      <b-form-input id="loginPassword" type="password" v-model="password" placeholder="Password"></b-form-input>
    </b-form-group> 
    <b-button @click="signUp">Sign Up</b-button>
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
        password: ''
      }
    },
    methods: {
      signUp: function() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$router.replace('home')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  }
</script>
