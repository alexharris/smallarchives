<template>
  <div class="login">  
    <h3 class="mb-3">Log In</h3>
      <b-form @submit="login">
        <b-form-group label="Email Address:" label-for="loginEmail">
          <b-form-input id="loginEmail" type="email" v-model="email" placeholder="Email" required></b-form-input>
        </b-form-group>
        <b-form-group label="Password:" label-for="loginPassword">
          <b-form-input id="loginPassword" type="password" v-model="password" placeholder="Password"></b-form-input>
        </b-form-group>
        <b-button type="submit" variant="outline-primary">Submit</b-button>
      </b-form>
      <p class="mt-5">No account? <router-link to="/sign-up">Create one.</router-link></p>    
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
      }
    }
  }
</script>
