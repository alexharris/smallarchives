<template>
  <div class="login">  
    <h3>Sign In</h3>
    <b-form-group label="Email Address:" label-for="loginEmail">
      <b-form-input id="loginEmail" type="email" v-model="email" placeholder="Email" required></b-form-input>
    </b-form-group>
    <b-form-group label="Password:" label-for="loginPassword">
      <b-form-input id="loginPassword" type="password" v-model="password" placeholder="Password"></b-form-input>
    </b-form-group>
    <b-button @click="login">Login</b-button>
    <p>No account? <router-link to="/sign-up">Create one.</router-link></p>
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
    methods: {
      login: function() {

        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
          (user) => {
            this.$store.dispatch('setUser')
            this.$router.replace('admin/archives')
          },
          (err) => {
            alert('Oops. ' + err.message)
          }
        );
      }
    }
  }
</script>
