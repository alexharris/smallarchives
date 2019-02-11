<template>
	<div class="btn" @click="logout">Logout</div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "LogoutButton", 
  methods: {
  	logout: function() {
  		firebase.auth().signOut().then(() => {
  			this.$router.replace('login')
  		})
  	}
  }
};
</script>