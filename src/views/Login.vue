<template>
  <div class="login">  
    
    <div class="row justify-content-sm-center">

      <div class="col-6">
              <h3 class="mb-5">Log in</h3>
        <form>
          <div class="form-group row">
            <label for="inputEmail" class="col-sm-2 col-form-label">Email</label>
            <div class="col-sm-10">
              <input type="email" class="form-control" id="inputEmail" placeholder="Email" v-model="email">
            </div>
          </div>
          <div class="form-group row">
            <label for="inputPassword" class="col-sm-2 col-form-label">Password</label>
            <div class="col-sm-10">
              <input type="password" class="form-control" id="inputPassword" placeholder="Password" v-model="password">
            </div>
          </div>        
          <div class="btn btn-primary" type="submit" @click.stop="login">Submit</div>
        </form>
        <p class="mt-5">No account? <router-link to="/sign-up">Create one.</router-link></p>    
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
